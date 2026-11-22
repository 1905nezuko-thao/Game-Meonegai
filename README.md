# Mèo Né Gai (Phiên Bản Nâng Cấp Toàn Diện)

Dự án game sinh tồn phản xạ 2D nâng cấp từ nguyên mẫu Figma (`https://admin-fast-09943863.figma.site/`).

---

## 🌟 Những nâng cấp nổi bật

### 1. Cơ chế lối chơi (Gameplay & Mechanics)
- **Hệ Thống Tim (Mạng Sống):**
  - Mèo có các trái tim hiển thị trực quan dạng ❤️❤️❤️ trên màn hình.
  - Mỗi lần va phải gai hoặc đạn boss: Mất 1 tim, kèm **1.6 giây chớp nháy bất tử (i-frame)** để kịp thời tháo chạy, không bị chết oan dồn dập.
  - Khi hết tim mới kết thúc màn chơi.
- **Bảng Tùy Chọn Cài Đặt (Game Settings Panel):**
  - Nhấn nút **⚙️ Tùy chọn** ở góc trên hoặc trên màn hình bắt đầu.
  - Tùy chỉnh **Số lượng tim** (1, 3, 5 hoặc từ 1 đến 9 tim).
  - Tùy chỉnh **Độ khó** (Dễ, Vừa, Khó, Ác mộng hoặc kéo tùy chỉnh số khối neon và số lượng Boss 1-3 con).
  - Tùy chỉnh **Thời gian Boss xuất hiện** (15s, 30s, 60s, 90s hoặc tùy ý từ 10s đến 150s).
- **Kỹ năng Lướt (Dash / Dodge Roll):**
  - Nhấn `Space` hoặc `Shift` (hoặc nút **LƯỚT** trên điện thoại).
  - Tăng tốc vọt 2.6x trong 0.22 giây, bất tử xuyên qua gai và khối lập phương!
  - Cooldown 2.2 giây có thanh HUD hiển thị tiến độ và hiệu ứng sáng khi sẵn sàng.
- **Vật phẩm rơi ngẫu nhiên (Pickups):**
  - 🐟 **Cá hồi vàng:** Cộng ngay +50 điểm.
  - 🥫 **Lon Pate thơm ngon:** Cộng ngay +100 điểm.
  - 🛡️ **Khiên bảo vệ (Shield):** Đỡ được 1 lần va chạm chí mạng vào gai hoặc khối chướng ngại vật.
  - ⏱️ **Đồng hồ cát (Slow-Mo):** Làm chậm tốc độ các chướng ngại vật 50% trong 5 giây.
  - 🌿 **Cỏ mèo (Catnip Frenzy):** Thu nhỏ kích thước mèo 30% và tăng tốc 35% trong 6 giây, luồn lách cực đã!
- **Điểm Thưởng Né Sát (Near-Miss Bonus):**
  - Lướt sát mép khối nảy trong gang tấc (<15px) được cộng ngay `+15 điểm` kèm hiệu ứng ngôi sao và âm thanh ting-ting.

### 2. Thử thách theo giai đoạn & ĐẠI CHIẾN BOSS
- **Mốc 15s+:** Xuất hiện **Tia Laser cảnh báo** (đường đỏ nhấp nháy 1.4s kèm tiếng bíp trước khi phóng luồng năng lượng thiêu đốt).
- **Mốc 32s+:** Xuất hiện thêm **Khối chướng ngại vật thứ 3 (Neon Gold Spinner)** xoay cực nhanh.
- **MỐC 600 ĐIỂM - ĐẠI BOSS XUẤT HIỆN: CHÓ ROBOT CYBER (HP: 600/600):**
  - Còi báo động hú vang, thanh máu Boss đỏ rực xuất hiện trên đầu màn hình.
  - **Mèo tự động trang bị Súng Laser Plasma:** Có tia ngắm laser chiếu thẳng vào Boss, tự động xả đạn liên thanh 6 viên/giây `pew! pew!` giáng đòn chí mạng `-15`, `CRIT! -30`.
  - **Kỹ năng của Boss:**
    - Lao thẳng như tên bắn về phía mèo (báo trước 1.1s, phải dùng **LƯỚT** để né!).
    - Bắn tỏa 7 tia đạn gai xung quanh.
  - **Phần thưởng hạ gục Boss:** Nổ tung màn hình, tặng ngay **+1000 ĐIỂM THƯỞNG** và rớt ra 3 hộp quà quý (Pate, Cá, Khiên)!

### 3. Âm thanh sống động (Web Audio API Synthesizer)
- 🐱 Tiếng mèo kêu *Meow~* ngọt ngào khi bắt đầu và khi đổi skin.
- 😿 Tiếng mèo kêu thảng thốt khi thua cuộc.
- ⚡ Tiếng vút gió *Whoosh* khi kích hoạt kỹ năng Lướt.
- 🛡️ Tiếng nổ vỡ *Crack* khi khiên bảo hộ hấp thụ cú va chạm.
- 🎵 Nhạc nền Lo-fi / 8-bit Chiptune nhịp nhàng, có nút Bật/Tắt âm thanh tiện lợi.

