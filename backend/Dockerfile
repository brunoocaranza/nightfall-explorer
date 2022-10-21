# Build Stage 1
# This build created a staging docker image

FROM node:16.17.0-alpine AS appbuild

WORKDIR /usr/src/app

COPY package.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./
COPY ./src ./src

RUN npm i 

RUN npm run build \
    && npm prune --production


# Build Stage 2
# This build takes the production build from staging build
#
FROM node:16.17.0-alpine

WORKDIR /usr/src/app

COPY --from=appbuild /usr/src/app/node_modules ./node_modules
COPY --from=appbuild /usr/src/app/package.json ./
COPY --from=appbuild /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
