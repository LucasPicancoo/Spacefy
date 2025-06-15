import React, { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-[#00A3FF] text-white p-4 rounded-full shadow-lg hover:bg-[#0084CC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-opacity-50 z-50"
      aria-label="Voltar ao topo da página"
      aria-hidden={!showScrollTop}
      role="button"
      aria-controls="main-content"
    >
      <FaChevronUp 
        className="text-xl" 
        aria-hidden="true"
      />
      <span className="sr-only">Clique para voltar ao início da página</span>
    </button>
  );
};

export default ScrollToTopButton; 