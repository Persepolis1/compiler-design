let nodeNumber = 1;
class Node {
  constructor(node = null) {
    this.node = node;
    this.number = nodeNumber++;
  }

  setLeaf(leaf){
    this.leaf = leaf;
  }

  setHasToken(token){
    this.hasToken = token;
  }

  makeFamily(children){
    if(this.children) {
      this.children = this.children.concat(children);
    }
    else {
      this.children = children;
    }
  }
}
module.exports = {
  Node,
};
