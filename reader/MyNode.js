/**
 * MyNode
 * @constructor
 */
 function MyNode(){
   this.material = [];
   this.texture = null;
   this.mat = null;
   this.children =[];
   this.primitive = null;
 };

 MyNode.prototype.push = function(nodeName){
   this.children.push(nodeName);
 }

 MyNode.prototype.getSize = function(){
   return this.children.length;
 }
