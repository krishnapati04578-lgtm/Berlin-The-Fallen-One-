// Seal animation overlay — success / error / guest states

export function showSealAnimation(state = "success", message = "") {
  const overlay = document.getElementById("sealOverlay");
  if (!overlay) return;
  const icon = overlay.querySelector(".seal-icon");
  const msg = overlay.querySelector(".seal-message");

  overlay.className = "seal-overlay " + state;

  if (icon) {
    if (state === "success") icon.textContent = "✦";
    else if (state === "error") icon.textContent = "✖";
    else if (state === "guest") icon.textContent = "◈";
    else icon.textContent = "◌";
  }

  if (msg) msg.textContent = message;

  overlay.style.display = "flex";
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    overlay.style.transform = "scale(1)";
  });

  if (state !== "loading") {
    setTimeout(() => hideSealAnimation(), 2800);
  }
}

export function hideSealAnimation() {
  const overlay = document.getElementById("sealOverlay");
  if (!overlay) return;
  overlay.style.opacity = "0";
  overlay.style.transform = "scale(0.9)";
  setTimeout(() => {
    overlay.style.display = "none";
  }, 400);
}

// Inject seal overlay HTML into page if not present
export function initSealOverlay() {
  if (document.getElementById("sealOverlay")) return;
  const div = document.createElement("div");
  div.id = "sealOverlay";
  div.className = "seal-overlay";
  div.style.cssText = `
    display:none; opacity:0; transform:scale(0.9);
    position:fixed; inset:0; z-index:9999;
    align-items:center; justify-content:center;
    flex-direction:column; gap:18px;
    background:rgba(8,6,15,0.92);
    transition: opacity 0.4s ease, transform 0.4s ease;
  `;
  div.innerHTML = `
    <div class="seal-icon" style="font-size:64px;color:#c084b8;font-family:'Cinzel Decorative',cursive;"></div>
    <div class="seal-message" style="font-family:'EB Garamond',serif;font-size:1.2rem;color:#f0e8f5;text-align:center;max-width:320px;"></div>
  `;
  document.body.appendChild(div);
}

window.showSealAnimation = showSealAnimation;
window.hideSealAnimation = hideSealAnimation;
window.initSealOverlay = initSealOverlay;
