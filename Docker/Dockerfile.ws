FROM oven/bun:1

WORKDIR /usr/src/app
COPY ./packages ./packages
COPY ./bun.lock ./bun.lock

COPY ./package.json ./package.json
COPY ./turbo.json ./turbo.json

COPY ./apps/ws-server ./apps/ws-server

COPY . .

RUN bun install
RUN bun run db:generate
EXPOSE 4000
CMD ["bun","run","start:websocket"]
