const container = document.getElementById("image-container")
let image = document.getElementById("image");

let scale = 1; // 缩放比例
let startScale = 1; // 上次缩放的比例
let currentX = 0, currentY = 0; // 图片偏移位置
let startX = 0, startY = 0; // 上次图片位置
let rotateAngle = 0;
let startTouches = []; // 开始触控点

// 手勢處理
let touchStartDistance = 0;

container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
        // 单指移动
        startTouches = [e.touches[0]];
    } else if (e.touches.length === 2) {
        // 双指缩放
        startTouches = [e.touches[0], e.touches[1]];
        startScale = scale;
    }
});

container.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && startTouches.length === 1) {
        // 单指移动
        const dx = e.touches[0].clientX - startTouches[0].clientX;
        const dy = e.touches[0].clientY - startTouches[0].clientY;

        currentX = startX + dx;
        currentY = startY + dy;

        image.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    } else if (e.touches.length === 2 && startTouches.length === 2) {
        // 双指缩放
        const distanceStart = Math.hypot(
            startTouches[0].clientX - startTouches[1].clientX,
            startTouches[0].clientY - startTouches[1].clientY
        );
        const distanceNow = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );

        scale = Math.max(0.5, Math.min(2, startScale * (distanceNow / distanceStart))); // 限制缩放范围
        image.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
    }
});

container.addEventListener('touchend', () => {
    // 记录最终位置
    startX = currentX;
    startY = currentY;
    startTouches = [];
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

const rotateButton = document.getElementById("rotate");
const rotateSliderContainer = document.getElementById("rotate-slider-container");
const rotateSlider = document.getElementById("rotate-slider");
const completeBtn = document.getElementById('complete-btn');

rotateButton.addEventListener("click", () => {
    rotateSliderContainer.style.display = rotateSliderContainer.style.display === "none" ? "block" : "none";
});

rotateSlider.addEventListener("input", (e) => {
    rotateAngle = e.target.value;
    image.style.transform = `rotate(${rotateAngle}deg) scale(${scale}) translate(${currentX}px, ${currentY}px)`;
});

completeBtn.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置 canvas 大小与擷取框一致
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    // 计算图片相对擷取框的位置
    const dx = (imageRect.left - containerRect.left) / scale;
    const dy = (imageRect.top - containerRect.top) / scale;
    const dWidth = imageRect.width / scale;
    const dHeight = imageRect.height / scale;

    // 绘制图片
    ctx.drawImage(image, dx, dy, dWidth, dHeight);

    // 导出图片
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'captured-image.png';
    link.click();
});

