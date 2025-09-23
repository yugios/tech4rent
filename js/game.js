let score = 0;
let timeLeft = 10;
let timerStarted = false;

const button = document.getElementById("gameButton");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");

button.addEventListener("click", () => {
  if (!timerStarted) {
    startTimer();
    timerStarted = true;
  }
  score++;
  scoreDisplay.textContent = "Score: " + score;
});

function startTimer() {
  let countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = "Tijd: " + timeLeft + "s";

    if (timeLeft <= 0) {
      clearInterval(countdown);
      button.disabled = true;
      if (score >= 10) {
        resultDisplay.textContent = "🎉 Gefeliciteerd! Je hebt 15% korting gewonnen!";
      } else {
        resultDisplay.textContent = "Helaas! Probeer het opnieuw om korting te winnen.";
      }
    }
  }, 1000);
}
