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

4. Thêm Discord bot token vào file `.env`:
```
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
```

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

## Hỗ trợ

Nếu gặp vấn đề, hãy mở issue trên GitHub.

## License

MIT
