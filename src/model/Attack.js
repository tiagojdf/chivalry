/*
 * Attacks can be scheduled, active, blocked, success
 */
export default class Attack{
  constructor(target){
    this.target = target
    this.status = 'scheduled'
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
  updateStartPoint(touch, time){
    this.start = {
      x: touch.pageX,
      y: touch.pageY,
      time: time || new Date,
    }
  }
  updateEndPoint(touch, time){
    this.end = {
      x: touch.pageX,
      y: touch.pageY,
      time: time || new Date,
    }
  }
}
