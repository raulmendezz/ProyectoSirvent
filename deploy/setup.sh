#!/bin/bash
# =============================================================================
# setup.sh — Configuración inicial del VPS (Ubuntu 20/22/24)
# Ejecutar UNA sola vez como root: bash setup.sh
# =============================================================================

set -e

REPO_URL="https://github.com/raulmendezz/ProyectoSirvent.git"
APP_DIR="/var/www/ProyectoSirvent"
DB_NAME="sirvent_db"
DB_USER="sirvent"
# Cambia estas contraseñas antes de ejecutar
DB_PASS="CambiaEstoEnProduccion123!"
MYSQL_ROOT_PASS="RootPassCambiaEsto456!"

echo "=== [1/8] Actualizando sistema ==="
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git unzip ufw

echo "=== [2/8] Instalando Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "=== [3/8] Instalando Nginx ==="
apt-get install -y nginx
systemctl enable nginx

echo "=== [4/8] Instalando MySQL 8 ==="
apt-get install -y mysql-server
systemctl enable mysql

# Configurar MySQL
mysql -u root <<SQL
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASS}';
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL
echo "MySQL configurado."

echo "=== [5/8] Clonando repositorio ==="
mkdir -p /var/www
git clone ${REPO_URL} ${APP_DIR}
cd ${APP_DIR}

echo "=== [6/8] Instalando dependencias ==="
cd ${APP_DIR}/adminSystem
npm install --workspaces --include-workspace-root

echo "=== [7/8] Configurando Nginx ==="
cp ${APP_DIR}/deploy/nginx.conf /etc/nginx/sites-available/sirvent
ln -sf /etc/nginx/sites-available/sirvent /etc/nginx/sites-enabled/sirvent
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "=== [8/8] Configurando firewall ==="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "============================================================"
echo "  Setup completado."
echo "  Ahora configura los archivos .env:"
echo "    ${APP_DIR}/adminSystem/apps/api/.env"
echo "    ${APP_DIR}/adminSystem/apps/admin-dashboard/.env.local"
echo "  Luego ejecuta: bash ${APP_DIR}/deploy/deploy.sh"
echo "============================================================"
