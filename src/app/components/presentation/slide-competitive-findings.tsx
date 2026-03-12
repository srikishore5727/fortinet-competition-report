import { ExternalLink, Lightbulb, TrendingUp, Target, Users, List } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
} from './design-system';

// Import screenshots
import img5 from '../../../assets/0a8bf43fea8fb119772adb54811dcf3ccbf8b2fd.png';
import img8 from '../../../assets/76549cdfa0289dd4870dc03c488319e0c93ff3a4.png';
import img9 from '../../../assets/67199bcb36bfbb124a3912feef06262a96383659.png';
import img10 from '../../../assets/ca2e9c8134a363bdc9f26f349ddaebd9840c3c06.png';
import img11 from '../../../assets/5c8260bfb75e6ba268526c4f7b8e037202bbb7f6.png';
import img12 from '../../../assets/daec210ff205c2acf193dcece3fcf76888dc8ba9.png';
import img13 from '../../../assets/7e3db8477affc93e3e46a8cbde0b8d9a01d44dc6.png';
import img14 from '../../../assets/56d1c4255787fc6b0c75888cc4cfda55fc88429c.png';
import img15 from '../../../assets/b331eb4abe1382dbc410fe6f7fbf58f55e1bc379.png';
import imgAnthology from '../../../assets/cc20c781429501bb5722588c2e4f39066692f708.png';
import imgContentSummary from '../../../assets/41740da456cf142cd718ccc1e678feb99e9cb021.png';
import imgInteractive1 from '../../../assets/21379af63469eae9122696f6377bd4363401a620.png';
import imgInteractive2 from '../../../assets/3351d24a3a3aff4dbba25aa9a432316340939958.png';

interface Finding {
  icon: any;
  color: string;
  bgColor: string;
  title: string;
  description: string | string[];
  competitor: string;
  url?: string;
  urlDisplay?: string;
  screenshot?: string;
  screenshot2?: string;
  screenshot3?: string;
  midText?: string;
  midTextUrl?: string;
}

const findings: Finding[] = [
  {
    icon: Target,
    color: '#EF4444',
    bgColor: '#FEF2F2',
    title: 'Trust Validation',
    description: [
      'Increased integration of third-party validation.',
      'Expanded use of social proof markers'
    ],
    competitor: 'Palo Alto vs Sentinel One',
    screenshot: img8,
    screenshot2: img9,
    screenshot3: img10,
  },
  {
    icon: Lightbulb,
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    title: 'Sub-category Navigation',
    description: [
      'Shift in UI architecture to emphasize platformization.',
      'Implementation of sub-category navigation menus on the Home page.',
      'Menus are intended to guide users through platform capabilities.'
    ],
    competitor: 'Palo Alto',
    screenshot: img11,
  },
  {
    icon: Users,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    title: 'Optimized Call-to-Action (CTA)',
    description: [
      'Competitors are moving away from generic CTAs to solution-specific CTAs.',
      'Example: Palo Alto Networks\' segment-specific "Explore" CTAs for Network Security'
    ],
    competitor: 'Fortinet vs Palo Alto',
    screenshot: img12,
    midText: 'Palo CTA (Explore network security, explore identity security, explore secops)',
    midTextUrl: 'https://www.paloaltonetworks.in/',
    screenshot2: img13,
    screenshot3: img14,
  },
  {
    icon: TrendingUp,
    color: '#10B981',
    bgColor: '#D1FAE5',
    title: 'Contextual Discovery',
    description: [
      'This is done to surface high-performing cybersecurity content.',
      'The goal is improving content discoverability.',
      'It also reinforces topic authority for key industry trends.'
    ],
    competitor: 'Sentinel One',
    screenshot: img15,
  },
  {
    icon: List,
    color: '#6C9AFF',
    bgColor: '#EFF6FF',
    title: 'Thought Leadership Hubs',
    description: [
      "SentinelOne's Anthology hub builds thought leadership.",
      "It publishes detailed ransomware threat intelligence & attack analyses.",
    ],
    competitor: 'Sentinel One',
    screenshot: imgAnthology,
  },
  {
    icon: ExternalLink,
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
    title: 'Optimized Content Summarization',
    description: [
      'Article Summary within content for visibility in LLM',
    ],
    competitor: 'Cloudflare',
    screenshot: imgContentSummary,
  },
  {
    icon: TrendingUp,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    title: 'Interactive Elements',
    description: [
      'Maximize LLM visibility and strengthen E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness).',
      'Move beyond static content.',
      'Integrate interactive elements to create a "high-engagement anchor."',
      'AI models prioritize these anchors because they correlate with user utility and deep information processing.',
    ],
    competitor: 'Palo Alto',
    screenshot: imgInteractive1,
    screenshot2: imgInteractive2,
  },
];

