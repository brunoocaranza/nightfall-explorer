# Build Stage 1
# This build created a staging docker image

FROM node:16.17.0-alpine AS appbuild

WORKDIR /usr/src/app

RUN npm i yarn
RUN yarn global add parcel

COPY package.json ./
COPY yarn.lock ./
COPY tailwind.config.js ./
COPY ./tsconfig.json ./
COPY ./.postcssrc ./
COPY ./.parcelrc ./
COPY ./public ./public
COPY ./static ./static
COPY ./src ./src

RUN yarn
RUN yarn build


# Build Stage 2
# This build takes the production build from staging build
#
FROM nginx:alpine

WORKDIR /usr/src/app

COPY --from=appbuild /usr/src/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./set-env.sh /usr/share/nginx/html/set-env.sh

EXPOSE 80

CMD ["chmod", "777", "./set-env.sh"]
CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./set-env.sh && nginx -g 'daemon off;'"]
#CMD ["nginx", "-g", "daemon off;"]