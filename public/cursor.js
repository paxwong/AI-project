var cursor = document.getElementById("cursor");

document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px",
        cursor.style.top = e.clientY + "px";

});

var background = document.querySelector('.background');
let x = 2
function changeBackround() {
    if (x > 3) {
        x = 1
    }
    background.style.backgroundImage = `url('./img/background${x}.jpeg')`
    x++

}

setInterval(changeBackround, 10000)