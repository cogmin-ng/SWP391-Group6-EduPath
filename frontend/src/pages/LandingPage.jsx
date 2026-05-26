import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import FeaturedRoadmaps from '../components/landing/FeaturedRoadmaps';
import Features from '../components/landing/Features';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedRoadmaps />
      <Features />
      <Footer />
    </div>
  );
}
