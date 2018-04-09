const jsonFile = require('jsonfile');
const Table = require('easy-table');
const fs = require('fs');
const output = 'output.m';

function moon(tables, ast) {
  const offSetTables = [];
  let registerPool = ['r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'];
  registerPool = registerPool.reverse();
  const moonCode = [];
  const moonData = [];
  const tableStack = [];
  const codeGenVisitors = {
    'prog': generateProgCode,
    'programStatBlock': generateProgramCode,
    'assignStat': generateAssignStatCode,
    'num': generateNumCode,
    'putStat': generatePutStatCode,
  };
  setOffsets(ast);
  generateCode(ast);
  printAllTables(offSetTables);

  function generateCode(node) {
    if (codeGenVisitors[node.node]) {
      codeGenVisitors[node.node](node);
    }
  }

  function generateProgCode(node) {
    if (node.children) {
      node.children[2].node = 'programStatBlock';
      generateCode(node.children[2]);
    }
    printMoonCode(moonCode, moonData);
  }

  function generateProgramCode(node) {
    moonCode.push('entry % Program start');
    moonCode.push('\t\t addi\t r1, r0, topaddr  % Set frame pointer');
    moonCode.push('\t\t addi\t r2, r0, topaddr  % Set stack pointer');
    moonCode.push('\t\t addi\t r14, r0, topaddr  % Set func stack pointer');
    if (node.children) {
      tableStack.push(node.symtab);
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    moonCode.push('\t\t hlt');
    moonData.push('buf\tres\t20');
  }

  function generateAssignStatCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    // allocate local registers
    const localregister1 = registerPool.pop();
    moonCode.push(`\t\t lw\t ${localregister1}, ${node.children[1].offSet}(r2)`);
    const LHSOffset = getOffSet(node.children[0].children[0].children[0].leaf.value);
    moonCode.push(`\t\t sw\t ${LHSOffset}(r2),  ${localregister1}`);
    //deallocate all registers
    registerPool.push(localregister1);
  }

  function generateNumCode(node) {
    const localregister1 = registerPool.pop();
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    // create a value corresponding to the literal value
    moonCode.push(`\t\t addi\t ${localregister1}, r0, ${node.leaf.value}`);
    // assign this value to a temporary variable (assumed to have been previously created by the symbol table generator)
    moonCode.push(`\t\t sw\t ${node.offSet}(r2),  ${localregister1}`);
    // deallocate the register for the current node
    registerPool.push(localregister1);
  }

  function generatePutStatCode(node) {
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const LHSOffset = getOffSet(node.children[0].children[0].children[0].leaf.value);
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}(r2)`);
    moonCode.push(`\t\t sw\t -8(r14), ${localregister1}`);
    moonCode.push(`\t\t addi\t ${localregister2},${localregister1},buf`);
    moonCode.push(`\t\t sw\t -12(r14), ${localregister2}`);
    moonCode.push('\t\t jl\t r15, intstr');
    moonCode.push('\t\t sw\t -8(r14), r13');
    moonCode.push('\t\t jl\t r15, putstr');
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function setOffsets(node) {
    if (node.symtab) {
      node.symtab.size = 0;
      if (node.symtab.entries) {
        node.symtab.entries.forEach((entry) => {
          if (entry.type === 'int' || entry.type === 'float') {
            entry.size = 4;
            entry.offSet = (entry.size + node.symtab.size) * -1;
            node.symtab.size += entry.size;
          }
        })
      }
      offSetTables.unshift(node.symtab);
    }
    if (node.children) {
      node.children.forEach((child) => {
        setOffsets(child);
      })
    }
  }

  function getOffSet(name) {
    for (let i = tableStack.length - 1; i >= 0; i--) {
      if (tableStack[i].entries) {
        for (let j = 0; j < tableStack[i].entries.length; j++) {
          if (tableStack[i].entries[j].name === name) {
            return tableStack[i].entries[j].offSet;
          }
        }
      }
    }
  }

  function printAllTables(tables) {
    tables.unshift(tables.pop());
    fs.writeFileSync('symbolTablesOffset.txt', '---SYMBOL TABLES with offsets--- \n\n');
    tables.forEach((table) => {
      const t = new Table;
      table.entries.forEach((entry) => {
        t.cell('Name', entry.name);
        t.cell('Kind', entry.kind);
        t.cell('Type', entry.type);
        t.cell('Line', entry.line);
        t.cell('Size', entry.size);
        t.cell('Offset', entry.offSet);
        t.cell('Link', entry.link);
        t.newRow();
      });
      fs.appendFileSync('symbolTablesOffset.txt', `Table: ${table.table}\nScope Size: ${table.size}\n`);
      fs.appendFileSync('symbolTablesOffset.txt', `${t.toString()}\n\n`);
    });
    jsonFile.writeFileSync('symbolTablesJSONOffset.txt', tables, {spaces: 2}, function (err) {
    })
  }

  function printMoonCode(code, data) {
    fs.writeFileSync(output, '');
    code.forEach((line) => {
      fs.appendFileSync(output, `${line}\n`);
    });
    data.forEach((line) => {
      fs.appendFileSync(output, `${line}\n`);
    })
  }
}

module.exports = moon;
