FROM node:14-bullseye-slim AS build
LABEL maintainer="Jaime Leonardo Suncin Cruz <leosuncin@gmail.com>"

WORKDIR /var/cache/backend

RUN npm i -g @vercel/ncc && chown node:node /var/cache/backend

USER node

ENV RUNTIME_DOWNLOAD=false

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build && ncc build dist/app.js -o build --target es2020

FROM gcr.io/distroless/nodejs:14 AS app
LABEL maintainer="Jaime Leonardo Suncin Cruz <leosuncin@gmail.com>"

ARG NODE_ENV="production"

ENV NODE_ENV=${NODE_ENV}

WORKDIR /srv/app

COPY --from=build /var/cache/backend/dist/health-check.js .
COPY --from=build /var/cache/backend/build/* ./

EXPOSE 1337

CMD ["/srv/app/index.js"]
