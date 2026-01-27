#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Extract DB credentials from DATABASE_URL
# Assumes format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
# Note: This is a basic parser. For complex passwords, manual configuration is safer.
PROTO="$(echo $DATABASE_URL | grep :// | sed -e's,^\(.*://\).*,\1,g')"
URL="$(echo ${DATABASE_URL/$PROTO/})"
USER="$(echo $URL | grep @ | cut -d: -f1)"
pass_host_port_db="$(echo $URL | sed -e s,$USER:,,g)"
PASSWORD="$(echo $pass_host_port_db | grep @ | cut -d@ -f1)"
host_port_db="$(echo $pass_host_port_db | sed -e s,$PASSWORD@,,g)"
HOST="$(echo $host_port_db | cut -d: -f1)"
port_db="$(echo $host_port_db | sed -e s,$HOST:,,g)"
PORT="$(echo $port_db | cut -d/ -f1)"
DB_NAME="$(echo $port_db | grep / | cut -d/ -f2)"

# Backup configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Starting backup for database: $DB_NAME at $TIMESTAMP..."

# Perform backup
mysqldump -u "$USER" -p"$PASSWORD" -h "$HOST" -P "$PORT" "$DB_NAME" --single-transaction --quick --lock-tables=false | gzip > "$FILENAME"

if [ $? -eq 0 ]; then
  echo "Backup successful! Saved to: $FILENAME"
  # Keep only latest 7 days of backups (optional)
  find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +7 -delete
else
  echo "Backup failed!"
  exit 1
fi
