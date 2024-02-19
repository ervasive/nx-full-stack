# Install dependencies only when needed
FROM docker.io/node:lts-alpine as dependencies

RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Production image, copy all the files and run fastify
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init

ENV NODE_ENV production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

# Copy installed dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy built application files
COPY ./ ./

RUN chown -R node:node .
USER node
EXPOSE 3000

# You can remove this install step if you build with `--bundle` option.
# The bundled output will include external dependencies.
CMD ["dumb-init", "node", "."]
