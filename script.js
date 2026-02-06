function setSeason(season) {
  document.body.classList.remove("winter-mode", "summer-mode");
  document.body.classList.add(season + "-mode");

  document
    .getElementById("btn-winter")
    .classList.toggle("active", season === "winter");
  document
    .getElementById("btn-summer")
    .classList.toggle("active", season === "summer");
  localStorage.setItem("pref_season", season);
}

function setMilitary(isOn) {
  document.body.classList.toggle("military-on", isOn);
  document.getElementById("btn-mil-on").classList.toggle("active", isOn);
  document.getElementById("btn-mil-off").classList.toggle("active", !isOn);
  localStorage.setItem("pref_military", isOn);
}

// Your original Logic for persistence
function hashLabel(text) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}

function storageKeyForCheckbox(checkbox, fallbackIndex) {
  const label = checkbox.closest("label");
  const txt = (label ? label.innerText : checkbox.value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return txt ? "chk_" + hashLabel(txt) : "chk_idx_" + fallbackIndex;
}

function applySavedState() {
  const boxes = document.querySelectorAll('input[type="checkbox"]');
  boxes.forEach((box, i) => {
    const key = storageKeyForCheckbox(box, i);
    const saved = localStorage.getItem(key);
    if (saved === "true") {
      box.checked = true;
      box.closest(".item")?.classList.add("dimmed");
    }
    box.addEventListener("change", function () {
      localStorage.setItem(key, this.checked);
      this.closest(".item")?.classList.toggle("dimmed", this.checked);
    });
  });

  // Restore Toggle States
  const savedSeason = localStorage.getItem("pref_season") || "winter";
  const savedMil = localStorage.getItem("pref_military") === "true";
  setSeason(savedSeason);
  setMilitary(savedMil);
}

function clearChecklist() {
  if (confirm("Clear all checked items?")) {
    localStorage.clear();
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", applySavedState);
