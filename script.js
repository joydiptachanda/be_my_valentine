const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const mainGif = document.getElementById('main-gif');
const questionText = document.getElementById('question-text');
const heartBg = document.getElementById('heart-bg');

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const giftBoxContainer = document.getElementById('gift-box-container');
const giftBox = document.getElementById('gift-box');
const messageContainer = document.getElementById('message-container');

// Logic Variables
let noClickCount = 0;
let yesScale = 1;
const MAX_NO_CLICKS = 16; 

const gifs = {
    ask: "https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif",
    sad: "https://media.tenor.com/mNO8aMW3GB8AAAAi/milk-and-mocha-mocha.gif",
    success: "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif"
};

function preloadImages() {
    for (const key in gifs) {
        const img = new Image();
        img.src = gifs[key];
    }
}
preloadImages();

const noTexts = [
    "No", "Are you sure?", "Really sure?", "Think again!", 
    "Last chance!", "Surely not?", "You might regret this!", 
    "Give it another thought!", "Are you absolutely certain?", 
    "This could be a mistake!", "Have a heart!", "Don't be so cold!", 
    "Change of heart?", "Wouldn't you reconsider?", 
    "Is that your final answer?", "You're breaking my heart ;("
];

// --- NO BUTTON LOGIC ---
function handleNoInteraction() {
    noClickCount++;

    if (noClickCount >= MAX_NO_CLICKS) {
        noBtn.style.display = 'none';
        questionText.innerText = "Okay, enough playing hard to get! 😤";
        yesBtn.style.transform = "scale(1)";
        yesBtn.className = "bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-12 rounded-full shadow-2xl text-3xl animate-bounce mt-4";
        yesBtn.innerText = "Just Click YES! 💖";
        mainGif.src = gifs.ask; 
        return;
    }

    noBtn.innerText = noTexts[noClickCount % noTexts.length];
    if (yesScale < 4) {
        yesScale += 0.15;
        yesBtn.style.transform = `scale(${yesScale})`;
    }

    const padding = 20;
    const maxWidth = window.innerWidth - noBtn.offsetWidth - padding;
    const maxHeight = window.innerHeight - noBtn.offsetHeight - padding;
    
    const randomX = Math.max(padding, Math.random() * maxWidth);
    const randomY = Math.max(padding, Math.random() * maxHeight);

    if (noBtn.style.position !== "fixed") {
        const rect = noBtn.getBoundingClientRect();
        noBtn.style.left = `${rect.left}px`;
        noBtn.style.top = `${rect.top}px`;
        noBtn.style.position = "fixed";
        void noBtn.offsetWidth; 
    }

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    
    mainGif.src = gifs.sad;
}

noBtn.addEventListener('mouseover', handleNoInteraction);
noBtn.addEventListener('click', (e) => { e.preventDefault(); handleNoInteraction(); });
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleNoInteraction(); });

// --- YES BUTTON LOGIC ---
yesBtn.addEventListener('click', () => {
    // 1. CONDITIONAL TEXT CHANGE
    // Only show "Eventually" if they clicked/hovered No at least once
    if (noClickCount > 0) {
        document.getElementById('eventually-text').innerText = "(Eventually 😉)";
    } else {
        document.getElementById('eventually-text').innerText = "";
    }

    step1.style.opacity = '0';
    setTimeout(() => {
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
        step2.classList.add('flex'); 
        fireConfetti();
    }, 500);
});

// --- GIFT BOX LOGIC ---
giftBoxContainer.addEventListener('click', () => {
    giftBox.style.animation = 'none';
    giftBox.classList.add('open-gift');
    
    fireConfetti();

    setTimeout(() => {
        giftBoxContainer.classList.add('hidden'); 
        messageContainer.classList.remove('hidden');
        messageContainer.classList.add('flex');
        
        document.getElementById('success-gif').src = gifs.success;
        
        startBalloonGame();
    }, 500);
});

// --- BACKGROUND HEARTS ---
function createHearts() {
    const symbols = ['❤️', '💖', '💕', '🥰', '🌹'];
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart-bg');
        heart.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heartBg.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }, 300);
}
createHearts();

// --- BALLOON MINI GAME ---
function startBalloonGame() {
    const balloons = ['🎈', '❤️', '🌹', '🧸', '✨'];
    
    setInterval(() => {
        const b = document.createElement('div');
        b.classList.add('balloon');
        b.innerText = balloons[Math.floor(Math.random() * balloons.length)];
        
        b.style.left = Math.random() * 90 + 'vw';
        b.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        const popBalloon = (e) => {
            e.preventDefault(); 
            e.target.innerText = '💥';
            e.target.style.transition = 'all 0.1s';
            e.target.style.transform = 'scale(1.5)';
            e.target.style.opacity = '0';
            
            const rect = e.target.getBoundingClientRect();
            confetti({
                particleCount: 15,
                spread: 40,
                startVelocity: 20,
                origin: {
                    x: (rect.left + rect.width / 2) / window.innerWidth,
                    y: (rect.top + rect.height / 2) / window.innerHeight
                }
            });

            setTimeout(() => e.target.remove(), 200);
        };

        b.addEventListener('click', popBalloon);
        b.addEventListener('touchstart', popBalloon);

        document.body.appendChild(b);
        setTimeout(() => { if(b.parentNode) b.remove(); }, 8000);
    }, 600);
}

function fireConfetti() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}