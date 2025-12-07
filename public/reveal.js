// Constantes
const STORAGE_KEY = 'secretSanta';
const STAGE_KEY = 'currentStage';
const STAGES = {
    SELECTION: 'selection',
    MESSAGE: 'message',
    REVEAL: 'reveal'
};

let isRevealed = false;

// Vérifier si l'utilisateur a sélectionné une identité
function checkSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Pas de session, rediriger vers l'accueil
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(stored);
}

// Vérifier si déjà révélé
function checkIfAlreadyRevealed() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        if (data.revealed) {
            isRevealed = true;
            return true;
        }
    }
    return false;
}

// Initialiser la page
async function init() {
    const session = checkSession();
    if (!session) return;
    
    const card = document.getElementById('card');
    const loading = document.getElementById('loading');
    const subtitle = document.getElementById('subtitle');
    
    // Vérifier si déjà révélé
    if (checkIfAlreadyRevealed()) {
        // Charger directement les données révélées
        await loadRevealedData(session.selectedName);
        card.classList.add('flipped');
        subtitle.textContent = 'Voici ton Secret Santa !';
        return;
    }
    
    // Charger les données du match
    loading.classList.add('show');
    
    try {
        const matchData = await fetchMatchData(session.selectedName);
        if (matchData) {
            setupCard(matchData, session.selectedName);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement. Veuillez réessayer.');
    } finally {
        loading.classList.remove('show');
    }
    
    // Ajouter les événements de clic/touch
    card.addEventListener('click', () => revealCard(session.selectedName));
    card.addEventListener('touchstart', () => revealCard(session.selectedName), { passive: true });
}

// Récupérer les données du match
async function fetchMatchData(name) {
    try {
        // Récupérer le match
        const matchResponse = await fetch(`/api/match/${name}`);
        const matchData = await matchResponse.json();
        
        if (!matchData.match) {
            throw new Error('Match non trouvé');
        }
        
        // Récupérer le message du match
        const messageResponse = await fetch(`/api/message-for-match/${name}`);
        const messageData = await messageResponse.json();
        
        return {
            match: matchData.match,
            message: messageData.message || ''
        };
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}

// Configurer la carte avec les données
function setupCard(matchData, currentName) {
    const revealedImage = document.getElementById('revealedImage');
    const revealedName = document.getElementById('revealedName');
    const revealedMessage = document.getElementById('revealedMessage');
    
    // Image
    const imagePath = `/images/${matchData.match}.jpg`;
    revealedImage.src = imagePath;
    revealedImage.alt = matchData.match;
    revealedImage.onerror = function() {
        // Image par défaut si elle n'existe pas
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2ZmZDcwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjcwIiBmaWxsPSIjMWEzZDBmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+OqTwvdGV4dD48L3N2Zz4=';
    };
    
    // Nom
    revealedName.textContent = matchData.match;
    
    // Message
    if (matchData.message) {
        revealedMessage.textContent = matchData.message;
    } else {
        revealedMessage.style.display = 'none';
    }
    
    // Stocker les données dans le localStorage pour éviter de recharger
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    stored.matchData = matchData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

// Charger les données déjà révélées
async function loadRevealedData(name) {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    if (stored.matchData) {
        setupCard(stored.matchData, name);
    } else {
        // Recharger depuis l'API
        const matchData = await fetchMatchData(name);
        setupCard(matchData, name);
    }
}

// Révéler la carte
function revealCard(name) {
    if (isRevealed) return;
    
    const card = document.getElementById('card');
    const subtitle = document.getElementById('subtitle');
    const cardContainer = card.closest('.card-container');
    
    // Retourner la carte
    card.classList.add('flipped');
    isRevealed = true;
    
    // Mettre à jour le sous-titre avec animation
    subtitle.style.animation = 'fadeInDown 0.5s ease-out';
    subtitle.textContent = 'Voici ton Secret Santa !';
    
    // Créer l'effet de flash
    createFlashEffect(cardContainer);
    
    // Lancer les confettis améliorés
    setTimeout(() => createConfetti(), 200);
    setTimeout(() => createSparkleParticles(cardContainer), 400);
    
    // Sauvegarder dans localStorage
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    stored.revealed = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    localStorage.setItem(STAGE_KEY, STAGES.REVEAL);
}

// Créer l'effet de flash
function createFlashEffect(container) {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255, 215, 0, 0.9) 0%, rgba(255, 215, 0, 0.5) 50%, transparent 70%);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 50;
        animation: flashReveal 0.8s ease-out forwards;
    `;
    container.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.remove();
        }
    }, 1000);
}

// Créer des particules d'éclat
function createSparkleParticles(container) {
    const particleCount = 30;
    const centerX = container.offsetLeft + container.offsetWidth / 2;
    const centerY = container.offsetTop + container.offsetHeight / 2;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'sparkle-particle';
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = 100 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.setProperty('--sparkle-x', x + 'px');
        particle.style.setProperty('--sparkle-y', y + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 2000);
    }
}

// Créer des confettis améliorés
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['gold', 'red', 'green', 'blue', 'yellow'];
    const count = 100;
    const cardContainer = document.querySelector('.card-container');
    const centerX = cardContainer ? cardContainer.offsetLeft + cardContainer.offsetWidth / 2 : window.innerWidth / 2;
    const centerY = cardContainer ? cardContainer.offsetTop + cardContainer.offsetHeight / 2 : window.innerHeight / 2;
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        const isStar = Math.random() > 0.7;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        if (isStar) {
            confetti.className = `confetti star`;
            confetti.style.borderBottomColor = color === 'gold' ? 'var(--gold)' : 
                                               color === 'red' ? 'var(--primary-red)' :
                                               color === 'green' ? 'var(--primary-green)' :
                                               color === 'blue' ? '#0066ff' : 'var(--gold)';
        } else {
            confetti.className = `confetti ${color}`;
        }
        
        // Position initiale autour du centre de la carte
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50;
        const startX = centerX + Math.cos(angle) * radius;
        const startY = centerY + Math.sin(angle) * radius;
        
        confetti.style.left = startX + 'px';
        confetti.style.top = startY + 'px';
        confetti.style.setProperty('--random-x', (Math.random() - 0.5) * 2);
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 3) + 's';
        
        container.appendChild(confetti);
        
        // Supprimer après l'animation
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.remove();
            }
        }, 6000);
    }
}

// Démarrer l'application
init();

