// Drawing application
const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let currentColor = '#000000';
let currentLineWidth = 6;
let undoStack = [];
let currentTool = 'draw'; // 'draw' or 'erase'

// Initialize canvas
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.strokeStyle = currentColor;
ctx.lineWidth = currentLineWidth;

// Save initial empty state
saveState();

// Create paint toolbar
function createPaintBar() {
    const paintBar = document.getElementById('paint-bar');
    
    // Color palette
    const colors = [
        '#000000', '#8B4513', '#654321', '#A0522D',
        '#FF0000', '#FF6B6B', '#FFA500', '#FFD700',
        '#00FF00', '#4CAF50', '#00CED1', '#0000FF',
        '#800080', '#FF1493', '#FFB6C1', '#FFFFFF'
    ];
    
    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-container';
    
    colors.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn' + (index === 0 ? ' selected' : '');
        btn.style.background = color;
        btn.title = color;
        
        if (color === '#FFFFFF') {
            btn.style.border = '2px solid #333';
        }
        
        btn.onclick = () => {
            currentColor = color;
            currentTool = 'draw';
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            
            const eraserBtn = document.getElementById('eraser-btn');
            if (eraserBtn) eraserBtn.classList.remove('active');
        };
        
        colorContainer.appendChild(btn);
    });
    
    paintBar.appendChild(colorContainer);
    
    // Tools container
    const toolsContainer = document.createElement('div');
    toolsContainer.style.display = 'flex';
    toolsContainer.gap = '10px';
    toolsContainer.style.flexWrap = 'wrap';
    toolsContainer.style.justifyContent = 'center';
    toolsContainer.style.marginTop = '10px';
    
    // Eraser button
    const eraserBtn = document.createElement('button');
    eraserBtn.id = 'eraser-btn';
    eraserBtn.className = 'tool-btn';
    eraserBtn.textContent = '🧹 橡皮擦';
    eraserBtn.onclick = () => {
        currentTool = 'erase';
        ctx.globalCompositeOperation = 'destination-out';
        eraserBtn.classList.add('active');
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    };
    toolsContainer.appendChild(eraserBtn);
    
    // Undo button
    const undoBtn = document.createElement('button');
    undoBtn.className = 'tool-btn';
    undoBtn.textContent = '↶ 撤销';
    undoBtn.onclick = undo;
    toolsContainer.appendChild(undoBtn);
    
    // Clear button (in toolbar)
    const clearToolBtn = document.createElement('button');
    clearToolBtn.className = 'tool-btn';
    clearToolBtn.style.background = '#dc3545';
    clearToolBtn.textContent = '🗑️ 清空';
    clearToolBtn.onclick = clearCanvas;
    toolsContainer.appendChild(clearToolBtn);
    
    // Size control
    const sizeControl = document.createElement('div');
    sizeControl.className = 'size-control';
    
    const sizeLabel = document.createElement('label');
    sizeLabel.textContent = '粗细:';
    sizeControl.appendChild(sizeLabel);
    
    const sizeSlider = document.createElement('input');
    sizeSlider.type = 'range';
    sizeSlider.min = '1';
    sizeSlider.max = '30';
    sizeSlider.value = currentLineWidth;
    sizeSlider.oninput = () => {
        currentLineWidth = parseInt(sizeSlider.value);
        ctx.lineWidth = currentLineWidth;
        sizeDisplay.textContent = currentLineWidth;
    };
    sizeControl.appendChild(sizeSlider);
    
    const sizeDisplay = document.createElement('span');
    sizeDisplay.className = 'size-display';
    sizeDisplay.textContent = currentLineWidth;
    sizeControl.appendChild(sizeDisplay);
    
    toolsContainer.appendChild(sizeControl);
    
    paintBar.appendChild(toolsContainer);
}

// Drawing functions
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
        saveState();
    }
}

function saveState() {
    const imageData = canvas.toDataURL();
    undoStack.push(imageData);
    if (undoStack.length > 20) {
        undoStack.shift();
    }
}

function undo() {
    if (undoStack.length > 1) {
        undoStack.pop(); // Remove current state
        const prevState = undoStack[undoStack.length - 1];
        
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = prevState;
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events for mobile
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Submit button
const swimBtn = document.getElementById('swim-btn');
if (swimBtn) {
    swimBtn.addEventListener('click', async () => {
        // Check if canvas is empty
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let isEmpty = true;
        
        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] !== 0) {
                isEmpty = false;
                break;
            }
        }
        
        if (isEmpty) {
            await ModalUtils.show(
                '画点什么吧！',
                '<p>你还没画大便呢！先画一个再提交吧 😊</p>',
                [{ text: '好的', type: 'primary', action: 'ok' }]
            );
            return;
        }
        
        // Ask for artist name
        const result = await ModalUtils.showArtistInput();
        
        if (result.action === 'submit') {
            const artistName = result.value.trim() || 'Anonymous';
            Storage.saveArtistName(artistName);
            
            // Save the poop
            const poopData = canvas.toDataURL();
            Storage.addPoop({
                imageData: poopData,
                artist: artistName,
                width: canvas.width,
                height: canvas.height
            });
            
            await ModalUtils.showSuccess('你的大便已经提交！去幕布看它掉下来吧！💩');
            
            // Clear canvas for next drawing
            clearCanvas();
        }
    });
}

// Clear button
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('确定要清空画布吗？')) {
            clearCanvas();
        }
    });
}

// Initialize
createPaintBar();

// Welcome message
const savedName = Storage.getArtistName();
if (savedName) {
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = 'text-align: center; padding: 10px; background: #ffffcc; border-radius: 8px; margin: 10px 0;';
    welcomeMsg.innerHTML = `欢迎回来，<strong>${savedName}</strong>！继续创作你的大便吧！ 💩`;
    
    const drawingSection = document.getElementById('drawing-section');
    drawingSection.insertBefore(welcomeMsg, drawingSection.firstChild);
    
    setTimeout(() => {
        welcomeMsg.style.transition = 'opacity 1s';
        welcomeMsg.style.opacity = '0';
        setTimeout(() => welcomeMsg.remove(), 1000);
    }, 3000);
}
