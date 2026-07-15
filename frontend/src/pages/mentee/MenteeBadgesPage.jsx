import { useState, useEffect } from "react";
import { Award, Lock, Shield, Star, Zap } from "lucide-react";
import MenteeHeader from "../../components/mentee/MenteeHeader";
import { badgeService } from "../../services/badgeService";
import { useAuth } from "../../hooks/useAuth";

export default function MenteeBadgesPage() {
  const { user: authUser, updateUser } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const res = await badgeService.getMyBadges();
        if (res && res.data) {
          setBadges(res.data.badges || []);
          if (res.data.xp !== undefined && authUser && authUser.xp !== res.data.xp) {
            updateUser({ xp: res.data.xp });
          }
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.id) {
      fetchBadges();
    }
  }, [authUser?.id]);

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600/10 antialiased">
      <MenteeHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="text-3xl">🏆</span> Bộ sưu tập Huy hiệu
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Khám phá và mở khoá các cột mốc ý nghĩa trên con đường học tập cùng EduPath.
            </p>
          </div>
          <div className="text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full self-start md:self-auto shadow-sm">
            Đã mở khoá: {unlockedCount}/{badges.length}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 animate-pulse">Đang tải huy hiệu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => {
              const isUnlocked = badge.isUnlocked;
              return (
                <div
                  key={badge.id}
                  className={`relative rounded-2xl border p-6 flex flex-col items-center text-center transition-all duration-300 group hover:shadow-md ${
                    isUnlocked
                      ? "bg-gradient-to-br from-indigo-50/50 to-violet-50/50 border-indigo-100 hover:scale-105"
                      : "bg-slate-50/50 border-slate-100 opacity-60"
                  }`}
                >
                  {isUnlocked && (
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                  )}

                  {/* Badge Icon */}
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner ${
                      isUnlocked
                        ? badge.iconName === "zap"
                          ? "bg-amber-100 text-amber-600"
                          : badge.iconName === "award"
                            ? "bg-emerald-100 text-emerald-600"
                            : badge.iconName === "star"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-indigo-100 text-indigo-600"
                        : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {badge.iconName === "zap" ? (
                      <Zap className="w-10 h-10 animate-pulse" />
                    ) : badge.iconName === "award" ? (
                      <Award className="w-10 h-10" />
                    ) : badge.iconName === "star" ? (
                      <Star className="w-10 h-10" />
                    ) : badge.iconName === "shield" ? (
                      <Shield className="w-10 h-10" />
                    ) : (
                      <Award className="w-10 h-10" />
                    )}
                  </div>

                  {/* Lock status for locked badges */}
                  {!isUnlocked && (
                    <div className="absolute top-4 right-4 text-slate-400 bg-white rounded-full p-1.5 border border-slate-100 shadow-xs">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}

                  <h3 className={`font-bold text-base leading-tight ${isUnlocked ? "text-slate-800" : "text-slate-500"}`}>
                    {badge.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed flex-1">
                    {badge.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-slate-100/60 w-full flex items-center justify-between text-xs font-semibold">
                    <span className={`${isUnlocked ? "text-emerald-600" : "text-slate-400"}`}>
                      +{badge.xpReward} XP
                    </span>
                    {isUnlocked ? (
                      <span className="text-indigo-600 font-medium bg-white px-3 py-1 rounded-md shadow-xs">
                        Đã nhận ✨
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Chưa đạt</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500 mt-12">
        © 2026 EduPath. All rights reserved.
      </footer>
    </div>
  );
}
