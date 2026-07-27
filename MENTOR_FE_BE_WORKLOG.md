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

- [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js)
- [questionBank.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/questionBank.js)
- [user.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/user.js)
- [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)
- [questionBankService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/questionBankService.js)
- [userService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/userService.js)

### Database ở đâu

- [schema.prisma](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/schema.prisma)
- [seed.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/seed.js)

---

## 3. Tôi đã làm gì ở Frontend

### 3.1 Mentor Dashboard

#### File code

- [MentorDashboardPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorDashboardPage.jsx)
- [roadmapService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/roadmapService.js)

#### Nghiệp vụ

Cung cấp cho Mentor một trung tâm điều khiển (Control Panel) để theo dõi tổng quan các chỉ số hoạt động giảng dạy (tổng lộ trình, số lượng mentee đang học, điểm đánh giá trung bình, số đóng góp bài học). Giúp mentor nắm bắt kịp thời các yêu cầu cần phê duyệt (như Mẹo học tập - Tips mà học viên đóng góp) và truy cập nhanh vào các lộ trình đang giảng dạy.

#### Tôi làm gì

Tôi chuyển Mentor Dashboard từ phụ thuộc dữ liệu giả sang sử dụng các API động từ hệ thống.

Cụ thể trong `MentorDashboardPage.jsx`, tôi:
- Dùng `useEffect` gọi `getMentorDashboardStats()` lấy dữ liệu thống kê thời gian thực của mentor (số lộ trình, đóng góp được duyệt, tổng số học viên học lộ trình của mình, điểm đánh giá trung bình).
- Gọi `getMentorRoadmaps()` lấy danh sách lộ trình của bản thân để lọc ra các lộ trình đang chờ duyệt (`status === 'PENDING'`) và các lộ trình đã được duyệt hoặc xuất bản (`APPROVED` / `PUBLISHED`) hiển thị lên lưới.
- Gọi `getPendingTips()` hiển thị 5 mẹo học tập (tips) mới nhất do học viên đóng góp đang chờ mentor duyệt, hỗ trợ duyệt nhanh ngay tại màn hình chính.

#### Tôi hoàn thành như thế nào

Tôi liên kết trực tiếp trang Dashboard với các service API backend, thay vì dùng dữ liệu tĩnh, giúp thông tin phản ánh đúng hoạt động giảng dạy của mentor.

Kết quả là:
- Các con số thống kê tự động cập nhật chính xác theo dữ liệu hệ thống.
- Các lộ trình chờ duyệt và đã xuất bản hiển thị tách biệt rõ ràng.
- Mentor có thể duyệt nhanh các tips của học viên gửi tới.

#### Công dụng của code này

- Là màn hình trung tâm quản lý hoạt động giảng dạy của mentor.
- Giúp theo dõi nhanh mức độ tương tác của học viên (số lượt học, điểm review).

---

### 3.2 Xem Lộ Trình & Xem Trước Với Góc Nhìn Học Viên (My Roadmaps, Detail & Mentee Preview)

#### File code

- [MentorRoadmapsPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapsPage.jsx)
- [MentorRoadmapDetailPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapDetailPage.jsx)
- [MentorRoadmapLearningPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorRoadmapLearningPage.jsx)

#### Nghiệp vụ

Cho phép Mentor quản lý danh mục tất cả lộ trình cá nhân theo từng giai đoạn vòng đời (Bản nháp DRAFT, Đang chờ duyệt PENDING, Đã xuất bản PUBLISHED), xem cấu trúc chi tiết bài giảng và đặc biệt là **trải nghiệm chế độ Xem trước với góc nhìn học viên (Mentee View Preview)** để kiểm tra giao diện học tập, thứ tự các Node, checklist, tài liệu và bài quiz trước khi xuất bản. Hỗ trợ quy trình xóa/ẩn lộ trình an toàn khi đã có học viên đăng ký học.

#### Tôi làm gì

Tôi phát triển luồng xem danh sách lộ trình cá nhân, xem chi tiết lộ trình và chế độ xem trước nội dung học tập ở góc nhìn mentee của mentor.

