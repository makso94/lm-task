FROM --platform=$BUILDPLATFORM node:20-bookworm-slim as node
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# General system staff
RUN apt update && apt upgrade -y
RUN apt install -y curl tmux git locales iputils-ping wget gnupg build-essential

# Clean up
RUN apt clean && apt autoremove -y && rm -rf /var/lib/apt/lists/*

# Locales
RUN echo 'Europe/Skopje' > /etc/timezone
ENV TZ=Europe/Skopje
RUN echo 'en_US.UTF-8 UTF-8' > /etc/locale.gen
RUN locale-gen

# Frontend environment tools
RUN npm i -g @angular/cli@18

# Prepare dependencies path on the target
RUN mkdir -p /opt/node/node_modules && chown -R node:node /opt/node
RUN mkdir -p /project/webapp && chown -R node:node /project

# ---------------------------------- Angular Dev ------------------------------------
FROM node as dev
SHELL ["/bin/bash", "-c"]

# Switch to user
USER node:node

# Keep VS code server settings in volumes so that we can
# avoid reinstalls
RUN mkdir -p /home/node/.vscode-server /home/node/.local \
    && chmod 777 /home/node/.vscode-server /home/node/.local \
    && chmod ug+s /home/node/.vscode-server /home/node/.local

# Setup NPM
ADD --chown=node:node webapp/package.json /opt/node
ADD --chown=node:node webapp/package-lock.json /opt/node
RUN cd /opt/node && npm i && npm cache clean --force

WORKDIR /project/webapp
