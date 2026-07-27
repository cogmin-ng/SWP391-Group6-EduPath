const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  // 1. Find all mentor users
  const mentors = await prisma.user.findMany({
    where: {
      role: { name: 'MENTOR' },
      isDeleted: false,
    },
  });

  if (mentors.length === 0) {
    console.error('No mentor accounts found in the database. Please seed the database first.');
    process.exit(1);
  }

  // 2. Find subjects by their correct name codes (e.g. PRJ301, SWP391, MAS291)
  const javaSubject = await prisma.subject.findFirst({
    where: { name: 'PRJ301', isDeleted: false },
  });
  const swpSubject = await prisma.subject.findFirst({
    where: { name: 'SWP391', isDeleted: false },
  });
  const probSubject = await prisma.subject.findFirst({
    where: { name: 'MAS291', isDeleted: false },
  });

  if (!javaSubject || !swpSubject || !probSubject) {
    console.error('Subjects not found. Please run seed first to create PRJ301, SWP391, and MAS291.');
    process.exit(1);
  }

  const baseQuestionsData = [
    // Java Web Application Development questions
    {
      subjectId: javaSubject.id,
      difficulty: 'DE',
      question: 'Servlet Lifecycle trong Java Web bao gồm các phương thức chính nào theo thứ tự?',
      explanation: 'Vòng đời của Servlet gồm 3 giai đoạn: khởi tạo (init), phục vụ yêu cầu (service) và hủy (destroy).',
      options: [
        { content: 'init(), service(), destroy()', isCorrect: true },
        { content: 'start(), execute(), stop()', isCorrect: false },
        { content: 'init(), execute(), close()', isCorrect: false },
        { content: 'onCreate(), onStart(), onDestroy()', isCorrect: false }
      ]
    },
    {
      subjectId: javaSubject.id,
      difficulty: 'TRUNG_BINH',
      question: 'Trong mô hình MVC, vai trò chính của Controller là gì?',
      explanation: 'Controller tiếp nhận yêu cầu từ client, xử lý logic điều hướng, giao tiếp với Model để cập nhật dữ liệu và chọn View phù hợp để hiển thị.',
      options: [
        { content: 'Tiếp nhận request, điều hướng dữ liệu giữa Model và View', isCorrect: true },
        { content: 'Kết nối và truy vấn trực tiếp với cơ sở dữ liệu', isCorrect: false },
        { content: 'Xây dựng giao diện HTML/CSS hiển thị cho người dùng', isCorrect: false },
        { content: 'Lưu trữ trạng thái đăng nhập của Session', isCorrect: false }
      ]
    },
    {
      subjectId: javaSubject.id,
      difficulty: 'KHO',
      question: 'Cơ chế hoạt động của Spring Security SecurityContextHolder là gì?',
      explanation: 'SecurityContextHolder sử dụng ThreadLocal theo mặc định để lưu trữ chi tiết bảo mật của context hiện tại liên kết với luồng xử lý yêu cầu.',
      options: [
        { content: 'Sử dụng ThreadLocal để lưu trữ thông tin Authentication của luồng hiện tại', isCorrect: true },
        { content: 'Lưu trữ thông tin xác thực trực tiếp vào HTTP Session', isCorrect: false },
        { content: 'Sử dụng database để cache thông tin người dùng mỗi lần request', isCorrect: false },
        { content: 'Là một Servlet filter lưu trữ token JWT trong RAM', isCorrect: false }
      ]
    },

    // Software Development Project questions
    {
      subjectId: swpSubject.id,
      difficulty: 'DE',
      question: 'Trong quy trình Scrum, Daily Scrum (họp hằng ngày) thường diễn ra trong bao lâu?',
      explanation: 'Daily Scrum là cuộc họp ngắn hằng ngày của Development Team kéo dài tối đa 15 phút để đồng bộ công việc.',
      options: [
        { content: '15 phút', isCorrect: true },
        { content: '30 phút', isCorrect: false },
        { content: '5 phút', isCorrect: false },
        { content: '1 tiếng', isCorrect: false }
      ]
    },
    {
      subjectId: swpSubject.id,
      difficulty: 'TRUNG_BINH',
      question: 'Yêu cầu phi chức năng (Non-functional requirement) nào sau đây mô tả khả năng chịu tải của hệ thống?',
      explanation: 'Khả năng chịu tải, tốc độ phản hồi thuộc về Performance (Hiệu năng) của phần mềm.',
      options: [
        { content: 'Hiệu năng và khả năng mở rộng (Performance & Scalability)', isCorrect: true },
        { content: 'Chức năng đăng nhập bằng Google Oauth2', isCorrect: false },
        { content: 'Tính năng xuất báo cáo ra file Excel', isCorrect: false },
        { content: 'Giao diện thân thiện với người dùng', isCorrect: false }
      ]
    },
    {
      subjectId: swpSubject.id,
      difficulty: 'KHO',
      question: 'Khi áp dụng mô hình Git Branching (GitFlow), nhánh nào luôn phản ánh trạng thái production mới nhất?',
      explanation: 'Nhánh main (hoặc master) chứa code ổn định nhất và luôn sẵn sàng để deploy lên môi trường production.',
      options: [
        { content: 'main (hoặc master)', isCorrect: true },
        { content: 'develop', isCorrect: false },
        { content: 'feature', isCorrect: false },
        { content: 'release', isCorrect: false }
      ]
    },

    // Probability and Statistics questions
    {
      subjectId: probSubject.id,
      difficulty: 'DE',
      question: 'Công thức tính xác suất của biến cố A là gì?',
      explanation: 'P(A) = n(A) / n(Omega), tức là số kết quả thuận lợi chia cho tổng số kết quả đồng khả năng.',
      options: [
        { content: 'Số kết quả thuận lợi cho A chia cho tổng số kết quả có thể xảy ra', isCorrect: true },
        { content: 'Tổng số kết quả chia cho số kết quả thuận lợi cho A', isCorrect: false },
        { content: 'Tích của số kết quả thuận lợi và tổng số kết quả', isCorrect: false },
        { content: 'Hiệu giữa tổng số kết quả và số kết quả thuận lợi', isCorrect: false }
      ]
    },
    {
      subjectId: probSubject.id,
      difficulty: 'TRUNG_BINH',
      question: 'Độ lệch chuẩn (Standard Deviation) đo lường điều gì trong một tập dữ liệu?',
      explanation: 'Độ lệch chuẩn đo lường mức độ phân tán của các điểm dữ liệu so với giá trị trung bình (Mean).',
      options: [
        { content: 'Mức độ phân tán của dữ liệu xung quanh giá trị trung bình', isCorrect: true },
        { content: 'Giá trị xuất hiện nhiều nhất trong tập dữ liệu', isCorrect: false },
        { content: 'Giá trị nằm ở chính giữa tập dữ liệu đã sắp xếp', isCorrect: false },
        { content: 'Hiệu giữa giá trị lớn nhất và nhỏ nhất', isCorrect: false }
      ]
    },
    {
      subjectId: probSubject.id,
      difficulty: 'KHO',
      question: 'Định lý giới hạn trung tâm (Central Limit Theorem) phát biểu điều gì về phân phối của số trung bình mẫu?',
      explanation: 'Định lý giới hạn trung tâm phát biểu rằng khi kích thước mẫu n đủ lớn (thường n >= 30), phân phối của số trung bình mẫu sẽ xấp xỉ phân phối chuẩn (Normal Distribution) bất kể phân phối của quần thể ban đầu.',
      options: [
        { content: 'Phân phối của số trung bình mẫu sẽ xấp xỉ phân phối chuẩn khi kích thước mẫu đủ lớn', isCorrect: true },
        { content: 'Số trung bình của quần thể luôn bằng số trung bình mẫu', isCorrect: false },
        { content: 'Tổng xác suất của mọi biến cố liên tục luôn bằng 1', isCorrect: false },
        { content: 'Mọi tập dữ liệu đều có phân phối đối xứng hoàn hảo', isCorrect: false }
      ]
    }
  ];

  console.log(`Seeding bank questions for ${mentors.length} mentors...`);

  let totalSeeded = 0;
  for (const mentor of mentors) {
    // Delete any old questions for this mentor to keep it clean and avoid duplicates
    await prisma.bankQuestion.deleteMany({
      where: { creatorId: mentor.id }
    });

    for (const q of baseQuestionsData) {
      await prisma.bankQuestion.create({
        data: {
          question: q.question,
          explanation: q.explanation,
          difficulty: q.difficulty,
          subjectId: q.subjectId,
          creatorId: mentor.id,
          options: {
            create: q.options
          }
        }
      });
      totalSeeded++;
    }
    console.log(`Seeded 9 questions for mentor: ${mentor.email}`);
  }

  console.log(`Done! Successfully seeded a total of ${totalSeeded} questions across all ${mentors.length} mentors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
