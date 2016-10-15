export default class Character{
  constructor(name){
    this.hp = 100
    this.name = name
  }
  hurt(hp){
    this.hp -= hp
  }
  update(){

  }
}
