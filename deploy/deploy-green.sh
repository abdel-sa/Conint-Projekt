#!/usr/bin/env bash
# Pulls the newly delivered image and (re)starts only the "green" side.
# Runs on the EC2 host from the CI/CD "Deploy" stage. Blue keeps serving
# production traffic untouched while green is prepared and tested.
set -euo pipefail

SERVICE="$1" # "backend" or "frontend"
IMAGE_TAG="${IMAGE_TAG:?IMAGE_TAG env var is required}"

cd /opt/secret-notes/deploy

case "$SERVICE" in
  backend) export GREEN_TAG="$IMAGE_TAG" ;;
  frontend) export GREEN_TAG="$IMAGE_TAG" ;;
  *) echo "unknown service: $SERVICE" >&2; exit 1 ;;
esac

docker compose -f docker-compose.blue-green.yml pull "${SERVICE}-green"
docker compose -f docker-compose.blue-green.yml up -d "${SERVICE}-green"
