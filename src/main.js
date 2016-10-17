/* global ga */
/*
 * TODO Check Mousetrap and Hammerjs
 */

/*
 * V 0.1
 * Add health bars (player and enemy)
 * Add enemy block
 *
 * V 0.2
 * Add enemy hit box
 * Add level logic on Win
 * Draw cut as curvy line ?
 */

 /*
  * PLAYER
  *
  * Draw life bar
  * Add stamina
  * Draw stamina bar
  */

 /*
  * Defense
  *
  * calculate damage when defense is not strong enough
  */


/*
 * ENEMY
 *
 * Make enemy defend
 * Make enemy attack from random position
 * Add AI for attack pattern
 *  - Random attack time at first
 *  - Random chance to block at first
 *
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
import Enemy from './Enemy'
import Attack from './model/Attack'
import lineIntersect from './tools/lineIntersect'
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
// const enemyImage = new Image()
// enemyImage.src = './assets/enemy.jpg';
let  attacks = []

class Game {
  constructor(canvas, context){
    this.canvas = canvas
    this.context = context
    this.accumulator = 0
    this.previousTime = 0
    this.step = 1/60
    this.player = new Character('player')
    this.enemy = new Enemy('enemy', 100, 1000)
    this.ongoingTouches = []
  }
  startup(){
    this.canvas.addEventListener('touchstart', handleStart.bind(this), false)
    this.canvas.addEventListener('touchend', handleEnd.bind(this), false)
    this.canvas.addEventListener('touchcancel', handleCancel.bind(this), false)
  }
  launch(currentTime){
    if (this.state === 'lost') return
    if (this.state === 'win') return

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
    // Enemy AI
    this.enemy.attackTimer -= dt
    if (this.enemy.attackTimer <= 0) {
      attacks.push(this.enemy.attack(this.player))
    }
    const attackEnemy = attacks.find(attack => attack.target === this.enemy && attack.status === 'active')
    const attackPlayer = attacks.find(attack => attack.target === this.player && attack.status === 'active')
    if (!attackPlayer && attackEnemy && this.enemy.willDefend()) attacks.push(this.enemy.defend(this.player, attackEnemy))
    // this.enemy.defendTimer -= dt
    // if (this.enemy.defendTimer <= 0) {
    // }
    // Process existing attacks
    for (let i = 0; i < attacks.length; i++){
      let attack = attacks[i]
      switch (attack.status) {
      case 'active':
        // Block logic
        for (let j = i+1; j < attacks.length; j++) {
          let block = attacks[j]
          if (block.target != attack.target && lineIntersect(attack, block)) {
            attack.end.time = new Date
            attack.status = 'blocked' // needed for animation
            block.status = 'blocking' // needed for animation
            ga('send', 'event', 'game', 'block', null, attack.target.name)
          }
        }
        // If time is over and not blocked
        if (attack.end.time < new Date && attack.status === 'active') {
          attack.status = 'success'
          const damage = attack.intensity/Math.sqrt(this.canvas.width**2 + this.canvas.height**2)*100
          attack.target.hurt(damage)
          ga('send', 'event', 'game', 'hurt', attack.target.name, attack.target.hp)
        }
        break
      }
    }
    // Check if we need to change state

    if (this.player.hp <= 0) this.gameOver()
    if (this.enemy.hp <= 0) this.win()
  }
  restart(){
    this.player.hp = 100
    this.enemy.hp = 100
    this.state = undefined
    this.accumulator = 0
    this.previousTime = 0
    this.ongoingTouches = []

    this.launch()
  }
  gameOver(){
    ga('send', 'event', 'game', 'lost', null, null)
    this.state = 'lost'
  }
  win(){
    ga('send', 'event', 'game', 'win', null, null)
    this.state = 'win'
  }
  // Drawing methods
  draw(){
    if (this.state === 'lost') return this.drawMainText('You lose!', 'Touch the screen to restart')
    if (this.state === 'win') return this.drawMainText('You win!', 'Touch the screen to restart')

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
    this.context.strokeStyle = attack.target === this.player ? 'red' : 'black'
    this.context.fillStyle = attack.target === this.player ? 'red' : 'black'
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
    this.context.strokeStyle = attack.target === this.player ? 'red' : 'black'
    this.context.fillStyle = attack.target === this.player ? 'red' : 'black'
    this.context.beginPath()
    this.context.moveTo(attack.start.x, attack.start.y)
    this.context.lineTo(
      attack.start.x + attack.delta.x*(new Date - attack.start.time)/(attack.delta.time),
      attack.start.y + attack.delta.y*(new Date - attack.start.time)/(attack.delta.time))
    this.context.stroke()

    this.context.restore()
  }
  drawMainText(title, subtitle){
    this.context.textAlign = 'center'
    this.context.font = '48px serif'
    this.context.fillText(title, this.canvas.width / 2, this.canvas.height / 2)
    this.context.font = 'bold 24px serif'
    this.context.fillText(subtitle, this.canvas.width/2, this.canvas.height/2 + 50)
  }
}

const game = new Game(canvas, ctx)
game.startup()
game.launch()

function handleStart(evt) {
  evt.preventDefault()
  if (this.state === 'lost') this.restart()
  if (this.state === 'win') this.restart()

  var touches = evt.changedTouches

  for (var i = 0; i < touches.length; i++) {
    this.ongoingTouches.push(startAttack(this.enemy, touches[i]))
  }
}

function handleEnd(evt) {
  evt.preventDefault()
  const touches = evt.changedTouches

  for (let i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById.bind(this)(touches[i].identifier)
        // var imageData = ctx.getImageData(0,0,canvas.width,canvas.height) // http://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas
    if (idx >= 0) {

      const attack = updateTouch(this.ongoingTouches[idx], touches[i])
      attack.alpha = 1
      attacks.push(attack)
      this.ongoingTouches.splice(idx, 1)  // remove it; we're done
    } else {
      console.error('can\'t figure out which touch to end')
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault()
  var touches = evt.changedTouches

  for (var i = 0; i < touches.length; i++) {
    this.ongoingTouches.splice(i, 1)  // remove it; we're done
  }
}

// HELPER FUNCTIONS

function startAttack(target, touch) {
  const attack = new Attack(target)
  attack.updateStartPoint({
    x: touch.pageX,
    y: touch.pageY,
  })
  attack.identifier = touch.identifier
  return attack
}

function updateTouch(attack, touch) {
  if (attack.identifier !== touch.identifier) return
  attack.updateEndPoint({
    x: touch.pageX,
    y: touch.pageY,
  })
  attack.status = 'active'
  return attack
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < this.ongoingTouches.length; i++) {
    var id = this.ongoingTouches[i].identifier

    if (id == idToFind) {
      return i
    }
  }
  return -1    // not found
}
