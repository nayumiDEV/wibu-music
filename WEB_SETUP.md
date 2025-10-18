# Hướng dẫn cài đặt Web Dashboard

Web dashboard cho phép bạn điều khiển bot Discord Music từ trình duyệt với giao diện thân thiện.

## Tính năng

- 🔐 Đăng nhập bằng Discord OAuth2
- 🎵 Điều khiển phát nhạc real-time
- 📝 Xem và quản lý queue
- 🔊 Điều chỉnh âm lượng
- ⚡ Cập nhật trạng thái live qua WebSocket
- 📱 Responsive design

## Yêu cầu bổ sung

Các dependencies đã được thêm vào `package.json`:
- express
- express-session
- passport
- passport-discord
- socket.io
- ejs

## Cấu hình

### 1. Cập nhật file .env

Thêm các biến môi trường sau vào file `.env`:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
SESSION_SECRET=your_random_session_secret_here
WEB_PORT=3000
CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

### 2. Lấy Discord Client Secret

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Chọn application của bot
3. Vào tab **OAuth2**
4. Nhấn **"Reset Secret"** hoặc copy secret có sẵn
5. Thêm vào file `.env` ở dòng `DISCORD_CLIENT_SECRET`

### 3. Thêm Redirect URL

Trong Discord Developer Portal:
1. Vào tab **OAuth2**
2. Phần **"Redirects"**, nhấn **"Add Redirect"**
3. Thêm: `http://localhost:3000/auth/discord/callback`
4. Nếu deploy lên server, thêm URL production: `https://yourdomain.com/auth/discord/callback`
5. Nhấn **"Save Changes"**

### 4. Tạo Session Secret

Tạo một chuỗi ngẫu nhiên cho SESSION_SECRET. Bạn có thể dùng lệnh:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Hoặc đơn giản là một chuỗi ngẫu nhiên dài:
```
SESSION_SECRET=my-super-secret-key-change-this-in-production
```

## Chạy Web Dashboard

```bash
npm install
npm run deploy  # Đăng ký slash commands (nếu chưa)
npm start
```

Bot sẽ tự động khởi động cả Discord bot và web server.

Truy cập: **http://localhost:3000**

## Cấu trúc thư mục

```
src/
├── web/
│   ├── server.js           # Express server & Socket.io
│   ├── public/
│   │   └── css/
│   │       └── style.css   # Styles
│   └── views/
│       ├── index.ejs       # Trang chủ
│       ├── login.ejs       # Trang đăng nhập
│       ├── dashboard.ejs   # Dashboard - chọn server
│       └── server.ejs      # Điều khiển nhạc
```

## Sử dụng

### 1. Đăng nhập

- Truy cập http://localhost:3000
- Nhấn **"Đăng nhập với Discord"**
- Cho phép ứng dụng truy cập thông tin Discord của bạn

### 2. Chọn Server

Sau khi đăng nhập, bạn sẽ thấy danh sách các server mà:
- Bạn là thành viên
- Bot đã được thêm vào

### 3. Điều khiển nhạc

Trong trang server:
- **Phát nhạc**: Nhập link hoặc tên bài hát và nhấn "Phát nhạc"
- **Pause/Resume**: Nhấn nút giữa
- **Skip**: Nhấn nút tiếp theo
- **Stop**: Dừng phát và xóa queue
- **Volume**: Kéo thanh âm lượng
- **Queue**: Xem danh sách bài hát đang chờ

### 4. Real-time Updates

Dashboard tự động cập nhật khi:
- Có bài hát mới được phát
- Có bài hát được thêm vào queue
- Queue kết thúc

## API Endpoints

Dashboard cung cấp các API endpoints:

### GET /api/queue/:guildId
Lấy thông tin queue hiện tại

### POST /api/play/:guildId
```json
{
  "query": "never gonna give you up"
}
```

### POST /api/pause/:guildId
Tạm dừng nhạc

### POST /api/resume/:guildId
Tiếp tục phát nhạc

### POST /api/skip/:guildId
Bỏ qua bài hát hiện tại

### POST /api/stop/:guildId
Dừng và xóa queue

### POST /api/volume/:guildId
```json
{
  "volume": 75
}
```

## WebSocket Events

### Client -> Server
- `subscribe` - Đăng ký nhận updates cho một guild

### Server -> Client
- `trackStart` - Bài hát mới bắt đầu
- `trackAdd` - Bài hát được thêm vào queue
- `queueEnd` - Queue kết thúc

## Deploy lên Production

### Cập nhật biến môi trường

```env
WEB_PORT=3000
CALLBACK_URL=https://yourdomain.com/auth/discord/callback
SESSION_SECRET=use-a-strong-random-secret-here
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### PM2 (khuyên dùng)

```bash
pm2 start src/index.js --name discord-music-bot
pm2 save
pm2 startup
```

### Docker

Dockerfile đã được cấu hình sẵn. Thêm port 3000:

```yaml
# docker-compose.yml
services:
  discord-bot:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
```

Chạy:
```bash
docker-compose up -d
```

## Bảo mật

⚠️ **Quan trọng:**

1. **Không commit file .env** lên git
2. **Sử dụng HTTPS** trong production
3. **Đổi SESSION_SECRET** thành chuỗi ngẫu nhiên mạnh
4. **Giới hạn rate limit** nếu cần thiết
5. **Kiểm tra permissions** trước khi cho phép điều khiển

## Xử lý lỗi

### "Missing Access" khi đăng nhập
- Kiểm tra DISCORD_CLIENT_SECRET đúng
- Kiểm tra Redirect URL đã thêm trong Developer Portal

### "No guilds showing"
- Đảm bảo bot đã được thêm vào server
- Đăng nhập với tài khoản là thành viên của server đó

### WebSocket không kết nối
- Kiểm tra firewall không chặn port 3000
- Kiểm tra proxy configuration nếu dùng Nginx

### "You need to be in a voice channel"
- Tham gia voice channel trước khi phát nhạc từ web

## Tùy chỉnh

### Thay đổi theme
Chỉnh sửa file `src/web/public/css/style.css`

### Thêm tính năng
Xem code trong `src/web/server.js` để thêm endpoints mới

### Custom authentication
Chỉnh sửa middleware `checkAuth` trong `server.js`

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs console
2. Xem browser console cho lỗi frontend
3. Đảm bảo tất cả dependencies đã cài đặt: `npm install`
4. Kiểm tra file .env đã cấu hình đúng

---

Chúc bạn sử dụng vui vẻ! 🎵
