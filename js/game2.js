<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kortingsspel — Draai het Rad!</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #2563eb, #1e3a8a);
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .game-box {
      background: rgba(0,0,0,0.3);
      padding: 20px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      max-width: 400px;
    }
    h1 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }
    #wheel {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      border: 10px solid #fff;
      margin: 0 auto 20px auto;
      position: relative;
      overflow: hidden;
      transform: rotate(0deg);
      transition: transform 5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }
    .segment {
      position: absolute;
      width: 50%;
      height: 50%;
      background: #facc15;
      transform-origin: 100% 100%;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: bold;
      color: #000;
    }
    #pointer {
      width: 0; 
      height: 0; 
      border-left: 20px solid transparent;
      border-right: 20px solid transparent;
      border-bottom: 30px solid #f87171;
      margin: 0 auto 10px auto;
    }
    button {
      background: #22c55e;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      color: #fff;
      transition: background 0.3s;
    }
    button:hover {
      background: #16a34a;
    }
    #result {
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }
    #coupon {
      margin-top: 10px;
      font-size: 16px;
      background: #1e40af;
      padding: 8px;
      border-radius: 8px;
      display: inline-block;
    }
    #copyBtn {
      margin-top: 10px;
      background: #fbbf24;
      color: #000;
      display: none;
    }
    #copyBtn:hover {
      background: #f59e0b;
    }
  </style>
</head>
<body>
  <div class="game-box">
    <h1>🎉 Draai het Rad en Win een Korting!</h1>
    <div id="pointer"></div>
    <div id="wheel"></div>
    <button id="spinBtn">Draai</button>
    <div id="result"></div>
    <div id="coupon"></div>
    <button id="copyBtn">Kopieer Code</button>
  </div>

  <script>
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const result = document.getElementById('result');
    const couponEl = document.getElementById('coupon');
    const copyBtn = document.getElementById('copyBtn');

    const prizes = ["5% Korting", "10% Korting", "15% Korting", "20% Korting", "Gratis verzending", "30% Korting"];

    function createSegments(){
      const segmentAngle = 360 / prizes.length;
      prizes.forEach((prize, i) => {
        const segment = document.createElement('div');
        segment.classList.add('segment');
        segment.style.background = i % 2 === 0 ? '#facc15' : '#fbbf24';
        segment.style.transform = rotate(${i * segmentAngle}deg) skewY(${90 - segmentAngle}deg);
        segment.innerHTML = <span style="transform: skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle/2}deg);">${prize}</span>;
        wheel.appendChild(segment);
      });
    }

    function generateCoupon(prize){
      let code = "";
      if(prize.includes("Gratis")){
        code = "FREE-SHIP-" + Math.floor(1000 + Math.random()*9000);
      } else {
        const num = prize.match(/\d+/)[0];
        code = "DISCOUNT" + num + "-" + Math.floor(1000 + Math.random()*9000);
      }
      return code;
    }

    let spinning = false;
    let currentRotation = 0;

    spinBtn.addEventListener('click', () => {
      if(spinning) return;
      spinning = true;
      result.textContent = "";
      couponEl.textContent = "";
      copyBtn.style.display = "none";

      const spins = Math.floor(Math.random() * 5) + 5; 
      const extra = Math.floor(Math.random() * 360); 
      const total = spins * 360 + extra;

      currentRotation += total;
      wheel.style.transform = rotate(${currentRotation}deg);

      setTimeout(() => {
        const segmentAngle = 360 / prizes.length;
        const normalizedRotation = currentRotation % 360;
        const index = Math.floor(((360 - normalizedRotation) % 360) / segmentAngle);
        const wonPrize = prizes[index];
        result.textContent = 🎁 Gefeliciteerd! Je hebt ${wonPrize} gewonnen!;
        const coupon = generateCoupon(wonPrize);
        couponEl.textContent = Jouw kortingscode: ${coupon};
        copyBtn.style.display = "inline-block";

        copyBtn.onclick = () => {
          navigator.clipboard.writeText(coupon);
          alert("✅ Code gekopieerd: " + coupon);
        };

        spinning = false;
      }, 5200);
    });

    createSegments();
  </script>
</body>
</html>