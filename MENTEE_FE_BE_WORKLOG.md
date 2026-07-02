# Mentee FE-BE Worklog

## Tổng quan

Tài liệu này tổng hợp những gì đã được chỉnh sửa cho flow mentee, từ frontend đến backend, theo cách dễ đọc và dễ bàn giao.

Mục tiêu chính trong đợt này:

- Sửa các lỗi dữ liệu và API ảnh hưởng đến mentee.
- Làm cho trang roadmap của mentee hiển thị đúng dữ liệu thật.
- Cải thiện giao diện learning page theo hướng chuyên nghiệp hơn.
- Giữ nguyên logic hiện có, ưu tiên thay đổi UI và sửa lỗi thay vì viết lại flow.

---

## 1. Frontend - Mentee

## 1.1 My Roadmaps Page

### Vấn đề

Tab `Đang học` trước đó không hiển thị một số roadmap mà mentee đã enroll, nhất là trường hợp:

- `status = ACTIVE`
- `progressPercent = 0`

Điều này làm roadmap vừa đăng ký xong nhưng chưa học bài nào bị ẩn khỏi danh sách `Đang học`.

### Cách xử lý

Đã sửa logic lọc danh sách trong:

- `frontend/src/pages/mentee/MyRoadmapsPage.jsx`

### Kết quả

- Roadmap có `status: ACTIVE` sẽ hiển thị trong tab `Đang học` đúng như kỳ vọng.
- Không còn phụ thuộc sai vào `progressPercent > 0` để xếp vào `Đang học`.

---

## 1.2 Explore Page

### Vấn đề cũ

Trang Explore trước đó bị pha trộn giữa mock data và API data, dẫn đến:

- giao diện không phản ánh dữ liệu thật
- mentor filter hoạt động không rõ ràng
- rating và duration không đẹp và không ổn định

### Cách xử lý

Đã chuyển Explore page sang hướng API-first.

Đã cập nhật các file:

- `frontend/src/pages/ExplorePage.jsx`
- `frontend/src/pages/mentee/features/explore/components/ExploreFilters.jsx`
- `frontend/src/pages/mentee/features/explore/components/RoadmapCard.jsx`
- `frontend/src/services/exploreService.js`

### Những gì đã đổi

- Lấy dữ liệu roadmap từ API thay vì trộn với mock.
- Ở filter mentor, ô tìm kiếm đã được nối đúng thay vì chỉ là placeholder.
- Card roadmap chỉ hiển thị rating khi thực sự có dữ liệu rating.
- Duration hiển thị gọn hơn và chuyên nghiệp hơn.

### Kết quả

- Explore page hiển thị dữ liệu thật từ backend.
- Giảm tình trạng UI đẹp nhưng dữ liệu sai.
- Dễ debug và kiểm soát chất lượng data hơn.

---

## 1.3 Roadmap Learning Page

Đây là phần được chỉnh UI nhiều nhất.

### Mục tiêu

- Làm trang học roadmap trông đẹp hơn, gần với reference.
- Không bỏ logic cũ.
- Không xóa feature hiện có.

### File liên quan

- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`
- `frontend/src/components/mentee/node/NodeSidebar.jsx`
- `frontend/src/components/mentee/node/NodeHeader.jsx`
- `frontend/src/components/mentee/node/ProgressCard.jsx`
- `frontend/src/components/mentee/node/MaterialsSection.jsx`
- `frontend/src/components/mentee/node/QuizSection.jsx`
- `frontend/src/components/mentee/node/ChecklistSection.jsx`
- `frontend/src/components/mentee/node/TipsSection.jsx`

### Những gì đã thay đổi

#### a. Layout tổng thể

- Chuyển thành bố cục 3 cột rõ hơn ở desktop.
- Tăng độ rộng container để page bớt hẹp.
- Đưa materials và quiz sang cột phải.
- Giữ checklist và tips ở cột giữa.

#### b. Fix active node ở sidebar

Đã sửa bug active item ở sidebar.

Trước đó page truyền sai id active:

- sai: `phase-${currentPhaseIndex}`
- đúng: `currentPhase?.id`

Kết quả:

- sidebar highlight đúng node đang học

#### c. NodeHeader

- Làm mới header theo kiểu hero gradient.
- Thêm thông tin roadmap title.
- Thêm overall progress.
- Giữ vai trò là khu vực tổng quan của node hiện tại.

#### d. NodeSidebar

- Làm mới giao diện sidebar.
- Thêm step index.
- Thêm summary checklist theo node.
- Hiển thị trạng thái node rõ hơn.

#### e. ProgressCard

- Làm mới card tiến độ ở cột phải.
- Hiển thị checklist progress, materials read, quiz done, overall progress.
- Sau đó đã bỏ `sticky` vì gây lỗi chồng lấp khi scroll.

#### f. MaterialsSection

- Thêm `variant="compact"` để dùng trong cột phải.
- Giao diện card gọn hơn, hợp với right rail.
- Nếu có URL thì mở được tab mới.

#### g. QuizSection

- Thêm `compact` mode để dùng trong cột phải.
- Nếu node có quiz, hiển thị title, số câu hỏi, thời lượng, nút bắt đầu.
- Nếu node không có quiz, vẫn giữ block UI và hiển thị empty state.

Điều này giải quyết vấn đề:

- quiz UI biến mất hoàn toàn khi node hiện tại chưa có quiz

#### h. ChecklistSection

- Đã redesign checklist theo kiểu row card để dễ nhìn hơn.
- Thêm icon trạng thái bên trái.
- Thêm badge trạng thái bên phải.
- Thêm progress bar phía trên và footer progress phía dưới.
- Vẫn giữ nguyên logic toggle checklist.

### Các lỗi UI đã xử lý trong learning page

#### Lỗi 1: giao diện quá hẹp

Đã tăng width cho:

- breadcrumb container
- main container
- kích thước 3 cột desktop

#### Lỗi 2: card tài liệu đè lên card tiến độ khi scroll

Nguyên nhân:

- `ProgressCard` sticky riêng
- các card bên dưới cuộn lên và đè vào nó

Cách sửa:

- bỏ sticky khỏi `ProgressCard`

#### Lỗi 3: quiz UI biến mất

Nguyên nhân:

- `QuizSection` trả về `null` nếu không có `quiz`

Cách sửa:

- giữ block quiz luôn hiển thị
- nếu không có quiz thì hiển thị empty state `Chưa có bài kiểm tra`

---

## 2. Backend - Mentee support APIs

## 2.1 Explore API

### Mục tiêu

Làm cho Explore page của mentee sử dụng dữ liệu thật và đẹp hơn.

### File đã sửa

- `backend/src/services/learningPathService.js`
- `backend/src/utils/duration.js`

### Những gì đã đổi

#### a. Tính rating thật từ reviews

Explore API hiện tại đã tính `rating` dựa trên dữ liệu `Review` thay vì hardcode hoặc mock.

Kết quả:

- roadmap card bên frontend có thể hiển thị rating thật

#### b. Format duration đẹp hơn

Đã thêm xử lý tổng hợp duration bằng utility:

- `normalizeDurationParts`
- `serializeDuration`
- `summarizeDuration`

Trước đó duration có thể hiển thị kiểu:

- `2 weeks • 3 weeks • 2 weeks`

Sau khi xử lý sẽ gọn hơn, ví dụ:

- `7 tuần`

### Quy tắc dữ liệu

- Không có ý định chặn hay lọc bớt các roadmap cũ/rác nếu user không yêu cầu.
- Explore API vẫn có thể trả về old records nếu database đang có chúng.

---

## 2.2 Node detail data cho learning flow

### Mục tiêu

Đảm bảo learning page của mentee có đủ dữ liệu để hiển thị:

- checklist
- materials
- quizzes
- tips

### Nơi liên quan

Node details đã được frontend dùng qua:

- `frontend/src/services/nodeService.js`
- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`

Phía backend liên quan đến:

- `backend/src/controllers/nodeController.js`
- `backend/src/services/nodeService.js`
- `backend/src/repositories/nodeRepository.js`

### Ghi nhận

Backend đang trả về quiz trong node details, frontend đã map quiz đầu tiên để dùng ở learning page.

Ngoài ra backend cũng trả `latestAttempt` cho từng quiz để frontend có thể biết quiz đã làm hay chưa.

---

## 2.3 Prisma / Repository issue đã sửa

### Lỗi gặp phải

Đã gặp lỗi:

`Unknown field 'duration' for select statement on model 'Node'.`

### Nguyên nhân thật

Không phải do business logic query sai.

Nguyên nhân là:

- Prisma schema đã có field `Node.duration`
- nhưng Prisma client đang bị stale, chưa đồng bộ với schema mới

### Nơi liên quan

- `backend/prisma/schema.prisma`
- `backend/src/repositories/roadmapRepository.js`

### Cách xử lý

Đã regenerate Prisma client bằng:

```bash
npx prisma generate --no-engine
```

Lý do dùng cách này:

- generate thông thường từng bị lỗi `EPERM` khi rename query engine trên Windows

### Kết quả

- Lỗi `Unknown field duration` đã được xử lý theo đúng nguyên nhân.

---

## 3. Dữ liệu demo / database support cho mentee

