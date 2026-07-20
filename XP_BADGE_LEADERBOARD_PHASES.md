# Theo Dõi Triển Khai XP, Badge, Level, Leaderboard

## Mục tiêu

- Xây dựng hệ thống XP đơn giản, dễ kiểm soát.
- Hiển thị level trên profile mentee.
- Mở khóa badge theo mốc XP và thành tích học tập.
- Tạo leaderboard tuần/tháng dựa trên XP kiếm được.
- Theo dõi tiến độ FE + BE theo từng phase để dễ monitor.

## Nguyên tắc làm việc

- Ưu tiên thay đổi nhỏ, ít ảnh hưởng các phần đang chạy.
- Backend xong phase nào sẽ verify phase đó trước khi chuyển tiếp.
- Frontend sẽ nối theo API thực tế, tránh làm UI trước khi BE chưa ổn định.
- Mỗi phase hoàn thành sẽ đánh dấu `done`.

## Rule nghiệp vụ để implement

- Hoàn thành 1 node: `+20 XP`
- Hoàn thành 1 learning path 100%: `+100 XP`
- 1 tip được duyệt: `+30 XP`
- Quiz: tạm thời không cộng XP ở bản đơn giản
- Level: `floor(totalXp / 100) + 1`
- Badge theo XP chỉ là mốc vinh danh, không cộng thêm XP
- Leaderboard tính theo XP kiếm được trong kỳ, không dùng tổng XP tích lũy

## Phase 1 - Chốt nền XP ở Backend

Trạng thái: `done`

### Backend

- [x] Tạo cơ chế ghi nhận XP tập trung (`xpService` hoặc tương đương)
- [x] Chốt các loại sự kiện XP: `NODE_COMPLETED`, `ROADMAP_COMPLETED`, `TIP_APPROVED`
- [x] Tạo bảng lịch sử XP để tính leaderboard theo thời gian
- [x] Thêm ràng buộc tránh cộng trùng XP cho cùng 1 sự kiện
- [x] Verify bảng schema + dữ liệu mẫu không ảnh hưởng các bảng hiện tại

### Frontend

- [x] Chưa cần code FE ở phase này

### Điều kiện done

- [x] Có schema lưu lịch sử XP
- [x] Có service backend để cộng XP đúng 1 đầu mối
- [x] Có cách chống double reward

## Phase 2 - Nối XP vào các luồng học tập

Trạng thái: `done`

### Backend

- [x] Cộng `+20 XP` khi user hoàn thành node lần đầu
- [x] Cộng `+100 XP` khi user hoàn thành learning path 100% lần đầu
- [x] Cộng `+30 XP` khi tip được mentor approve lần đầu
- [x] Bảo đảm undo/toggle không làm cộng trùng XP
- [x] Thêm verify cho các case node, roadmap, tip

### Frontend

- [x] Chưa cần thay đổi lớn, ưu tiên dựng BE xong trước

### Điều kiện done

- [x] XP tăng đúng theo 3 rule đã chốt
- [x] Không bị cộng lặp khi thao tác lại
- [x] Đã test được trên account mentee demo

## Phase 3 - Level và Profile

Trạng thái: `done`

### Backend

- [x] Tính `level` từ `user.xp`
- [x] Bổ sung field phục vụ FE: `level`, `currentLevelXp`, `nextLevelXp`, `xpToNextLevel`
- [x] Trả thông tin level trong API profile mentee
- [x] Trả thông tin level trong API mentee dashboard

### Frontend

- [x] Hiển thị `Level` trên trang profile mentee
- [x] Hiển thị progress lên level tiếp theo
- [x] Hiển thị level/xp gọn gọn ở homepage mentee nếu hợp lý
- [x] Kiểm tra UI desktop/mobile

### Điều kiện done

- [x] Profile nhìn thấy level rõ ràng
- [x] API trả đủ dữ liệu cho FE
- [x] Số XP và level khớp nhau

## Phase 4 - Badge

Trạng thái: `done`

### Backend

- [x] Tạo hoặc bổ sung dữ liệu badge trong DB
- [x] Tách 2 nhóm badge:
- [x] Badge theo XP: `Beginner (100)`, `Fast Learner (300)`, `Dedicated Learner (500)`, `XP Master (1000)`
- [x] Badge theo thành tích: `First Step`, `Path Finisher`, `Contributor`, `Quiz Ace`
- [x] Cập nhật logic unlock badge theo XP và sự kiện học tập
- [x] Không cộng thêm XP cho badge ở bản đơn giản
- [x] Verify API `/api/badges`

### Frontend

- [x] Hiển thị danh sách badge không bị trống trang
- [x] Nếu cần, tách section `Badge theo XP` và `Badge thành tích`
- [x] Hiển thị trạng thái đã mở khóa/chưa mở khóa rõ ràng
- [x] Kiểm tra số lượng badge unlocked

### Điều kiện done

- [x] Trang badge có dữ liệu thật
- [x] Badge mở khóa đúng rule
- [x] Không ảnh hưởng profile/homepage hiện tại

## Phase 5 - Leaderboard Tuần/Tháng

Trạng thái: `done`

### Backend

- [x] Tạo API leaderboard theo `week` và `month`
- [x] Chỉ tính user có role `MENTEE`
- [x] Tính theo tổng `xp event` trong kỳ
- [x] Trả về top list + rank của current user
- [x] Tối ưu query có index cần thiết

### Frontend

- [x] Tạo service gọi leaderboard API
- [x] Hiển thị leaderboard tuần/tháng
- [x] Có tab hoặc toggle `Tuần` / `Tháng`
- [x] Hiển thị top user + XP kiếm được trong kỳ
- [x] Highlight current user nếu cần

### Điều kiện done

- [x] Leaderboard ra đúng thứ tự
- [x] Chuyển tuần/tháng hoạt động đúng
- [x] FE load dữ liệu thật, không dùng mock

## Phase 6 - Rà soát và Đóng gói

Trạng thái: `done`

### Backend

- [x] Rà soát các route/API liên quan XP, badge, level, leaderboard
- [x] Kiểm tra backward impact tới dashboard/profile/badge cũ
- [x] Kiểm tra seed/migration nếu có

### Frontend

- [x] Rà soát UI profile, homepage, badge, leaderboard
- [x] Fix lỗi layout nếu có
- [x] Đồng bộ wording hiển thị cho dễ hiểu

### Điều kiện done

- [x] End-to-end mentee flow chạy ổn
- [x] Có thể demo được: học node -> tăng XP -> lên level -> mở badge -> vào leaderboard

## Tiến độ tổng

- [x] Phase 1 - Nền XP Backend
- [x] Phase 2 - Nối XP vào luồng học tập
- [x] Phase 3 - Level và Profile
- [x] Phase 4 - Badge
- [x] Phase 5 - Leaderboard Tuần/Tháng
- [x] Phase 6 - Rà soát và Đóng gói

## Ghi chú monitor

- Khi tôi hoàn thành phase nào, tôi sẽ đổi `Trạng thái` của phase đó thành `done`.
- Đồng thời tôi sẽ tick các checkbox FE + BE đã xong trong phase đó.
- Nếu có phát sinh thay đổi rule nghiệp vụ, tôi sẽ cập nhật ngay trong file này trước khi làm tiếp.
