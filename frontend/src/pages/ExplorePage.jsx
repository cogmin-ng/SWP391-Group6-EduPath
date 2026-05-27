import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import ExploreFilters from '../features/explore/components/ExploreFilters';
import RoadmapCard from '../features/explore/components/RoadmapCard';
import { categories, mentors, roadmaps } from '../features/explore/data/roadmaps';

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function ExplorePage() {
  const [selectedCategories, setSelectedCategories] = useState(['Development']);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [sortBy, setSortBy] = useState('popular');

  const filteredRoadmaps = useMemo(() => {
    const filtered = roadmaps.filter((item) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const mentorMatch = selectedMentors.length === 0 || selectedMentors.includes(item.mentor);
      return categoryMatch && mentorMatch;
    });

    if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === 'duration') {
      return [...filtered].sort((a, b) => Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10));
    }

    return filtered;
  }, [selectedCategories, selectedMentors, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl pt-20">
        <ExploreFilters
          categories={categories}
          mentors={mentors}
          selectedCategories={selectedCategories}
          selectedMentors={selectedMentors}
          onToggleCategory={(category) => setSelectedCategories((prev) => toggleValue(prev, category))}
          onToggleMentor={(mentor) => setSelectedMentors((prev) => toggleValue(prev, mentor))}
        />

        <section className="flex-1 p-4 md:p-8">
          <nav className="mb-5 flex items-center gap-1 text-xs text-slate-500">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-medium text-slate-700">Explore Roadmaps</span>
          </nav>

          <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Explore Development Roadmaps</h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                Discover curated learning paths from mentors and follow a practical journey from foundation to advanced topics.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <span>Sort by:</span>
              <select
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="duration">Shortest Duration</option>
              </select>
            </label>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
