# Secret Santa v2 🎅

Un site web de Secret Santa familial avec un design de Noël animé et des effets visuels magiques !

## ✨ Fonctionnalités

- **Page d'accueil** : Sélection de son identité parmi les participants
- **Page message** : Possibilité de laisser un message optionnel pour son Secret Santa
- **Page révélation** : Carte retournée animée qu'on peut toucher/cliquer pour révéler son Secret Santa
- **Design de Noël** : Animations, flocons de neige, lumières clignotantes, confettis
- **Responsive** : Fonctionne parfaitement sur mobile et desktop
- **Stockage** : Messages sauvegardés dans un fichier JSON côté serveur
- **Navigation intelligente** : Utilise le localStorage pour rediriger les utilisateurs à la bonne étape

## 🎯 Participants

Les matchs sont prédéfinis :
- Ninou → Habiba
- Habiba → Suley
- Suley → Soussou
- Soussou → Ninou

## 📁 Structure du projet

```
secretsantav2/
├── public/           # Fichiers statiques (HTML, CSS, JS)
│   ├── index.html   # Page d'accueil
│   ├── message.html # Page message
│   └── reveal.html  # Page révélation
├── images/          # Photos des participants (nom = titre de la photo)
├── data/            # Fichier JSON pour les messages (créé automatiquement)
├── server.js        # Serveur Express
├── package.json     # Dépendances Node.js
└── render.yaml      # Configuration Render pour déploiement automatique
```

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Ajouter les photos des participants dans le dossier `images/` :
   - `Ninou.jpg`
   - `Habiba.jpg`
   - `Suley.jpg`
   - `Soussou.jpg`

3. Démarrer le serveur :
```bash
npm start
```

Le serveur démarre sur le port 3000 (ou le port défini dans la variable d'environnement PORT).

**Note** : Par défaut, le fichier `data/messages.json` est **réinitialisé à chaque démarrage** du serveur. Pour conserver les messages entre les redémarrages en développement, définir la variable d'environnement :
```bash
RESET_DATA_ON_START=false npm start
```

## 🌐 Déploiement sur Surge

### Prérequis

1. Installer Surge globalement :
```bash
npm install -g surge
```

2. Créer un compte Surge (si ce n'est pas déjà fait) :
```bash
surge
```

### Déploiement

1. Construire le projet (si nécessaire) :
```bash
npm install
```

2. Déployer sur Surge :
```bash
surge public/ your-domain.surge.sh
```

**Note importante** : Surge sert uniquement des fichiers statiques. Pour déployer l'application complète avec le serveur Node.js, vous devrez utiliser un service comme Heroku, Railway, ou Render.

## 🚀 Déploiement sur Render (Recommandé)

Le projet est **pré-configuré** pour un déploiement rapide sur Render avec le fichier `render.yaml`.

### Déploiement rapide (avec render.yaml)

1. **Créer un compte** sur [Render](https://render.com) (gratuit)

2. **Pousser votre code** sur GitHub, GitLab ou Bitbucket

3. **Dans Render Dashboard** :
   - Cliquer sur "New +" → "Blueprint"
   - Connecter votre dépôt
   - Render détectera automatiquement le fichier `render.yaml`
   - Cliquer sur "Apply"

4. **C'est tout !** Render va :
   - Installer les dépendances (`npm install`)
   - Démarrer le serveur (`npm start`)
   - Assigner automatiquement un port via `process.env.PORT`

### Déploiement manuel (sans render.yaml)

Si vous préférez configurer manuellement :

1. Créer un compte sur [Render](https://render.com)
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre dépôt Git
4. Configurer :
   - **Name** : `secretsanta-v2` (ou votre choix)
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Plan** : Free (ou Starter pour plus de ressources)
5. Cliquer sur "Create Web Service"

### ⚠️ Points importants pour Render

- **Port** : Le serveur utilise automatiquement `process.env.PORT` (déjà configuré ✓)
- **Dossier data** : Le dossier `data/` est créé automatiquement au démarrage
- **Réinitialisation des données** : Par défaut, le fichier `messages.json` est **réinitialisé à chaque déploiement/redémarrage** pour un Secret Santa frais. Pour conserver les données, définir `RESET_DATA_ON_START=false` dans les variables d'environnement Render.
- **Images** : Assurez-vous d'avoir ajouté les photos dans le dossier `images/` avant de déployer
- **Variables d'environnement** : 
  - `RESET_DATA_ON_START` : `true` par défaut (réinitialise les messages à chaque démarrage)
  - `NODE_ENV` : `production` (défini automatiquement par render.yaml)
- **Health Check** : Render vérifie automatiquement la route `/` pour s'assurer que le service est en ligne

## 🎨 Personnalisation

### Modifier les participants

Éditez le fichier `server.js` et modifiez les objets `MATCHES` et `PARTICIPANTS` :

```javascript
const MATCHES = {
  'Ninou': 'Habiba',
  'Habiba': 'Suley',
  'Suley': 'Soussou',
  'Soussou': 'Ninou'
};
```

### Modifier le design

Les couleurs et styles sont définis dans les fichiers CSS avec des variables CSS :
- `--primary-red` : Rouge principal
- `--primary-green` : Vert principal
- `--gold` : Or/doré
- `--snow` : Blanc/neige

## 📝 API Endpoints

- `GET /api/participants` : Liste des participants
- `GET /api/match/:name` : Récupérer le match d'un participant
- `POST /api/message` : Sauvegarder un message
  - Body : `{ "from": "Nom", "message": "Message" }`
- `GET /api/message/:name` : Récupérer le message d'un participant
- `GET /api/message-for-match/:name` : Récupérer le message pour le match d'un participant

## 🛠️ Technologies utilisées

- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **HTML/CSS/JavaScript** : Frontend
- **localStorage** : Stockage côté client pour la navigation

## 📄 Licence

MIT

## 🎄 Joyeux Noël !

Profitez bien de votre Secret Santa ! 🎁✨

