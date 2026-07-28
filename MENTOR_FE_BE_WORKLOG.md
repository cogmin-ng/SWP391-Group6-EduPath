# MENTOR FE/BE WORKLOG - Bản Chi Tiết Để Review

## 1. Tôi phụ trách phần nào

Trong dự án `EduPath`, tôi phụ trách xây dựng, hoàn thiện và đồng bộ hóa luồng tính năng của Mentor (`Mentor Flow`) theo hướng full-stack.

Mục tiêu của tôi là thiết lập một hệ thống quản lý, biên soạn lộ trình và hỗ trợ chuẩn bị học liệu hoàn chỉnh dành cho mentor:

`Mentor Dashboard -> Quản lý & Xem Lộ trình -> Tạo/Chỉnh sửa Lộ trình -> Ngân hàng Câu hỏi -> Hồ sơ Cá nhân`

Tức là tôi làm xuyên suốt ở cả 3 tầng:

- **Frontend**: Xây dựng giao diện tương tác của mentor, từ trang dashboard thống kê, quản lý và thiết kế chi tiết lộ trình (create/edit roadmap & nodes), quản lý ngân hàng câu hỏi trắc nghiệm đến cập nhật thông tin và ảnh đại diện hồ sơ cá nhân.
- **Backend**: Cung cấp các API lấy dữ liệu thống kê dashboard, xử lý lưu nháp, cập nhật, gửi duyệt lộ trình, quản lý ngân hàng câu hỏi (CRUD) và cập nhật thông tin tài khoản mentor.
- **Database**: Tương tác với các bảng liên quan đến mentor, lộ trình (`LearningPath`, `Node`, v.v.), ngân hàng câu hỏi (`BankQuestion`, `BankQuestionOption`) và thông tin người dùng (`User`).

---

## 2. Dự án được tổ chức như thế nào

EduPath là monorepo, gồm:

- `frontend/`: phần giao diện người dùng ReactJS.
- `backend/`: phần API, xử lý logic và truy vấn dữ liệu Node.js/Express.
- `backend/prisma/`: schema và seed dữ liệu database PostgreSQL.

Những nơi tôi làm nhiều nhất:

### Frontend ở đâu

- [MentorDashboardPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorDashboardPage.jsx)
- [MentorRoadmapsPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapsPage.jsx)
- [MentorRoadmapDetailPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapDetailPage.jsx)
- [CreateRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/CreateRoadmapPage.jsx)
- [EditRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/EditRoadmapPage.jsx)
- [QuestionBankPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/QuestionBankPage.jsx)
- [MentorProfilePage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorProfilePage.jsx)
- [MentorRoadmapLearningPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapLearningPage.jsx)
- [roadmapService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/roadmapService.js)
- [questionBankService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/questionBankService.js)

### Backend ở đâu
---

## 3. Các Phân Hệ Tính Năng Full-Stack Tôi Đã Đảm Nhận

### 3.1 Mentor Dashboard (Thống Kê Động & Duyệt Nhanh)

#### File code liên quan

- **Frontend**: [MentorDashboardPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorDashboardPage.jsx), [roadmapService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/roadmapService.js)
- **Backend**: [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js), [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)

#### Nghiệp vụ

Cung cấp cho Mentor một trung tâm điều khiển (Control Panel) để theo dõi tổng quan các chỉ số hoạt động giảng dạy thời gian thực (tổng số lộ trình sáng tạo, tổng số học viên đăng ký học, điểm đánh giá trung bình từ mentee, số lượng mẹo đóng góp được duyệt). Giúp mentor nắm bắt kịp thời các yêu cầu cần phê duyệt (Mẹo học tập - Tips từ học viên) và truy cập nhanh vào các lộ trình giảng dạy.

#### Tôi làm gì

