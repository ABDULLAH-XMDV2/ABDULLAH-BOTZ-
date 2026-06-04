FROM node:20-bookworm-slim

# Install system dependencies
# git      → needed by npm for some packages
# ffmpeg   → media conversion
# imagemagick + webp → sticker/image processing
# python3 + make + g++ + pkg-config + libvips-dev → wa-sticker-formatter (sharp)
RUN apt-get update && \
    apt-get install -y \
    git \
    ffmpeg \
    imagemagick \
    webp \
    python3 \
    make \
    g++ \
    pkg-config \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN test -f lib/arslan.html && echo "✅ arslan.html EXISTS" || echo "❌ MISSING"

EXPOSE ${PORT:-9090}

CMD ["node", "index.js"]
