FROM node:12 AS build-app
WORKDIR /app
COPY app/package.json app/package-lock.json app/tsconfig.json /app/
COPY app/src /app/src
COPY app/public /app/public
RUN npm ci
RUN npm run build

FROM node:12 AS build-api
WORKDIR /app
COPY api/package.json api/package-lock.json api/tsconfig.json /app/
COPY api/src /app/src
RUN npm ci
RUN npm run build

FROM node:12
WORKDIR /app
COPY --from=build-app /app/build /app/build
COPY --from=build-api /app/lib /app/lib
COPY --from=build-api /app/node_modules /app/node_modules
CMD node lib/index.js