- **Frontend**: Chuyển Mentor Dashboard từ dữ liệu tĩnh sang API động hệ thống. Sử dụng `useEffect` gọi `getMentorDashboardStats()`, `getMentorRoadmaps()`, `getPendingTips()`. Hiển thị tách biệt các lộ trình chờ duyệt (`PENDING`) và đã được xuất bản (`APPROVED`/`PUBLISHED`), hỗ trợ nút phê duyệt nhanh mẹo bài học ngay trên giao diện chính.
- **Backend**: Triển khai API `GET /api/roadmaps/mentor/stats` trong `roadmapService.js`. Xây dựng hàm `getMentorDashboardStats()` tính toán đếm số lộ trình hoạt động, đếm tổng học viên đăng ký (`Enrollment`), tính trung bình điểm đánh giá (`Review`) và đếm số tips bài học được duyệt trong cơ sở dữ liệu.

#### Tôi hoàn thành như thế nào

Tôi liên kết trực tiếp trang Dashboard với các service API backend thay vì dùng dữ liệu giả, đảm bảo thông tin phản ánh đúng và chính xác hoạt động giảng dạy thực tế của mentor theo thời gian thực.

#### Công dụng của code này

- Là màn hình trung tâm quản lý hoạt động giảng dạy của mentor.
- Giúp theo dõi nhanh hiệu quả bài giảng và mức độ tương tác của học viên.

---

### 3.2 Quản Lý Lộ Trình & Xem Trước Ở Góc Nhìn Học Viên (Roadmap Management & Mentee Preview)

#### File code liên quan

- **Frontend**: [MentorRoadmapsPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapsPage.jsx), [MentorRoadmapDetailPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapDetailPage.jsx), [MentorRoadmapLearningPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapLearningPage.jsx)
- **Backend**: [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js), [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)

#### Nghiệp vụ

Cho phép Mentor quản lý danh mục tất cả lộ trình cá nhân theo từng giai đoạn vòng đời (Bản nháp `DRAFT`, Đang chờ duyệt `PENDING`, Đã xuất bản `PUBLISHED`), xem cấu trúc chi tiết bài giảng và nhận xét đánh giá của mentee. Cung cấp chế độ **Xem trước với góc nhìn học viên (Mentee View Preview)** giúp mentor tự kiểm thử giao diện học tập, thứ tự các Node, nội dung checklist, tài liệu và bài quiz trước khi xuất bản. Hỗ trợ quy trình xóa/ẩn lộ trình an toàn khi đã có học viên đăng ký học.

#### Tôi làm gì

- **Frontend**: 
  - Trong `MentorRoadmapsPage.jsx`, tôi phân chia giao diện thành 3 tab chính: `Lộ trình nháp`, `Đang chờ duyệt`, `Đã được duyệt`, tích hợp chức năng xóa lộ trình (`deleteRoadmap`) kèm cảnh báo.
  - Trong `MentorRoadmapDetailPage.jsx`, hiển thị tổng quan lộ trình, chương trình học (`Curriculum Path`) và danh sách đánh giá của học viên.
  - Trong `MentorRoadmapLearningPage.jsx`, tôi phát triển trang **Xem trước dưới góc nhìn Học viên**. Mentor có thể trải nghiệm toàn bộ giao diện bài học của mentee (`NodeHeader`, `NodeSidebar`, `Checklist`, `Materials`, `Quiz`, `Tips`, `Discussion`), chuyển đổi linh hoạt giữa các Node để kiểm tra tính trực quan trước khi giảng dạy.
- **Backend**: Xây dựng API `getMentorRoadmaps()` hỗ trợ phân trang và hàm `deleteRoadmap()` (chuyển trạng thái sang `ARCHIVED` nếu lộ trình đã xuất bản và có mentee đang học để ẩn khỏi trang tìm kiếm nhưng bảo vệ tiến trình học của học viên cũ).

#### Tôi hoàn thành như thế nào

Tôi đồng bộ hóa các bộ lọc trạng thái, cấu trúc curriculum và xây dựng chế độ Xem trước độc lập (Preview Mode) cách ly dữ liệu tiến độ để mentor vừa có quyền chỉnh sửa/quản trị ở trang Detail, vừa kiểm thử được trải nghiệm học tập chuẩn xác của mentee.

