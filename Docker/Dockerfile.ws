FROM oven/bun:1.4

WORKDIR /app

COPY package.json bun.lock ./

COPY apps/ws-server/package.json ./apps/ws-server/package.json
COPY packages/db/package.json ./packages/db/package.json

RUN bun install

COPY . .

RUN bunx prisma generate --schema=packages/db/prisma/schema.prisma

WORKDIR /app/apps/ws-server

EXPOSE 4000

CMD ["bun", "index.ts"]