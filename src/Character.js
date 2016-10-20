import { drawLifeBar } from './tools/draw'

export default class Character{
  constructor(name){
    this.hp = 100
    this.maxHp = 100
    this.name = name
    this.drawLifeBar = (canvas, context, {x, y}) => {
      drawLifeBar(canvas, context, {x, y}, this)
    }
  }
  hurt(hp){
    this.hp -= hp
  }
}
