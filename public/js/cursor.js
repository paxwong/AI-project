function update(e) {
  var x = e.clientX || e.touches[0].clientX
  var y = e.clientY || e.touches[0].clientY
  const windowX = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
  const windowY = window.innerHeight || document.documentElement.clientHeight ||
    document.body.clientHeight;

  document.documentElement.style.setProperty('--cursorX', x + 'px')
  document.documentElement.style.setProperty('--cursorY', y + 'px')
  document.documentElement.style.setProperty('--cursorNegX', -x + 'px')
  document.documentElement.style.setProperty('--cursorNegY', -y + 'px')
  document.documentElement.style.setProperty('--X', windowX + 200 + 'px')
  document.documentElement.style.setProperty('--Y', windowY + 200 + 'px')
}

document.addEventListener('mousemove', update)
document.addEventListener('touchmove', update)
var background = document.querySelector('.background-mask');
var cursor = document.querySelector('.cursor');
var nothing = document.querySelector('.nothing');
let x = 2
function changeBackground() {
  if (x > 7) {
    x = 1
  }
  background.style.backgroundImage = `url('./img/background${x}.jpeg')`
  cursor.style.backgroundImage = `url('./img/background${x}.jpeg')`
  nothing.style.backgroundImage = `url('./img/background${x}.jpeg')`
  x++

}

setInterval(changeBackground, 5000)

window.addEventListener('load', function () {
  background.style.backgroundImage = `url('./img/background1.jpeg')`
  cursor.style.backgroundImage = `url('./img/background1.jpeg')`
  nothing.style.backgroundImage = `url('./img/background1.jpeg')`
}
)

