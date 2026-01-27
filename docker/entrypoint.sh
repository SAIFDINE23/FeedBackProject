#!/bin/bash
set -e

echo "Attendre PostgreSQL..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USERNAME" -d "$DB_DATABASE" -c '\q' 2>/dev/null; do
  echo "PostgreSQL n'est pas prêt..."
  sleep 2
done
echo "PostgreSQL est prêt!"

if [ ! -f /app/.env ]; then
    cp /app/.env.example /app/.env
fi

php /app/artisan key:generate --force
php /app/artisan migrate --force
php /app/artisan storage:link || true
php /app/artisan config:cache
php /app/artisan route:cache
php /app/artisan view:cache

chown -R www-data:www-data /app
chmod -R 775 /app/storage
chmod -R 775 /app/bootstrap/cache

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
