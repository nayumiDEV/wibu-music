# Hướng dẫn xử lý lỗi

## Lỗi thường gặp

### 1. Bot không khởi động

#### Lỗi: "Invalid token"
```
Error: An invalid token was provided
```

**Giải pháp:**
- Kiểm tra DISCORD_TOKEN trong file .env
- Đảm bảo không có khoảng trắng thừa
- Reset token mới từ Discord Developer Portal
- Đảm bảo file .env nằm ở thư mục gốc dự án

#### Lỗi: "Cannot find module"
```
Error: Cannot find module 'discord.js'
```

**Giải pháp:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Slash commands không hiện

**Nguyên nhân:**
- Chưa đăng ký commands
- Discord cache cũ
- Thiếu quyền

**Giải pháp:**
```bash
npm run deploy
```

Sau đó:
- Đợi vài phút để Discord cập nhật
- Đăng xuất và đăng nhập lại Discord
- Reload Discord (Ctrl+R trên desktop)

### 3. Bot không phát nhạc

#### Lỗi: "Missing Access"
**Giải pháp:**
- Kiểm tra bot có trong voice channel
- Kiểm tra quyền "Connect" và "Speak" của bot
- Đảm bảo voice channel không bị giới hạn người dùng

#### Lỗi: "FFmpeg not found"
**Giải pháp Windows:**
```bash
# Bot sẽ tự động sử dụng ffmpeg-static
# Hoặc cài FFmpeg thủ công
```

**Giải pháp Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Giải pháp macOS:**
```bash
brew install ffmpeg
```

#### Lỗi: "No extractor found"
**Giải pháp:**
```bash
npm install discord-player-youtubei @discord-player/extractor
```

### 4. Lỗi khi phát từ Spotify

**Lưu ý:** Bot phát nhạc Spotify bằng cách tìm kiếm trên YouTube
- Tên bài hát có thể không khớp 100%
- Một số bài hát có thể không tìm thấy

**Giải pháp:**
- Sử dụng link YouTube trực tiếp cho chất lượng tốt nhất
- Hoặc tìm kiếm thủ công với `/search`

### 5. Bot bị lag hoặc chậm

**Nguyên nhân:**
- Mạng chậm
- CPU yếu
- Quá nhiều bot trên server

**Giải pháp:**
- Giảm âm lượng xuống 50-70%
- Không sử dụng nhiều filters cùng lúc
- Upgrade server nếu đang host
- Sử dụng VPS tốt hơn

### 6. Bot bị disconnect

**Nguyên nhân:**
- Mất kết nối internet
- Discord API issues
- Voice gateway timeout

**Giải pháp:**
```bash
# Sử dụng PM2 để auto-restart
npm install -g pm2
pm2 start src/index.js --name music-bot
pm2 startup
pm2 save
```

### 7. Lyrics không tìm thấy

**Nguyên nhân:**
- Bài hát quá mới hoặc không phổ biến
- Tên bài hát không chính xác

**Giải pháp:**
- Sử dụng `/lyrics <tên bài hát chính xác>`
- Thêm tên nghệ sĩ: `/lyrics never gonna give you up rick astley`

### 8. Filters không hoạt động

**Nguyên nhân:**
- FFmpeg không có filters plugin
- Bài hát đang stream

**Giải pháp:**
- Cài FFmpeg đầy đủ (không dùng static)
- Một số filters có thể không tương thích với một số nguồn

### 9. Queue bị mất

**Nguyên nhân:**
- Bot restart
- Lỗi player

**Lưu ý:** 
- Queue chỉ lưu trong memory
- Sẽ mất khi bot restart
- Đây là hành vi bình thường

### 10. Privileged Gateway Intents error

```
Error: Privileged intent provided is not enabled or whitelisted
```

**Giải pháp:**
1. Vào [Discord Developer Portal](https://discord.com/developers/applications)
2. Chọn bot của bạn
3. Vào tab "Bot"
4. Bật các intents:
   - ✅ PRESENCE INTENT
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
5. Save changes
6. Restart bot

## Debugging

### Xem logs chi tiết

Thêm vào file .env:
```env
DEBUG=discord-player:*
```

### Kiểm tra Node.js version
```bash
node --version
# Cần >= v16.9.0
```

### Test kết nối Discord
```bash
node -e "console.log(require('discord.js').version)"
```

### Kiểm tra FFmpeg
```bash
ffmpeg -version
```

## Báo cáo lỗi

Khi báo cáo lỗi, hãy cung cấp:

1. **Mô tả lỗi** - Lỗi gì xảy ra?
2. **Các bước tái hiện** - Làm thế nào để lỗi xảy ra?
3. **Logs** - Copy toàn bộ error message
4. **Môi trường:**
   - Hệ điều hành
   - Node.js version
   - npm version
5. **Screenshots** - Nếu có

## Liên hệ hỗ trợ

- GitHub Issues: [Tạo issue mới]
- Discord Support Server: [Link server]

## Tips để tránh lỗi

1. ✅ Luôn cập nhật dependencies mới nhất
2. ✅ Đọc kỹ error messages
3. ✅ Kiểm tra logs thường xuyên
4. ✅ Test trên máy local trước khi deploy
5. ✅ Backup file .env
6. ✅ Sử dụng PM2 cho production
7. ✅ Giữ bot token bí mật
8. ✅ Không commit file .env lên GitHub

## Performance Tips

### Tối ưu memory
```javascript
// Trong src/index.js, thêm:
process.setMaxListeners(20);
```

### Giảm CPU usage
- Giảm âm lượng mặc định xuống 40-50%
- Tắt filters khi không dùng
- Giới hạn độ dài queue

### Network optimization
- Sử dụng server có kết nối tốt
- Cân nhắc dùng CDN cho cache
- Chọn region gần với Discord server

## Cập nhật Bot

```bash
# Backup trước
cp -r . ../discord-music-bot-backup

# Pull updates
git pull

# Update dependencies
npm install

# Redeploy commands
npm run deploy

# Restart bot
pm2 restart music-bot
# hoặc
npm start
```

---

Nếu vẫn gặp vấn đề, hãy mở issue với đầy đủ thông tin!
