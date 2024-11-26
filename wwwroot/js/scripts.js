let image = document.getElementById("image");
let scale = 1;
let currentX = 0, currentY = 0;
let startX, startY, startScale;
let isPanning = false;

// 手勢處理
let touchStartDistance = 0;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    return Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));
}

image.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        // 雙指縮放
        touchStartDistance = getDistance(e.touches);
        startScale = scale;
    } else if (e.touches.length === 1) {
        // 單指移動
        startX = e.touches[0].pageX - currentX;
        startY = e.touches[0].pageY - currentY;
        isPanning = true;
    }
});

image.addEventListener("touchmove", (e) => {
    e.preventDefault();

    if (e.touches.length === 2) {
        // 雙指縮放
        const newDistance = getDistance(e.touches);
        scale = startScale * (newDistance / touchStartDistance);
        image.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
    } else if (e.touches.length === 1 && isPanning) {
        // 單指移動
        currentX = e.touches[0].pageX - startX;
        currentY = e.touches[0].pageY - startY;
        image.style.transform = `scale(${scale}) translate(${currentX}px, ${currentY}px)`;
    }
});

image.addEventListener("touchend", (e) => {
    isPanning = false;
});

// 上下翻轉
document.getElementById("flip-vertical").addEventListener("click", () => {
    const currentTransform = getComputedStyle(image).transform;
    image.style.transform = currentTransform + " scaleY(-1)";
});

// 左右翻轉
document.getElementById("flip-horizontal").addEventListener("click", () => {
    const currentTransform = getComputedStyle(image).transform;
    image.style.transform = currentTransform + " scaleX(-1)";
});

// 旋轉
let rotateAngle = 0;
const rotateButton = document.getElementById("rotate");
const rotateSliderContainer = document.getElementById("rotate-slider-container");
const rotateSlider = document.getElementById("rotate-slider");

rotateButton.addEventListener("click", () => {
    rotateSliderContainer.style.display = rotateSliderContainer.style.display === "none" ? "block" : "none";
});

rotateSlider.addEventListener("input", (e) => {
    rotateAngle = e.target.value;
    image.style.transform = `rotate(${rotateAngle}deg) scale(${scale}) translate(${currentX}px, ${currentY}px)`;
});
