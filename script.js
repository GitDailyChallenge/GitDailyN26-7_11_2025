const moods = document.querySelectorAll(".mood");
const saveMessage = document.getElementById("save-message");
const historyDiv = document.getElementById("mood-history");
const averageText = document.getElementById("average");
const resetBtn = document.getElementById("reset");

// Load existing moods
let moodData = JSON.parse(localStorage.getItem("moodData")) || [];

// Display existing
renderHistory();

// Add today's mood
moods.forEach((btn) => {
  btn.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    const existingIndex = moodData.findIndex((d) => d.date === today);

    if (existingIndex >= 0) {
      moodData[existingIndex].mood = btn.dataset.mood;
    } else {
      moodData.push({ date: today, mood: btn.dataset.mood });
    }

    localStorage.setItem("moodData", JSON.stringify(moodData));
    saveMessage.textContent = "💾 Humeur sauvegardée !";
    setTimeout(() => (saveMessage.textContent = ""), 2000);
    renderHistory();
  });
});

function renderHistory() {
  historyDiv.innerHTML = "";

  // Only show last 7 days
  const recent = moodData.slice(-7);
  recent.forEach((d) => {
    const div = document.createElement("div");
    div.classList.add("mood-day");
    div.textContent = d.mood;
    historyDiv.appendChild(div);
  });

  updateAverage(recent);
}

function updateAverage(data) {
  if (data.length === 0) {
    averageText.textContent = "";
    return;
  }

  const moodValues = {
    "😄": 5,
    "🙂": 4,
    "😐": 3,
    "😔": 2,
    "😢": 1,
  };

  const avg =
    data.reduce((sum, d) => sum + (moodValues[d.mood] || 3), 0) / data.length;

  let emoji =
    avg >= 4.5
      ? "😄"
      : avg >= 3.5
      ? "🙂"
      : avg >= 2.5
      ? "😐"
      : avg >= 1.5
      ? "😔"
      : "😢";

  averageText.textContent = `Moyenne des 7 derniers jours : ${emoji}`;
}

// Reset
resetBtn.addEventListener("click", () => {
  if (confirm("Voulez-vous vraiment réinitialiser votre historique ?")) {
    localStorage.removeItem("moodData");
    moodData = [];
    renderHistory();
  }
});
