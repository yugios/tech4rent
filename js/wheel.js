const spinBtn = document.getElementById('spin-btn');
const wheelOverlay = document.getElementById('wheel-overlay');
const closeWheel = document.getElementById('close-wheel');
const spinWheelBtn = document.getElementById('spin-wheel-btn');
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const couponResult = document.getElementById('coupon-result');

const segments = [
  {text: "5%", color: "#f94144"},
  {text: "10%", color: "#f3722c"},
  {text: "15%", color: "#f8961e"},
  {text: "20%", color: "#f9c74f"},
  {text: "50%", color: "#90be6d"},
  {text: "80%", color: "#43aa8b"},
  {text: "90%", color: "#577590"}
];

const segCount = segments.length;
const segAngle = 2 * Math.PI / segCount;
let startAngle = 0;
let spinning = false;

// Limit spins
let spinsLeft = 2;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < segCount; i++) {
    const angle = i * segAngle + startAngle;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angle, angle + segAngle);
    ctx.fillStyle = segments[i].color;
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angle + segAngle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(segments[i].text, 180, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning) return;
  if (spinsLeft <= 0) {
    couponResult.textContent = "Je hebt je spins al gebruikt!";
    return;
  }

  spinning = true;
  couponResult.textContent = "";

  const spins = Math.floor(Math.random() * 5) + 8; // 8-12 full rotations
  const finalSegmentIndex = Math.floor(Math.random() * segCount); // correct segment
  const finalAngle = (segCount - finalSegmentIndex) * segAngle - segAngle / 2;
  const totalAngle = spins * 2 * Math.PI + finalAngle;
  const duration = 5000; // 5 sec
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3); // slow down
    startAngle = totalAngle * easeOut;
    drawWheel();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      spinsLeft--; // decrease spins
      const segment = segments[finalSegmentIndex];
      const couponCode = `TECH${Math.floor(Math.random() * 90000 + 10000)}`;
      couponResult.textContent = `Gefeliciteerd! Je won ${segment.text} korting! Code: ${couponCode}`;
    }
  }

  requestAnimationFrame(animate);
}

// Event Listeners
spinBtn.addEventListener('click', () => wheelOverlay.style.display = 'flex');
closeWheel.addEventListener('click', () => wheelOverlay.style.display = 'none');
spinWheelBtn.addEventListener('click', spinWheel);

// Initial draw
drawWheel();
