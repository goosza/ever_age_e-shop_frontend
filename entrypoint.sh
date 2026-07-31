#!/bin/sh
set -e

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  VITE_ZASILKOVNA_API_KEY: "${VITE_ZASILKOVNA_API_KEY}"
};
EOF

exec nginx -g "daemon off;"