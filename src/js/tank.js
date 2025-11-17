// Tank/Curtain page - Poops falling from the sky
const tankContainer = document.getElementById('tank-container');
const poopCountEl = document.getElementById('poop-count');
const totalPoopsEl = document.getElementById('total-poops');
const spawnBtn = document.getElementById('spawn-poop-btn');
const stopBtn = document.getElementById('stop-poop-btn');

let fallingPoops = [];
let animationId = null;
let spawnInterval = null;
let isRaining = false;

class FallingPoop {
    constructor(imageData, x, y, width, height) {
        this.element = document.createElement('div');
        this.element.className = 'falling-poop';
        
        // Create canvas for this poop
        const canvas = document.createElement('canvas');
        canvas.className = 'poop-canvas';
        canvas.width = width;
        canvas.height = height;
        
        // Draw the poop image
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageData;
        
        this.element.appendChild(canvas);
        
        // Set initial position and properties
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityY = Math.random() * 2 + 2; // Random fall speed
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 3;
        this.scale = 0.5 + Math.random() * 0.5; // Random size
        this.opacity = 1;
        this.hasLanded = false;
        
        this.updatePosition();
        tankContainer.appendChild(this.element);
    }
    
    updatePosition() {
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.transform = `rotate(${this.rotation}deg) scale(${this.scale})`;
        this.element.style.opacity = this.opacity;
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
    }
    
    update() {
        if (this.hasLanded) {
            // Landed poops slowly fade and sink
            this.opacity -= 0.005;
            this.y += 0.5;
            
            if (this.opacity <= 0) {
                this.remove();
                return false;
            }
        } else {
            // Falling
            this.y += this.velocityY;
            this.rotation += this.rotationSpeed;
            this.velocityY += 0.1; // Gravity
            
            // Check if landed
            const containerHeight = tankContainer.offsetHeight;
            if (this.y >= containerHeight - this.height * this.scale) {
                this.y = containerHeight - this.height * this.scale;
                this.hasLanded = true;
                this.velocityY = 0;
                
                // Add a little bounce effect
                this.y -= 10;
                setTimeout(() => {
                    this.y += 10;
                    this.updatePosition();
                }, 100);
            }
        }
        
        this.updatePosition();
        return true;
    }
    
    remove() {
        this.element.remove();
    }
}

function spawnRandomPoop() {
    const poops = Storage.getPoops();
    const containerWidth = tankContainer.offsetWidth;
    
    // Spawn random poop from storage or generate a new one
    let imageData, width, height;
    
    if (poops.length > 0 && Math.random() < 0.7) {
        // 70% chance to use a user-created poop
        const randomPoop = poops[Math.floor(Math.random() * poops.length)];
        imageData = randomPoop.imageData;
        width = randomPoop.width || 100;
        height = randomPoop.height || 100;
    } else {
        // 30% chance to generate a random styled poop
        const tempCanvas = document.createElement('canvas');
        width = 80 + Math.random() * 60;
        height = 80 + Math.random() * 60;
        PoopUtils.generateRandomPoop(tempCanvas, width, height);
        imageData = tempCanvas.toDataURL();
    }
    
    // Random x position
    const x = Math.random() * (containerWidth - width);
    const y = -height; // Start above the container
    
    const poop = new FallingPoop(imageData, x, y, width, height);
    fallingPoops.push(poop);
}

function animate() {
    // Update all falling poops
    fallingPoops = fallingPoops.filter(poop => poop.update());
    
    // Update UI
    poopCountEl.textContent = fallingPoops.length;
    
    animationId = requestAnimationFrame(animate);
}

function startPoopRain() {
    if (isRaining) return;
    
    isRaining = true;
    spawnBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    
    // Spawn 4 poops per second (every 250ms)
    spawnInterval = setInterval(() => {
        spawnRandomPoop();
    }, 250);
    
    // Start animation loop
    if (!animationId) {
        animate();
    }
}

function stopPoopRain() {
    isRaining = false;
    spawnBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    
    if (spawnInterval) {
        clearInterval(spawnInterval);
        spawnInterval = null;
    }
}

function clearAllPoops() {
    fallingPoops.forEach(poop => poop.remove());
    fallingPoops = [];
}

// Event listeners
spawnBtn.addEventListener('click', startPoopRain);
stopBtn.addEventListener('click', stopPoopRain);

// Update total poops count
const poops = Storage.getPoops();
totalPoopsEl.textContent = poops.length;

// Auto-start if there are poops in storage
if (poops.length > 0) {
    setTimeout(() => {
        startPoopRain();
    }, 500);
}

// Spawn some random poops on load for demo
if (poops.length === 0) {
    // Generate some demo poops
    for (let i = 0; i < 5; i++) {
        const tempCanvas = document.createElement('canvas');
        const size = 80 + Math.random() * 40;
        PoopUtils.generateRandomPoop(tempCanvas, size, size);
        
        Storage.addPoop({
            imageData: tempCanvas.toDataURL(),
            artist: 'Demo',
            width: size,
            height: size
        });
    }
    
    totalPoopsEl.textContent = Storage.getPoops().length;
    
    // Auto-start demo
    setTimeout(() => {
        startPoopRain();
    }, 500);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (isRaining) {
            stopPoopRain();
        } else {
            startPoopRain();
        }
    } else if (e.key === 'c' || e.key === 'C') {
        if (confirm('清除所有正在掉落的大便？')) {
            clearAllPoops();
        }
    }
});

// Add keyboard hint
const keyboardHint = document.createElement('div');
keyboardHint.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(0,0,0,0.7); color: white; padding: 10px 15px; border-radius: 8px; font-size: 12px;';
keyboardHint.innerHTML = '<strong>快捷键:</strong><br>空格 = 开始/停止<br>C = 清空';
document.body.appendChild(keyboardHint);

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopPoopRain();
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

// Add some visual effects
function createParticleEffect(x, y) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 5px;
            height: 5px;
            background: ${['#8B4513', '#A0522D', '#654321'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            pointer-events: none;
        `;
        
        tankContainer.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed - 2;
        
        let px = x;
        let py = y;
        let opacity = 1;
        
        function animateParticle() {
            px += vx;
            py += vy;
            opacity -= 0.02;
            
            particle.style.left = px + 'px';
            particle.style.top = py + 'px';
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        animateParticle();
    }
}

// Add random particle effects occasionally
setInterval(() => {
    if (isRaining && Math.random() < 0.3) {
        const x = Math.random() * tankContainer.offsetWidth;
        const y = Math.random() * tankContainer.offsetHeight * 0.5;
        createParticleEffect(x, y);
    }
}, 2000);

// Add stats update
setInterval(() => {
    totalPoopsEl.textContent = Storage.getPoops().length;
}, 5000);