Cụ thể:
- Trong `MentorRoadmapsPage.jsx`, tôi phân chia giao diện thành 3 tab chính: `Lộ trình nháp` (`DRAFT`), `Đang chờ duyệt` (`PENDING`) và `Đã được duyệt` (`APPROVED`/`PUBLISHED`). Đồng thời, hỗ trợ chức năng xóa lộ trình (`deleteRoadmap`) kèm cảnh báo nếu lộ trình đã có học sinh đang theo học.
- Trong `MentorRoadmapDetailPage.jsx`, tôi sử dụng `useParams()` để lấy ID lộ trình, gọi `getRoadmapById(roadmapId)` hiển thị tổng quan lộ trình (hình nền, mô tả, tên mentor, số lượng học viên), danh sách chi tiết các Node thuộc chương trình học (`Curriculum Path`) và khu vực xem phản hồi đánh giá của học viên.
- Trong `MentorRoadmapLearningPage.jsx`, tôi phát triển trang **Xem trước lộ trình dưới góc nhìn Học viên (Mentee Perspective Preview)**. Tại đây, mentor có thể trải nghiệm toàn bộ giao diện bài học của mentee (`NodeHeader`, `NodeSidebar`, `Checklist`, `Materials`, `Quiz`, `Tips`, `Discussion`), chuyển đổi linh hoạt giữa các Node và kiểm tra tính trực quan của toàn bộ nội dung giáo án trước khi đưa vào giảng dạy chính thức.

#### Tôi hoàn thành như thế nào

Tôi đồng bộ hóa các bộ lọc trạng thái, cấu trúc curriculum và xây dựng chế độ Xem trước độc lập (Preview Mode) cách ly dữ liệu tiến độ để mentor vừa có quyền chỉnh sửa/quản trị ở trang Detail, vừa kiểm thử được trải nghiệm học tập chuẩn xác của mentee.

#### Công dụng của code này

- Giúp mentor theo dõi phân phối bài giảng, kiểm thử trải nghiệm bài học dưới góc nhìn mentee và nắm bắt nhận xét của học viên.
- Giúp tổ chức và dọn dẹp các lộ trình cũ/lỗi qua cơ chế xóa an toàn.

---

### 3.3 Tạo & Chỉnh Sửa Lộ Trình (Create & Edit Roadmap)

#### File code

- [CreateRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/CreateRoadmapPage.jsx)
- [EditRoadmapPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/EditRoadmapPage.jsx)
- [roadmapService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/roadmapService.js)

#### Tôi làm gì

Tôi xây dựng chức năng khởi tạo lộ trình học tập mới và sửa đổi nội dung lộ trình có sẵn kèm cơ chế lưu bản nháp/gửi phê duyệt.

Cụ thể trong các file này, tôi:
- Tạo các trường nhập liệu tên lộ trình, mô tả, chuyên ngành (category) và môn học liên kết (subjectId) được lọc tự động dựa trên các môn học mentor đã được Admin phê duyệt (`getMyApprovedSubjects`).
- Xử lý upload ảnh đại diện (thumbnail) sử dụng `FileReader` để chuyển file ảnh sang định dạng base64/data URL truyền lên backend.
- Hiển thị danh sách các Node học tập dạng dòng thời gian (timeline). Mỗi Node cho phép mentor chỉnh sửa chi tiết nội dung bài học, tài liệu, checklist hoặc bài kiểm tra (quizzes).
- Thiết lập logic nút "Lưu Nháp" (gọi `createRoadmap` hoặc `updateRoadmap` lưu trạng thái `DRAFT`) và nút "Cập Nhật & Gửi" (đưa lộ trình lên trạng thái chờ duyệt `PENDING` qua `submitRoadmap`).

#### Tôi hoàn thành như thế nào

Tôi áp dụng phương pháp truyền trạng thái biểu mẫu hiện tại (`formData` và `nodes` list) vào `location.state` khi điều hướng sang trang thiết kế chi tiết node học (`NodeEditorPage.jsx`) và nhận ngược lại dữ liệu khi quay về, giúp trải nghiệm thiết kế lộ trình của mentor không bị gián đoạn và không bị mất thông tin đang nhập dở.

#### Công dụng của code này

- Là công cụ biên soạn giáo án cốt lõi cho Mentor.
- Đảm bảo chất lượng lộ trình thông qua quy trình kiểm duyệt DRAFT -> PENDING -> APPROVED.

---

### 3.4 Ngân Hàng Câu Hỏi (Question Bank)

#### File code

- [QuestionBankPage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/QuestionBankPage.jsx)
- [questionBankService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/questionBankService.js)

#### Tôi làm gì