#### Công dụng của code này

- Giúp mentor theo dõi phân phối bài giảng, kiểm thử trải nghiệm bài học dưới góc nhìn mentee và nắm bắt nhận xét của học viên.
- Giúp tổ chức và dọn dẹp các lộ trình cũ/lỗi qua cơ chế xóa an toàn.

---

### 3.3 Tạo & Chỉnh Sửa Lộ Trình (Create & Edit Roadmap & Nodes)

#### File code liên quan

- **Frontend**: [CreateRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/CreateRoadmapPage.jsx), [EditRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/EditRoadmapPage.jsx), [roadmapService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/roadmapService.js)
- **Backend**: [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js), [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)

#### Nghiệp vụ

Quản lý toàn bộ quy trình biên soạn giáo án và thiết kế nội dung học tập. Mentor khởi tạo thông tin chung của lộ trình (chuyên ngành, môn học phụ trách, ảnh thumbnail, phần thưởng XP), sau đó thiết kế từng Node học tập (cột mốc bài học) gồm tài liệu học, danh sách việc cần làm (checklist) và bài kiểm tra (quiz). Hỗ trợ luồng lưu nháp an toàn và gửi Admin phê duyệt trước khi công khai cho học viên (`DRAFT` -> `PENDING` -> `APPROVED`).

#### Tôi làm gì

- **Frontend**: Xây dựng các biểu mẫu nhập liệu, tự động lọc danh sách môn học theo môn mentor đã được Admin phê duyệt (`getMyApprovedSubjects`), xử lý tải ảnh đại diện bằng `FileReader` (base64/data URL), quản lý danh sách Node thời gian thực và thiết lập các nút "Lưu Nháp" / "Cập Nhật & Gửi".
- **Backend**: Viết các API `createRoadmap`, `updateRoadmap`, `submitRoadmap` và hàm `syncQuizzes` lưu trữ câu hỏi trắc nghiệm kèm theo `bankQuestionId` khi đồng bộ lưu lộ trình học từ client.

#### Tôi hoàn thành như thế nào

Tôi áp dụng phương pháp truyền trạng thái biểu mẫu hiện tại (`formData` và `nodes` list) vào `location.state` khi điều hướng sang trang thiết kế chi tiết node học (`NodeEditorPage.jsx`) và nhận ngược lại dữ liệu khi quay về, giúp trải nghiệm thiết kế lộ trình của mentor không bị gián đoạn và không bị mất thông tin đang nhập dở.

#### Công dụng của code này

- Là công cụ biên soạn giáo án cốt lõi cho Mentor.
- Đảm bảo chất lượng lộ trình thông qua quy trình kiểm duyệt DRAFT -> PENDING -> APPROVED.

---

### 3.4 Ngân Hàng Câu Hỏi Trắc Nghiệm (Question Bank & Import)

#### File code liên quan

- **Frontend**: [QuestionBankPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/QuestionBankPage.jsx), [questionBankService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/questionBankService.js), [ImportQuestionsModal.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/components/mentor/ImportQuestionsModal.jsx)
- **Backend**: [questionBank.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/questionBank.js), [questionBankService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/questionBankService.js)
- **Database**: [schema.prisma](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/schema.prisma) (`BankQuestion`, `BankQuestionOption`), [seed.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/seed.js)

#### Nghiệp vụ

Xây dựng kho lưu trữ câu hỏi trắc nghiệm cá nhân độc lập của Mentor để phân loại theo môn học phụ trách, chọn mức độ khó (`Dễ`, `Trung bình`, `Khó`), thiết lập danh sách các lựa chọn đáp án kèm giải thích chi tiết lý do đúng/sai. Phục vụ việc trích xuất và tái sử dụng câu hỏi từ kho để nạp trực tiếp vào các bài kiểm tra (Quiz) của từng Node học tập, tự động loại trừ các câu hỏi đã có mặt trong Quiz để tránh trùng lặp. Đảm bảo bảo mật và tính toàn vẹn dữ liệu khi tạo mới hoặc chỉnh sửa.

