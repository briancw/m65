FROM debian:jessie

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    ca-certificates \
    bzip2 \
    libfontconfig \
    curl \
    nano \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash \
  && export NVM_DIR="$HOME/.nvm" \
  && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
  && nvm install 7.8.0 \
  && npm install -g yarn