Tôi phát triển giao diện ngân hàng câu hỏi trắc nghiệm cá nhân của mentor để lưu trữ và tái sử dụng câu hỏi.

Cụ thể trong `QuestionBankPage.jsx`, tôi:
- Gọi API `getQuestionBank()` hiển thị danh sách câu hỏi kèm theo phân trang và các badge môn học, độ khó (`Dễ`, `Trung bình`, `Khó`).
- Tích hợp bộ lọc tìm kiếm theo từ khóa nội dung câu hỏi, lọc theo môn học và độ khó.
- Thiết kế Modal Thêm mới / Chỉnh sửa câu hỏi: Nhập đề bài, giải thích lý do đáp án đúng (explanation), chọn môn học liên quan, độ khó.
- Cho phép mentor thêm tối đa 8 đáp án trắc nghiệm (tối thiểu 2 đáp án) và chọn chính xác 1 đáp án đúng làm khóa đáp án chính. Gọi `createQuestion()` hoặc `updateQuestion()` để cập nhật dữ liệu.
- Xử lý nút xóa câu hỏi (`deleteQuestion`) khỏi kho lưu trữ đi kèm hộp thoại xác nhận.

#### Tôi hoàn thành như thế nào

Tôi thực hiện kiểm tra biểu mẫu (validation) chặt chẽ trên frontend: Đảm bảo người dùng nhập nội dung câu hỏi, chọn môn học, các đáp án không trống, và bắt buộc phải chọn đúng 1 đáp án đúng trước khi gửi payload lên server.

#### Công dụng của code này

- Giúp mentor lưu trữ hàng trăm câu hỏi trắc nghiệm một cách khoa học.
- Giúp việc tạo bài kiểm tra (Quiz) tại mỗi node bài học trở nên nhanh chóng bằng cách trích xuất câu hỏi từ ngân hàng có sẵn.

---

### 3.5 Hồ Sơ Cá Nhân Mentor

#### File code

- [MentorProfilePage.jsx](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/pages/mentor/MentorProfilePage.jsx)
- [userService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/userService.js)
- [mentorApplicationService.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/frontend/src/services/mentorApplicationService.js)

#### Tôi làm gì

Tôi hoàn thiện trang hiển thị và cập nhật hồ sơ cá nhân nâng cao của mentor.

Cụ thể trong `MentorProfilePage.jsx`, tôi:
- Hiển thị các thông tin cơ bản: Tên, email, chức danh công việc (title), tiểu sử chuyên môn (bio), vị trí địa lý, ngày tham gia và danh sách các kỹ năng chuyên môn (specialties).
- Hiển thị các thông tin chuyên ngành & danh mục đăng ký giảng dạy lấy từ đơn ứng tuyển của mentor (`getMyApplication`).
- Xây dựng Modal "Chỉnh sửa hồ sơ": Cho phép cập nhật thông tin tên hiển thị, chức danh, vị trí, chuyên ngành, học vị hiện tại và bio giới thiệu bản thân.
- Tích hợp tính năng đổi ảnh đại diện (avatar): Cho phép chọn file ảnh từ máy tính, gọi API `userService.updateAvatar()` để tải ảnh đại diện lên Cloudinary thông qua backend và cập nhật lại thông tin hiển thị trên header.

#### Tôi hoàn thành như thế nào

Tôi sử dụng cơ chế lưu trữ các tùy biến địa phương (`localStorage` overrides) được định danh theo từng ID tài khoản khác nhau nhằm đảm bảo khi mentor đăng nhập bằng các tài khoản khác nhau trên cùng trình duyệt sẽ không bị lẫn thông tin hiển thị hồ sơ cá nhân.

#### Công dụng của code này

- Giúp mentor cá nhân hóa tài khoản giảng dạy của mình.
- Cho phép hiển thị chuyên môn và các môn học được duyệt để tăng độ uy tín với học viên.

---

## 4. Tôi đã làm gì ở Backend

### 4.1 Thống kê và Quản lý Lộ trình của Mentor

#### File code

- [roadmap.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/roadmap.js)
- [roadmapService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/roadmapService.js)

#### Tôi làm gì

Tôi xây dựng các API cung cấp số liệu thống kê dashboard và quản lý trạng thái lộ trình của Mentor.

