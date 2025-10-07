// Define coupon sectors with discount percentages and codes
const sectors = [
  { color: "#FFBC03", text: "#333333", label: "10% OFF", discount: 10, code: "FTO8744" },
  { color: "#FF5A10", text: "#FFFFFF", label: "15% OFF", discount: 15, code: "FTO6844" },
  { color: "#4CAF50", text: "#FFFFFF", label: "20% OFF", discount: 20, code: "FTO9633" },
  { color: "#2196F3", text: "#FFFFFF", label: "25% OFF", discount: 25, code: "FTO9311" },
  { color: "#9C27B0", text: "#FFFFFF", label: "30% OFF", discount: 30, code: "FTO2123" },
  { color: "#FF5722", text: "#FFFFFF", label: "35% OFF", discount: 35, code: "FTO8752" },
  { color: "#607D8B", text: "#FFFFFF", label: "40% OFF", discount: 40, code: "FTO8572" },
  { color: "#795548", text: "#FFFFFF", label: "50% OFF", discount: 50, code: "FTO6009" },
];

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (m, M) => Math.random() * (M - m) + m;
let tot, spinEl, ctx, dia, rad, PI, TAU, arc;

const friction = 0.991;
let angVel = 0;
let ang = 0;
let spinButtonClicked = false;
let wheelTries = 2;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 16px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 12, 8);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  // Fire an event after the wheel has stopped spinning
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false;
    return;
  }

  angVel *= friction;
  if (angVel < 0.002) angVel = 0;
  ang += angVel;
  ang %= TAU;
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function initWheel() {
  // Initialize wheel variables
  spinEl = document.querySelector("#spin");
  ctx = document.querySelector("#wheel").getContext("2d");
  dia = ctx.canvas.width;
  rad = dia / 2;
  PI = Math.PI;
  TAU = 2 * PI;
  tot = sectors.length;
  arc = TAU / sectors.length;

  // Draw sectors and start engine
  sectors.forEach(drawSector);
  rotate();
  engine();
  
  // Add spin event listener
  spinEl.addEventListener("click", () => {
    if (!angVel && wheelTries > 0) {
      angVel = rand(0.25, 0.45);
      spinButtonClicked = true;
      
      // Decrement tries immediately on click
      wheelTries--;
      document.getElementById("wheel-tries-left").textContent = wheelTries;
      
      // Disable spin button if no tries left
      if (wheelTries <= 0) {
        spinEl.disabled = true;
        spinEl.textContent = "GEEN SPINS";
      }
    }
  });
}

function showResult(sector) {
  const resultEl = document.getElementById("wheel-result");
  resultEl.innerHTML = `
    <div class="alert alert-success">
      <h4>🎉 Gefeliciteerd!</h4>
      <p>Je hebt <span class="discount-badge">${sector.discount}% korting</span> gewonnen!</p>
      <p>Je kortingscode: <span class="coupon-code">${sector.code}</span></p>
      <p class="mb-0">Deze code wordt automatisch toegepast bij het afrekenen.</p>
    </div>
  `;
  
  // Apply the discount immediately
  applyCouponFromWheel(sector);
}

function showWheelOverlay() {
  document.getElementById("wheel-overlay").style.display = "flex";
}

function closeWheelOverlay() {
  document.getElementById("wheel-overlay").style.display = "none";
}

// COUPON FUNCTIONALITY - INTEGRATED WITH MAIN.JS
function applyCouponFromWheel(sector) {
  // Store coupon in localStorage
  localStorage.setItem('tech4rent_coupon', JSON.stringify(sector));
  
  // Update checkout UI if checkout page is open
  if (typeof updateCheckoutCouponDisplay === 'function') {
    updateCheckoutCouponDisplay();
  }
  
  // Update order summary with discount
  if (typeof updateOrderSummary === 'function') {
    updateOrderSummary();
  }
  
  // Show success message
  if (typeof showNotification === 'function') {
    showNotification(`🎉 ${sector.discount}% korting toegepast! Code: ${sector.code}`, 'success');
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize wheel
  initWheel();
  
  // Add event listeners
  document.getElementById("spin-wheel-btn").addEventListener("click", showWheelOverlay);
  document.getElementById("close-wheel").addEventListener("click", closeWheelOverlay);
  
  // Listen for spin end events
  events.addListener("spinEnd", (sector) => {
    console.log(`🎉 You won ${sector.discount}% OFF with code: ${sector.code}`);
    setTimeout(() => {
      showResult(sector);
    }, 500);
  });
});
