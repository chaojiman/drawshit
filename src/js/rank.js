// Ranking page
const rankContainer = document.getElementById('rank-container');
const noPoopsMessage = document.getElementById('no-poops-message');
const sortVotesBtn = document.getElementById('sort-votes');
const sortRecentBtn = document.getElementById('sort-recent');

let currentSort = 'votes'; // 'votes' or 'recent'

function renderPoops() {
    let poops = Storage.getPoops();
    
    if (poops.length === 0) {
        noPoopsMessage.style.display = 'block';
        return;
    }
    
    noPoopsMessage.style.display = 'none';
    
    // Sort poops
    if (currentSort === 'votes') {
        poops.sort((a, b) => (b.votes || 0) - (a.votes || 0));
    } else {
        poops.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
    
    rankContainer.innerHTML = '';
    
    poops.forEach((poop, index) => {
        const poopItem = document.createElement('div');
        poopItem.className = 'poop-item';
        
        // Determine rank badge
        let rankBadgeClass = '';
        let rankText = `#${index + 1}`;
        if (currentSort === 'votes') {
            if (index === 0) {
                rankBadgeClass = 'gold';
                rankText = '🥇 ' + rankText;
            } else if (index === 1) {
                rankBadgeClass = 'silver';
                rankText = '🥈 ' + rankText;
            } else if (index === 2) {
                rankBadgeClass = 'bronze';
                rankText = '🥉 ' + rankText;
            }
        }
        
        // Format timestamp
        const date = new Date(poop.timestamp);
        const timeAgo = getTimeAgo(date);
        
        poopItem.innerHTML = `
            <div class="poop-header">
                <span class="rank-badge ${rankBadgeClass}">${rankText}</span>
                <span style="color: #666; font-size: 14px;">
                    by <strong>${poop.artist || 'Anonymous'}</strong> • ${timeAgo}
                </span>
            </div>
            
            <div class="poop-canvas-container">
                <canvas width="${poop.width || 100}" height="${poop.height || 100}"></canvas>
            </div>
            
            <div class="vote-section">
                <button class="vote-btn upvote-btn" data-id="${poop.id}" data-action="upvote">
                    👍 赞
                </button>
                <span class="vote-count">${poop.votes || 0} 票</span>
                <button class="vote-btn downvote-btn" data-id="${poop.id}" data-action="downvote">
                    👎 踩
                </button>
            </div>
        `;
        
        rankContainer.appendChild(poopItem);
        
        // Draw the poop on canvas
        const canvas = poopItem.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        img.src = poop.imageData;
    });
    
    // Add vote event listeners
    document.querySelectorAll('.vote-btn').forEach(btn => {
        btn.addEventListener('click', handleVote);
    });
}

function handleVote(e) {
    const button = e.currentTarget;
    const poopId = parseFloat(button.dataset.id);
    const action = button.dataset.action;
    
    const poops = Storage.getPoops();
    const poop = poops.find(p => p.id === poopId);
    
    if (!poop) return;
    
    // Check if user already voted
    const votedKey = `voted_${poopId}`;
    const hasVoted = localStorage.getItem(votedKey);
    
    if (hasVoted) {
        showMessage('你已经给这个大便投过票了！', 'warning');
        return;
    }
    
    // Update vote count
    if (action === 'upvote') {
        poop.votes = (poop.votes || 0) + 1;
        showMessage('投票成功！👍', 'success');
    } else {
        poop.votes = (poop.votes || 0) - 1;
        showMessage('投票成功！👎', 'success');
    }
    
    // Mark as voted
    localStorage.setItem(votedKey, 'true');
    
    // Save and re-render
    Storage.savePoops(poops);
    renderPoops();
    
    // Add animation to the button
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return '刚刚';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} 分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} 小时前`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} 天前`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} 个月前`;
    
    const years = Math.floor(months / 12);
    return `${years} 年前`;
}

function showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px 30px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#007bff'};
        color: white;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Sort button event listeners
sortVotesBtn.addEventListener('click', () => {
    currentSort = 'votes';
    sortVotesBtn.style.background = '#007bff';
    sortRecentBtn.style.background = '#6c757d';
    renderPoops();
});

sortRecentBtn.addEventListener('click', () => {
    currentSort = 'recent';
    sortVotesBtn.style.background = '#6c757d';
    sortRecentBtn.style.background = '#007bff';
    renderPoops();
});

// Initialize
renderPoops();

// Add refresh button
const refreshBtn = document.createElement('button');
refreshBtn.textContent = '🔄 刷新';
refreshBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
`;
refreshBtn.addEventListener('click', () => {
    renderPoops();
    showMessage('列表已刷新！', 'success');
});
document.body.appendChild(refreshBtn);

// Add delete all button (for testing)
const deleteAllBtn = document.createElement('button');
deleteAllBtn.textContent = '🗑️ 清空所有大便';
deleteAllBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    padding: 12px 20px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
`;
deleteAllBtn.addEventListener('click', () => {
    if (confirm('确定要删除所有大便吗？这个操作不能撤销！')) {
        localStorage.removeItem(Storage.POOPS_KEY);
        // Also clear all vote records
        for (let key in localStorage) {
            if (key.startsWith('voted_')) {
                localStorage.removeItem(key);
            }
        }
        renderPoops();
        showMessage('所有大便已清空！', 'success');
    }
});
document.body.appendChild(deleteAllBtn);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        renderPoops();
        showMessage('列表已刷新！', 'success');
    }
});

// Auto-refresh every 30 seconds
setInterval(() => {
    renderPoops();
}, 30000);

// Add some random poops if empty (for demo)
if (Storage.getPoops().length === 0) {
    // Generate demo poops
    const demoNames = ['小明', '大便艺术家', '💩大师', '搞笑王', 'Anonymous', '创作者'];
    
    for (let i = 0; i < 8; i++) {
        const tempCanvas = document.createElement('canvas');
        const size = 100 + Math.random() * 100;
        PoopUtils.generateRandomPoop(tempCanvas, size, size);
        
        const poop = Storage.addPoop({
            imageData: tempCanvas.toDataURL(),
            artist: demoNames[Math.floor(Math.random() * demoNames.length)],
            width: size,
            height: size
        });
        
        // Add random votes for demo
        poop.votes = Math.floor(Math.random() * 20);
        Storage.updatePoop(poop.id, { votes: poop.votes });
        
        // Delay timestamp for variety
        poop.timestamp = Date.now() - Math.random() * 86400000 * 7; // Up to 7 days ago
        Storage.updatePoop(poop.id, { timestamp: poop.timestamp });
    }
    
    renderPoops();
}

// Add loading indicator
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.id = 'loading-indicator';
    rankContainer.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('loading-indicator');
    if (loading) loading.remove();
}

// Add hover effects for poop items
rankContainer.addEventListener('mouseover', (e) => {
    const poopItem = e.target.closest('.poop-item');
    if (poopItem) {
        poopItem.style.borderColor = '#007bff';
    }
});

rankContainer.addEventListener('mouseout', (e) => {
    const poopItem = e.target.closest('.poop-item');
    if (poopItem) {
        poopItem.style.borderColor = '#ddd';
    }
});
