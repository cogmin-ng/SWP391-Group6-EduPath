import { useEffect, useMemo, useState } from 'react';
import MenteeHeader from '../components/mentee/MenteeHeader';
import ExploreFilters from './mentee/features/explore/components/ExploreFilters';
import RoadmapCard from './mentee/features/explore/components/RoadmapCard';
import { exploreService } from '../services/exploreService';
import { subjectCategoryService } from '../services/subjectCategoryService';

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function ExplorePage() {
  const [exploreRoadmaps, setExploreRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMentors, setSelectedMentors] = useState([]);
  const [mentorQuery, setMentorQuery] = useState('');
  const [sortBy] = useState('popular');

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const data = await subjectCategoryService.getSubjectCategories();
        if (!isMounted) return;
        setCategories(data.map((category) => category.name));
      } catch (error) {
        console.error('Failed to fetch subject categories:', error);
        if (!isMounted) return;
        setCategories([]);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchLearningPaths = async () => {
      try {
        const data = await exploreService.getLearningPaths();
        if (!isMounted) return;

        setExploreRoadmaps(
          data.map((roadmap) => ({
            ...roadmap,
            cover:
              roadmap.cover ||
              'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80',
            duration: roadmap.duration || 'N/A',
          })),
        );
      } catch (error) {
        console.error('Failed to fetch learning paths:', error);
        if (!isMounted) return;
        setExploreRoadmaps([]);
      }
    };

    fetchLearningPaths();

    return () => {
      isMounted = false;
    };
  }, []);

  const mentors = useMemo(
    () => [...new Set(exploreRoadmaps.map((roadmap) => roadmap.mentor).filter(Boolean))],
    [exploreRoadmaps],
  );

  const filteredMentors = useMemo(() => {
    const normalizedQuery = mentorQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return mentors;
    }

    return mentors.filter((mentor) => mentor.toLowerCase().includes(normalizedQuery));
  }, [mentorQuery, mentors]);

  const filteredRoadmaps = useMemo(() => {
    const filtered = exploreRoadmaps.filter((item) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const mentorMatch = selectedMentors.length === 0 || selectedMentors.includes(item.mentor);
      return categoryMatch && mentorMatch;
    });

    if (sortBy === 'rating') {
      return [...filtered].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    if (sortBy === 'duration') {
      return [...filtered].sort((a, b) => Number.parseInt(a.duration, 10) - Number.parseInt(b.duration, 10));
    }

    return filtered;
  }, [exploreRoadmaps, selectedCategories, selectedMentors, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <MenteeHeader />

      <main className="mx-auto flex w-full max-w-420 px-4 sm:px-6 lg:px-8 xl:px-10 pt-20">
        <ExploreFilters
          categories={categories}
          mentors={filteredMentors}
          selectedCategories={selectedCategories}
          selectedMentors={selectedMentors}
          mentorQuery={mentorQuery}
          onMentorQueryChange={setMentorQuery}
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
