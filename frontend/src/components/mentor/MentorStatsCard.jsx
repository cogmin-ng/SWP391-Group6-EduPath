import * as Icons from 'lucide-react';

const MentorStatsCard = ({ label, value, icon, color, trend }) => {
  const IconComponent = Icons[icon];
  const isPositive = trend.includes('+') || trend.includes('higher');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} bg-opacity-10 rounded-xl flex items-center justify-center text-opacity-100 ${color.replace(
            'bg-',
            'text-'
          )}`}
        >
          <IconComponent className="w-6 h-6" />
        </div>
        <div
          className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
            isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}
        >
          {trend}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
};

export default MentorStatsCard;
