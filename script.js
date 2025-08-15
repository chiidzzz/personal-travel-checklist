// Stable hash so saved states persist even if you reorder items
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

/* Ensure the label has a dedicated span for text so the CSS grid
   can indent wrapped lines cleanly without editing your HTML items manually. */
function normalizeLabelsForIndent() {
  document.querySelectorAll(".item label").forEach((label) => {
    // If there is already a span, skip
    if (label.querySelector(".label-text")) return;

    // Move all non-input nodes into a new span
    const textSpan = document.createElement("span");
    textSpan.className = "label-text";

    const nodesToMove = [];
    label.childNodes.forEach((n) => {
      if (!(n.nodeType === 1 && n.tagName === "INPUT")) {
        nodesToMove.push(n);
      }
    });
    nodesToMove.forEach((n) => textSpan.appendChild(n));
    label.appendChild(textSpan);
  });
}

function applySavedState() {
  const boxes = document.querySelectorAll('input[type="checkbox"]');
  boxes.forEach((box, i) => {
    const key = storageKeyForCheckbox(box, i);
    const saved = localStorage.getItem(key);
    const isChecked = saved === "true";
    box.checked = isChecked;
    box.closest(".item")?.classList.toggle("dimmed", isChecked);

    box.addEventListener("change", function () {
      const checked = this.checked;
      localStorage.setItem(key, checked);
      this.closest(".item")?.classList.toggle("dimmed", checked);
    });
  });
}

function clearChecklist() {
  const boxes = document.querySelectorAll('input[type="checkbox"]');
  boxes.forEach((box, i) => {
    const key = storageKeyForCheckbox(box, i);
    box.checked = false;
    box.closest(".item")?.classList.remove("dimmed");
    localStorage.removeItem(key);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  normalizeLabelsForIndent(); // sets up hanging indentation spans
  applySavedState(); // restores and wires persistence
});
