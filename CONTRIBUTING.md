# Đóng góp cho dự án

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Discord Music Bot!

## Cách đóng góp

### Báo cáo lỗi

Nếu bạn tìm thấy lỗi, hãy tạo issue với các thông tin:
- Mô tả lỗi chi tiết
- Các bước để tái hiện lỗi
- Hành vi mong đợi
- Screenshots (nếu có)
- Phiên bản Node.js và hệ điều hành

### Đề xuất tính năng

Hãy tạo issue với nhãn "feature request" và mô tả:
- Tính năng bạn muốn
- Lý do tại sao tính năng này hữu ích
- Ví dụ sử dụng

### Pull Requests

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/TenTinhNang`)
3. Commit changes (`git commit -m 'Thêm tính năng X'`)
4. Push to branch (`git push origin feature/TenTinhNang`)
5. Tạo Pull Request

## Quy tắc code

- Sử dụng ES6+ syntax
- Comment code khi cần thiết
- Tên biến và hàm phải rõ ràng
- Xử lý lỗi đúng cách
- Test trước khi submit

## Cấu trúc dự án

```
discord-music-bot/
├── src/
│   ├── commands/          # Các lệnh slash commands
│   │   ├── play.js
│   │   ├── pause.js
│   │   └── ...
│   ├── index.js          # File chính
│   └── deploy-commands.js # Đăng ký commands
├── .env.example          # Template file cấu hình
├── package.json
└── README.md
```

## Thêm command mới

1. Tạo file mới trong `src/commands/`
2. Export object với cấu trúc:

```javascript
import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ten-lenh')
    .setDescription('Mô tả lệnh'),
  
  async execute(interaction) {
    // Logic của lệnh
  }
};
```

3. Chạy `npm run deploy` để đăng ký command

## Testing

Trước khi submit PR:
1. Test command trên server Discord thật
2. Kiểm tra không có lỗi trong console
3. Đảm bảo code chạy với các trường hợp edge case

## Code Review

Pull request sẽ được review dựa trên:
- Chất lượng code
- Tính hữu ích của feature
- Tài liệu và comments
- Testing

## Liên hệ

Nếu có câu hỏi, hãy mở issue hoặc discussion trên GitHub.

---

Cảm ơn vì đã đóng góp! 🎵
