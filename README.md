# Discord Music Bot

Bot Discord đa nền tảng để phát nhạc từ YouTube, Spotify, SoundCloud và nhiều nguồn khác.

## Tính năng

- 🎵 Phát nhạc từ nhiều nguồn:
  - YouTube (video và playlist)
  - Spotify (bài hát và playlist)
  - SoundCloud
  - Apple Music
  - Deezer
  - Và nhiều nguồn khác...
- 📝 Hàng đợi phát nhạc (queue)
- ⏯️ Điều khiển phát nhạc (play, pause, resume, skip, stop)
- 🔀 Shuffle và loop
- 🎚️ Điều chỉnh âm lượng
- 📊 Hiển thị bài hát đang phát
- 🌐 **Web Dashboard** - Giao diện web để điều khiển bot
  - Đăng nhập bằng Discord OAuth2
  - Điều khiển phát nhạc từ trình duyệt
  - Real-time updates qua WebSocket
  - Giao diện responsive, thân thiện

## Yêu cầu

- Node.js v16.9.0 trở lên
- FFmpeg
- Discord Bot Token

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd discord-music-bot
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example` và điền thông tin:
```bash
cp .env.example .env
```

4. Thêm thông tin Discord bot vào file `.env`:
```
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
SESSION_SECRET=your_random_session_secret_here
WEB_PORT=3000
CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

> **Lưu ý:** Để sử dụng Web Dashboard, xem hướng dẫn chi tiết trong [WEB_SETUP.md](WEB_SETUP.md)

## Cách tạo Discord Bot

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Nhấn "New Application" và đặt tên cho bot
3. Vào tab "Bot" và nhấn "Add Bot"
4. Copy token và thêm vào file `.env`
5. Bật các Privileged Gateway Intents:
   - PRESENCE INTENT
   - SERVER MEMBERS INTENT
   - MESSAGE CONTENT INTENT
6. Vào tab "OAuth2" > "URL Generator"
7. Chọn scopes: `bot`, `applications.commands`
8. Chọn permissions: `Send Messages`, `Connect`, `Speak`, `Use Voice Activity`
9. Copy URL và mời bot vào server của bạn

## Đăng ký Slash Commands

Trước khi chạy bot lần đầu, cần đăng ký các slash commands:
```bash
npm run deploy
```

## Chạy bot

```bash
npm start
```

Hoặc chạy ở chế độ development với auto-reload:
```bash
npm run dev
```

## Lệnh

### Phát nhạc
- `/play <link/tên bài hát>` - Phát nhạc từ link hoặc tìm kiếm
- `/search <tên bài hát>` - Tìm kiếm và chọn từ danh sách kết quả
- `/pause` - Tạm dừng nhạc
- `/resume` - Tiếp tục phát nhạc
- `/skip` - Bỏ qua bài hát hiện tại
- `/stop` - Dừng phát nhạc và xóa queue

### Quản lý queue
- `/queue` - Hiển thị hàng đợi phát nhạc
- `/nowplaying` - Hiển thị bài hát đang phát
- `/shuffle` - Xáo trộn queue
- `/remove <số>` - Xóa bài hát khỏi queue
- `/clear` - Xóa toàn bộ queue

### Điều chỉnh
- `/volume <0-100>` - Điều chỉnh âm lượng
- `/loop <mode>` - Bật/tắt chế độ lặp lại (off/track/queue)
- `/filters <filter>` - Áp dụng hiệu ứng âm thanh

### Khác
- `/lyrics [tên bài]` - Hiển thị lời bài hát
- `/autoplay [on/off/toggle/status]` - Tự động phát bài hát tương tự khi hàng đợi trống

## 🌐 Web Dashboard

Bot đi kèm với giao diện web dashboard hoàn chỉnh!

### Truy cập Dashboard

Sau khi chạy bot, truy cập: **http://localhost:3000**

### Tính năng Dashboard

- 🔐 Đăng nhập an toàn với Discord OAuth2
- 🎵 Điều khiển phát nhạc real-time
- 📝 Quản lý queue trực quan
- 🔊 Điều chỉnh âm lượng bằng slider
- ⚡ Cập nhật tự động qua WebSocket
- 📱 Giao diện responsive cho mobile

### Hướng dẫn cài đặt

Xem hướng dẫn chi tiết trong [WEB_SETUP.md](WEB_SETUP.md)

## Hỗ trợ

Nếu gặp vấn đề, hãy mở issue trên GitHub.

## License

MIT
