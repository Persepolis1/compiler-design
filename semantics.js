const jsonFile = require('jsonfile');
const fs = require('fs');
function semantics(ast){
  if (!ast){
    return;
  }
  const TABLE_CREATORS = ['prog', 'classList','classDecl','statBlock'];
  const TABLE_CREATOR_MAP = {
    'prog': createProgSymTab,
    'classList': createClasslistSymTab,
    'classDecl': createClassDeclTable,
    'statBlock': createStatBlockTable,
  }
  const ENTRY_CREATOR_MAP = {
    'classList': createClassListEntries,
    'classDecl': createClassDeclEntries,
    'varDecl': createVarDeclEntries,
    'funcDecl': createFuncDeclEntries,
    'fparam': createFParamEntries,
    'statBlock': createStatBlockEntry,
  }
  const tables = [];
  const errors = [];
  const AST = [...ast][0];
  buildTables(AST);
  printAllTables(tables);
  function buildTables(AST){
    if (TABLE_CREATORS.includes(AST.node)){
      AST['symtab'] = TABLE_CREATOR_MAP[AST.node](AST);
    }
  }
  function createProgSymTab(node){
    const symtab = {
      table: 'Global',
      entries: [],
    }
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
  function createClassListEntries(node){
    buildTables(node);
    return node.symtab.entries
  }
  function createClasslistSymTab(node){
   const symtab = {
     table: 'classList',
     entries: [],
   };
   node.children.forEach((child) =>{
     symtab.entries.push(ENTRY_CREATOR_MAP[child.node](child));
   })
    return symtab;
  }
  function createClassDeclEntries(node){
    const entry = {
      name: node.children[0].leaf.value,
      kind: 'class',
      type: 'nil',
      link: node.children[0].leaf.value,
    }
    buildTables(node);
    tables.push(node.symtab);
    return entry;
  }
  function createClassDeclTable(node) {
    const symtab = {
      table: node.children[0].leaf.value,
      entries: [],
    };
    // Duplicate check
    const bucket = []
    if(node.children[2].children) {
      node.children[2].children.forEach((child) => {
        const entry = ENTRY_CREATOR_MAP[child.node](child);
        if (!bucket.includes(entry.name)) {
          bucket.push(entry.name)
          symtab.entries.push(entry);
        }
        else {
          errors.push(`Duplicate variable declaration: '${entry.type} ${entry.name}' in class '${symtab.table}' `)
        }
      })
    }
    return symtab;
  }
  function createVarDeclEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind:'variable',
      type: node.children[0].leaf.value,
      link:'nil',
    }
    if(node.children[2].children) {
      const dimlist = [];
      node.children[2].children.forEach((child) => {
        dimlist.push(child.leaf.value);
      })
      dimlist.forEach((num) =>{
        entry.type = entry.type.concat(`[${num}]`)
      })
    }
    return entry;
  }
  function createFuncDeclEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind: 'function',
      type: `${node.children[0].leaf.value} : `,
      link: 'nil',
    }
    if(node.children[2].children){
      const paramEntry = [];
      const bucket = [];
      node.children[2].children.forEach((child)=> {
        paramEntry.push(ENTRY_CREATOR_MAP[child.node](child));
      })
      paramEntry.forEach((param) =>{
        if (!bucket.includes(param.name)){
         bucket.push(param.name);
         entry.type = entry.type.concat(`${param.type}, `)
        }
        else {
          errors.push(`Duplicate param declaration: '${param.name} in ${entry.name}' `)
        }
      })
      entry.type = entry.type.slice(0, -2);
    }
    return entry;

  }
  function createFParamEntries(node){
    const entry = {
      name: node.children[1].leaf.value,
      kind:'parameter',
      type: node.children[0].leaf.value,
      link:'nil',
    }
    if(node.children[2].children) {
      const dimlist = [];
      node.children[2].children.forEach((child) => {
        dimlist.push(child.leaf.value);
      })
      dimlist.forEach((num) =>{
        entry.type = entry.type.concat(`[${num}]`)
      })
    }
    return entry;
  }
  function createStatBlockEntry(node){
    const entry = {
      name : 'program',
      kind: 'function',
      type: 'nil',
      link: 'program',
    }
    buildTables(node);
    tables.push(node.symtab);
    return entry;
  }
  function createStatBlockTable(node){
    const symtab = {
      table: 'program',
      entries: [],
    }
    const bucket = [];
    node.children.forEach((child) =>{
      const entry = ENTRY_CREATOR_MAP[child.node](child);
      if (!bucket.includes(entry.name)) {
        bucket.push(entry.name)
        symtab.entries.push(entry);
      }
      else {
        errors.push(`Duplicate variable declaration: '${entry.type} ${entry.name}' in '${symtab.table}' `)
      }
    })
    return symtab;
  }
  function printAllTables(tables){
    if (errors.length > 0 ){
      fs.writeFileSync('symbolTables.txt', '---ERRORS--- \n\n');
      console.log('Semantic Errors!')
      errors.forEach((error) =>{
        console.log(error);
        fs.appendFileSync('symbolTables.txt', `${error} \n`);
      })
      fs.appendFileSync('symbolTables.txt', '\n---SYMBOL TABLES--- \n\n');
    }
    else{
      fs.writeFileSync('symbolTables.txt', '---SYMBOL TABLES--- \n\n');
    }
    tables = tables.reverse();
    for (let i = 0; i < tables.length ; i++) {
      const currentTable = tables[i];
      fs.appendFileSync('symbolTables.txt', `Symbol Table : ${currentTable.table} \n`);
      fs.appendFileSync('symbolTables.txt', `--------------------------------------------------------\n`);
      fs.appendFileSync('symbolTables.txt', 'Name\t\t\tKind\t\t\tType\t\t\tLink\n');
      fs.appendFileSync('symbolTables.txt', `--------------------------------------------------------\n`);
      currentTable.entries.forEach((entry) => {
        fs.appendFileSync('symbolTables.txt', `${entry.name}\t\t\t${entry.kind}\t\t\t${entry.type}\t\t\t${entry.link}\n`);
      })
      fs.appendFileSync('symbolTables.txt', `--------------------------------------------------------\n\n`);
    }
    jsonFile.writeFileSync('symbolTablesJSON.txt', tables, {spaces: 2}, function(err) {})
  }
}

module.exports = semantics;
