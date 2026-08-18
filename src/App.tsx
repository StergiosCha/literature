import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './components/Theme';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookPage from './pages/BookPage';
import Texts from './pages/Texts';
import TextPage from './pages/TextPage';
import Reviews from './pages/Reviews';
import Events from './pages/Events';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function ScrollTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo(0, 0); }, [pathname]); return null; }

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ScrollTop />
          <Header />
          <main id="main" className="page" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:slug" element={<BookPage />} />
              <Route path="/texts" element={<Texts />} />
              <Route path="/texts/:slug" element={<TextPage />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/events" element={<Events />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* old URLs from the previous static site */}
              <Route path="/texts/:slug.html" element={<TextPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
