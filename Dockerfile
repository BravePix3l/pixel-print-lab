FROM node:22-bookworm-slim

ENV NODE_ENV=production
ENV PRUSASLICER_PATH=/usr/local/bin/prusa-slicer-headless
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends prusa-slicer xvfb xauth \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY scripts/prusa-slicer-headless.sh /usr/local/bin/prusa-slicer-headless

RUN chmod +x /usr/local/bin/prusa-slicer-headless \
    && mkdir -p /app/data /app/storage/catalog /app/storage/uploads /app/storage/orders \
    && chown -R node:node /app/data /app/storage

USER node
EXPOSE 3000

CMD ["sh", "-c", "node src/setup-database.js && exec node src/server.js"]