Cụ thể trong `roadmapService.js`, tôi triển khai:
- Hàm `getMentorDashboardStats()`: Thực hiện đếm số lượng lộ trình hoạt động của mentor, đếm tổng số học viên đăng ký học các lộ trình của mentor (`Enrollment`), tính điểm rating review trung bình và đếm tổng số tips đóng góp được phê duyệt.
- Hàm `getMentorRoadmaps()`: Truy vấn danh sách lộ trình do mentor sáng tạo hỗ trợ phân trang và đính kèm thông tin đếm số học viên đăng ký.
- Cơ chế xóa lộ trình (`deleteRoadmap`): Nếu lộ trình là bản nháp (`DRAFT`), tiến hành xóa mềm. Nếu lộ trình đã xuất bản (`PUBLISHED`) và có học viên đang học, tự động đổi trạng thái sang `ARCHIVED` (ẩn khỏi trang khám phá đối với mentee mới nhưng mentee cũ vẫn tiếp tục học) và gửi thông báo lên Admin phê duyệt yêu cầu xóa.

#### Công dụng của code này

- Đảm bảo dữ liệu thống kê trên giao diện mentor luôn chính xác.
- Bảo vệ tiến trình học tập của mentee thông qua cơ chế lưu trữ (archiving) thay vì xóa cứng lộ trình đang có người học.

---

### 4.2 API Ngân Hàng Câu Hỏi (Question Bank APIs)

#### File code

- [questionBank.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/questionBank.js)
- [questionBankService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/questionBankService.js)

#### Tôi làm gì

Tôi triển khai các API xử lý các thao tác của ngân hàng câu hỏi đi kèm cơ chế phân quyền bảo mật.

Cụ thể tôi xây dựng:
- Middleware phân quyền `requireRole(['MENTOR'])` cho toàn bộ các route trong `questionBank.js`.
- Logic tạo câu hỏi (`createBankQuestion`): Nhận thông tin đề bài, độ khó, môn học, explanation và tạo câu hỏi cùng danh sách tùy chọn đáp án trong một Prisma transaction để đảm bảo dữ liệu lưu trữ nhất quán.
- Logic cập nhật câu hỏi (`updateBankQuestion`): Cho phép thay đổi thông tin câu hỏi, đồng thời đồng bộ hóa danh sách đáp án bằng cách xóa các tùy chọn đáp án cũ và nạp lại tùy chọn mới trong transaction.
- Logic xóa câu hỏi (`deleteBankQuestion`): Xóa mềm câu hỏi thông qua việc đổi cờ `isDeleted = true`.

#### Công dụng của code này

- Ngăn chặn truy cập trái phép vào ngân hàng câu hỏi của mentor khác.
- Duy trì tính toàn vẹn dữ liệu trong database khi cập nhật hoặc chỉnh sửa danh sách đáp án trắc nghiệm.

---

### 4.3 API Cập nhật Thông tin & Avatar lên Cloudinary

#### File code

- [user.js (routes)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/routes/user.js)
- [userService.js (services)](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/src/services/userService.js)

#### Tôi làm gì

Tôi xử lý API cập nhật thông tin cá nhân và upload ảnh đại diện của mentor.

Cụ thể:
- Trong route `PATCH /api/users/:id/avatar`, tôi tích hợp middleware `singleMediaUpload` để tiếp nhận file ảnh từ client.
- Trong `userService.js`, tôi xử lý upload file ảnh nhận được lên dịch vụ Cloudinary để lấy URL trực tuyến, sau đó lưu URL này vào trường `avatarUrl`/`avatar` của user trong database.

#### Công dụng của code này

- Hỗ trợ lưu trữ tài nguyên đa phương tiện (ảnh avatar) an toàn, tải nhanh qua CDN của Cloudinary.
- Đồng bộ thông tin cá nhân của mentor xuyên suốt toàn hệ thống.

---

## 5. Tôi đã sửa gì ở Database / Prisma

### 5.1 Thiết kế Schema dữ liệu cho Ngân Hàng Câu Hỏi

#### File code

- [schema.prisma](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/schema.prisma)

#### Tôi làm gì

Tôi làm việc dựa trên cấu trúc các bảng hỗ trợ cho ngân hàng câu hỏi gồm:

