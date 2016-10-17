import Attack from './model/Attack'

export default class Enemy{
  constructor(name, hp, speed){
    this.name = name || 'enemy'
    this.hp = hp || 100
    this.attackTimer = 2
    // this.defendTimer = 3
    this.defensiveProbability = 1
    this.speed = speed || 1000
    this.attackMoves = [
      {
        start: { x: 60, y: 50 },
        end: { x: 260, y: 400 },
      },
      {
        start: { x: 260, y: 400 },
        end: { x: 60, y: 50 },
      },
      {
        start: { x: 260, y: 50 },
        end: { x: 60, y: 400 },
      },
      {
        start: { x: 60, y: 400 },
        end: { x: 260, y: 50 },
      },
      {
        start: { x: 160, y: 400 },
        end: { x: 160, y: 50 },
      },
      {
        start: { x: 160, y: 400 },
        end: { x: 160, y: 50 },
      },
      {
        start: { x: 260, y: 568/2 },
        end: { x: 60, y: 568/2 },
      },
      {
        start: { x: 60, y: 568/2 },
        end: { x: 260, y: 568/2 },
      },
    ]
  }
  update(){

  }
  attack(target){
    this.defensiveProbability = Math.max(0.5, this.defensiveProbability - 0.1)
    this.attackTimer = Math.ceil(Math.random() * 3)

    const attack = new Attack(target)
    const { start, end } = this.attackMoves[Math.floor(Math.random()*this.attackMoves.length)]
    attack.updateStartPoint(start)
    attack.updateEndPoint({
      x: end.x,
      y: end.y,
      time: new Date((new Date()).getTime() + this.speed),
    })
    attack.status = 'active'
    return attack
  }
  hurt(hp){
    this.hp -= hp
    this.defensiveProbability = 1
  }
  willDefend(){
    return this.defensiveProbability >= Math.random()
  }
  defend(target, attack){
    const midpoint = {
      x: (attack.start.x + attack.end.x) / 2,
      y: (attack.start.y + attack.end.y) / 2,
    }

    const block = new Attack(target)
    block.updateStartPoint({
      x: attack.start.y - midpoint.y + midpoint.x,
      y: attack.start.x - midpoint.x + midpoint.y,
    })
    block.updateEndPoint({
      x: attack.end.y - midpoint.y + midpoint.x,
      y: attack.end.x - midpoint.x + midpoint.y,
    })
    block.status = 'active'

    return block
  }
}
