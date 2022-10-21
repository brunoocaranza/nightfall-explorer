# Build Stage 1
# This build created a staging docker image

FROM node:16.17.0-alpine AS appbuild

WORKDIR /app

COPY package.json ./
COPY ./src ./src
RUN npm install -g npm@8.19.2
RUN npm i 

RUN npm prune --production


# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16.17.0-alpine

WORKDIR /app

COPY --from=appbuild /app/node_modules ./node_modules
COPY --from=appbuild /app/package.json ./
COPY --from=appbuild /app/src ./src

CMD ["node", "src/index.mjs"]