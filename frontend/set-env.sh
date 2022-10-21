cp -f /usr/share/nginx/html/index.html /tmp

if [ -n "$API_URL" ]; then
  sed -i -e "s|{API_URL}|$API_URL|g" /tmp/index.html
fi

if [ -n "$APP_NAME" ]; then
  sed -i -e "s|{APP_NAME}|$APP_NAME|g" /tmp/index.html
fi

if [ -n "$APP_URL" ]; then
  sed -i -e "s|{APP_URL}|$APP_URL|g" /tmp/index.html
fi

if [ -n "$NET_URLS" ]; then
  sed -i -e "s|{NET_URLS}|$NET_URLS|g" /tmp/index.html
fi

if [ -n "$SENTRY_DSN" ]; then
  sed -i -e "s|{SENTRY_DSN}|$SENTRY_DSN|g" /tmp/index.html
fi
if [ -n "$L1_EXPLORER_URL" ]; then
  sed -i -e "s|{L1_EXPLORER_URL}|$L1_EXPLORER_URL|g" /tmp/index.html
fi

cat /tmp/index.html >/usr/share/nginx/html/index.html
