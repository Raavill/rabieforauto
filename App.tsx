import { useState } from 'react';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import HowItWorks from './sections/HowItWorks';
import KineticDataHelix from './sections/KineticDataHelix';
import KineticTextMarquee from './sections/KineticTextMarquee';
import PopularCategories from './sections/PopularCategories';
import Footer from './sections/Footer';
import SearchResults from './pages/SearchResults';
import AdminPanel from './pages/AdminPanel';

type Page = 'home' | 'search' | 'admin';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const goToSearch = (query: string) => {
    setSearchQuery(query);
    setPage('search');
  };

  if (page === 'admin') {
    return <AdminPanel onBack={() => setPage('home')} />;
  }

  if (page === 'search') {
    return <SearchResults query={searchQuery} onBack={() => setPage('home')} />;
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#000000' }}>
      <Navigation onAdminClick={() => setPage('admin')} onSearch={goToSearch} />
      <HeroSection onSearch={goToSearch} />
      <HowItWorks />
      <KineticDataHelix />
      <KineticTextMarquee />
      <PopularCategories onCategorySearch={goToSearch} />
      <Footer onAdminClick={() => setPage('admin')} />
    </div>
  );
}
