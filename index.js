const canvas = document.getElementById('canvas')
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const sizeEl = document.getElementById('size')
const colorEl = document.getElementById('color')
const clearEl = document.getElementById('clear')
const circleEl = document.getElementById('circle')
const download = document.getElementById('download')
const reviewEl = document.getElementById('review')
const pen = document.getElementById('pen')

const ctx = canvas.getContext('2d')

let size = 10
let isPressed = false
colorEl.value = 'black'
let color;
let type = 'fill'
let x, y
let records = []

const updateStep = (fn, args) => {
  records.push({ fn, args })
}

const review = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const len = records.length - 1;
  let idx = 0
  let timer = setTimeout(async function f() {
    await new Promise(resolve => {
      const item = records[idx]
      const args = [item.args]
      item.fn(...args)
      idx += 1
      resolve()
    }).then(() => {
      if (idx >= len) {
        clearTimeout(timer)
      } else{
        setTimeout(f, 5)
      }
    })
  }, 5);
}


const drawCircle = (args) => {
  const { x, y } = args
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.arc(x, y, size, Math.PI * 2, false)
  ctx.stroke()
}

const fillCircle = (args) => {
  const { x, y } = args
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, size, Math.PI * 2, false)
  ctx.fill()
  ctx.restore()
}

const drawLine = (args) => {
  const { x, y, x2, y2 } = args
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = color
  ctx.lineWidth = size * 2
  ctx.stroke()
  ctx.restore()
}

canvas.addEventListener('mousedown', (e) => {
  isPressed = true
  x = e.offsetX
  y = e.offsetY
  // drawCircle(x, y)
  // fillCircle(x, y)
})

canvas.addEventListener('mouseup', (e) => {
  if (type === 'stroke') {
    drawCircle({ x, y })
    updateStep(drawCircle, { x, y,})
  }
  isPressed = false
  x = undefined
  y = undefined
  
})

canvas.addEventListener('mousemove', (e) => {
  if (isPressed && type === 'fill') {
    const x2 = e.offsetX
    const y2 = e.offsetY
    // drawCircle(x, y)
    fillCircle({ x, y })
    drawLine({ x, y, x2, y2 })
    updateStep(fillCircle, { x, y })
    updateStep(drawLine, { x, y, x2, y2 })
    x = x2
    y = y2

  }
})


colorEl.addEventListener('change', (e) => color = e.target.value)

circleEl.addEventListener('click', () => {
  type = 'stroke'
  console.log(type)
})

const downloadImage = (blob) => {
  // canvas.toBlob(function(blob) {
  let link = document.createElement('a')
  link.download = 'example.png'

  link.href = URL.createObjectURL(blob)
  link.click()

  URL.revokeObjectURL(link.href)
  // }, 'image/png')
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  records = []
  type = "fill"
}

download.addEventListener('click', async () => {
  let blob = await new Promise(resolve => canvas.toBlob(downloadImage, 'image/png'))
})

increaseBtn.addEventListener('click', () => {
  size = size + 5 <= 50 ? size + 5 : 50
  sizeEl.textContent = size
})

decreaseBtn.addEventListener('click', () => {
  size = size - 5 >= 5 ? size - 5 : 5
  sizeEl.textContent = size
})

clearEl.addEventListener('click', clearCanvas)

reviewEl.addEventListener('click', review)

pen.addEventListener('click', () => type = 'fill')