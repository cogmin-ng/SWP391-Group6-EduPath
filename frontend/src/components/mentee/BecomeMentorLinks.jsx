import { Globe, Link, Link2 } from "lucide-react";

/**
 * Portfolio and personal links form section.
 *
 * @param {{ register: Function }} props
 */
export default function BecomeMentorLinks({ register }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm mb-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600">
          <Link2 className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Portfolio & Liên kết cá nhân
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            LinkedIn
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Link className="w-4 h-4" />
            </div>
            <input
              type="url"
              placeholder="linkedin.com/in/username"
              {...register("linkedinUrl")}
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 pl-10 pr-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            GitHub
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Link className="w-4 h-4" />
            </div>
            <input
              type="url"
              placeholder="github.com/username"
              {...register("githubUrl")}
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 pl-10 pr-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300"
            />
          </div>
        </div>

        {/* Portfolio Website */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Portfolio Website
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="url"
              placeholder="https://yourportfolio.com"
              {...register("portfolioUrl")}
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 pl-10 pr-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300"
            />
          </div>
        </div>

        {/* Website cá nhân */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Website cá nhân
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Globe className="w-4 h-4" />
            </div>
            <input
              type="url"
              placeholder="https://yourwebsite.com"
              {...register("personalWebsiteUrl")}
              className="w-full rounded-xl border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-400 pl-10 pr-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
