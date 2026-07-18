# MENTEE FE/BE WORKLOG - Bản Chi Tiết Để Review

## 1. Tôi phụ trách phần nào

Trong dự án `EduPath`, tôi phụ trách hoàn thiện `mentee roadmap flow` theo hướng full-stack.

Mục tiêu của tôi là làm cho luồng này chạy được bằng dữ liệu thật:

`Explore -> Roadmap Detail -> Enroll -> Learning Page -> Update Progress -> Complete`

Tức là tôi không chỉ làm giao diện, mà làm xuyên suốt ở 3 tầng:

- Frontend: hiển thị và xử lý tương tác của mentee.
- Backend: trả dữ liệu đúng cho frontend và xử lý business logic.
- Database: bổ sung dữ liệu thật để toàn bộ flow có thể test và demo.

---

## 2. Dự án được tổ chức như thế nào

EduPath là monorepo, gồm:

- `frontend/`: phần giao diện người dùng.
- `backend/`: phần API, xử lý logic và truy vấn dữ liệu.
- `backend/prisma/`: schema và seed dữ liệu database.

Những nơi tôi làm nhiều nhất:

### Frontend ở đâu

- `frontend/src/pages/ExplorePage.jsx`
- `frontend/src/pages/RoadmapDetailPage.jsx`
- `frontend/src/pages/mentee/MyRoadmapsPage.jsx`
- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`
- `frontend/src/components/mentee/node/`
- `frontend/src/services/`

### Backend ở đâu

- `backend/src/services/learningPathService.js`
- `backend/src/services/nodeService.js`
- `backend/src/routes/roadmap.js`
- `backend/src/routes/enrollment.js`
- `backend/src/utils/duration.js`

### Database ở đâu

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.js`

---

## 3. Tôi đã làm gì ở Frontend

## 3.1 Explore Page

### File code

- `frontend/src/pages/ExplorePage.jsx`
- `frontend/src/services/exploreService.js`
- `frontend/src/services/subjectCategoryService.js`

### Tôi làm gì

Tôi chuyển Explore page từ dạng phụ thuộc mock data sang dùng API thật.

Cụ thể trong `ExplorePage.jsx`, tôi:

- dùng `useEffect()` để gọi `subjectCategoryService.getSubjectCategories()` lấy category thật từ backend,
- dùng `exploreService.getLearningPaths()` để lấy danh sách roadmap thật,
- map lại dữ liệu trả về để thêm fallback cho `cover` và `duration`,
- dùng `useMemo()` để sinh danh sách mentor từ dữ liệu roadmap,
- lọc roadmap theo `selectedCategories` và `selectedMentors`.

### Tôi hoàn thành như thế nào

Tôi hoàn thành phần này bằng cách nối page trực tiếp vào service gọi API thật, thay vì hardcode dữ liệu trong UI.

Kết quả là:

- category hiển thị từ database,
- mentor filter bám theo dữ liệu thật,
- card roadmap hiển thị đúng dữ liệu hơn,
- Explore trở thành entry point ổn định cho mentee.

### Công dụng của code này

- Giúp mentee khám phá roadmap thật trong hệ thống.
- Giảm lệch giữa UI và backend.
- Là điểm bắt đầu cho toàn bộ luồng roadmap.

## 3.2 Roadmap Detail Page

### File code

- `frontend/src/pages/RoadmapDetailPage.jsx`
- `frontend/src/services/roadmapService.js`
- `frontend/src/services/enrollmentService.js`

### Tôi làm gì

Tôi làm trang chi tiết roadmap để user xem thông tin trước khi học và có thể đăng ký ngay.

Cụ thể trong `RoadmapDetailPage.jsx`, tôi:

