export default function lineIntersect(line1, line2) {
  var x=((line1.start.x*line1.end.y-line1.start.y*line1.end.x)*(line2.start.x-line2.end.x)-(line1.start.x-line1.end.x)*(line2.start.x*line2.end.y-line2.start.y*line2.end.x))/((line1.start.x-line1.end.x)*(line2.start.y-line2.end.y)-(line1.start.y-line1.end.y)*(line2.start.x-line2.end.x))
  var y=((line1.start.x*line1.end.y-line1.start.y*line1.end.x)*(line2.start.y-line2.end.y)-(line1.start.y-line1.end.y)*(line2.start.x*line2.end.y-line2.start.y*line2.end.x))/((line1.start.x-line1.end.x)*(line2.start.y-line2.end.y)-(line1.start.y-line1.end.y)*(line2.start.x-line2.end.x))
  if (isNaN(x)||isNaN(y)) {
    return false
  } else {
    if (line1.start.x>=line1.end.x) {
      if (!(line1.end.x<=x&&x<=line1.start.x)) {return false}
    } else {
      if (!(line1.start.x<=x&&x<=line1.end.x)) {return false}
    }
    if (line1.start.y>=line1.end.y) {
      if (!(line1.end.y<=y&&y<=line1.start.y)) {return false}
    } else {
      if (!(line1.start.y<=y&&y<=line1.end.y)) {return false}
    }
    if (line2.start.x>=line2.end.x) {
      if (!(line2.end.x<=x&&x<=line2.start.x)) {return false}
    } else {
      if (!(line2.start.x<=x&&x<=line2.end.x)) {return false}
    }
    if (line2.start.y>=line2.end.y) {
      if (!(line2.end.y<=y&&y<=line2.start.y)) {return false}
    } else {
      if (!(line2.start.y<=y&&y<=line2.end.y)) {return false}
    }
  }
  return true
}