### 4. Hệ thống Skin & Thiết kế (Visuals)
- **Mở khóa sẵn toàn bộ 6 skin mèo** từ đầu:
  1. Mèo mướp vàng (Tabby)
  2. Mèo tam thể (Calico)
  3. Mèo đen mắt hổ phách (Black Cat)
  4. Mèo tuxedo áo vest (Tuxedo)
  5. Mèo Xiêm mắt xanh (Siamese)
  6. Mèo mướp xám (Gray Tabby)
- Hiệu ứng vệt bóng ma (Ghost Trail) khi lướt.
- Hiệu ứng rung màn hình (Screen Shake) chân thực khi va chạm hoặc lướt nhanh.
- Pháo hoa và âm thanh chúc mừng khi phá kỷ lục cá nhân.

### 5. Tối ưu cho thiết bị di động & máy tính bảng (Mobile & Tablet Ready)
- **Cần gạt ảo Analog 360°:** Rê ngón cái linh hoạt mọi hướng, có dead-zone và hiệu ứng sáng neon khi chạm.
- **Phím chữ thập D-Pad cảm ứng trượt:** Chuyển đổi nhanh giữa Cần gạt và D-Pad, hỗ trợ vuốt liên tục giữa các phím.
- **Nút Lướt công thái học:** Nút tròn to ở góc phải kèm hiệu ứng hồi chiêu và rung phản hồi xúc giác (Haptic Feedback).
- **Chế độ Toàn màn hình (⛶):** Ẩn thanh công cụ trình duyệt chỉ với 1 chạm.
- **Tự động thích ứng xoay ngang (Cockpit Mode):** Xoay ngang điện thoại để vào giao diện tay cầm console chuyên nghiệp.

---

## 🎮 Hướng dẫn điều khiển

| Thiết bị | Di chuyển | Kỹ năng Lướt (Dash) | Toàn màn hình | Bắt đầu / Chơi lại |
| :--- | :--- | :--- | :--- | :--- |
| **Máy tính (PC/Laptop)** | `WASD` hoặc `← ↑ ↓ →` | `Space` hoặc `Shift` | Nút `⛶` trên thanh công cụ | `Enter` hoặc `Space` |
| **Điện thoại / Tablet** | Cần gạt ảo 360° hoặc D-Pad | Nút tròn **LƯỚT** | Nút `⛶` trên thanh công cụ | Chạm nút trên màn hình |

---

## 🚀 Hướng dẫn khởi chạy & Đưa lên GitHub

### Cách chạy cục bộ:
1. Nhấp đúp vào file `start_game.bat` hoặc mở trực tiếp file `index.html` bằng trình duyệt web bất kỳ.
2. Không cần cài đặt `npm`, `node_modules` hay bất kỳ thư viện ngoài nào (100% Native Web).

### Các lệnh để khởi tạo và push lên GitHub:
```bash
# 1. Khởi tạo kho lưu trữ Git
git init

# 2. Thêm tất cả các file vào danh sách theo dõi
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: hoàn thiện game Mèo Né Gai nâng cấp toàn diện (Boss battle, Mobile Joystick, Settings)"

# 4. Đổi tên nhánh mặc định thành main
git branch -M main

# 5. Liên kết tới repository GitHub của bạn (thay URL bằng link repo thật)
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git

# 6. Đẩy mã nguồn lên GitHub
git push -u origin main
```

### Triển khai lên Vercel (Khuyên dùng - Đường link đẹp & siêu nhanh):
1. Đăng nhập vào [vercel.com](https://vercel.com/) bằng tài khoản GitHub của bạn.
2. Nhấn nút **Add New...** > chọn **Project**.
3. Chọn kho lưu trữ `meo-ne-gai` và nhấn **Import**.
4. Giữ nguyên toàn bộ cấu hình mặc định (dự án đã tích hợp sẵn file `vercel.json` tối ưu bảo mật & bộ nhớ đệm) > Nhấn **Deploy**.
5. Sau 10 - 15 giây, trò chơi sẽ sẵn sàng tại địa chỉ `https://<ten-repo>.vercel.app`!

### Hoặc bật chơi trực tuyến miễn phí với GitHub Pages:
1. Vào repository trên GitHub > bấm **Settings** (Cài đặt).
2. Chọn mục **Pages** ở thanh menu bên trái.
3. Ở phần **Branch**, chọn nhánh `main` và thư mục `/ (root)` rồi nhấn **Save**.
4. Chờ 1 phút, GitHub sẽ tạo đường link trực tiếp (ví dụ `https://<ten-user>.github.io/<ten-repo>/`) để bạn bè và người thân có thể bấm vào chơi ngay trên cả máy tính lẫn điện thoại!
