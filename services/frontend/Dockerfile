# ---------- 1. Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# 1.1  Cài các gói – dùng npm install vì không có package-lock.json
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 1.2  Copy source & build
COPY . .
RUN npm run build    # tạo thư mục dist/

# ---------- 2. Production stage ----------
FROM nginx:1.27-alpine AS production
# Copy file build sang nginx html
COPY --from=builder /app/dist /usr/share/nginx/html

# Tùy chọn: copy nginx.conf riêng (nếu có)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
