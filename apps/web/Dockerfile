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

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# In standalone mode, Next.js creates output in .next/standalone
# Copy entire standalone directory which includes server.js and node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./

# Copy static files - they must be accessible as .next/static relative to server.js
# In standalone mode for monorepo, server.js may be in apps/web/ subdirectory
# Copy static to both root .next and potential apps/web/.next locations
RUN mkdir -p .next apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
RUN chown -R nextjs:nodejs .next apps/web/.next 2>/dev/null || true

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# In standalone mode, Next.js creates server.js in the root of standalone output
# For monorepo it might be in apps/web/server.js  
# Find server.js and run it from its directory so .next/static is accessible
CMD ["sh", "-c", "cd /app && SERVER=$(find . -name 'server.js' -type f -not -path '*/node_modules/*' | head -1) && if [ -z \"$SERVER\" ]; then echo 'Error: server.js not found'; exit 1; fi && cd \"$(dirname \"$SERVER\")\" && node \"$(basename \"$SERVER\")\""]
