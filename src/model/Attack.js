/*
 * Attacks can be active, blocked, success
 */
export default class Attack{
  constructor(target){
    this.target = target
    this.status = 'scheduling'
    this.alpha = 1
    this.start = {
      x: undefined,
      y: undefined,
      time: undefined,
    },
    this.end = {
      x: undefined,
      y: undefined,
      time: undefined,
    }
  }
  get delta(){
    return {
      x: this.end.x - this.start.x,
      y: this.end.y - this.start.y,
      time: this.end.time - this.start.time,
    }
  }
  get intensity(){
    return Math.sqrt((this.delta.x*this.delta.x) + (this.delta.y*this.delta.y))
  }
  get angle(){
    return Math.atan2(this.delta.y, this.delta.x) / Math.PI * 180
  }
  get duration(){
    return this.delta.time
  }
  updateStartPoint({x, y, time = new Date}){
    this.start = {
      x,
      y,
      time: time,
    }
  }
  updateEndPoint({x, y, time = new Date}){
    this.end = {
      x,
      y,
      time: time,
    }
  }
}
