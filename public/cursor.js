function update(e){
    var x = e.clientX || e.touches[0].clientX
    var y = e.clientY || e.touches[0].clientY
    const windowX  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
    const windowY = window.innerHeight|| document.documentElement.clientHeight|| 
    document.body.clientHeight;
  
    document.documentElement.style.setProperty('--cursorX', x + 'px')
    document.documentElement.style.setProperty('--cursorY', y + 'px')
    document.documentElement.style.setProperty('--cursorNegX', -x + 'px')
    document.documentElement.style.setProperty('--cursorNegY', -y + 'px')
    document.documentElement.style.setProperty('--X', windowX+200 + 'px')
    document.documentElement.style.setProperty('--Y', windowY+200 + 'px')
  }
  
  document.addEventListener('mousemove',update)
  document.addEventListener('touchmove',update)