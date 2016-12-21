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
   this.transformation = null;
   this.animations = [];
   this.animationIndex = 0;
 };

 MyNode.prototype.push = function(nodeName){
   this.children.push(nodeName);
 }

 MyNode.prototype.getSize = function(){
   return this.children.length;
 }
