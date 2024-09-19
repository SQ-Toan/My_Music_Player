const numFlakes = 80;
const snowFlakes = document.querySelector(".snowflakes");

function createSnowFlakes() {
    // Xoá bông tuyết cũ đi
    snowFlakes.innerHTML = "";

    for (let i = 0; i < numFlakes; i++) {
        const snowFlake = document.createElement("div");
        snowFlake.classList.add("snowflake");
        const size = Math.random() * 5 + 5 + "px";
        const positionX = Math.random() * 100 + "vw";
        const duration = Math.random() * 5 + 5 + "s";
        const delay = Math.random() * 10 + "s";

        snowFlake.style.width = size;
        snowFlake.style.height = size;
        snowFlake.style.left = positionX;
        snowFlake.style.animationDuration = duration;
        snowFlake.style.animationDelay = delay;

        snowFlakes.appendChild(snowFlake);
    }
}

// setInterval(createSnowFlakes, 15000);

createSnowFlakes();
