const jsonFile = require('jsonfile');
const Table = require('easy-table');
const fs = require('fs');
const exec = require("child_process").exec;
const output = 'output.m';
const moonsrcOutput = 'moonsrc/output.m';

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
    'addOp': generateAddOpCode,
    'multOp': generateMultOpCode,
    'var': generateVarCode,
    'dataMember': generateDataMemberCode,
    'funcDefList': generateFuncDefListCode,
    'funcDef': generateFuncDefCode,
    'statBlock': generateStatBlockCode,
    'returnStat': generateReturnStatCode,
    'fCall': generateFcallCode,
    'fparamList': generateFparamListCode,
    'fparam': generateFparamCode,
    'aParams': generateAparamsCode,
    'ifStat': generateIfStatCode,
    'relOp': generateRelOpCode,
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
      generateCode(node.children[1]);
      node.children[2].node = 'programStatBlock';
      generateCode(node.children[2]);
    }
    printMoonCode(moonCode, moonData);
    executeMoonCode();
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
    const LHSOffset = node.children[0].offSet;
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
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}(r2)`);
    moonCode.push(`\t\t sw\t -8(r14), ${localregister1}`);
    moonCode.push(`\t\t addi\t ${localregister2},r0,buf`);
    moonCode.push(`\t\t sw\t -12(r14), ${localregister2}`);
    moonCode.push('\t\t jl\t r15, intstr');
    moonCode.push('\t\t sw\t -8(r14), r13');
    moonCode.push('\t\t jl\t r15, putstr');
    moonCode.push('\t\t addi\t r2, r0, topaddr  % Set stack pointer');
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateAddOpCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const localregister3 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    const RHSOffset = node.children[1].offSet;
    const operator = node.hasToken.value;
    let opCode;
    switch (operator) {
      case '+':
        opCode = 'add';
        break;
      case '-':
        opCode = 'sub';
        break;
      case 'or':
        opCode = 'or';
        break;
    }
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}(r2)`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}(r2)`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}(r2), ${localregister3}`);
    registerPool.push(localregister3);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateMultOpCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const localregister3 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    const RHSOffset = node.children[1].offSet;
    const operator = node.hasToken.value;
    let opCode;
    switch (operator) {
      case '*':
        opCode = 'mul';
        break;
      case '/':
        opCode = 'div';
        break;
      case 'and':
        opCode = 'and';
        break;
    }
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}(r2)`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}(r2)`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}(r2), ${localregister3}`);
    registerPool.push(localregister3);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateVarCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    node.offSet = node.children[0].offSet;
  }

  function generateDataMemberCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    node.offSet = getOffSet(node.children[0].leaf.value);
  }

  function generateFuncDefListCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
  }

  function generateFuncDefCode(node) {
    tableStack.push(node.symtab);
    moonCode.push(`${node.children[2].leaf.value}\t\t addi\t r2, r0, topaddr`);
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    moonCode.push('\t\t jr r15');
    tableStack.pop();
  }

  function generateStatBlockCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
  }

  function generateReturnStatCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const childOffset = node.children[0].offSet;
    moonCode.push(`\t\t lw\t r13, ${childOffset}(r2)`);
  }

  function generateFcallCode(node) {
    if (node.children[1].children) {
      generateCode(node.children[1]);
    }
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    moonCode.push(`\t\t jl\t r15, ${node.children[0].leaf.value} `);
    moonCode.push(`\t\t sw\t ${node.offSet}(r2), r13`);
  }

  function generateFparamListCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
  }

  function generateFparamCode(node) {
    const localregister1 = registerPool.pop();
    moonCode.push(`\t\t lw\t ${localregister1}, ${getOffSet(node.children[1].leaf.value)}(r14)`);
    moonCode.push(`\t\t sw\t  ${getOffSet(node.children[1].leaf.value)}(r2), ${localregister1} `);
    registerPool.push(localregister1);
  }

  function generateAparamsCode(node) {
    let paramOffSet = -4;
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
        const localregister1 = registerPool.pop();
        moonCode.push(`\t\t lw\t ${localregister1}, ${child.offSet}(r2)`);
        moonCode.push(`\t\t sw\t ${paramOffSet}(r14), ${localregister1}`);
        paramOffSet -= 4;
        registerPool.push(localregister1);
      });
    }
  }

  function generateIfStatCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }

  }

  function generateRelOpCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const localregister3 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    const RHSOffset = node.children[1].offSet;
    const operator = node.hasToken.Token;
    let opCode;
    switch (operator) {
      case 'eq':
        opCode = 'ceq';
        break;
      case 'geq':
        opCode = 'cge';
        break;
      case 'gt':
        opCode = 'cgt';
        break;
      case 'leq':
        opCode = 'cle';
        break;
      case 'lt':
        opCode = 'clt';
        break;
      case 'neq':
        opCode = 'cne';
        break;
    }
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}(r2)`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}(r2)`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}(r2), ${localregister3}`);
    registerPool.push(localregister3);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }


  function setOffsets(node) {
    if (node.symtab) {
      node.symtab.size = 0;
      //let paramsSize = 0;
      if (node.symtab.entries) {
        node.symtab.entries.forEach((entry) => {
          if ((entry.type === 'int' || entry.type === 'float')) {
            entry.size = 4;
            entry.offSet = (entry.size + node.symtab.size) * -1;
            node.symtab.size += entry.size;
          }
          // if (entry.kind === 'parameter') {
          //   entry.size = 4;
          //   entry.offSet = (entry.size + paramsSize) * -1;
          //   paramsSize += entry.size;
          // }
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
    });
    fs.writeFileSync(moonsrcOutput, fs.readFileSync(output));
  }

  function executeMoonCode() {
    const dir = exec("cd moonsrc && moon lib output && cd ..", function (err, stdout, stderr) {
      if (err) {
        // assume no error
      }
      console.log(stdout);
      fs.writeFileSync('output_executed.txt', stdout);
    });

    dir.on('exit', function (code) {
      // exit code is code
    });
  }
}

module.exports = moon;
