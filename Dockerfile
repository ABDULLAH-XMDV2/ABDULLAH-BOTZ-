FROM node:20-bookworm-slim

RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install && npm install -g qrcode-terminal

COPY . .

RUN ls -la lib/ && echo "✅ lib folder OK" && \
    test -f lib/arslan.html && echo "✅ arslan.html EXISTS" || echo "❌ arslan.html MISSING"

EXPOSE ${PORT:-9090}

CMD ["node", "index.js"]
