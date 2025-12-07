// Gestion du localStorage
const STORAGE_KEY = 'secretSanta';
const STAGE_KEY = 'currentStage';
const STAGES = {
    SELECTION: 'selection',
    MESSAGE: 'message',
    REVEAL: 'reveal'
};

// Vérifier si l'utilisateur a déjà sélectionné une identité
function checkExistingSession() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        const stage = localStorage.getItem(STAGE_KEY) || STAGES.SELECTION;
        
        // Rediriger vers la bonne étape
        if (stage === STAGES.MESSAGE) {
            window.location.href = 'message.html';
        } else if (stage === STAGES.REVEAL) {
            window.location.href = 'reveal.html';
        }
    }
}

// Charger les participants depuis l'API
async function loadParticipants() {
    try {
        const response = await fetch('/api/participants');
        const data = await response.json();
        return data.participants;
    } catch (error) {
        console.error('Erreur lors du chargement des participants:', error);
        return [];
    }
}

// Afficher les participants
function displayParticipants(participants) {
    const grid = document.getElementById('participantsGrid');
    const loading = document.getElementById('loading');
    
    if (participants.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: var(--gold);">Aucun participant trouvé</p>';
        loading.classList.remove('show');
        return;
    }
    
    grid.innerHTML = '';
    
    participants.forEach((participant, index) => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Essayer de charger l'image, avec fallback si elle n'existe pas
        const imagePath = `/images/${participant}.jpg`;
        const image = document.createElement('img');
        image.src = imagePath;
        image.alt = participant;
        image.className = 'participant-image';
        image.onerror = function() {
            // Si l'image n'existe pas, utiliser une image par défaut ou un emoji
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2ZmZDcwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjQ4IiBmaWxsPSIjMWEzZDBmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+OqTwvdGV4dD48L3N2Zz4=';
        };
        
        const name = document.createElement('div');
        name.className = 'participant-name';
        name.textContent = participant;
        
        card.appendChild(image);
        card.appendChild(name);
        
        card.addEventListener('click', () => selectParticipant(participant));
        
        grid.appendChild(card);
    });
    
    loading.classList.remove('show');
}

// Sélectionner un participant
function selectParticipant(name) {
    // Sauvegarder dans localStorage
    const data = {
        selectedName: name,
        timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STAGE_KEY, STAGES.MESSAGE);
    
    // Rediriger vers la page message
    window.location.href = 'message.html';
}

// Initialisation
async function init() {
    checkExistingSession();
    
    const loading = document.getElementById('loading');
    loading.classList.add('show');
    
    const participants = await loadParticipants();
    displayParticipants(participants);
}

// Démarrer l'application
init();

