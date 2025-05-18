# Sử dụng Node.js LTS làm image base
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package*.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Lắng nghe port 3000 (hoặc port app của bạn)
EXPOSE 3000

# Command khởi chạy ứng dụng
CMD ["npm", "start"]
