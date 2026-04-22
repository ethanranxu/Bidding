# ---------- Base Stage ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Deps Stage ----------
FROM base AS deps
# Alpine 上安装 libc6 兼容库
RUN apk add --no-cache libc6-compat

WORKDIR /app

# 安装依赖
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Builder Stage ----------
FROM base AS builder
WORKDIR /app

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制源代码
COPY . .

# 构建 Next.js 项目
RUN npm run build

# ---------- Runner Stage ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制构建结果
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# ✅ 复制依赖到 runner
COPY --from=deps /app/node_modules ./node_modules

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3001
ENV PORT=3001

# 启动命令
CMD ["node", "server.js"]
