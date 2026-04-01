// Random number generator (1 to 2000)
const generateRandomNumber = () => {
  return Math.floor(Math.random() * 2000) + 1;
};

// Convert number to 4-digit array (e.g., 2 becomes [0, 0, 0, 2])
const numberToFourDigits = (num) => {
  const padded = num.toString().padStart(4, "0");
  return padded.split("").map(Number);
};

// State management
let currentNumber = null;
let currentDigits = [];
let revealIndex = 0;

// DOM Elements
const drawBtn = document.getElementById("draw-btn");
const resetBtn = document.getElementById("reset-btn");
const titleElement = document.querySelector(".title");
const digitElements = [
  document.getElementById("digit-1"),
  document.getElementById("digit-2"),
  document.getElementById("digit-3"),
  document.getElementById("digit-4"),
];
const container = document.querySelector(".container");

// Create Audio Context for celebration sound
let audioContext = null;

const playWinnerSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Play a fanfare-like sound
    const playTone = (frequency, startTime, duration, gain = 0.3) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "triangle";

      gainNode.gain.setValueAtTime(gain, audioContext.currentTime + startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + startTime + duration,
      );

      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);
    };

    // Fanfare melody
    playTone(523.25, 0, 0.15); // C5
    playTone(659.25, 0.15, 0.15); // E5
    playTone(783.99, 0.3, 0.15); // G5
    playTone(1046.5, 0.45, 0.4); // C6 (longer)
    playTone(783.99, 0.85, 0.15); // G5
    playTone(1046.5, 1.0, 0.6); // C6 (final, longest)
  } catch (e) {
    console.log("Audio not supported");
  }
};

// Initialize the page
const init = () => {
  resetDisplay();
};

// Reset the display to initial state
const resetDisplay = () => {
  currentNumber = null;
  currentDigits = [];
  revealIndex = 0;

  // Reset title back to LOTTERY
  titleElement.textContent = "LOTTERY";
  titleElement.classList.remove("winner-title");

  // Reset all digits
  digitElements.forEach((digit) => {
    digit.classList.remove("revealed");
    digit.querySelector(".digit-value").textContent = "-";
  });

  // Reset buttons
  drawBtn.disabled = false;
  drawBtn.classList.remove("hidden");
  resetBtn.classList.add("hidden");

  // Remove complete state
  container.classList.remove("complete");
};

// Confetti colors matching theme
const confettiColors = [
  "#ffd700",
  "#006a4e",
  "#f42a41",
  "#00875f",
  "#b8860b",
  "#ffffff",
];

// Create confetti celebration
const createConfetti = () => {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);

  const confettiCount = 150;

  for (let i = 0; i < confettiCount; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.backgroundColor =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.width = Math.random() * 10 + 5 + "px";
      confetti.style.height = Math.random() * 15 + 10 + "px";
      confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
      confetti.style.animationDelay = "0s";
      confettiContainer.appendChild(confetti);

      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 20);
  }

  // Remove container after all confetti is done
  setTimeout(() => {
    confettiContainer.remove();
  }, 7000);
};

// Handle draw button click
const handleDraw = () => {
  // First click - generate the random number
  if (currentNumber === null) {
    currentNumber = generateRandomNumber();
    currentDigits = numberToFourDigits(currentNumber);
    console.log("Generated number:", currentNumber, "Digits:", currentDigits);
  }

  // Reveal the current digit
  if (revealIndex < 4) {
    const digitElement = digitElements[revealIndex];
    const digitValue = digitElement.querySelector(".digit-value");

    // Add animation class
    digitElement.classList.add("revealed");
    digitValue.textContent = currentDigits[revealIndex];

    // Play reveal sound effect (visual feedback)
    digitElement.style.animation = "none";
    digitElement.offsetHeight; // Trigger reflow
    digitElement.style.animation = null;

    revealIndex++;

    // Check if all digits are revealed
    if (revealIndex >= 4) {
      // All digits revealed - disable draw button and show reset
      drawBtn.disabled = true;
      resetBtn.classList.remove("hidden");
      container.classList.add("complete");

      // Change title to WINNER
      titleElement.textContent = "WINNER";
      titleElement.classList.add("winner-title");

      // Play winner sound
      playWinnerSound();

      // Launch confetti celebration
      setTimeout(() => {
        createConfetti();
      }, 300);
    }
  }
};

// Handle reset button click
const handleReset = () => {
  resetDisplay();
};

// Event listeners
drawBtn.addEventListener("click", handleDraw);
resetBtn.addEventListener("click", handleReset);

// Initialize on page load
document.addEventListener("DOMContentLoaded", init);
