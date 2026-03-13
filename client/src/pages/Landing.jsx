import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Demo from "../components/landing/Demo";
import Features from "../components/landing/Features";
import ArticlesSnippets from "../components/landing/Snippets";
import DashboardPreview from "../components/landing/DashboardPreview";
import Footer from "../components/landing/Footer";

const Landing = () => {
  return (
    <div className="bg-[var(--bg-primary)] text-[var(--text-main)]">
        <Navbar />
        <Hero />
        <Features />
        <Demo />
        <ArticlesSnippets />
        <DashboardPreview />
        <Footer />
    </div>
  );
};

export default Landing;  