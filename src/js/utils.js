// Storage utilities
const Storage = {
    POOPS_KEY: 'drawshit_poops',
    ARTIST_KEY: 'drawshit_artist',
    
    getPoops() {
        const data = localStorage.getItem(this.POOPS_KEY);
        return data ? JSON.parse(data) : [];
    },
    
    savePoops(poops) {
        localStorage.setItem(this.POOPS_KEY, JSON.stringify(poops));
    },
    
    addPoop(poop) {
        const poops = this.getPoops();
        poop.id = Date.now() + Math.random();
        poop.timestamp = Date.now();
        poop.votes = 0;
        poop.artist = poop.artist || 'Anonymous';
        poops.push(poop);
        this.savePoops(poops);
        return poop;
    },
    
    updatePoop(id, updates) {
        const poops = this.getPoops();
        const index = poops.findIndex(p => p.id === id);
        if (index !== -1) {
            poops[index] = { ...poops[index], ...updates };
            this.savePoops(poops);
        }
    },
    
    getArtistName() {
        return localStorage.getItem(this.ARTIST_KEY) || '';
    },
    
    saveArtistName(name) {
        localStorage.setItem(this.ARTIST_KEY, name);
    }
};

// Poop drawing utilities
const PoopUtils = {
    // Generate random funny poop styles
    generateRandomPoop(canvas, width, height) {
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Random style selector
        const styles = [
            this.drawClassicPoop,
            this.drawSpiralPoop,
            this.drawAngryPoop,
            this.drawHappyPoop,
            this.drawFancyPoop,
            this.drawPixelPoop,
            this.drawRainbowPoop,
            this.drawMonsterPoop
        ];
        
        const style = styles[Math.floor(Math.random() * styles.length)];
        style.call(this, ctx, width, height);
    },
    
    drawClassicPoop(ctx, w, h) {
        const colors = ['#8B4513', '#A0522D', '#654321'];
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.fillStyle = baseColor;
        
        // Bottom pile
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.75, w*0.35, h*0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Middle pile
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.5, w*0.3, h*0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Top swirl
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.3, w*0.25, h*0.15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.45, w*0.08, 0, Math.PI * 2);
        ctx.arc(w*0.6, h*0.45, w*0.08, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.45, w*0.04, 0, Math.PI * 2);
        ctx.arc(w*0.6, h*0.45, w*0.04, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(w/2, h*0.5, w*0.12, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
    },
    
    drawSpiralPoop(ctx, w, h) {
        ctx.fillStyle = '#8B4513';
        
        let angle = 0;
        let radius = 0;
        const centerX = w / 2;
        const centerY = h / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        
        for (let i = 0; i < 100; i++) {
            angle += 0.2;
            radius += 0.5;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.lineTo(x, y);
        }
        
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#8B4513';
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // Sparkles
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const x = centerX + Math.random() * w * 0.4 - w * 0.2;
            const y = centerY + Math.random() * h * 0.4 - h * 0.2;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawAngryPoop(ctx, w, h) {
        ctx.fillStyle = '#8B0000';
        
        // Body
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.6, w*0.4, h*0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry eyes
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(w*0.35, h*0.5, w*0.1, 0, Math.PI * 2);
        ctx.arc(w*0.65, h*0.5, w*0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Angry eyebrows
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w*0.25, h*0.4);
        ctx.lineTo(w*0.4, h*0.45);
        ctx.moveTo(w*0.75, h*0.4);
        ctx.lineTo(w*0.6, h*0.45);
        ctx.stroke();
        
        // Frown
        ctx.beginPath();
        ctx.arc(w/2, h*0.75, w*0.15, 1.2 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();
        
        // Steam
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(w*0.3 + i*w*0.2, h*0.2);
            ctx.lineTo(w*0.32 + i*w*0.2, h*0.1);
            ctx.stroke();
        }
    },
    
    drawHappyPoop(ctx, w, h) {
        ctx.fillStyle = '#DAA520';
        
        // Body with gradient effect
        const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w/2);
        gradient.addColorStop(0, '#DAA520');
        gradient.addColorStop(1, '#B8860B');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.6, w*0.35, h*0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Big smile
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(w/2, h*0.6, w*0.2, 0, Math.PI);
        ctx.fill();
        
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.5, w*0.05, 0, Math.PI * 2);
        ctx.arc(w*0.6, h*0.5, w*0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Blush
        ctx.fillStyle = 'rgba(255, 105, 180, 0.5)';
        ctx.beginPath();
        ctx.ellipse(w*0.25, h*0.6, w*0.08, h*0.05, 0, 0, Math.PI * 2);
        ctx.ellipse(w*0.75, h*0.6, w*0.08, h*0.05, 0, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawFancyPoop(ctx, w, h) {
        ctx.fillStyle = '#8B4513';
        
        // Body
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.65, w*0.35, h*0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Top hat
        ctx.fillStyle = 'black';
        ctx.fillRect(w*0.35, h*0.25, w*0.3, h*0.1);
        ctx.fillRect(w*0.3, h*0.35, w*0.4, h*0.05);
        
        // Monocle
        ctx.strokeStyle = 'gold';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(w*0.6, h*0.55, w*0.08, 0, Math.PI * 2);
        ctx.stroke();
        
        // Mustache
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(w*0.4, h*0.7, w*0.1, h*0.03, -0.3, 0, Math.PI * 2);
        ctx.ellipse(w*0.6, h*0.7, w*0.1, h*0.03, 0.3, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawPixelPoop(ctx, w, h) {
        const pixelSize = Math.floor(w / 10);
        const pixels = [
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,1,1,1,0,0,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,0,0,0]
        ];
        
        ctx.fillStyle = '#8B4513';
        for (let y = 0; y < pixels.length; y++) {
            for (let x = 0; x < pixels[y].length; x++) {
                if (pixels[y][x]) {
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    },
    
    drawRainbowPoop(ctx, w, h) {
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        
        for (let i = 0; i < 7; i++) {
            ctx.fillStyle = colors[i];
            const offset = i * (h * 0.08);
            ctx.beginPath();
            ctx.ellipse(w/2, h*0.5 + offset, w*0.35 - i*3, h*0.15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Sparkles
        ctx.fillStyle = 'white';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Happy face
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.4, w*0.06, 0, Math.PI * 2);
        ctx.arc(w*0.6, h*0.4, w*0.06, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(w*0.4, h*0.4, w*0.03, 0, Math.PI * 2);
        ctx.arc(w*0.6, h*0.4, w*0.03, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawMonsterPoop(ctx, w, h) {
        ctx.fillStyle = '#4B0082';
        
        // Body
        ctx.beginPath();
        ctx.ellipse(w/2, h*0.6, w*0.4, h*0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Multiple eyes
        const eyeCount = 3;
        ctx.fillStyle = 'yellow';
        for (let i = 0; i < eyeCount; i++) {
            const x = w * (0.3 + i * 0.2);
            const y = h * 0.5 + Math.sin(i) * h * 0.1;
            ctx.beginPath();
            ctx.arc(x, y, w*0.08, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(x, y, w*0.04, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'yellow';
        }
        
        // Tentacles
        ctx.strokeStyle = '#4B0082';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            const startX = w * (0.3 + i * 0.15);
            ctx.moveTo(startX, h * 0.8);
            ctx.bezierCurveTo(
                startX + (Math.random() - 0.5) * 20,
                h * 0.9,
                startX + (Math.random() - 0.5) * 30,
                h,
                startX + (Math.random() - 0.5) * 40,
                h * 1.1
            );
            ctx.stroke();
        }
        
        // Teeth
        ctx.fillStyle = 'white';
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            const x = w * (0.35 + i * 0.06);
            ctx.moveTo(x, h * 0.7);
            ctx.lineTo(x - 5, h * 0.75);
            ctx.lineTo(x + 5, h * 0.75);
            ctx.closePath();
            ctx.fill();
        }
    }
};

// Animation utilities
const AnimationUtils = {
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },
    
    easeInCubic(t) {
        return t * t * t;
    },
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
};

// Modal utilities
const ModalUtils = {
    show(title, content, buttons) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${title}</h2>
                ${content}
                <div class="modal-buttons">
                    ${buttons.map(btn => 
                        `<button class="modal-btn ${btn.type}" data-action="${btn.action}">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        return new Promise(resolve => {
            modal.querySelectorAll('.modal-btn').forEach(btn => {
                btn.onclick = () => {
                    const action = btn.dataset.action;
                    const input = modal.querySelector('input');
                    modal.remove();
                    resolve({ action, value: input ? input.value : null });
                };
            });
        });
    },
    
    showArtistInput() {
        const savedName = Storage.getArtistName();
        return this.show(
            '给你的大便署名！',
            `<input type="text" placeholder="输入你的昵称..." value="${savedName}" maxlength="30">`,
            [
                { text: '取消', type: 'secondary', action: 'cancel' },
                { text: '提交', type: 'primary', action: 'submit' }
            ]
        );
    },
    
    showSuccess(message) {
        return this.show(
            '成功！',
            `<p style="font-size: 18px; margin: 20px 0;">${message}</p>`,
            [{ text: '好的', type: 'primary', action: 'ok' }]
        );
    }
};
