/**
 * Mock / constant data for the Become-Mentor page.
 * Centralised here so the form options are easy to modify later
 * (e.g. when they come from an API instead).
 */

/* ------------------------------------------------------------------ */
/*  Dropdown options                                                   */
/* ------------------------------------------------------------------ */

export const SPECIALIZATION_OPTIONS = [
  { value: "", label: "Chọn chuyên ngành" },
  { value: "information-technology", label: "Công nghệ thông tin" },
  { value: "computer-science", label: "Khoa học máy tính" },
  { value: "communication-technology", label: "Công nghệ truyền thông" },
  { value: "business-administration", label: "Quản trị kinh doanh" },
  { value: "languages", label: "Ngôn ngữ" },
];

export const SEMESTER_OPTIONS = [
  { value: "", label: "Chọn kỳ học" },
  { value: "1", label: "Kì 1" },
  { value: "2", label: "Kì 2" },
  { value: "3", label: "Kì 3" },
  { value: "4", label: "Kì 4" },
  { value: "5", label: "Kì 5" },
  { value: "6", label: "Kì 6" },
  { value: "7", label: "Kì 7" },
  { value: "8", label: "Kì 8" },
  { value: "9", label: "Kì 9" },
  { value: "Đã tốt nghiệp", label: "Đã tốt nghiệp" },
];

/* ------------------------------------------------------------------ */
/*  File upload config                                                 */
/* ------------------------------------------------------------------ */

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/* ------------------------------------------------------------------ */
/*  Hero section content                                               */
/* ------------------------------------------------------------------ */

export const HERO_CONTENT = {
  title: "Trở thành Mentor",
  description:
    "Chia sẻ kiến thức, kinh nghiệm và đồng hành cùng người học trên hành trình phát triển học tập tại EduPath.",
};
