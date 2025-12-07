// Constantes
const STORAGE_KEY = 'secretSanta';
const STAGE_KEY = 'currentStage';
const STAGES = {
    SELECTION: 'selection',
    MESSAGE: 'message',
    REVEAL: 'reveal'
};

const MAX_CHARS = 1000;

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

// Initialiser la page
function init() {
    const session = checkSession();
    if (!session) return;
    
    const messageInput = document.getElementById('messageText');
    const charCount = document.getElementById('charCount');
    const sendBtn = document.getElementById('sendBtn');
    const skipBtn = document.getElementById('skipBtn');
    const loading = document.getElementById('loading');
    
    // Charger le message existant s'il y en a un
    loadExistingMessage(session.selectedName);
    
    // Gérer le compteur de caractères
    messageInput.addEventListener('input', () => {
        const count = messageInput.value.length;
        charCount.textContent = count;
        
        if (count > MAX_CHARS) {
            charCount.style.color = 'var(--primary-red)';
            messageInput.style.borderColor = 'var(--primary-red)';
        } else {
            charCount.style.color = 'var(--gold)';
            messageInput.style.borderColor = 'var(--gold)';
        }
    });
    
    // Limiter à MAX_CHARS caractères
    messageInput.addEventListener('input', function() {
        if (this.value.length > MAX_CHARS) {
            this.value = this.value.substring(0, MAX_CHARS);
            charCount.textContent = MAX_CHARS;
        }
    });
    
    // Envoyer le message
    sendBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();
        
        if (message.length > MAX_CHARS) {
            alert('Le message est trop long (maximum 1000 caractères)');
            return;
        }
        
        await sendMessage(session.selectedName, message);
    });
    
    // Passer cette étape
    skipBtn.addEventListener('click', () => {
        proceedToReveal();
    });
    
    // Permettre Enter + Ctrl/Cmd pour envoyer
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            sendBtn.click();
        }
    });
}

// Charger le message existant
async function loadExistingMessage(name) {
    try {
        const response = await fetch(`/api/message/${name}`);
        const data = await response.json();
        
        if (data.message) {
            document.getElementById('messageText').value = data.message;
            document.getElementById('charCount').textContent = data.message.length;
        }
    } catch (error) {
        console.error('Erreur lors du chargement du message:', error);
    }
}

// Envoyer le message au serveur
async function sendMessage(name, message) {
    const loading = document.getElementById('loading');
    const sendBtn = document.getElementById('sendBtn');
    const skipBtn = document.getElementById('skipBtn');
    
    loading.classList.add('show');
    sendBtn.disabled = true;
    skipBtn.disabled = true;
    
    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: name,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Message sauvegardé, passer à la révélation
            proceedToReveal();
        } else {
            alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
            loading.classList.remove('show');
            sendBtn.disabled = false;
            skipBtn.disabled = false;
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion. Veuillez réessayer.');
        loading.classList.remove('show');
        sendBtn.disabled = false;
        skipBtn.disabled = false;
    }
}

// Passer à la page de révélation
function proceedToReveal() {
    localStorage.setItem(STAGE_KEY, STAGES.REVEAL);
    window.location.href = 'reveal.html';
}

// Démarrer l'application
init();

