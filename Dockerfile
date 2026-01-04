# Base Image
FROM node:lts-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable

# Install dependencies
FROM base AS deps
COPY package.json .
COPY pnpm-lock.yaml .
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile

# Build
FROM deps AS build
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_BACKEND_BASE_URL
ARG VITE_ALLOWED_EMAIL_DOMAINS
RUN pnpm run build

# Production
FROM nginx:stable-alpine AS production

# Copia los archivos estáticos generados por Vite a la ubicación de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]