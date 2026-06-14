export const jsQuizQuestions = [
  {
    id: 'q1',
    question: 'Phương thức nào dùng để thêm một phần tử vào cuối mảng trong JavaScript?',
    options: [
      { id: 'A', label: 'push()', isCorrect: true },
      { id: 'B', label: 'pop()', isCorrect: false },
      { id: 'C', label: 'shift()', isCorrect: false },
      { id: 'D', label: 'unshift()', isCorrect: false },
    ],
    explanation: 'push() thêm phần tử vào cuối mảng. pop() xóa phần tử cuối, shift() xóa phần tử đầu, unshift() thêm phần tử vào đầu mảng.',
  },
  {
    id: 'q2',
    question: 'Từ khóa nào dùng để khai báo hằng số trong JavaScript (ES6)?',
    options: [
      { id: 'A', label: 'var', isCorrect: false },
      { id: 'B', label: 'let', isCorrect: false },
      { id: 'C', label: 'const', isCorrect: true },
      { id: 'D', label: 'static', isCorrect: false },
    ],
    explanation: 'const khai báo hằng số, không thể gán lại. var và let khai báo biến có thể thay đổi. static dùng trong class, không phải để khai báo hằng.',
  },
  {
    id: 'q3',
    question: 'Giá trị của typeof null trong JavaScript là gì?',
    options: [
      { id: 'A', label: '"null"', isCorrect: false },
      { id: 'B', label: '"undefined"', isCorrect: false },
      { id: 'C', label: '"object"', isCorrect: true },
      { id: 'D', label: '"boolean"', isCorrect: false },
    ],
    explanation: 'Đây là một lỗi nổi tiếng từ phiên bản đầu của JavaScript. typeof null trả về "object" do cách lưu trữ nhị phân của null giống object lúc thiết kế ngôn ngữ.',
  },
  {
    id: 'q4',
    question: 'Phương thức nào tạo một mảng mới từ kết quả của một hàm callback?',
    options: [
      { id: 'A', label: 'forEach()', isCorrect: false },
      { id: 'B', label: 'filter()', isCorrect: false },
      { id: 'C', label: 'reduce()', isCorrect: false },
      { id: 'D', label: 'map()', isCorrect: true },
    ],
    explanation: 'map() tạo mảng mới với cùng số phần tử, mỗi phần tử là kết quả của callback. forEach() chỉ duyệt, filter() lọc phần tử, reduce() gom thành một giá trị duy nhất.',
  },
  {
    id: 'q5',
    question: 'Kết quả của 2 + "2" trong JavaScript là gì?',
    options: [
      { id: 'A', label: '4', isCorrect: false },
      { id: 'B', label: '"22"', isCorrect: true },
      { id: 'C', label: '22', isCorrect: false },
      { id: 'D', label: 'TypeError', isCorrect: false },
    ],
    explanation: 'Khi cộng số và chuỗi, JavaScript ưu tiên nối chuỗi. Số 2 được ép kiểu thành chuỗi "2", kết quả là "22" (kiểu string). Không phải TypeError vì JS tự động ép kiểu.',
  },
  {
    id: 'q6',
    question: 'Toán tử nào dùng để so sánh cả giá trị và kiểu dữ liệu?',
    options: [
      { id: 'A', label: '==', isCorrect: false },
      { id: 'B', label: '===', isCorrect: true },
      { id: 'C', label: '=', isCorrect: false },
      { id: 'D', label: '!=', isCorrect: false },
    ],
    explanation: '=== so sánh chặt (strict), kiểm tra cả giá trị lẫn kiểu. == chỉ so sánh giá trị sau khi ép kiểu tự động, dễ gây lỗi ngầm. = là phép gán, != là so sánh khác (không chặt).',
  },
  {
    id: 'q7',
    question: 'Hàm nào dùng để chuyển đổi JSON thành object trong JavaScript?',
    options: [
      { id: 'A', label: 'JSON.stringify()', isCorrect: false },
      { id: 'B', label: 'JSON.parse()', isCorrect: true },
      { id: 'C', label: 'JSON.convert()', isCorrect: false },
      { id: 'D', label: 'JSON.toObject()', isCorrect: false },
    ],
    explanation: 'JSON.parse() chuyển chuỗi JSON thành object. JSON.stringify() làm ngược lại (object → chuỗi). convert() và toObject() không tồn tại trong API JSON.',
  },
  {
    id: 'q8',
    question: 'setTimeout(fn, 0) được dùng để làm gì?',
    options: [
      { id: 'A', label: 'Gọi hàm ngay lập tức', isCorrect: false },
      { id: 'B', label: 'Đưa hàm vào hàng đợi sau khi stack hiện tại xong', isCorrect: true },
      { id: 'C', label: 'Dừng thực thi chương trình', isCorrect: false },
      { id: 'D', label: 'Gọi hàm sau 0 giây đồng bộ', isCorrect: false },
    ],
    explanation: 'setTimeout(fn, 0) không gọi hàm ngay lập tức. Nó đưa hàm vào macrotask queue, chỉ thực thi sau khi call stack hiện tại và tất cả microtasks hoàn thành (event loop mechanism).',
  },
  {
    id: 'q9',
    question: 'Phương thức nào kiểm tra một mảng có chứa phần tử hay không?',
    options: [
      { id: 'A', label: 'contains()', isCorrect: false },
      { id: 'B', label: 'has()', isCorrect: false },
      { id: 'C', label: 'includes()', isCorrect: true },
      { id: 'D', label: 'indexOf()', isCorrect: false },
    ],
    explanation: 'includes() trả về true/false nếu phần tử tồn tại trong mảng. indexOf() trả về chỉ số (hoặc -1), không phải boolean. contains() và has() không phải method của Array.',
  },
  {
    id: 'q10',
    question: 'Arrow function khác function thường ở điểm nào?',
    options: [
      { id: 'A', label: 'Không có this riêng', isCorrect: true },
      { id: 'B', label: 'Không thể gán cho biến', isCorrect: false },
      { id: 'C', label: 'Luôn trả về undefined', isCorrect: false },
      { id: 'D', label: 'Không thể nhận tham số', isCorrect: false },
    ],
    explanation: 'Arrow function kế thừa this từ ngữ cảnh cha (lexical this), không tạo this riêng. Function thường có this riêng phụ thuộc vào cách gọi. Arrow function vẫn nhận tham số và gán cho biến bình thường.',
  },
  {
    id: 'q11',
    question: 'Event loop trong JavaScript xử lý các tác vụ như thế nào?',
    options: [
      { id: 'A', label: 'Đồng bộ hoàn toàn', isCorrect: false },
      { id: 'B', label: 'Dùng microtasks trước, macrotasks sau', isCorrect: true },
      { id: 'C', label: 'Xử lý macrotasks trước', isCorrect: false },
      { id: 'D', label: 'Chỉ xử lý callback', isCorrect: false },
    ],
    explanation: 'Event loop ưu tiên xử lý hết microtasks queue (Promise.then, MutationObserver) trước khi xử lý một macrotask (setTimeout, DOM event). Sau mỗi macrotask, nó lại quét microtasks tiếp.',
  },
  {
    id: 'q12',
    question: 'Kết quả của [] + [] trong JavaScript là gì?',
    options: [
      { id: 'A', label: '[]', isCorrect: false },
      { id: 'B', label: '"" (chuỗi rỗng)', isCorrect: true },
      { id: 'C', label: '0', isCorrect: false },
      { id: 'D', label: 'undefined', isCorrect: false },
    ],
    explanation: 'Toán tử + gọi ép kiểu về string cho object. [].toString() = "", nên [] + [] = "" + "" = "" (chuỗi rỗng). Đây là một trong những behavior kỳ lạ của JavaScript.',
  },
];
