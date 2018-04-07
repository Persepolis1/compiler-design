const jsonFile = require('jsonfile');
const Table = require('easy-table');
const fs = require('fs');
function semantics(ast){
  if (!ast){
    return;
  }
  const TABLE_CREATOR_MAP = {
    'prog': createProgSymTab,
    'classList': createClasslistSymTab,
    'funcDefList': createFuncDefListTable,
    'funcDef': createFuncDefTable,
    'classDecl': createClassDeclTable,
    'statBlock': createStatBlockTable,
  };
  const ENTRY_CREATOR_MAP = {
    'classList': createClassListEntries,
    'classDecl': createClassDeclEntries,
    'funcDefList': createFuncDefListEntries,
    'funcDef': createFuncDefEntries,
    'varDecl': createVarDeclEntries,
    'funcDecl': createFuncDeclEntries,
    'fparam': createFParamEntries,
    'statBlock': createStatBlockEntry,
  };
  const tables = [];
  const errors = [];
  const warnings = [];
  const rootNode = [...ast][0];
  graphAST(rootNode);
  buildTables(rootNode);
  printAllTables(tables);
  printErrorsOrWarnings(errors, 'Errors');
  printErrorsOrWarnings(warnings, 'Warnings');
  printAugmentedAst(rootNode);
  function buildTables(node) {
    try {
      if (TABLE_CREATOR_MAP[node.node]) {
        node['symtab'] = TABLE_CREATOR_MAP[node.node](node);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  // prog
  function createProgSymTab(node){
    const symtab = {
      table: 'Global',
      entries: [],
    };
    let entries ;
    node.children.forEach((child) =>{
      if (child.children){
        entries = ENTRY_CREATOR_MAP[child.node](child);
        if(entries.length > 0 ) {
          entries.forEach((entry) => {
            symtab.entries.push(entry);
          })
        }
        else
          symtab.entries.push(entries);
      }
    });
    //check for duplicates
    if(symtab.entries.length > 0){
      const classBucket = [];
      const funcBucket = [];
      symtab.entries.forEach((entry) =>{
        if(entry.kind === 'class'){
          if (!classBucket.includes(entry.name)){
            classBucket.push(entry.name)
          }
          else{
            errors.push(`Duplicate class declaration: '${entry.kind} ${entry.name}' in '${symtab.table}' scope `)
          }
        }
        else if (entry.kind === 'function'){
          if (!funcBucket.includes(entry.name)){
            funcBucket.push(entry.name)
          }
          else{
            errors.push(`Duplicate function declaration: '${entry.kind} ${entry.name}' in '${symtab.table}' scope `)
          }
        }
      })
    }
    tables.push(symtab);
    return symtab;
  }

  // Class List
  function createClassListEntries(node){
    buildTables(node);
    return node.symtab.entries;
  }
  function createClasslistSymTab(node){
   const symtab = {
     table: 'classList',
     entries: [],
   };
   node.children.forEach((child) =>{
     symtab.entries.push(ENTRY_CREATOR_MAP[child.node](child));
   });
    return symtab;
  }

  //Class Decl
  function createClassDeclEntries(node){
    const entry = {
      name: node.children[0].leaf.value,
      kind: 'class',
      type: 'nil',
      link: node.children[0].leaf.value,
      line: node.children[0].leaf.line,
    };
    buildTables(node);
    tables.push(node.symtab);
    return entry;
  }
  function createClassDeclTable(node) {
    const symtab = {
      table: node.children[0].leaf.value,
      entries: [],
    };
    const inheritedClasses = [];
    // inherit list
    let bucket = [];
    if (node.children[1].children) {
      node.children[1].children.forEach((child) => {
        const entry = {
          name: child.leaf.value,
          kind: 'class',
          type: 'parent',
          link: child.leaf.value,
          line: child.leaf.line,
        };
        // check if parent is declared
        if (!doesTableExist(entry.link)) {
          errors.push(`Undeclared parent class: '${entry.name}' in child class '${symtab.table}' @ line ${entry.line} `);
        }
        else if (!bucket.includes(entry.name)) {
          bucket.push(entry.name);
          inheritedClasses.push(entry.link);
          symtab.entries.push(entry);
        }
        else {
          errors.push(`Duplicate parent class: '${entry.name}' in child class '${symtab.table}' @ line ${entry.line} `);
        }
      })
    }
    // Duplicate and shadowing check for memberList
    bucket = [];
    if (node.children[2].children) {
      node.children[2].children.forEach((child) => {
        const entry = ENTRY_CREATOR_MAP[child.node](child);
        if (!bucket.includes(entry.name)) {
          bucket.push(entry.name);
          symtab.entries.push(entry);
        }
        else {
          errors.push(`Duplicate ${entry.kind} declaration: '${entry.type} ${entry.name}' in class '${symtab.table}' @ line ${entry.line} `)
        }
        // shadow member check
        if (inheritedClasses.length > 0) {
          for (let i = 0; i < inheritedClasses.length; i++) {
            if (doesEntryExist(entry, inheritedClasses[i])) {
              warnings.push(`${entry.kind} '${entry.name}' in class '${symtab.table}' shadows the same member in its parent '${inheritedClasses[i]}' @ line ${entry.line}`)
            }
          }
        }
      })
    }
    return symtab;
  }

  // Func Def List
  function createFuncDefListEntries(node) {
    buildTables(node);
    return node.symtab.entries;
  }
  function createFuncDefListTable(node) {
    const symtab = {
      table: 'funcDefList',
      entries: [],
    };
    node.children.forEach((child) => {
      symtab.entries.push(ENTRY_CREATOR_MAP[child.node](child));
    });
    return symtab;
  }

  // Func Def
  function createFuncDefEntries(node) {
    const entry = {
      name: node.children[2].leaf.value,
      kind: 'function',
      type: `${node.children[0].leaf.value} : `,
      link: node.children[2].leaf.value,
      line: node.children[2].leaf.line,
    };
    if (node.children[3].children) {
      const paramEntry = [];
      const bucket = [];
      node.children[3].children.forEach((child) => {
        paramEntry.push(ENTRY_CREATOR_MAP[child.node](child));
      });
      paramEntry.forEach((param) => {
        if (!bucket.includes(param.name)) {
          bucket.push(param.name);
          entry.type = entry.type.concat(`${param.type}, `)
        }
        else {
          errors.push(`Duplicate param declaration: '${param.name} in ${entry.name}' `)
        }
      });
      entry.type = entry.type.slice(0, -2);
    }
    buildTables(node);
    tables.push(node.symtab);
    return entry;
  }
  function createFuncDefTable(node) {
    const symtab = {
      table: node.children[2].leaf.value,
      entries: [],
    };
    // Duplicate check
    const bucket = [];
    if (node.children[4].children) {
      node.children[4].children.forEach((child) => {
        const entry = ENTRY_CREATOR_MAP[child.node](child);
        if (!bucket.includes(entry.name)) {
          bucket.push(entry.name);
          symtab.entries.push(entry);
        }
        else {
          errors.push(`Duplicate variable declaration: '${entry.type} ${entry.name}' in function '${symtab.table}' @ line ${entry.line} `)
        }
      })
    }
    return symtab;
  }

  // Var Decl
  function createVarDeclEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind:'variable',
      type: node.children[0].leaf.value,
      link:'nil',
      line: node.children[1].leaf.line,
    };
    if(node.children[2].children) {
      const dimlist = [];
      node.children[2].children.forEach((child) => {
        dimlist.push(child.leaf.value);
      });
      dimlist.forEach((num) =>{
        entry.type = entry.type.concat(`[${num}]`)
      })
    }
    return entry;
  }

  // Func Decl
  function createFuncDeclEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind: 'function',
      type: `${node.children[0].leaf.value} : `,
      link: 'nil',
      line: node.children[1].leaf.line,
    };
    if(node.children[2].children){
      const paramEntry = [];
      const bucket = [];
      node.children[2].children.forEach((child)=> {
        paramEntry.push(ENTRY_CREATOR_MAP[child.node](child));
      });
      paramEntry.forEach((param) =>{
        if (!bucket.includes(param.name)){
         bucket.push(param.name);
         entry.type = entry.type.concat(`${param.type}, `)
        }
        else {
          errors.push(`Duplicate param declaration: '${param.name} in ${entry.name}' `)
        }
      });
      entry.type = entry.type.slice(0, -2);
    }
    return entry;

  }

  // fParam
  function createFParamEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind:'parameter',
      type: node.children[0].leaf.value,
      link:'nil',
    };
    if(node.children[2].children) {
      const dimlist = [];
      node.children[2].children.forEach((child) => {
        dimlist.push(child.leaf.value);
      });
      dimlist.forEach((num) =>{
        entry.type = entry.type.concat(`[${num}]`)
      })
    }
    return entry;
  }

  // statBlock (prog)
  function createStatBlockEntry(node){
    const entry = {
      name : 'program',
      kind: 'function',
      type: 'nil',
      link: 'program',
    };
    buildTables(node);
    tables.push(node.symtab);
    return entry;
  }
  function createStatBlockTable(node){
    const symtab = {
      table: 'program',
      entries: [],
    };
    const bucket = [];
    node.children.forEach((child) =>{
      if (!ENTRY_CREATOR_MAP[child.node]) {
        return;
      }
      const entry = ENTRY_CREATOR_MAP[child.node](child);
      if (!bucket.includes(entry.name)) {
        bucket.push(entry.name);
        symtab.entries.push(entry);
      }
      else {
        errors.push(`Duplicate variable declaration: '${entry.type} ${entry.name}' in '${symtab.table}' @ line ${entry.line} `)
      }
    });
    return symtab;
  }

  function doesTableExist(name) {
    for (let i = 0; i < tables.length; i++) {
      if (tables[i].table === name) {
        return true;
      }
    }
    return false;
  }

  function doesEntryExist(entry, name) {
    for (let i = 0; i < tables.length; i++) {
      // Find the table
      if (tables[i].table === name) {
        // Compare entries one-by-one
        for (let j = 0; j < tables[i].entries.length; j++) {
          if (tables[i].entries[j].name === entry.name && tables[i].entries[j].kind === entry.kind) {
            return true;
          }
        }
      }
    }
    return false;
  }
  function printAllTables(tables){
    tables.unshift(tables.pop());
    fs.writeFileSync('symbolTables.txt', '---SYMBOL TABLES--- \n\n');
    tables.forEach((table) => {
      const t = new Table;
      table.entries.forEach((entry) => {
        t.cell('Name', entry.name);
        t.cell('Kind', entry.kind);
        t.cell('Type', entry.type);
        t.cell('Line', entry.line);
        t.cell('Link', entry.link);
        t.newRow();
      });
      fs.appendFileSync('symbolTables.txt', `Table: ${table.table}\n`);
      fs.appendFileSync('symbolTables.txt', `${t.toString()}\n\n`);
    });
    jsonFile.writeFileSync('symbolTablesJSON.txt', tables, {spaces: 2}, function (err) {
    })
  }

  function printErrorsOrWarnings(errors, type) {
    if (errors.length > 0) {
      fs.writeFileSync(`${type}.txt`, `---Semantic ${type}--- \n\n`);
      errors.forEach((error) =>{
        console.error(`Semantic ${type.slice(0, -1)}: ${error}`);
        fs.appendFileSync(`${type}.txt`, `${error} \n`);
      });
    }
    else {
      fs.writeFileSync(`${type}.txt`, `No Semantic ${type}`);
    }
  }

  function printAugmentedAst(rootNode) {
    jsonFile.writeFileSync('augmentedAST.txt', rootNode, {spaces: 2}, function (err) {
    })
  }

  function graphAST(node) {
    if (node.node === 'prog') {
      fs.writeFileSync("astGraph.txt", "graph AST { \n");
      fs.appendFileSync("astGraph.txt", `\t${node.number} [label="${node.node}"];\n`);
    }
    if (node.children) {
      node.children.forEach((child) => {
        fs.appendFileSync("astGraph.txt", `\t${child.number} [label="${child.node}"${!child.children && !child.leaf ? ', style=filled, fillcolor="#FFCCCB "' : ''}];\n`);
        fs.appendFileSync("astGraph.txt", `\t${node.number} -- ${child.number};\n`);
        graphAST(child);
      });
    }
    if (node.leaf) {
      fs.appendFileSync("astGraph.txt", `\t${node.leaf.position * -1} [label="${node.leaf.value}", style="filled,dotted", fillcolor=lightblue];\n`);
      fs.appendFileSync("astGraph.txt", `\t${node.number} -- ${node.leaf.position * -1} [style=dashed, color=black];\n`);
    }
    if (node.node === 'prog') {
      fs.appendFileSync("astGraph.txt", "}");
    }
  }
}

module.exports = semantics;
