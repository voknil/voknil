FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files (build context should be root of monorepo)
# Copy root package.json first
COPY package.json package-lock.json* ./

# Copy entire apps/web directory structure
COPY apps/web ./apps/web

# Install dependencies for monorepo (installs all workspace dependencies)
RUN npm ci || npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy all files needed for build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Copy app source code
COPY apps/web ./apps/web

# Set working directory to app for build
WORKDIR /app/apps/web

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/apps/web/public ./public

# Set the correct permission for prerender cache
RUN mkdir -p .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# In standalone mode, Next.js creates output in .next/standalone
# For monorepo, the structure may preserve the apps/web path
# Copy entire standalone directory which includes server.js and node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# In standalone mode, Next.js creates server.js in the root of standalone output
# But for monorepo it might be in apps/web/server.js
# List files to debug if needed: ls -la /app/ or find /app -name server.js
CMD ["sh", "-c", "cd /app && (node server.js 2>/dev/null || node apps/web/server.js || find . -name 'server.js' -type f | head -1 | xargs node)"]
