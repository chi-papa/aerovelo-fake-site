const container = document.getElementById("dots-container");
const dotCount = 25;
const sizes = [20, 30, 40, 50, 60];

function createDots() {
  container.innerHTML = "";
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";

    const sizeIndex = Math.floor(Math.random() * sizes.length);
    const size = sizes[sizeIndex];
    dot.style.width = size + "px";
    dot.style.height = size + "px";

    const left = Math.random() * (windowWidth - size);
    const top = Math.random() * (windowHeight - size);
    dot.style.left = left + "px";
    dot.style.top = top + "px";

    const opacity = Math.random() * 0.4 + 0.1;
    dot.style.opacity = opacity;

    const delay = Math.random() * 10;
    dot.style.animationDelay = delay + "s";

    const duration = Math.random() * 10 + 15;
    dot.style.animationDuration = duration + "s";

    container.appendChild(dot);
  }
}

createDots();
window.addEventListener("resize", createDots);
