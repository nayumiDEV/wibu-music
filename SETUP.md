# Hướng dẫn cài đặt chi tiết

## Bước 1: Cài đặt Node.js

Đảm bảo bạn đã cài đặt Node.js phiên bản 16.9.0 trở lên:
```bash
node --version
```

Nếu chưa có, tải và cài đặt từ [nodejs.org](https://nodejs.org/)

## Bước 2: Cài đặt FFmpeg

### Windows
1. Tải FFmpeg từ [ffmpeg.org](https://ffmpeg.org/download.html)
2. Giải nén và thêm vào PATH
3. Hoặc bot sẽ tự động cài đặt ffmpeg-static

### macOS
```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

## Bước 3: Tạo Discord Bot

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Nhấn **"New Application"**
3. Đặt tên cho bot (ví dụ: "Music Bot")
4. Chấp nhận điều khoản và nhấn **"Create"**

### Cấu hình Bot

1. Vào tab **"Bot"** ở menu bên trái
2. Nhấn **"Add Bot"** và xác nhận
3. Bật các **Privileged Gateway Intents**:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT  
   - ✅ MESSAGE CONTENT INTENT
4. Nhấn **"Reset Token"** và sao chép token
   - ⚠️ **Quan trọng**: Giữ token này bí mật!

### Mời Bot vào Server

1. Vào tab **"OAuth2"** > **"URL Generator"**
2. Chọn **Scopes**:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Chọn **Bot Permissions**:
   - ✅ Send Messages
   - ✅ Send Messages in Threads
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Use External Emojis
   - ✅ Add Reactions
   - ✅ Connect
   - ✅ Speak
   - ✅ Use Voice Activity
4. Copy URL và mở trong trình duyệt
5. Chọn server và nhấn **"Authorize"**

## Bước 4: Cấu hình Bot

1. Clone hoặc tải repository về máy
2. Mở terminal/command prompt trong thư mục project
3. Cài đặt dependencies:
```bash
npm install
```

4. Tạo file `.env`:
```bash
cp .env.example .env
```

5. Mở file `.env` và điền thông tin:
```env
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
```

**Lấy Client ID:**
- Vào Discord Developer Portal
- Chọn application của bạn
- Vào tab "General Information"
- Copy "Application ID"

## Bước 5: Đăng ký Slash Commands

Chạy lệnh sau để đăng ký các slash commands:
```bash
npm run deploy
```

Bạn sẽ thấy thông báo: `✅ Đã đăng ký thành công X slash commands!`

## Bước 6: Khởi chạy Bot

```bash
npm start
```

Nếu thành công, bạn sẽ thấy:
```
✅ Bot đã sẵn sàng! Đăng nhập với tên: YourBotName#1234
🎵 Đã kết nối đến X server(s)
```

## Kiểm tra

1. Vào server Discord nơi bạn đã mời bot
2. Tham gia một voice channel
3. Gõ `/play` và thử phát một bài hát:
   - `/play never gonna give you up`
   - `/play https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - `/play https://open.spotify.com/track/...`

## Xử lý lỗi thường gặp

### Lỗi: "Invalid token"
- Kiểm tra lại DISCORD_TOKEN trong file .env
- Đảm bảo không có khoảng trắng thừa
- Reset token mới từ Developer Portal

### Lỗi: "Missing Access"
- Kiểm tra bot có đủ quyền trong server
- Đảm bảo đã bật các Privileged Gateway Intents

### Lỗi: "Cannot find module"
- Chạy lại `npm install`
- Xóa folder `node_modules` và chạy lại `npm install`

### Không thấy slash commands
- Chạy lại `npm run deploy`
- Đợi vài phút để Discord cập nhật
- Đăng xuất và đăng nhập lại Discord

### Bot không phát nhạc
- Kiểm tra bot có trong voice channel không
- Kiểm tra quyền "Connect" và "Speak"
- Xem logs để biết lỗi cụ thể

## Chạy bot 24/7

### Sử dụng PM2 (khuyên dùng)
```bash
npm install -g pm2
pm2 start src/index.js --name music-bot
pm2 save
pm2 startup
```

### Hosting miễn phí
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Replit](https://replit.com/)
- [Heroku](https://www.heroku.com/) (có phí)

## Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs để xem lỗi cụ thể
2. Tìm kiếm lỗi trên Google
3. Mở issue trên GitHub repository
