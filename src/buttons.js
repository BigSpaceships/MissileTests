let speed = 0;
let oldSpeed = 1;

function playPause() {
  alert("hi")
  if (speed == 0) {
    speed = oldSpeed 
  } else {
    oldSpeed = speed;
    speed = 0;
  }
}