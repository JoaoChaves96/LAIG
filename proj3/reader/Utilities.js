class Light{
  constructor(id, type, enabled, angle, exponent, target, location, ambient, diffuse, specular){
    this.type = type;
    this.id = id;
    this.enabled = enabled;
    this.angle = angle;
    this.exponent = exponent;
    this.target = target;
    this.location = location;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
  }
}

class Material{
  constructor(id, emission, ambient, diffuse, specular, shininess){
    this.id = id;
    this.emission = emission;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
  }
}

class Texture{
  constructor(id, text, length_s, length_t){
    this.id = id;
    this.file = text;
    this.length_s = length_s;
    this.length_t = length_t;
  }
}

function Stack(item){
  this.stack = [];
  if(item != null){
    this.stack.push(item);
  }
}

Stack.prototype.push = function(item){
  this.stack.push(item);
}

Stack.prototype.pop = function(){
  this.stack.pop();
}

Stack.prototype.top = function(){
  return this.stack[this.stack.length - 1];
}
