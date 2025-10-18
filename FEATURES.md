# Danh sách tính năng

## 🌐 Web Dashboard

### Giao diện web đầy đủ tính năng
- ✅ **Đăng nhập Discord OAuth2** - An toàn và tiện lợi
- ✅ **Điều khiển phát nhạc** - Play, pause, skip, stop từ trình duyệt
- ✅ **Quản lý queue** - Xem và quản lý hàng đợi trực quan
- ✅ **Real-time updates** - Cập nhật tự động qua WebSocket
- ✅ **Responsive design** - Hoạt động tốt trên mọi thiết bị
- ✅ **Dark theme** - Giao diện tối giống Discord
- ✅ **Multi-server support** - Quản lý nhiều server cùng lúc

### API Endpoints
- `GET /api/queue/:guildId` - Lấy thông tin queue
- `POST /api/play/:guildId` - Phát nhạc
- `POST /api/pause/:guildId` - Tạm dừng
- `POST /api/resume/:guildId` - Tiếp tục
- `POST /api/skip/:guildId` - Bỏ qua
- `POST /api/stop/:guildId` - Dừng
- `POST /api/volume/:guildId` - Điều chỉnh âm lượng

## 🎵 Phát nhạc

### Nguồn hỗ trợ
- ✅ **YouTube** - Video và Playlist
- ✅ **Spotify** - Bài hát và Playlist  
- ✅ **SoundCloud** - Bài hát và Playlist
- ✅ **Apple Music** - Bài hát và Playlist
- ✅ **Deezer** - Bài hát và Playlist
- ✅ **Reverbnation** - Bài hát
- ✅ **URL trực tiếp** - MP3, M4A, WebM, WAV, OGG

### Các lệnh phát nhạc
| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `/play <query>` | Phát nhạc từ link hoặc tìm kiếm | `/play never gonna give you up` |
| `/search <query>` | Tìm kiếm và chọn từ danh sách | `/search counting stars` |
| `/pause` | Tạm dừng nhạc | `/pause` |
| `/resume` | Tiếp tục phát nhạc | `/resume` |
| `/skip` | Bỏ qua bài hiện tại | `/skip` |
| `/stop` | Dừng và xóa hàng đợi | `/stop` |

## 📝 Quản lý hàng đợi

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `/queue` | Xem hàng đợi | `/queue` |
| `/nowplaying` | Xem bài đang phát | `/nowplaying` |
| `/remove <vị trí>` | Xóa bài khỏi queue | `/remove 3` |
| `/clear` | Xóa toàn bộ queue | `/clear` |
| `/shuffle` | Xáo trộn queue | `/shuffle` |

## 🎚️ Điều khiển

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `/volume <0-100>` | Điều chỉnh âm lượng | `/volume 75` |
| `/loop <mode>` | Lặp lại (off/track/queue) | `/loop track` |
| `/filters <filter>` | Áp dụng hiệu ứng âm thanh | `/filters bassboost` |
| `/autoplay <on/off/toggle/status>` | Tự động phát bài hát tương tự khi queue trống | `/autoplay on` |

## 🎨 Hiệu ứng âm thanh

- **8D** - Âm thanh xoay vòng
- **Bass Boost** - Tăng bass
- **Nightcore** - Tăng tốc độ và pitch
- **Vaporwave** - Giảm tốc độ
- **Karaoke** - Loại bỏ vocal
- **Tremolo** - Rung âm lượng
- **Vibrato** - Rung tần số
- **Reverse** - Phát ngược
- **Treble** - Tăng treble

## 📊 Thông tin bài hát

| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `/lyrics [tên bài]` | Hiển thị lời bài hát | `/lyrics` |
| `/nowplaying` | Thông tin chi tiết | `/nowplaying` |

## ⚙️ Cấu hình tự động

- ✅ Tự động rời khi kết thúc playlist
- ✅ Tự động rời khi không còn ai trong voice channel (sau 5 phút)
- ✅ Tự động deafen (tự tắt mic)
- ✅ Âm lượng mặc định: 50%

## 🎯 Định dạng link hỗ trợ

### YouTube
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/playlist?list=PLAYLIST_ID
```

### Spotify
```
https://open.spotify.com/track/TRACK_ID
https://open.spotify.com/playlist/PLAYLIST_ID
https://open.spotify.com/album/ALBUM_ID
```

### SoundCloud
```
https://soundcloud.com/artist/track
https://soundcloud.com/artist/sets/playlist
```

### Apple Music
```
https://music.apple.com/album/ALBUM_ID
https://music.apple.com/playlist/PLAYLIST_ID
```

## 🔍 Tìm kiếm thông minh

Bot tự động nhận diện:
- Link trực tiếp → Phát ngay
- Từ khóa → Tìm kiếm trên YouTube
- Playlist → Thêm tất cả vào queue

## 🌟 Tính năng nổi bật

1. **Hỗ trợ playlist** - Thêm cả playlist vào queue chỉ với một lệnh
2. **Âm thanh chất lượng cao** - Tự động chọn chất lượng tốt nhất
3. **Giao diện đẹp mắt** - Embed với thumbnail và thông tin đầy đủ
4. **Ổn định** - Xử lý lỗi tốt, không bị crash
5. **Đa nguồn** - Không bị giới hạn bởi một nền tảng
6. **Hiệu ứng âm thanh** - 10+ hiệu ứng để thử nghiệm
7. **Tìm lời bài hát** - Tích hợp tìm kiếm lyrics

## 🚀 Sắp ra mắt

- [ ] Hỗ trợ radio stations
- [ ] Lưu playlist cá nhân
- [ ] Vote skip
- [ ] DJ role
- [ ] Web dashboard
- [ ] Thống kê nghe nhạc
