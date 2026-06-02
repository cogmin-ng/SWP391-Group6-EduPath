import { HERO_CONTENT } from "../../mock/becomeMentorData";

/**
 * Hero banner at the top of the Become-Mentor page.
 * Displays a gradient card with headline, description, and illustration.
 */
export default function BecomeMentorHero() {
  return (
    <section className="rounded-3xl bg-[#635BFF] p-6 sm:p-10 lg:p-12 mb-8 overflow-hidden animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Text */}
        <div className="max-w-xl space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-white leading-tight">
            {HERO_CONTENT.title}
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            {HERO_CONTENT.description}
          </p>
        </div>

        {/* Illustration */}
        <div className="hidden lg:block shrink-0">
          <img
            src={HERO_CONTENT.image}
            alt="Mentor illustration"
            className="w-64 h-auto rounded-2xl object-contain"
          />
        </div>
      </div>
    </section>
  );
}
