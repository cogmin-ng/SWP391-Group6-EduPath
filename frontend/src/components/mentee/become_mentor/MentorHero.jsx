import { HERO_CONTENT } from "../../../mock/becomeMentorData";

/**
 * Hero banner – 2-column layout with title/description on the left
 * and an SVG mentor illustration on the right.
 */
export default function MentorHero() {
  return (
    <section className="rounded-3xl bg-[#635BFF] p-6 lg:p-8 mb-8 overflow-hidden animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
        {/* ---- Text ---- */}
        <div className="w-full lg:w-[55%] xl:w-[60%] space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
            {HERO_CONTENT.description}
          </p>
        </div>

        {/* ---- Illustration (inline SVG) ---- */}
        <div className="hidden lg:flex w-full lg:w-[45%] xl:w-[40%] shrink-0 items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[380px] aspect-[320/220] flex items-end justify-center">
            {/* Background card */}
            <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm" />

            {/* Mentor illustration – simplified flat SVG */}
            <svg
              viewBox="0 0 320 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 w-full h-full"
            >
              {/* Desk */}
              <rect x="60" y="160" width="200" height="8" rx="4" fill="#CBD5E1" />
              <rect x="80" y="168" width="8" height="32" rx="2" fill="#94A3B8" />
              <rect x="232" y="168" width="8" height="32" rx="2" fill="#94A3B8" />

              {/* Laptop */}
              <rect x="110" y="120" width="100" height="42" rx="4" fill="#334155" />
              <rect x="116" y="126" width="88" height="30" rx="2" fill="#818CF8" />
              <rect x="100" y="160" width="120" height="4" rx="2" fill="#475569" />

              {/* Person 1 (mentor) */}
              <circle cx="130" cy="80" r="18" fill="#F8FAFC" />
              <circle cx="130" cy="80" r="18" fill="#6366F1" opacity="0.15" />
              <circle cx="130" cy="75" r="12" fill="#4F46E5" />
              <rect x="118" y="60" width="24" height="8" rx="4" fill="#312E81" />
              {/* Body */}
              <path
                d="M110 110 C110 95 120 90 130 90 C140 90 150 95 150 110"
                fill="#4F46E5"
              />
              {/* Glasses */}
              <circle cx="125" cy="76" r="4" stroke="#312E81" strokeWidth="1.5" fill="none" />
              <circle cx="135" cy="76" r="4" stroke="#312E81" strokeWidth="1.5" fill="none" />
              <line x1="129" y1="76" x2="131" y2="76" stroke="#312E81" strokeWidth="1.5" />

              {/* Person 2 (mentee) */}
              <circle cx="200" cy="85" r="16" fill="#F8FAFC" />
              <circle cx="200" cy="85" r="16" fill="#818CF8" opacity="0.15" />
              <circle cx="200" cy="80" r="10" fill="#818CF8" />
              <rect x="190" y="66" width="20" height="7" rx="3.5" fill="#4338CA" />
              {/* Body */}
              <path
                d="M182 115 C182 102 190 97 200 97 C210 97 218 102 218 115"
                fill="#818CF8"
              />

              {/* Book / document on desk */}
              <rect x="80" y="145" width="24" height="16" rx="2" fill="#E0E7FF" />
              <line x1="84" y1="150" x2="100" y2="150" stroke="#A5B4FC" strokeWidth="1.5" />
              <line x1="84" y1="154" x2="96" y2="154" stroke="#A5B4FC" strokeWidth="1.5" />

              {/* Coffee mug */}
              <rect x="240" y="146" width="14" height="16" rx="3" fill="#FDE68A" />
              <path d="M254 150 C260 150 260 158 254 158" stroke="#FDE68A" strokeWidth="2" fill="none" />

              {/* Floating elements */}
              <circle cx="70" cy="50" r="4" fill="#A5B4FC" opacity="0.5" />
              <circle cx="260" cy="40" r="3" fill="#C4B5FD" opacity="0.5" />
              <rect x="50" y="90" width="8" height="8" rx="2" fill="#E0E7FF" opacity="0.5" transform="rotate(15 54 94)" />
              <rect x="270" y="80" width="6" height="6" rx="1.5" fill="#DDD6FE" opacity="0.5" transform="rotate(-10 273 83)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
