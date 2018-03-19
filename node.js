class Node {
  constructor(node = null, parent = null){
    this.node = node;
    this.parent = parent;
  }

  getParent(){
    return this.parent;
  }
  setLeaf(leaf){
    this.leaf = leaf;
  }
  setHasToken(token){
    this.hasToken = token;
  }
  makeFamily(children){
    if(this.children)
    {
      this.children = this.children.concat(children);
    }
    else {
      this.children = children;
    }
  }
}
module.exports = {
  Node,
}
