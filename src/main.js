/*
 * TODO Check Mousetrap and Hammerjs
 *
 * Design a proper target system
 */

/*
 * Draw a static enemy as background
 * Draw cut as it is finished, scale it up and then make it fade -> Draw cut as curvy line ?
 * Draw enemy line of attack
 * Draw enemy at
 */

 /*
  * PLAYER
  *
  * Add life
  * Draw life bar
  * Add stamina
  * Draw stamina bar
  *
  * Defense -> calculate damage when defense is not strong enough
  */

/*
 * ENEMY
 *
 * Make enemy attack once per second
 * Draw enemy line of attack
 * Draw enemy attack -> make reusable function for drawing attack given start, end point and color
 * Calculate damage caused when not blocked
 * Make enemy defend
 */

/*
 * Attack mechanic
 *
 * V 0.1
 * Grab first and last point. Use intensity as value for damage or defense
 * Consider defense when lines intersect
 *
 */
import { enemyImage } from './assets/enemyImage'
import Character from './Character'
import Attack from './model/Attack'
import lineIntersect from './tools/lineIntersect'
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const ongoingTouches = new Array()
// const enemyImage = new Image()
// enemyImage.src = './assets/enemy.jpg';
let  attacks = []

startup(canvas)

class Game {
  constructor(canvas, context){
    this.canvas = canvas
    this.context = context
    this.accumulator = 0
    this.previousTime = 0
    this.step = 1/60
    this.player = new Character()
    this.enemy = new Character()
    this.enemy.timer = 2
    this.enemy.speed = 1000
  }
  launch(currentTime){
    if (this.previousTime) {
      this.update((currentTime - this.previousTime) / 1000)
    }
    this.previousTime = currentTime
    requestAnimationFrame((dt) => this.launch(dt))
  }
  update(dt){
    this.accumulator += dt
    while(this.accumulator > this.step){
      this.simulate(this.step)
      this.accumulator -= this.step
    }
    this.draw()
  }
  simulate(dt){
    // Process existing attacks
    for (let i = 0; i < attacks.length; i++){
      let attack = attacks[i]
      switch (attack.status) {
      case 'scheduled':
        attack.status = 'active'
        break
      case 'active':
        // Block logic
        for (let j = i+1; j < attacks.length; j++) {
          let block = attacks[j]
          if (block.target != attack.target && lineIntersect(attack, block)) {
            console.log('block');
            attack.status = 'blocked'
            attack.end.time = new Date
            block.status = 'blocking'
          }
        }
        // If time is over and not blocked
        if (attack.end.time < new Date) {
          attack.status = 'success'
        }
        break
      }
    }
    // Enemy AI
    if (this.enemy.timer > 0) {
      this.enemy.timer -= dt
      return
    }
    // Add enemy attack

    const attack = new Attack('player')
    attack.updateStartPoint({
      pageX: 50,
      pageY: 50,
    })
    attack.updateEndPoint({
      pageX: 200,
      pageY: 400,
    }, new Date((new Date()).getTime() + this.enemy.speed))
    attack.status = 'scheduled'
    attacks.push(attack)
    this.enemy.timer = 5
  }
  draw(){
    this.context.clearRect(0, 0, canvas.width, canvas.height)
    this.context.drawImage(enemyImage, 400, 0, 540, 960, 0, 0, 320, 568)

    attacks.forEach((attack) => {
      switch (attack.status) {
      case 'success':
      case 'blocking':
      case 'blocked':
        this.drawAttack(attack)
        attacks = attacks.filter((attack) => attack.alpha > 0)
        break
      case 'active':
        this.drawPath(attack)
        break
      }
    })
  }
  drawAttack(attack){
    this.context.save()
    this.context.globalAlpha = attack.alpha
    this.context.lineWidth = 4
    this.context.strokeStyle = attack.target === 'player' ? 'red' : 'black'
    this.context.fillStyle = attack.target === 'player' ? 'red' : 'black'
    this.context.beginPath()
    this.context.moveTo(attack.start.x, attack.start.y)
    this.context.lineTo(attack.end.x, attack.end.y)
    this.context.stroke()

    attack.alpha -= 0.06
    this.context.restore()
  }
  drawPath(attack){
    this.context.save()
    this.context.lineWidth = 4
    this.context.strokeStyle = attack.target === 'player' ? 'red' : 'black'
    this.context.fillStyle = attack.target === 'player' ? 'red' : 'black'
    this.context.beginPath()
    this.context.moveTo(attack.start.x, attack.start.y)
    this.context.lineTo(
      attack.start.x + attack.delta.x*(new Date - attack.start.time)/(attack.delta.time),
      attack.start.y + attack.delta.y*(new Date - attack.start.time)/(attack.delta.time))
    this.context.stroke()

    this.context.restore()
  }
}

const game = new Game(canvas, ctx)
game.launch()
function startup(canvas) {
  canvas.addEventListener('touchstart', handleStart, false)
  canvas.addEventListener('touchend', handleEnd, false)
  canvas.addEventListener('touchcancel', handleCancel, false)
}
function handleStart(evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.push(startAttack(touches[i]))
  }
}

function handleEnd(evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier)
        // var imageData = ctx.getImageData(0,0,canvas.width,canvas.height) // http://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas

    if (idx >= 0) {

      const attack = updateTouch(ongoingTouches[idx], touches[i])
      attack.alpha = 1
      attack.target = 'opponent'
      attacks.push(attack)
      ongoingTouches.splice(idx, 1)  // remove it; we're done
    } else {
      console.error('can\'t figure out which touch to end')
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1)  // remove it; we're done
  }
}

// HELPER FUNCTIONS

function startAttack(touch) {
  const attack = new Attack('opponent')
  attack.updateStartPoint(touch)
  attack.identifier = touch.identifier
  return attack
}

function updateTouch(attack, touch) {
  if (attack.identifier !== touch.identifier) return
  attack.updateEndPoint(touch)
  return attack
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier

    if (id == idToFind) {
      return i
    }
  }
  return -1    // not found
}
