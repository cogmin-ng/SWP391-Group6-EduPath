import { useMemo, useState } from 'react';
import MenteeHeader from '../components/mentee/MenteeHeader';
import ExploreFilters from './mentee/features/explore/components/ExploreFilters';
import RoadmapCard from './mentee/features/explore/components/RoadmapCard';
import { categories, mentors, roadmaps } from './mentee/features/explore/data/roadmaps';

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
      <MenteeHeader />

      <main className="mx-auto flex w-full max-w-420 px-4 sm:px-6 lg:px-8 xl:px-10 pt-20">
        <ExploreFilters
          categories={categories}
          mentors={mentors}
          selectedCategories={selectedCategories}
          selectedMentors={selectedMentors}
          onToggleCategory={(category) => setSelectedCategories((prev) => toggleValue(prev, category))}
          onToggleMentor={(mentor) => setSelectedMentors((prev) => toggleValue(prev, mentor))}
        />

        <section className="flex-1 p-4 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredRoadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