#### Tôi làm gì

- **Frontend**: 
  - Trong `QuestionBankPage.jsx`: Gọi `getQuestionBank()` hiển thị danh sách phân trang, bộ lọc tìm kiếm theo từ khóa/môn học/độ khó, Modal thêm mới/chỉnh sửa câu hỏi (hỗ trợ 2 - 8 đáp án, chọn 1 đáp án đúng làm khóa) và nút xóa câu hỏi.
  - Trong `ImportQuestionsModal.jsx`: Gửi tham số `excludeIds` lên backend và kết hợp bộ lọc so khớp văn bản `excludeQuestionTexts` ở client để loại bỏ toàn bộ câu hỏi đã tồn tại khỏi danh sách chọn.
- **Backend**: Triển khai middleware `requireRole(['MENTOR'])`, viết API `createBankQuestion`, `updateBankQuestion` (sử dụng Prisma Transaction để xóa tùy chọn cũ và nạp tùy chọn mới nhất quán) và `deleteBankQuestion` (xóa mềm `isDeleted = true`).
- **Database**: Thiết kế cấu trúc 2 bảng `BankQuestion` và `BankQuestionOption` trong `schema.prisma` và nạp dữ liệu seed mẫu trong `seed.js` phục vụ demo.

#### Tôi hoàn thành như thế nào

Tôi thực hiện kiểm tra biểu mẫu (validation) chặt chẽ trên frontend (bắt buộc chọn 1 đáp án đúng) và sử dụng Prisma Transaction trên backend đảm bảo dữ liệu kho câu hỏi luôn nhất quán.

#### Công dụng của code này

- Giúp mentor lưu trữ hàng trăm câu hỏi trắc nghiệm một cách khoa học.
- Giúp việc tạo bài kiểm tra (Quiz) tại mỗi node bài học trở nên nhanh chóng bằng cách trích xuất câu hỏi từ ngân hàng có sẵn.

---

### 3.5 Hồ Sơ Cá Nhân Mentor & Upload Ảnh Đại Diện

#### File code liên quan

- **Frontend**: [MentorProfilePage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorProfilePage.jsx), [userService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/userService.js), [mentorApplicationService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/mentorApplicationService.js)
- **Backend**: [user.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/user.js), [userService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/userService.js)

#### Nghiệp vụ

Quản lý thông tin thương hiệu cá nhân của Mentor trên hệ thống (chức danh, tiểu sử chuyên môn, ảnh đại diện, danh sách môn học & chuyên ngành đã được Admin phê duyệt giảng dạy). Giúp học viên và phụ huynh dễ dàng tìm hiểu thông tin, độ tin cậy cũng như năng lực chuyên môn của Mentor. Xử lý tải ảnh đại diện an toàn lên dịch vụ đám mây Cloudinary thông qua CDN tốc độ cao.

#### Tôi làm gì

- **Frontend**: Trong `MentorProfilePage.jsx`, hiển thị thông tin bằng cấp/chuyên ngành từ đơn đăng ký (`getMyApplication`), giải quyết Major ID sang tên chuyên ngành cụ thể, thiết kế Modal chỉnh sửa thông tin hồ sơ và tính năng chọn file ảnh đại diện.
- **Backend**: Trong route `PATCH /api/users/:id/avatar`, tích hợp middleware `singleMediaUpload` tiếp nhận file ảnh từ client, gọi `userService.updateAvatar()` đẩy file ảnh lên Cloudinary và lưu URL vào trường `avatar` của bảng `User`.

#### Tôi hoàn thành như thế nào

Tôi sử dụng cơ chế lưu trữ các tùy biến địa phương (`localStorage` overrides) được định danh theo từng ID tài khoản khác nhau nhằm đảm bảo khi mentor đăng nhập bằng các tài khoản khác nhau trên cùng trình duyệt sẽ không bị lẫn thông tin hiển thị hồ sơ cá nhân.

