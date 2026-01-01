#!/bin/bash
BACKUP_DIR="/var/www/html/arilogbaru/backups"
DATA_FILE="/var/www/html/arilogbaru/data/airlog.sqlite"
LOG_FILE="/var/www/html/arilogbaru/logs/backup.log"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Perform backup
if [ -f "$DATA_FILE" ]; then
    cp "$DATA_FILE" "$BACKUP_DIR/airlog_$TIMESTAMP.sqlite"
    if [ $? -eq 0 ]; then
        echo "[$(date)] Backup success: $BACKUP_DIR/airlog_$TIMESTAMP.sqlite" >> "$LOG_FILE"
    else
        echo "[$(date)] Backup failed!" >> "$LOG_FILE"
        exit 1
    fi
else
    echo "[$(date)] Source DB not found: $DATA_FILE" >> "$LOG_FILE"
    exit 1
fi

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "airlog_*.sqlite" -mtime +7 -delete
