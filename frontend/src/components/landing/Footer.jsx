import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const footerLinks = [
  { label: 'Product', href: '#' },
  { label: 'Roadmaps', href: '#roadmaps' },
  { label: 'Mentors', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Community', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-6 h-6 text-indigo-600" />
              <span className="text-lg font-bold text-slate-900">EduPath</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-xs">
              © 2024 EduPath. Scholarly precision for modern engineering.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-500 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
