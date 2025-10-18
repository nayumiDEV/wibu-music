# Quick Start - Web Dashboard

Hướng dẫn nhanh để bật Web Dashboard trong 5 phút!

## Bước 1: Cài đặt dependencies

```bash
npm install
```

## Bước 2: Cập nhật .env

Mở file `.env` và thêm các dòng sau:

```env
# Thông tin từ Discord Developer Portal
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret

# Session secret (tạo random string)
SESSION_SECRET=my-super-secret-key-12345

# Web server config
WEB_PORT=3000
CALLBACK_URL=http://localhost:3000/auth/discord/callback
```

### Lấy Client Secret:

1. Vào https://discord.com/developers/applications
2. Chọn application của bạn
3. Tab **OAuth2** → Copy "Client Secret"
4. Paste vào `.env`

## Bước 3: Thêm Redirect URL

Trong Discord Developer Portal:

1. Tab **OAuth2**
2. Phần **"Redirects"** → **Add Redirect**
3. Nhập: `http://localhost:3000/auth/discord/callback`
4. **Save Changes**

## Bước 4: Đăng ký commands (nếu chưa)

```bash
npm run deploy
```

## Bước 5: Chạy bot

```bash
npm start
```

Bạn sẽ thấy:
```
✅ Bot đã sẵn sàng! Đăng nhập với tên: YourBot#1234
🎵 Đã kết nối đến X server(s)
🌐 Web dashboard running on http://localhost:3000
```

## Bước 6: Truy cập Dashboard

Mở trình duyệt và vào: **http://localhost:3000**

## Xong! 🎉

Bây giờ bạn có thể:
- Đăng nhập với Discord
- Chọn server
- Điều khiển phát nhạc từ trình duyệt

---

## Xử lý lỗi nhanh

### Lỗi: "Invalid redirect_uri"
→ Kiểm tra đã thêm redirect URL trong Developer Portal chưa

### Lỗi: "Cannot find module"
→ Chạy lại `npm install`

### Không thấy server trong dashboard
→ Đảm bảo bot đã được add vào server đó

### Port 3000 đã được sử dụng
→ Đổi `WEB_PORT=3001` trong .env

---

**Cần trợ giúp thêm?** Xem [WEB_SETUP.md](WEB_SETUP.md) để biết chi tiết đầy đủ.