- `BankQuestion`: Lưu trữ nội dung câu hỏi, giải thích đáp án (`explanation`), độ khó (`difficulty` dạng enum `DE`, `TRUNG_BINH`, `KHO`), môn học liên kết (`subjectId`), thông tin người tạo (`creatorId` liên kết với bảng `User`) và cờ xóa mềm `isDeleted`.
- `BankQuestionOption`: Lưu trữ nội dung đáp án (`content`), cờ đánh dấu đáp án đúng (`isCorrect`), liên kết với câu hỏi gốc (`questionId`) và cờ xóa mềm `isDeleted`.

#### Công dụng của phần này

- Cung cấp mô hình dữ liệu quan hệ hoàn chỉnh giúp liên kết câu hỏi trắc nghiệm với môn học và mentor sở hữu.
- Làm nền tảng để mentor trích xuất câu hỏi tạo thành các bài thi trắc nghiệm (Quizzes) trong các node bài học sau này.

---

### 5.2 Seed Dữ Liệu Thực cho Mentor và Câu Hỏi Mẫu

#### File code

- [seed.js](file:///c:/Users/Administrator/Documents/GitHub/SWP391-Group6-EduPath/SWP391-Group6-EduPath/backend/prisma/seed.js)

#### Tôi làm gì

Tôi bổ sung dữ liệu mẫu trong file seed của hệ thống:
- Tạo sẵn tài khoản mẫu mang role `MENTOR` phục vụ cho việc kiểm thử đăng nhập nhanh.
- Seed danh sách môn học được phê duyệt giảng dạy cho tài khoản mentor để hiển thị trên trang cá nhân và bộ lọc tạo lộ trình.
- Seed sẵn danh sách các câu hỏi trắc nghiệm mẫu trong `BankQuestion` và `BankQuestionOption` để đảm bảo ngân hàng câu hỏi có sẵn nội dung trực quan khi khởi động hệ thống.

#### Công dụng của phần này

- Đảm bảo môi trường chạy thử (demo) và kiểm thử (testing) có sẵn các dữ liệu cần thiết liên quan đến phân hệ Mentor.

---

## 6. Kết quả tôi đã hoàn thành được

Sau khi tôi hoàn thiện phần việc của mình:

1. **Mentor Dashboard**: Hiển thị chính xác các số liệu thống kê thời gian thực từ database và tích hợp duyệt nhanh các tip của học viên đóng góp.
2. **Xem Lộ Trình**: Quản lý danh sách lộ trình phân loại rõ ràng theo tab trạng thái, xem chi tiết bài học và các review đóng góp từ học viên.
3. **Tạo & Chỉnh Sửa Lộ Trình**: Biểu mẫu tạo mới/sửa đổi lộ trình hoạt động ổn định, upload ảnh đại diện và lưu trữ thông tin không bị mất khi biên soạn Nodes học tập.
4. **Ngân Hàng Câu Hỏi**: Hỗ trợ đầy đủ các thao tác CRUD câu hỏi, validate chặt chẽ frontend và cập nhật đồng bộ các tùy chọn đáp án bằng transaction backend.
5. **Hồ Sơ Cá Nhân**: Cập nhật thông tin chi tiết, hiển thị các môn học được phê duyệt và hỗ trợ tải ảnh đại diện lên Cloudinary thành công.
6. **Toàn Bộ Mentor Flow**: Chạy mượt mà, sẵn sàng phục vụ demo end-to-end.

---

## 7. Những file nên mở ra khi review

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

## 8. Câu nói ngắn để review

`Em phụ trách hoàn thiện toàn bộ luồng tính năng dành cho Mentor của EduPath theo hướng full-stack. Ở frontend, em phát triển các trang Mentor Dashboard (thống kê động, duyệt nhanh tips), Quản lý lộ trình (lọc theo tab, xem chi tiết, xem trước ở góc nhìn mentee qua MentorRoadmapLearningPage.jsx, tạo mới và chỉnh sửa lộ trình cùng Nodes học tập), Ngân hàng câu hỏi trắc nghiệm và trang Hồ sơ cá nhân tích hợp upload avatar. Ở backend, em viết các API thống kê dashboard, xử lý CRUD lộ trình (lưu nháp, gửi duyệt, xóa/ẩn an toàn), API cho ngân hàng câu hỏi bằng database transaction và API cập nhật thông tin/avatar lên Cloudinary. Ở database, em thiết kế cấu trúc bảng BankQuestion, BankQuestionOption và bổ sung dữ liệu seed phục vụ demo. Kết quả là luồng chuẩn bị bài học và quản lý của Mentor chạy ổn định end-to-end.`
