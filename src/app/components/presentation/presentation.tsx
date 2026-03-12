import { useState, useEffect } from 'react';
import leadWalnutLogo from '../../../assets/a333b5825a4a62c2c92f9a565cc6c2e7687f36c8.png';
import fortinetLogo from '../../../assets/291fe7dc7e80adc4e8b6918682e87e66ec6d5520.png';
import { SlideCover } from './slide-cover';
import { SlideTOC } from './slide-toc';
import { SlideTrafficOverviewDivider } from './slide-traffic-overview-divider';
import { SlideTrafficOverviewTabs } from './slide-traffic-overview-tabs';
import { SlideTrafficOverviewTabsWW } from './slide-traffic-overview-tabs-ww';
import { SlideKeywordDivider } from './slide-keyword-divider';
import { SlideOpportunities } from './slide-opportunities';
import { SlideCategoryDivider } from './slide-category-divider';
import { SlideNGFW } from './slide-ngfw';
import { SlideDashboard } from './slide-dashboard';
import { SlideOTSecurity } from './slide-ot-security';
import { SlideSDWANMetrics } from './slide-sdwan-metrics';
import { SlideZeroTrust } from './slide-zero-trust';
import { SlideCloudSecurity } from './slide-cloud-security';
import { SlideRansomware } from './slide-ransomware';
import { SlideAICyberSecurity } from './slide-ai-cybersecurity';
import { SlideQuantumSecurity } from './slide-quantum-security';
import { SlideLLMDivider } from './slide-llm-divider';
import { SlideProfundMetrics } from './slide-profund-metrics';
import { SlideAIOverview } from './slide-ai-overview';
import { SlideCategoryPerformance } from './slide-category-performance';
import { SlideBacklinkDivider } from './slide-backlink-divider';
import { SlideBacklinks } from './slide-backlinks';
import { SlideIntelDivider } from './slide-intel-divider';
import { SlideCompetitiveIntel } from './slide-competitive-intel';
import { SlideKeywordGap } from './slide-keyword-gap';
import { SlideCompetitiveFindings } from './slide-competitive-findings';
import { SlideThankYou } from './slide-thank-you';

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide < 27) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToHome = () => {
    setCurrentSlide(1); // Navigate to Table of Contents (slide 1)
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        goToNextSlide();
      } else if (event.key === 'ArrowLeft') {
        goToPreviousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  // Keyboard navigation from parent iframe (Webflow fix)
// useEffect(() => {
//   const handleMessage = (event: MessageEvent) => {
//     const allowedOrigins = [
//       "https://fortinet-competition-report.vercel.app/",
//       "https://lwstaging.webflow.io",
//       "https://www.leadwalnut.com"
//     ];

//     if (!allowedOrigins.includes(event.origin)) return;

//     if (event.data?.type === "KEY_NAV") {
//       if (event.data.key === "ArrowRight") {
//         setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
//       }

//       if (event.data.key === "ArrowLeft") {
//         setCurrentSlide(prev => Math.max(prev - 1, 0));
//       }
//     }
//   };

//   window.addEventListener("message", handleMessage);

//   return () => window.removeEventListener("message", handleMessage);
// }, [slides.length]);

  

  const slides = [
    <SlideCover onNavigateHome={goToHome} />,
    <SlideTOC onNavigate={(index) => setCurrentSlide(index)} onNavigateHome={goToHome} />,
    <SlideTrafficOverviewDivider onNavigateHome={goToHome} />,
    <SlideTrafficOverviewTabs onNavigateHome={goToHome} />,
    <SlideTrafficOverviewTabsWW onNavigateHome={goToHome} />,
    <SlideKeywordDivider onNavigateHome={goToHome} />,
    <SlideOpportunities onNavigateHome={goToHome} />,
    <SlideCategoryDivider onNavigateHome={goToHome} onNavigate={(index) => setCurrentSlide(index)} />,
    <SlideNGFW onNavigateHome={goToHome} />,
    <SlideSDWANMetrics onNavigateHome={goToHome} />,
    <SlideOTSecurity onNavigateHome={goToHome} />,
    <SlideDashboard onNavigateHome={goToHome} />,
    <SlideZeroTrust onNavigateHome={goToHome} />,
    <SlideCloudSecurity onNavigateHome={goToHome} />,
    <SlideRansomware onNavigateHome={goToHome} />,
    <SlideAICyberSecurity onNavigateHome={goToHome} />,
    <SlideQuantumSecurity onNavigateHome={goToHome} />,
    <SlideLLMDivider onNavigateHome={goToHome} />,
    <SlideProfundMetrics onNavigateHome={goToHome} />,
    <SlideCategoryPerformance onNavigateHome={goToHome} />,
    <SlideAIOverview onNavigateHome={goToHome} />,
    <SlideBacklinkDivider onNavigateHome={goToHome} />,
    <SlideBacklinks onNavigateHome={goToHome} />,
    <SlideIntelDivider onNavigateHome={goToHome} />,
    <SlideCompetitiveIntel onNavigateHome={goToHome} />,
    <SlideKeywordGap onNavigateHome={goToHome} />,
    <SlideCompetitiveFindings onNavigateHome={goToHome} />,
    <SlideThankYou onNavigateHome={goToHome} />,
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-auto">
      {/* Slide Container */}
      <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="relative w-full h-full min-h-[600px] bg-white rounded-lg sm:rounded-xl shadow-xl overflow-auto flex items-center justify-center">
          {/* Logos pinned to top corners on every slide */}
          <img
            src={leadWalnutLogo}
            alt="LeadWalnut"
            className={`absolute top-5 left-6 h-10 w-auto object-contain z-20 pointer-events-none ${currentSlide !== 0 ? 'hidden' : ''}`}
          />
          <img
            src={fortinetLogo}
            alt="Fortinet"
            className={`absolute top-5 right-6 h-8 w-auto object-contain z-20 pointer-events-none ${currentSlide !== 0 ? 'hidden' : ''}`}
          />
          {slides[currentSlide]}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-gray-200">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="group relative"
          >
            <div
              className={`h-1.5 sm:h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-6 sm:w-8 bg-red-500'
                  : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
              }`}
            />
            <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="hidden md:block fixed bottom-4 md:bottom-8 right-4 md:right-8 text-xs text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
}