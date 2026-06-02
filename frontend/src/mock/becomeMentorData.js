/**
 * Mock / constant data for the Become-Mentor page.
 * Centralised here so the form options are easy to modify later
 * (e.g. when they come from an API instead).
 */

export const EXPERIENCE_OPTIONS = [
  { value: "", label: "Chọn số năm" },
  { value: "1-2", label: "1-2 năm" },
  { value: "3-5", label: "3-5 năm" },
  { value: "5-10", label: "5-10 năm" },
  { value: "10+", label: "Trên 10 năm" },
];

export const SPECIALIZATION_OPTIONS = [
  { value: "", label: "Chọn lĩnh vực" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "mobile", label: "Mobile" },
  { value: "uiux", label: "UI/UX" },
  { value: "data-science", label: "Data Science" },
  { value: "devops", label: "DevOps" },
];

export const ACCEPTED_FILE_EXTENSIONS = ["pdf", "doc", "docx"];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const HERO_CONTENT = {
  title: "Trở thành Mentor",
  description:
    "Chia sẻ kiến thức, kinh nghiệm và đồng hành cùng người học trên hành trình phát triển sự nghiệp. Gia nhập cộng đồng chuyên gia hàng đầu tại EduPath.",
  image: "/images/mentor-hero.png",
};
