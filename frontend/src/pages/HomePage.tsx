import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import AILearningFlowSection from "../components/home/AILearningFlowSection";
import CourseHighlightSection from "../components/home/CourseHighlightSection";
import CTASection from "../components/home/CTASection";
import FeatureSection from "../components/home/FeatureSection";
import HeroSection from "../components/home/HeroSection";

function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <CourseHighlightSection />
        <AILearningFlowSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
