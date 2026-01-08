# Guide de Déploiement ArwaPark

## Prérequis sur le serveur

```bash
# Installer Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Installer PM2
sudo npm install -g pm2

# Installer Nginx
sudo apt-get install nginx

# Installer Git
sudo apt-get install git
```

## Configuration de la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE arwapark_prod;
CREATE USER arwapark WITH ENCRYPTED PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE arwapark_prod TO arwapark;
\q
```

## Déploiement

### 1. Cloner le repository

```bash
cd /var/www
sudo mkdir arwapark
sudo chown $USER:$USER arwapark
cd arwapark
git clone https://github.com/votre-username/abdoapp.git .
```

### 2. Configurer les variables d'environnement

```bash
cp .env.production .env
nano .env
```

Modifier les valeurs suivantes:
- `DATABASE_URL` avec vos informations PostgreSQL
- `JWT_SECRET` et `JWT_REFRESH_SECRET` avec des valeurs sécurisées
- `FRONTEND_URL` et `BACKEND_URL` avec votre domaine

### 3. Installer et construire

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Configurer Nginx

```bash
sudo cp nginx.conf /etc/nginx/sites-available/arwapark
sudo ln -s /etc/nginx/sites-available/arwapark /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Configurer SSL avec Let's Encrypt (Recommandé)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d arwapark.digima.cloud
```

## Commandes utiles

```bash
# Voir les logs
pm2 logs arwapark

# Redémarrer l'application
pm2 restart arwapark

# Voir le statut
pm2 status

# Mettre à jour l'application
./deploy.sh
```

## Alternative: Déploiement avec Docker

Si vous préférez utiliser Docker:

```bash
# Construire l'image
docker build -f Dockerfile.production -t arwapark .

# Lancer le conteneur
docker run -d \
  --name arwapark \
  -p 3001:3001 \
  --env-file .env \
  arwapark

# Avec docker-compose
docker-compose up -d
```

## Configuration DNS

Pointez votre domaine `arwapark.digima.cloud` vers l'IP de votre serveur:

```
Type: A
Name: arwapark
Value: [IP de votre serveur]
TTL: 3600
```

## Vérification

1. Accédez à `https://arwapark.digima.cloud` pour le frontend
2. Testez l'API à `https://arwapark.digima.cloud/api`
3. Vérifiez le health check à `https://arwapark.digima.cloud/health`

## Troubleshooting

### "Cannot GET /"
- Vérifiez que le backend est lancé: `pm2 status`
- Vérifiez les logs: `pm2 logs arwapark`
- Vérifiez la configuration nginx: `sudo nginx -t`

### Erreur de base de données
- Vérifiez que PostgreSQL est lancé: `sudo systemctl status postgresql`
- Vérifiez DATABASE_URL dans .env
- Lancez les migrations: `npx prisma migrate deploy`

### Erreur 502 Bad Gateway
- Vérifiez que l'application écoute sur le bon port: `netstat -tlnp | grep 3001`
- Redémarrez PM2: `pm2 restart arwapark`
- Redémarrez Nginx: `sudo systemctl restart nginx`
