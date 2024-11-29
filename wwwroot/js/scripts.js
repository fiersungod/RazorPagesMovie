//import Canvas2Image from './canvas2image';
//import html2canvas from './html2canvas';
//import domtoimage from 'dom-to-image';

const container = document.getElementById("image-container");
let image = document.getElementById("image");

let scale = 1; // 缩放比例
let startScale = 1; // 上次缩放的比例
let currentX = 0, currentY = 0; // 图片偏移位置
let startX = 0, startY = 0; // 上次图片位置
let rotateAngle = 0;
let flipHorizontal = 1; // 水平翻转，1 为正常，-1 为翻转
let flipVertical = 1; // 垂直翻转，1 为正常，-1 为翻转
let flippedH = false;
let flippedV = false;
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

        updateImageTransform();
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
        updateImageTransform();
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
    flippedV = !flippedV;
    flipVertical *= -1; // 切换垂直翻转状态
    updateImageTransform();
});

// 左右翻轉
document.getElementById("flip-horizontal").addEventListener("click", () => {
    flippedH = !flippedH;
    flipHorizontal *= -1; // 切换水平翻转状态
    updateImageTransform();
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
    updateImageTransform();
});

completeBtn.addEventListener('click', () => {
    /*const dataUri = await domtoimage.toPng(document.getElementById("image-container")).then(dataUrl => dataUrl);

    // 下載圖片
    const link = document.createElement('a');
    const filename = 'Demo.png';
    link.download = filename;
    link.href = dataUri;
    link.click();
    /*html2canvas(document.getElementById("image-container")).then(canvas => {
        const filename = 'xxxxx';
        Canvas2Image.saveAsPNG(
            canvas,
            canvas.width, canvas.height,
            filename
        );
    });*/
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置 canvas 大小与擷取框一致
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const containerRect = container.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const rad = (rotateAngle * Math.PI) / 180;
    //应用旋转
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(flipHorizontal, flipVertical);
    ctx.rotate(rad);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    //计算图片相对擷取框的位置
    let dx = 0;
    let dy = 0;
    if (rad < Math.PI / 2) {
        if (flippedH === false) {
            dx = ((imageRect.left - containerRect.left) * Math.abs(Math.cos(rad))) + ((imageRect.top - containerRect.top) * Math.abs(Math.sin(rad)));
        } else {
            dx = ((containerRect.right - imageRect.right) * Math.abs(Math.cos(rad))) + ((containerRect.bottom - imageRect.bottom) * Math.abs(Math.sin(rad)));
        }
        if (flippedV === false) {
            dy = ((imageRect.top - containerRect.top) * Math.abs(Math.cos(rad))) + ((containerRect.right - imageRect.right) * Math.abs(Math.sin(rad)));
        } else {
            dy = ((containerRect.bottom - imageRect.bottom) * Math.abs(Math.sin(rad))) + ((containerRect.left - imageRect.left) * Math.abs(Math.cos(rad)));
        }
    }
    else if (rad < Math.PI) {
        if (flippedH === false) {
            dx = ((containerRect.right - imageRect.right) * Math.abs(Math.cos(rad))) + ((containerRect.bottom - imageRect.bottom) * Math.abs(Math.sin(rad)));
        } else {
            dx = ((imageRect.left - containerRect.left) * Math.abs(Math.cos(rad))) + ((imageRect.top - containerRect.top) * Math.abs(Math.sin(rad)));
        }
        if (flippedV === false) {
            dy = ((containerRect.bottom - imageRect.bottom) * Math.abs(Math.cos(rad))) + ((containerRect.right - imageRect.right) * Math.abs(Math.sin(rad)));
        } else {
            dy = ((imageRect.top - containerRect.top) * Math.abs(Math.sin(rad))) + ((containerRect.right - imageRect.right) * Math.abs(Math.cos(rad)));
        }
    }
    const dWidth = (imageRect.width * Math.abs(Math.cos(rad))) + (imageRect.height * Math.abs(Math.sin(rad)));
    const dHeight = (imageRect.height * Math.abs(Math.cos(rad))) + (imageRect.width * Math.abs(Math.sin(rad)));
    //const dWidth = imageRect.width;
    //const dHeight = imageRect.height;

    //绘制图片
    ctx.drawImage(image, dx, dy, dWidth, dHeight);

    // 导出图片
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'captured-image.png';
    link.click();
});

function updateImageTransform() {
    image.style.transform = `
        translate(${currentX}px, ${currentY}px) 
        scale(${scale}) 
        rotate(${rotateAngle}deg) 
        scaleX(${flipHorizontal}) 
        scaleY(${flipVertical})`;
}