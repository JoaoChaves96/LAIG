class Light{
  constructor(id, enabled, location, ambient, diffuse, specular){
    this.id = id;
    this.enabled = enabled;
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
