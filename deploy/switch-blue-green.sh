#!/usr/bin/env bash
# Called from the "E2E and Performance Testing" CI stage, only after the
# green environment has passed its tests on port 8081. Flips the router's
# active upstream from blue to green (or back) and reloads nginx - this is
# the actual zero-downtime traffic switch. The previous color is left
# running as a fallback; it is not stopped here.
set -euo pipefail

cd /opt/secret-notes/deploy

CURRENT="$(cat .active-color 2>/dev/null || echo blue)"
if [ "$CURRENT" = "blue" ]; then
  NEXT="green"
else
  NEXT="blue"
fi

ln -sf "active-color-${NEXT}.conf" active-color.conf
echo -n "$NEXT" > .active-color

docker compose -f docker-compose.blue-green.yml exec router nginx -s reload
echo "Switched live traffic from $CURRENT to $NEXT"
