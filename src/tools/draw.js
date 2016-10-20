export function drawLifeBar(canvas, context, {x, y}, { name, hp, maxHp }){
  const height = 20
  const width = canvas.width - 2 * x

  context.save()
  context.fillStyle = 'red'
  context.fillRect(x,y,width ,height)
  context.fillStyle = 'green'
  context.fillRect(x,y,hp/maxHp * width ,height)
  context.fillStyle = 'white'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = 'bold 16px serif'
  context.fillText(name.toUpperCase(), x + width / 2, y + height / 2)
  context.restore()
}
