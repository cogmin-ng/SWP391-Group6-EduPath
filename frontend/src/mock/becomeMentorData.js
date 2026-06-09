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
  { value: "software-engineering", label: "Software Engineering" },
  { value: "information-assurance", label: "Information Assurance" },
  { value: "artificial-intelligence", label: "Artificial Intelligence" },
  { value: "digital-art-design", label: "Digital Art & Design" },
  { value: "information-system", label: "Information System" },
  { value: "iot", label: "IoT" },
];

export const SEMESTER_OPTIONS = [
  { value: "", label: "Chọn kỳ học" },
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
  { value: "5", label: "Semester 5" },
  { value: "6", label: "Semester 6" },
  { value: "7", label: "Semester 7" },
  { value: "8", label: "Semester 8" },
  { value: "9", label: "Semester 9" },
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
