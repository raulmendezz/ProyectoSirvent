#!/bin/bash
# =============================================================================
# deploy.sh — Despliega / actualiza la aplicación en el VPS
# Ejecutar desde el VPS: bash /var/www/ProyectoSirvent/deploy/deploy.sh
# =============================================================================

set -e

APP_DIR="/var/www/ProyectoSirvent"
API_DIR="${APP_DIR}/adminSystem/apps/api"
DASH_DIR="${APP_DIR}/adminSystem/apps/admin-dashboard"

echo "=== [1/5] Actualizando código ==="
cd ${APP_DIR}
git pull origin main

echo "=== [2/5] Instalando dependencias ==="
cd ${APP_DIR}/adminSystem
npm install --workspaces --include-workspace-root

echo "=== [3/5] Sincronizando base de datos ==="
cd ${API_DIR}
npx prisma db push --accept-data-loss

echo "=== [4/5] Compilando aplicaciones ==="
cd ${API_DIR}
npm run build

cd ${DASH_DIR}
npm run build

echo "=== [5/5] Reiniciando con PM2 ==="
cd ${APP_DIR}/adminSystem
pm2 start ecosystem.config.js --update-env
pm2 save

echo ""
echo "=========================================="
echo "  Despliegue completado."
echo "  Dashboard: http://168.231.86.244"
echo "  API:       http://168.231.86.244:4000/api"
echo "=========================================="