export function SlideCompetitiveFindings({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [selectedFinding, setSelectedFinding] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <SlideContainer slideNumber={23} onNavigateHome={onNavigateHome} source="">
      <SlideHeader 
        title="Web Experience" 
        subtitle="Strategic Observations from Competitor Websites"
      />
      
      <div className="flex-1 flex flex-col gap-4 pb-4 overflow-hidden">
        {/* Top Panel - Horizontal Findings Buttons */}
        <div className="flex-shrink-0 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:opacity-0 hover:[&::-webkit-scrollbar]:opacity-100 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 transition-all">
          <div className="flex gap-3 min-w-max">
            {findings.map((finding, idx) => {
              const Icon = finding.icon;
              const isSelected = selectedFinding === idx;
              
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedFinding(idx)}
                  className={`w-[220px] flex-shrink-0 text-left bg-white border-2 rounded-xl p-4 transition-all duration-200 ${
                    isSelected 
                      ? 'border-red-500 shadow-lg' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: finding.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: finding.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">{finding.title}</h3>
                    </div>
                  </div>
                  <span 
                    className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                    style={{ 
                      backgroundColor: finding.bgColor,
                      color: finding.color 
                    }}
                  >
                    {finding.competitor}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Panel - Screenshot Display */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-5 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            {(() => {
              const Icon = findings[selectedFinding].icon;
              return (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: findings[selectedFinding].bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: findings[selectedFinding].color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900">{findings[selectedFinding].title}</h3>
                    {Array.isArray(findings[selectedFinding].description) ? (
                      <ul className="text-xs text-gray-600 mt-2 list-disc list-inside space-y-1">
                        {(findings[selectedFinding].description as string[]).map((bullet, i) => (
                          <li key={i}>{bullet}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600 mt-1">{findings[selectedFinding].description}</p>
                    )}
                    {findings[selectedFinding].url && (
                      <a
                        href={findings[selectedFinding].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors group mt-2"
                      >
                        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                        <span className="truncate max-w-full">{findings[selectedFinding].urlDisplay}</span>
                      </a>
                    )}
                  </div>
                </>
              );
            })()}
          </div>

          {/* Screenshot(s) - Fixed Display */}
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start justify-center overflow-y-auto">
            {findings[selectedFinding].screenshot ? (
              <div className="w-full space-y-3">
                {/* Main Screenshot */}
                <div 
                  className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                  onClick={() => setLightboxImage(findings[selectedFinding].screenshot!)}
                >
                  <img
                    src={findings[selectedFinding].screenshot}
                    alt={findings[selectedFinding].title}
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Second Screenshot */}
                {findings[selectedFinding].screenshot2 && (
                  <>
                    {/* Mid-text with link for CTA finding */}
                    {findings[selectedFinding].midText && (
                      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <a
                          href={findings[selectedFinding].midTextUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors group"
                        >
                          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex-shrink-0" />
                          <span className="font-medium">{findings[selectedFinding].midText}</span>
                        </a>
                      </div>
                    )}
                    
                    {!findings[selectedFinding].midText && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-300" />
                        {findings[selectedFinding].screenshot2 === img5 && (
                          <span className="text-xs font-semibold text-gray-500 px-2">VS</span>
                        )}
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                    )}
                    
                    <div 
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot2!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot2}
                        alt={`${findings[selectedFinding].title} 2`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}
                
                {/* Third Screenshot */}
                {findings[selectedFinding].screenshot3 && (
                  <>
                    {!findings[selectedFinding].midText && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-gray-300" />
                        <div className="flex-1 h-px bg-gray-300" />
                      </div>
                    )}
                    <div 
                      className="bg-white rounded-lg shadow-sm overflow-hidden cursor-zoom-in hover:shadow-md transition-shadow"
                      onClick={() => setLightboxImage(findings[selectedFinding].screenshot3!)}
                    >
                      <img
                        src={findings[selectedFinding].screenshot3}
                        alt={`${findings[selectedFinding].title} 3`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100">
                  <ExternalLink className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No screenshot available</p>
                <p className="text-xs text-gray-400 mt-1">Visit the link to view the content</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-8"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>
          <div className="max-w-7xl max-h-full overflow-auto">
            <img
              src={lightboxImage}
              alt="Enlarged view"
              className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <SlideFooter />
    </SlideContainer>
  );
}