#### Công dụng của code này

- Giúp mentor cá nhân hóa tài khoản giảng dạy của mình.
- Cho phép hiển thị chuyên môn và các môn học được duyệt để tăng độ uy tín với học viên.

---

## 4. Kết quả tôi đã hoàn thành được

Sau khi tôi hoàn thiện phần việc của mình:

1. **Mentor Dashboard**: Hiển thị chính xác các số liệu thống kê thời gian thực từ database và tích hợp duyệt nhanh các tip của học viên đóng góp.
2. **Xem Lộ Trình & Xem Trước**: Quản lý danh sách lộ trình phân loại rõ ràng theo tab trạng thái, xem chi tiết bài học, các review đóng góp từ học viên và hỗ trợ chế độ xem trước hoàn chỉnh ở góc nhìn Mentee.
3. **Tạo & Chỉnh Sửa Lộ Trình**: Biểu mẫu tạo mới/sửa đổi lộ trình hoạt động ổn định, upload ảnh đại diện và lưu trữ thông tin không bị mất khi biên soạn Nodes học tập.
4. **Ngân Hàng Câu Hỏi**: Hỗ trợ đầy đủ các thao tác CRUD câu hỏi, validate chặt chẽ frontend, lọc câu hỏi trùng lặp thông minh và cập nhật đồng bộ các tùy chọn đáp án bằng transaction backend.
5. **Hồ Sơ Cá Nhân**: Cập nhật thông tin chi tiết, hiển thị các môn học được phê duyệt và hỗ trợ tải ảnh đại diện lên Cloudinary thành công.
6. **Toàn Bộ Mentor Flow**: Chạy mượt mà, sẵn sàng phục vụ demo end-to-end.

---

## 5. Những file nên mở ra khi review

Nếu cần chứng minh contribution bằng code, tôi sẽ mở các file sau:

### Frontend

- [MentorDashboardPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorDashboardPage.jsx)
- [MentorRoadmapsPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapsPage.jsx)
- [MentorRoadmapDetailPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapDetailPage.jsx)
- [CreateRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/CreateRoadmapPage.jsx)
- [EditRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/EditRoadmapPage.jsx)
- [QuestionBankPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/QuestionBankPage.jsx)
- [MentorProfilePage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorProfilePage.jsx)
- [MentorRoadmapLearningPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapLearningPage.jsx)

### Backend

- [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js)
- [questionBank.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/questionBank.js)
- [user.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/user.js)
- [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)
- [questionBankService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/questionBankService.js)
- [userService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/userService.js)

### Database

- [schema.prisma](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/schema.prisma)
- [seed.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/seed.js)

---

## 6. Câu nói ngắn để review

`Em phụ trách hoàn thiện toàn bộ luồng tính năng dành cho Mentor của EduPath theo hướng full-stack. Ở frontend, em phát triển các trang Mentor Dashboard (thống kê động, duyệt nhanh tips), Quản lý lộ trình (lọc theo tab, xem chi tiết, xem trước ở góc nhìn mentee qua MentorRoadmapLearningPage.jsx, tạo mới và chỉnh sửa lộ trình cùng Nodes học tập), Ngân hàng câu hỏi trắc nghiệm và trang Hồ sơ cá nhân tích hợp upload avatar. Ở backend, em viết các API thống kê dashboard, xử lý CRUD lộ trình (lưu nháp, gửi duyệt, xóa/ẩn an toàn), API cho ngân hàng câu hỏi bằng database transaction và API cập nhật thông tin/avatar lên Cloudinary. Ở database, em thiết kế cấu trúc bảng BankQuestion, BankQuestionOption và bổ sung dữ liệu seed phục vụ demo. Kết quả là luồng chuẩn bị bài học và quản lý của Mentor chạy ổn định end-to-end.`
