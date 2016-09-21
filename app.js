/*
 * TODO Check Mousetrap and Hammerjs
 */

/*
 * Create the game loop. Will need it for animation purposes. Check last video in egghead
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
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
const ongoingTouches = new Array();
var color = 'black';

startup(canvas)

function startup(canvas) {
  canvas.addEventListener("touchstart", handleStart, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchcancel", handleCancel, false);
  canvas.addEventListener("touchmove", handleMove, false);
}

function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.push(startTouch(touches[i]));
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      // ctx.beginPath();
      // ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      // ctx.lineTo(touches[i].pageX, touches[i].pageY);
      // ctx.lineWidth = 4;
      // ctx.strokeStyle = color;
      // ctx.stroke();

      ongoingTouches.splice(idx, 1, updateTouch(ongoingTouches[idx], touches[i]));  // swap in the new touch record
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height); // http://stackoverflow.com/questions/7365436/erasing-previously-drawn-lines-on-an-html5-canvas

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].startX, ongoingTouches[idx].startY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.stroke();
      console.log(touchDirection(ongoingTouches[idx]));
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we're done
  }
}

// HELPER FUNCTIONS

function startTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    startX: touch.pageX,
    startY: touch.pageY,
    startTime: Date.now(),
  };
}

function updateTouch(ongoingTouch, touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    startX: ongoingTouch.startX,
    startY: ongoingTouch.startY,
    startTime: ongoingTouch.startTime,
    endTime: Date.now(),
  };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function touchDirection(touch) {
  const dx = touch.startX - touch.pageX;
  const dy = touch.startY - touch.pageY;
  return {
    intensity: Math.sqrt((dx*dx) + (dy*dy)),
    angle: Math.atan2(dy, dx) / Math.PI * 180,
    duration:  - touch.endTime,
  }
}

// Add a function that draws the path and sets its globalAlpha to change at each step