- lấy `slug` từ URL bằng `useParams()`,
- gọi `getRoadmapBySlug(slug)` để load roadmap thật,
- lưu `roadmap` và `enrolled` state,
- tạo `roadmapView` bằng `useMemo()` để map dữ liệu backend sang dạng UI cần,
- hiển thị title, description, mentor, timeline node,
- xử lý `handleEnroll()` để gọi `enrollInRoadmapBySlug(roadmapView.slug)`,
- nếu user đã enroll thì cho điều hướng sang `/roadmaps/:slug/learn`.

### Tôi hoàn thành như thế nào

Tôi thống nhất detail flow theo `slug` thay vì chỉ dùng `id`, vì `slug` dễ đọc và thuận tiện cho route.

Kết quả là:

- user có thể xem chi tiết roadmap bằng dữ liệu thật,
- trạng thái đã enroll hay chưa được xác định rõ,
- từ detail page có thể đi thẳng sang learning flow.

### Công dụng của code này

- Là cầu nối giữa Explore và Learning.
- Giúp mentee hiểu roadmap trước khi đăng ký.
- Làm trải nghiệm đăng ký học liền mạch hơn.

## 3.3 My Roadmaps Page

### File code

- `frontend/src/pages/mentee/MyRoadmapsPage.jsx`

### Tôi làm gì

Tôi sửa logic hiển thị roadmap của mentee để phản ánh đúng trạng thái học.

Cụ thể trong file này, tôi:

- gọi `getMyEnrollments()` để lấy danh sách enrollment thật,
- tách danh sách `ongoing` và `completed`,
- dùng `status` kết hợp với `progressPercent` để phân loại chính xác,
- giữ tab `favorite` dựa trên danh sách slug yêu thích.

Logic chính hiện tại là:

- `ACTIVE` hoặc chưa đạt 100% thì nằm ở `ongoing`,
- `COMPLETED` hoặc `progressPercent >= 100` thì nằm ở `completed`.

### Tôi hoàn thành như thế nào

Tôi xử lý lỗi business logic quan trọng: user vừa enroll xong có thể đang `0%`, nhưng vẫn phải xuất hiện ở tab `Đang học`.

Kết quả là:

- mentee luôn thấy roadmap mình đã đăng ký,
- trạng thái `đang học` và `đã hoàn thành` không còn sai lệch.

### Công dụng của code này

- Giúp user quản lý lộ trình cá nhân rõ ràng.
- Đồng bộ đúng với trạng thái enrollment từ backend.

## 3.4 Roadmap Learning Page

### File code

- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`
- `frontend/src/components/mentee/node/NodeSidebar.jsx`
- `frontend/src/components/mentee/node/NodeHeader.jsx`
- `frontend/src/components/mentee/node/ChecklistSection.jsx`
- `frontend/src/components/mentee/node/MaterialsSection.jsx`
- `frontend/src/components/mentee/node/QuizSection.jsx`
- `frontend/src/components/mentee/node/TipsSection.jsx`
- `frontend/src/components/mentee/node/ProgressCard.jsx`

### Tôi làm gì

Đây là phần frontend quan trọng nhất tôi làm.

Trong `RoadmapLearningPage.jsx`, tôi:

- lấy `slug` từ URL,
- gọi `getRoadmapBySlug(slug)` để load toàn bộ roadmap,
- xác định `currentPhaseIndex` bằng node đầu tiên chưa completed,
- gọi `getNodeDetails(currentPhase.id)` để lấy chi tiết node đang học,
- map checklist, materials và quiz để render lên UI,
- xử lý `handleChecklistToggle()` để gọi `toggleChecklistProgress()`,
- xử lý `handleContinue()` để gọi `updateNodeProgress()` khi hoàn thành node,
- cập nhật lại `roadmap.enrollment.progressPercent` sau khi backend trả về,
- tự chuyển sang node tiếp theo nếu còn,
- tính `checklistProgress`, `overallProgress`, `isCurrentPhaseCompleted` để điều khiển trạng thái UI.

Ngoài logic, tôi còn tách UI thành các component nhỏ hơn trong `frontend/src/components/mentee/node/` như:

- `NodeSidebar`: hiển thị danh sách node và trạng thái từng node,
- `NodeHeader`: hiển thị thông tin node hiện tại,
- `ChecklistSection`: xử lý danh sách checklist,
- `MaterialsSection`: hiển thị tài liệu học,
- `QuizSection`: hiển thị quiz và trạng thái attempt,
- `TipsSection`: hiển thị tips,
- `ProgressCard`: hiển thị tiến độ tổng thể.

### Tôi hoàn thành như thế nào

Tôi hoàn thành phần này bằng cách xử lý đồng thời 2 việc:

- nối đủ data thật từ backend,
- và làm UI phản ánh đúng trạng thái học.

Cụ thể sau khi hoàn thiện:

- node hiện tại được chọn đúng theo tiến độ học,
- checklist tick xong thì UI cập nhật lại,
- complete node xong thì progress toàn roadmap tăng lên,
- nếu node hoàn thành thì màu sắc, CTA và trạng thái hiển thị thay đổi tương ứng,
- mentee có thể học theo từng bước thay vì chỉ xem nội dung tĩnh.

### Công dụng của code này

- Đây là màn học chính của mentee.
- Là nơi thể hiện rõ nhất việc đồng bộ UI state với backend state.
- Quyết định trực tiếp trải nghiệm học tập của người dùng.

---

## 4. Tôi đã làm gì ở Backend

## 4.1 Xử lý dữ liệu cho Explore page

### File code

- `backend/src/services/learningPathService.js`
- `backend/src/utils/duration.js`

### Tôi làm gì

Trong `learningPathService.js`, tôi làm hàm `getExploreLearningPaths()` để backend trả dữ liệu phù hợp với Explore page.

Hàm này:

- query các learning path chưa bị xóa,
- chỉ lấy roadmap public hoặc đã approved/published,
- include mentor, subject, category,
- include `nodes.duration` để tính tổng thời lượng,
- include `reviews.rating` để tính rating trung bình.

Sau đó tôi map dữ liệu thành payload gọn gồm:

- `id`
- `slug`
- `title`
- `description`
- `cover`
- `mentor`
- `subject`
- `category`
- `rating`
- `duration`

Trong `backend/src/utils/duration.js`, tôi bổ sung các hàm:

- `normalizeDurationParts()`
- `serializeDuration()`
- `summarizeDuration()`

để đọc và cộng duration từ nhiều format như `2 tuần`, `3 weeks`, `5 days`.

### Tôi hoàn thành như thế nào

Tôi chuyển phần tổng hợp dữ liệu từ frontend về backend.

Kết quả là frontend không cần tự tính rating hoặc duration nữa, chỉ cần render dữ liệu đã chuẩn hóa.

### Công dụng của code này

- Là backend support chính cho Explore page.
- Làm payload sạch hơn và đồng nhất hơn.
- Giảm logic xử lý rải rác ở frontend.

## 4.2 Làm roadmap flow theo slug

### File code

- `backend/src/routes/roadmap.js`
- `backend/src/routes/enrollment.js`

### Tôi làm gì

Tôi bổ sung các route làm việc theo `slug` để frontend có thể gọi API theo URL dễ đọc.

Các route chính:

- `GET /api/roadmaps/slug/:slug`
- `POST /api/enrollments/slug/:slug`
- `GET /api/enrollments/slug/:slug`
- `PATCH /api/enrollments/slug/:slug/progress`

### Tôi hoàn thành như thế nào

Tôi thống nhất route detail, enroll và progress theo cùng một định danh là `slug`.

Kết quả là frontend dễ điều hướng hơn và toàn bộ flow Explore -> Detail -> Learn bám theo cùng một URL pattern.

### Công dụng của code này

- URL dễ đọc hơn.
- Dễ demo hơn.
- Giảm phụ thuộc vào các id khó nhớ khi review sản phẩm.

## 4.3 Node detail cho Learning Page

### File code

- `backend/src/services/nodeService.js`

### Tôi làm gì

Tôi xử lý API node detail để trả đủ dữ liệu cho trang học của mentee.

Trong `nodeService.js`, tôi có các phần chính:

- `assertReadAccess()`: kiểm tra user có quyền xem node hay không,
- `assertEnrollment()`: kiểm tra mentee đã enroll roadmap chưa,
- `getNodeDetails()`: trả về node cùng checklist, materials, quizzes, tips,
- map thêm trạng thái completed cho từng checklist theo user,
- lấy latest quiz attempt của user và gắn vào quiz,
- lọc tips theo quyền truy cập.

### Tôi hoàn thành như thế nào

Tôi không chỉ trả raw node data, mà trả dữ liệu đã gắn với trạng thái học của từng user.

Kết quả là:

- frontend biết checklist nào đã hoàn thành,
- quiz nào đã có attempt,
- user thấy đúng nội dung mình được phép xem.

### Công dụng của code này

- Đây là backend cốt lõi của Learning Page.
- Giúp trang học hiển thị đúng theo từng mentee.

## 4.4 Update checklist, node progress và enrollment progress

### File code

- `backend/src/services/nodeService.js`

### Tôi làm gì

Tôi xử lý logic cập nhật tiến độ học thật ở backend.

Các phần chính gồm:

- `toggleChecklistProgress()`: update checklist progress theo user,
- `updateNodeProgress()`: đánh dấu node completed,
- `recalculateEnrollmentProgress()`: đếm tổng số node và số node đã hoàn thành để tính lại `progressPercent`,
- update `Enrollment.status` thành `ACTIVE` hoặc `COMPLETED`.

Ngoài ra, sau khi update node progress, backend còn trả về enrollment mới để frontend cập nhật ngay UI.

### Tôi hoàn thành như thế nào

Tôi đưa logic tính tiến độ về backend để đảm bảo dữ liệu đúng ở mọi màn hình.

Kết quả là:

- Learning Page cập nhật được phần trăm tiến độ thật,
- My Roadmaps hiển thị đúng trạng thái,
- completion state không còn chỉ là hiệu ứng giao diện mà đã được lưu thật trong hệ thống.

### Công dụng của code này

- Đồng bộ progress giữa DB, API và UI.
- Là phần quan trọng nhất để flow học có ý nghĩa thực tế.

---

## 5. Tôi đã sửa gì ở Database / Prisma

## 5.1 Schema dữ liệu phục vụ learning flow

### File code

- `backend/prisma/schema.prisma`

### Tôi làm gì

Tôi làm việc dựa trên schema có các model phục vụ learning flow như:

- `LearningPath`
- `Node`
- `Checklist`
- `ChecklistProgress`
- `Material`
- `Quiz`
- `Enrollment`
- `NodeProgress`
- `Review`

Điểm quan trọng là schema này đủ để biểu diễn:

- roadmap,
- node học,
- tài liệu,
- checklist,
- quiz,
- tiến độ của từng user,
- trạng thái enrollment của từng user.

### Tôi sửa gì

Phần tôi tác động nhiều nhất là khai thác và đồng bộ dữ liệu theo schema này để phục vụ frontend và backend.

Ví dụ:

- `Node` có `duration` để tính thời lượng roadmap,
- `ChecklistProgress` lưu trạng thái tick checklist theo từng user,
- `Enrollment` lưu `progressPercent` và `status`,
- `NodeProgress` lưu trạng thái completed của từng node.

### Công dụng của phần này

- Đây là nền dữ liệu để các màn mentee hoạt động đúng.
- Nếu không có các model và field này thì không thể làm progress thật.

## 5.2 Seed dữ liệu thật cho roadmap

### File code

- `backend/prisma/seed.js`

### Tôi làm gì

Trong `seed.js`, tôi bổ sung và chuẩn hóa dữ liệu để hệ thống có thể demo thật.

Tôi seed các phần sau:

- role: `MENTEE`, `MENTOR`, `ADMIN`,
- subject category: ví dụ `Mathematics`, `Backend Development`, `Full-Stack Project`,
- subject: ví dụ `MAS291`, `MAS101`, `PRJ301`, `SWP391`,
- user mẫu theo từng role,
- mentor mẫu,
- learning path mẫu,
- thumbnail, status, isPublic, xpReward cho roadmap.

Theo nội dung hiện có trong file, tôi đã thêm nhiều learning path như:

- `Java Web Application Development Bootcamp`
- `REST API Design with Node and Express`
- `Database Integration for Backend Systems`
- `Software Project Management Essentials`
- `Agile Delivery for Student Teams`
- `Capstone Planning and Execution`
- `Statistics and Probability Foundations`
- `Applied Probability for Data Analysis`
- `Quantitative Thinking for Engineers`

### Tôi hoàn thành như thế nào

Tôi dùng `upsert()` để dữ liệu có thể seed lại nhiều lần mà không dễ bị trùng.

Tôi cũng gắn mỗi learning path với:

- mentor,
- subject,
- category,
- trạng thái public/published phù hợp,
- phần thưởng xp.

### Công dụng của code này

- Có dữ liệu thật cho Explore page.
- Có roadmap thật để enroll.
- Có đủ dữ liệu nền để mở rộng tiếp sang node detail và learning flow.

## 5.3 Tôi đã sửa DB theo hướng nào

Tóm lại, phần database tôi sửa theo 3 hướng:

1. Thêm dữ liệu nền cho role, subject, mentor và roadmap.
2. Đảm bảo dữ liệu roadmap khớp với luồng mentee mà frontend đang dùng.
3. Hỗ trợ lưu tiến độ thật qua các bảng như `Enrollment`, `NodeProgress`, `ChecklistProgress`.

Điểm quan trọng là database không còn chỉ để chứa tiêu đề roadmap, mà đã phục vụ được cho cả luồng học, theo dõi tiến độ và demo hệ thống.

---

## 6. Kết quả tôi đã hoàn thành được

Sau khi tôi hoàn thiện phần việc của mình:

1. Explore page lấy roadmap thật từ backend.
2. Roadmap detail page load theo `slug` và cho enroll thật.
3. My Roadmaps hiển thị đúng roadmap đang học và đã hoàn thành.
4. Learning page load đúng node hiện tại và nội dung node.
5. Checklist có thể tick theo từng user.
6. Node có thể được đánh dấu hoàn thành.
7. Enrollment progress được cập nhật thật trong database.
8. Toàn bộ flow mentee roadmap có thể demo end-to-end.

---

## 7. Những file nên mở ra khi review

Nếu cần chứng minh contribution bằng code, tôi sẽ mở các file sau:

### Frontend

- `frontend/src/pages/ExplorePage.jsx`
- `frontend/src/pages/RoadmapDetailPage.jsx`
- `frontend/src/pages/mentee/MyRoadmapsPage.jsx`
- `frontend/src/pages/mentee/RoadmapLearningPage.jsx`

### Backend

- `backend/src/services/learningPathService.js`
- `backend/src/services/nodeService.js`
- `backend/src/routes/roadmap.js`
- `backend/src/routes/enrollment.js`
- `backend/src/utils/duration.js`

### Database

- `backend/prisma/schema.prisma`
- `backend/prisma/seed.js`

---

## 8. Câu nói ngắn để review

`Em phụ trách hoàn thiện mentee roadmap flow của EduPath theo hướng full-stack. Ở frontend, em nối các màn Explore, Detail, My Roadmaps và Learning Page sang API thật. Ở backend, em xử lý dữ liệu cho Explore, làm route theo slug, trả node detail theo từng user và tính lại progress khi user học xong. Ở database, em bổ sung và seed dữ liệu role, subject, mentor, roadmap để hệ thống có dữ liệu thật phục vụ demo. Kết quả là luồng Explore -> Enroll -> Learn -> Complete chạy được end-to-end.`
