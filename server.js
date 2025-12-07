const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Créer le dossier data s'il n'existe pas
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialiser le fichier JSON s'il n'existe pas
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

// Matchs prédéfinis
const MATCHES = {
  'Ninou': 'Habiba',
  'Habiba': 'Suley',
  'Suley': 'Soussou',
  'Soussou': 'Ninou'
};

// Liste des participants
const PARTICIPANTS = Object.keys(MATCHES);

// Route pour obtenir les participants
app.get('/api/participants', (req, res) => {
  res.json({ participants: PARTICIPANTS });
});

// Route pour obtenir le match d'un participant
app.get('/api/match/:name', (req, res) => {
  const name = req.params.name;
  if (MATCHES[name]) {
    res.json({ match: MATCHES[name] });
  } else {
    res.status(404).json({ error: 'Participant non trouvé' });
  }
});

// Route pour sauvegarder un message
app.post('/api/message', (req, res) => {
  const { from, message } = req.body;
  
  if (!from || !message) {
    return res.status(400).json({ error: 'Nom et message requis' });
  }
  
  if (!PARTICIPANTS.includes(from)) {
    return res.status(400).json({ error: 'Participant invalide' });
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    data[from] = message;
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer un message
app.get('/api/message/:name', (req, res) => {
  const name = req.params.name;
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({ message: data[name] || '' });
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour récupérer le message pour le match d'un participant
app.get('/api/message-for-match/:name', (req, res) => {
  const name = req.params.name;
  const match = MATCHES[name];
  
  if (!match) {
    return res.status(404).json({ error: 'Participant non trouvé' });
  }
  
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    res.json({ message: data[match] || '', from: match });
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de health check pour Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'secret-santa-v2' });
});

// Route racine - redirige vers index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎅 Serveur Secret Santa démarré sur le port ${PORT}`);
  console.log(`🌐 Accessible sur http://0.0.0.0:${PORT}`);
});