## Nguyên tắc đã giữ

- Không sửa dữ liệu cũ trong DB nếu không cần thiết.
- Nếu cần demo, chỉ thêm dữ liệu mới.

## Đã bổ sung dữ liệu demo

Đã thêm dữ liệu để phục vụ Explore và learning flow:

- 4 mentors
- 4 roadmaps
- nodes
- checklist items
- materials
- reviews
- enrollments

Tên mentor demo:

- `Nina Tran`
- `Ethan Vo`
- `Chloe Nguyen`
- `Leo Pham`

Tên roadmap demo:

- `Spring Boot API Engineering Lab`
- `Full-Stack Delivery Playbook`
- `Probability for Product Analytics`
- `SQL Performance Tuning Workshop`

## Duration data cleanup

Đã phát hiện một số giá trị duration demo bị hỏng ký tự, ví dụ dạng `tu?n`.

Đã sửa về dạng sạch hơn, ví dụ:

- `2 weeks`
- `3 weeks`

Lưu ý:

- Đây là sửa trên demo data mới tạo, không phải đi sửa toàn bộ dữ liệu cũ trong DB.

---

## 4. Danh sách file đã chỉnh

## Frontend

- `frontend/src/pages/mentee/MyRoadmapsPage.jsx`
- `frontend/src/pages/ExplorePage.jsx`
- `frontend/src/services/exploreService.js`
- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`
- `frontend/src/components/mentee/node/NodeSidebar.jsx`
- `frontend/src/components/mentee/node/NodeHeader.jsx`
- `frontend/src/components/mentee/node/ProgressCard.jsx`
- `frontend/src/components/mentee/node/MaterialsSection.jsx`
- `frontend/src/components/mentee/node/QuizSection.jsx`
- `frontend/src/components/mentee/node/ChecklistSection.jsx`
- `frontend/src/pages/mentee/features/explore/components/ExploreFilters.jsx`
- `frontend/src/pages/mentee/features/explore/components/RoadmapCard.jsx`

## Backend

- `backend/src/services/learningPathService.js`
- `backend/src/utils/duration.js`
- `backend/src/repositories/roadmapRepository.js`
- `backend/prisma/schema.prisma`
- Prisma client generate output

## Có liên quan dữ liệu/demo

- demo inserts qua script/Prisma trên local environment

---

## 5. Những gì user sẽ nhìn thấy sau các thay đổi này

### Ở phía mentee

- Tab `Đang học` hiển thị đúng roadmap vừa enroll.
- Explore page hiển thị data thật, mentor filter đúng hơn.
- Rating roadmap hợp lý hơn vì lấy từ reviews.
- Duration roadmap đẹp và gọn hơn.
- Learning page rộng hơn, ít bị chật.
- Sidebar roadmap dễ theo dõi hơn.
- Hero section đẹp hơn và có tổng quan tiến độ.
- Checklist dễ thao tác và dễ nhìn hơn.
- Materials và quiz được đưa sang cột phải.
- Nếu node chưa có quiz, vẫn thấy block quiz thay vì mất hẳn.
- Lỗi chồng lấp card khi scroll đã được xử lý.

---

## 6. Trạng thái hiện tại

## Đã xong

- Sửa filtering cho My Roadmaps.
- Chuyển Explore sang API-first.
- Tính rating thật và duration summary ở backend.
- Xử lý stale Prisma client liên quan `Node.duration`.
- Thêm demo data phục vụ mentee flow.
- Refactor UI learning page theo hướng mới.
- Sửa overlap khi scroll.
- Sửa quiz block biến mất.
- Làm mới checklist UI.

## Chưa hoàn thiện 100 phần trăm

Vẫn có thể làm tiếp nếu cần:

- checklist item time như reference
- locked state cho checklist item
- expand/collapse đúng nghĩa cho checklist row
- sticky right rail theo cả cụm card nếu muốn UX sát reference hơn
- fine-tune spacing, color, typography để sát ảnh mẫu hơn nữa

---

## 7. Ghi chú kỹ thuật quan trọng

- Explore API không có chủ trương tự động chặn old records nếu user không yêu cầu.
- Demo data được thêm theo hướng additive, không sửa từng old records trong DB cũ.
- Quiz block hiển thị empty state nếu node hiện tại không có quiz từ backend.
- Prisma generate trên Windows từng gặp lỗi `EPERM`, đã workaround bằng `--no-engine`.

---

## 8. File tham khảo bổ sung

- `ROADMAP_LEARNING_UI_NOTES.md`

File này tập trung riêng vào phần UI learning page, còn file hiện tại tổng hợp toàn bộ phạm vi FE + BE liên quan đến mentee.
