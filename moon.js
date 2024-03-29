const jsonFile = require('jsonfile');
const Table = require('easy-table');
const fs = require('fs');
const exec = require("child_process").exec;
const output = 'output.m';
const moonsrcOutput = 'moonsrc/output.m';

function moon(tables, ast) {
  const offSetTables = [];
  let registerPool = ['r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9', 'r10', 'r11', 'r12'];
  const stackRegister = '(r14)';
  registerPool = registerPool.reverse();
  const moonCode = [];
  const moonData = [];
  const tableStack = [];
  let ifCounter = 1;
  let tempVarCounter = 1;
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
    'sign': generateSignCode,
    'not': generateNotCode,
    'forStat': generateForCode,
  };
  const tempVarVisitors = {
    'num': setNumVar,
    'addOp': setAddOpVar,
    'multOp': setMultOpVar,
    'relOp': setRelOpVar,
    'fCall': setFcallVar,
    'funcDef': setFuncDefVar,
    'sign': setSignVar,
    'not': setNotVar,
  };
  setOffsets(ast);
  setTempVars(ast);
  setClassOffsets();
  setLoopOffsets();
  //setForLoopOffsets();
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
    moonCode.push('\t\t addi\t r14, r0, topaddr  % Set stack pointer');
    if (node.children) {
      tableStack.push(node.symtab);
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    moonCode.push('\t\t hlt');
    moonData.push('buf\tres\t20');
    moonData.push('m2\tdb\t 13,10,0');
  }

  function generateAssignStatCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    // allocate local registers
    const localregister1 = registerPool.pop();
    moonCode.push(`\t\t lw\t ${localregister1}, ${node.children[1].offSet}${stackRegister}`);
    const LHSOffset = node.children[0].offSet;
    moonCode.push(`\t\t sw\t ${LHSOffset}${stackRegister},  ${localregister1}`);
    //deallocate all registers
    registerPool.push(localregister1);
  }

  function generateNumCode(node) {
    const localregister1 = registerPool.pop();
    // create a value corresponding to the literal value
    moonCode.push(`\t\t addi\t ${localregister1}, r0, ${node.leaf.value}`);
    // assign this value to a temporary variable (assumed to have been previously created by the symbol table generator)
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister},  ${localregister1}`);
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
    const localregister3 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    const scopeSize = tableStack[tableStack.length - 1].size * -1;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t sw\t ${scopeSize - 8}${stackRegister}, ${localregister1}`);
    moonCode.push(`\t\t addi\t ${localregister2},r0,buf`);
    moonCode.push(`\t\t sw\t ${scopeSize - 12}${stackRegister}, ${localregister2}`);
    moonCode.push(`\t\t subi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);
    moonCode.push('\t\t jl\t r15, intstr');
    moonCode.push(`\t\t addi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);
    moonCode.push(`\t\t sw\t ${scopeSize - 8}${stackRegister}, r13`);
    moonCode.push(`\t\t subi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);
    moonCode.push('\t\t jl\t r15, putstr');
    moonCode.push(`\t\t addi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);
    // new line
    moonCode.push(`\t\t addi\t ${localregister3}, r0, m2\t % CR`);
    moonCode.push(`\t\t sw\t ${scopeSize - 8}${stackRegister}, ${localregister3}`);
    moonCode.push(`\t\t subi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);
    moonCode.push('\t\t jl\t r15, putstr');
    moonCode.push(`\t\t addi\t r14, r14, ${scopeSize * -1}\t % Adjust SP`);

    registerPool.push(localregister3);
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
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}${stackRegister}`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, ${localregister3}`);
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
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}${stackRegister}`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, ${localregister3}`);
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
    if (node.children.length === 1) {
      node.offSet = node.children[0].offSet;
    }
    else if (node.children.length > 1) {
      tableStack.pop();
      // parent scope
      const parentSize = tableStack[tableStack.length - 1].size;
      node.offSet = (parentSize + node.children[0].offSet) * -1 + node.children[1].offSet;
    }
  }

  function generateDataMemberCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    let offSet = getOffSet(node.children[0].leaf.value);
    if (offSet >= 0) {
      const tableName = getType(node.children[0].leaf.value);
      tableStack.push(findTable(tableName));
      node.offSet = offSet * -1;
    }
    else
      node.offSet = offSet;

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
    moonCode.push(`${node.children[2].leaf.value}\t\t % Function Definition`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, r15\t % Save Link`);
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
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
    const scopeSize = tableStack[tableStack.length - 1].size * -1;
    moonCode.push(`\t\t lw\t r13, ${childOffset}${stackRegister}`);
    moonCode.push(`\t\t lw\t r15, ${scopeSize}${stackRegister}\t % Restore Link`);
    moonCode.push('\t\t jr r15');
  }

  function generateFcallCode(node) {
    if (node.children[1].children) {
      generateCode(node.children[1]);
    }
    const scopeSize = tableStack[tableStack.length - 1].size;
    moonCode.push(`\t\t subi\t r14, r14, ${scopeSize}\t % Adjust SP`);
    moonCode.push(`\t\t jl\t r15, ${node.children[0].leaf.value} `);
    moonCode.push(`\t\t addi\t r14, r14, ${scopeSize}\t % Adjust SP`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, r13`);
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
    moonCode.push(`\t\t sw\t  ${getOffSet(node.children[1].leaf.value)}${stackRegister}, ${localregister1} `);
    registerPool.push(localregister1);
  }

  function generateAparamsCode(node) {
    // first param is -8, second -12, and so on
    const scopeSize = tableStack[tableStack.length - 1].size * -1;
    let paramOffset = -8;
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
        const localregister1 = registerPool.pop();
        moonCode.push(`\t\t lw\t ${localregister1}, ${child.offSet}${stackRegister}`);
        moonCode.push(`\t\t sw\t ${scopeSize + paramOffset}${stackRegister}, ${localregister1}`);
        paramOffset -= 4;
        registerPool.push(localregister1);
      });
    }
  }

  function generateIfStatCode(node) {
    // generate code for the conditional first
    if (node.children[0].children) {
      generateCode(node.children[0]);
    }
    const localregister1 = registerPool.pop();
    const elseStatement = `else_${ifCounter}`;
    const endIf = `endif_${ifCounter++}`;
    const boolOffset = node.children[0].offSet;
    // Check the conditional
    moonCode.push(`\t\t lw\t ${localregister1}, ${boolOffset}${stackRegister}`);
    moonCode.push(`\t\t bz\t ${localregister1}, ${elseStatement}`);
    registerPool.push(localregister1);
    //generate code for the first then branch
    if (node.children[1].children) {
      generateCode(node.children[1]);
    }
    moonCode.push(`\t\t j\t ${endIf}`);

    //  else branch
    moonCode.push(`\t\t ${elseStatement} nop`);
    if (node.children[2].children) {
      generateCode(node.children[2]);
    }
    moonCode.push(`\t\t ${endIf} nop`);
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
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t lw\t ${localregister2}, ${RHSOffset}${stackRegister}`);
    moonCode.push(`\t\t ${opCode}\t ${localregister3},${localregister1},${localregister2}`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, ${localregister3}`);
    registerPool.push(localregister3);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateSignCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t muli\t ${localregister2},${localregister1},-1`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, ${localregister2}`);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateNotCode(node) {
    if (node.children) {
      node.children.forEach((child) => {
        generateCode(child);
      })
    }
    const localregister1 = registerPool.pop();
    const localregister2 = registerPool.pop();
    const LHSOffset = node.children[0].offSet;
    moonCode.push(`\t\t lw\t ${localregister1}, ${LHSOffset}${stackRegister}`);
    moonCode.push(`\t\t not\t ${localregister2},${localregister1}`);
    moonCode.push(`\t\t sw\t ${node.offSet}${stackRegister}, ${localregister2}`);
    registerPool.push(localregister2);
    registerPool.push(localregister1);
  }

  function generateForCode(node) {
    //set the first value
    tableStack.push(node.symtab);
    const initialIdOffset = getOffSet(node.children[1].leaf.value);
    generateCode(node.children[2]);
    const initialValueOffset = node.children[2].offSet;
    const localregister1 = registerPool.pop();
    moonCode.push(`\t\t lw\t ${localregister1}, ${initialValueOffset}${stackRegister}`);
    moonCode.push(`\t\t sw\t ${initialIdOffset}${stackRegister},  ${localregister1}`);
    registerPool.push(localregister1);

    moonCode.push(`${node.symtab.table}`);
    // relOP
    if (node.children[3].children) {
      generateCode(node.children[3]);
    }
    const localregister2 = registerPool.pop();
    moonCode.push(`\t\t lw\t ${localregister2}, ${node.children[3].offSet}${stackRegister}`);
    moonCode.push(`\t\t bz\t ${localregister2}, exit${node.symtab.table}`);
    registerPool.push(localregister2);

    if (node.children[5].children) {
      generateCode(node.children[5]);
    }
    if (node.children[4].children) {
      generateCode(node.children[4]);
    }
    moonCode.push(`\t\t j\t ${node.symtab.table}`);
    moonCode.push(`exit${node.symtab.table}`);
    tableStack.pop();
  }

  function setOffsets(node) {
    if (node.symtab) {
      node.symtab.size = 0;
      let paramsSize = 0;
      if (node.symtab.entries) {
        node.symtab.entries.forEach((entry) => {
          if (entry.kind === 'parameter') {
            entry.size = 4;
            entry.offSet = (entry.size + 4 + paramsSize) * -1;
            paramsSize += entry.size;
            if (node.symtab.size === 0) {
              node.symtab.size = 4;
            }
            node.symtab.size += entry.size;
          }
          else if ((entry.type === 'int' || entry.type === 'float')) {
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

  function setTempVars(node) {
    if (node.symtab && (node.node !== 'classList' || node.node !== 'funcDefList')) {
      tableStack.push(node.symtab);
    }
    if (node.children) {
      node.children.forEach((child) => {
        setTempVars(child);
      })
    }
    if (tempVarVisitors[node.node]) {
      tempVarVisitors[node.node](node);
    }
    if (node.symtab && (node.node !== 'classList' || node.node !== 'funcDefList')) {
      node.symtab = tableStack.pop();
    }
  }

  function setNumVar(node) {
    insertTempVar(node);
  }

  function setAddOpVar(node) {
    insertTempVar(node);
  }

  function setMultOpVar(node) {
    insertTempVar(node);
  }

  function setRelOpVar(node) {
    insertTempVar(node);
  }

  function setFcallVar(node) {
    insertTempVar(node);
  }

  function setFuncDefVar(node) {
    // return value
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    const entry = {
      name: `returnAddr`,
      type: 'address',
      kind: 'return',
      link: 'nil',
      size: 4,
      offSet: `${node.offSet}`
    };
    tableStack[tableStack.length - 1].entries.push(entry);
  }

  function setSignVar(node) {
    insertTempVar(node);
  }

  function setNotVar(node) {
    insertTempVar(node);
  }

  function insertTempVar(node) {
    node.offSet = (tableStack[tableStack.length - 1].size + 4) * -1;
    tableStack[tableStack.length - 1].size += 4;
    const entry = {
      name: `tempVar${tempVarCounter++}`,
      type: 'int',
      kind: 'tempvar',
      link: 'nil',
      size: 4,
      offSet: `${node.offSet}`
    };
    tableStack[tableStack.length - 1].entries.push(entry);
  }
  function getOffSet(name) {
    for (let i = tableStack.length - 1; i >= 0; i--) {
      if (tableStack[i].entries) {
        for (let j = 0; j < tableStack[i].entries.length; j++) {
          if (tableStack[i].entries[j].name === name) {
            if (tableStack[i].entries[j].type !== 'int') {
              return tableStack[i].entries[j].size;
            }
            return tableStack[i].entries[j].offSet;
          }
        }
      }
    }
  }

  function setClassOffsets() {
    offSetTables.forEach((table) => {
      if (table.table === 'Global') {
        return;
      }
      classEntries(table);
    })
  }

  function classEntries(table) {
    table.entries.forEach((entry) => {
      if (entry.kind === 'variable' && !entry.size) {
        entry.size = getSize(entry.type);
        entry.offSet = (table.size + entry.size) * -1;
        table.size += entry.size;
      }
    })
  }

  function getSize(tableName) {
    // Find the table
    let table;
    let size = 0;
    for (let i = 0; i < offSetTables.length; i++) {
      if (offSetTables[i].table === tableName) {
        table = offSetTables[i];
        table.entries.forEach((entry) => {
          if (entry.size) {
            size += entry.size;
          }
          else if (entry.kind === 'variable') {
            entry.size = getSize(entry.type);
            entry.offSet = (table.size + entry.size) * -1;
            table.size += entry.size;
            size += entry.size;
          }
        });
        return size;
      }
    }
  }

  function findTable(tableName) {
    for (let i = 0; i < offSetTables.length; i++) {
      if (offSetTables[i].table === tableName) {
        return offSetTables[i];
      }
    }
  }

  function getType(name) {
    for (let i = tableStack.length - 1; i >= 0; i--) {
      if (tableStack[i].entries) {
        for (let j = 0; j < tableStack[i].entries.length; j++) {
          if (tableStack[i].entries[j].name === name) {
            return tableStack[i].entries[j].type;
          }
        }
      }
    }
  }

  function setLoopOffsets() {
    offSetTables.forEach((table) => {
      if (table.table === 'Global') {
        return;
      }
      table.entries.forEach((entry) => {
        if (entry.kind === 'loop') {
          entry.size = findTable(entry.name).size;
          entry.offSet = (table.size + entry.size) * -1;
          table.size += entry.size;
        }
      })
    })
  }

  // function setForLoopOffsets(){
  //   offSetTables.forEach((table)=>{
  //     if (table.table === 'Global'){
  //       return;
  //     }
  //     table.entries.forEach((entry)=>{
  //       if (entry.kind === 'loop'){
  //         modifyOffsets(findTable(entry.name), entry.offSet);
  //         entry.offSet = -20;
  //       }
  //     })
  //   })
  // }
  // function modifyOffsets(table, offSet){
  //   for (let i = table.entries.length - 2 ; i >= 0 ; i --){
  //     table.entries[i].offSet = table.entries[i+1].size + offSet;
  //     offSet-= table.entries[i].size + offSet;
  //     console.log(offSet);
  //   }
  // }

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
