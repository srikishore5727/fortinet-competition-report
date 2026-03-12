import { Search, AlertTriangle, Target, Users } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
} from './design-system';

// Missing Keywords Data (Sheet4 CSV)
const missingKeywordsData = [
  { keyword: 'threat detection', intent: 'Informational', volume: 1900, kd: 48, cpc: 11.91, cd: 0.28, ft: 0, pa: 8, cp: 77, cisco: 6, cs: 2 },
  { keyword: 'what is ci cd pipeline', intent: 'Informational', volume: 1300, kd: 61, cpc: 1.42, cd: 0.13, ft: 0, pa: 13, cp: 51, cisco: 28, cs: 12 },
  { keyword: 'cloud security management', intent: 'Informational', volume: 1000, kd: 24, cpc: 20.93, cd: 0.25, ft: 0, pa: 57, cp: 62, cisco: 40, cs: 9 },
  { keyword: 'how can generative ai be used in cybersecurity', intent: 'Informational', volume: 720, kd: 28, cpc: 3.98, cd: 0.37, ft: 0, pa: 2, cp: 24, cisco: 51, cs: 75 },
  { keyword: 'threat modelling', intent: 'Informational', volume: 720, kd: 49, cpc: 6.29, cd: 0.24, ft: 0, pa: 39, cp: 72, cisco: 5, cs: 38 },
  { keyword: 'container vulnerability scanning', intent: 'Informational', volume: 590, kd: 18, cpc: 24.36, cd: 0.09, ft: 0, pa: 34, cp: 61, cisco: 71, cs: 29 },
  { keyword: 'cybersecurity assessments', intent: 'Informational', volume: 390, kd: 30, cpc: 15.38, cd: 0.14, ft: 0, pa: 49, cp: 48, cisco: 96, cs: 34 },
  { keyword: 'kubernetes security posture management', intent: 'Informational', volume: 320, kd: 23, cpc: 14.51, cd: 0.13, ft: 0, pa: 2, cp: 24, cisco: 40, cs: 3 },
  { keyword: 'ai endpoint security', intent: 'Informational', volume: 260, kd: 42, cpc: 0, cd: 0.18, ft: 0, pa: 1, cp: 23, cisco: 100, cs: 11 },
  { keyword: 'patch management vs vulnerability management', intent: 'Commercial, Informational', volume: 260, kd: 21, cpc: 10.97, cd: 0.22, ft: 0, pa: 1, cp: 82, cisco: 89, cs: 85 },
  { keyword: 'security development lifecycle', intent: 'Informational', volume: 260, kd: 40, cpc: 13.01, cd: 0.09, ft: 0, pa: 3, cp: 59, cisco: 43, cs: 46 },
];

// Untapped Keywords Data (Image 2)
const untappedKeywordsData = [
  { keyword: 'cloud computing explained', intent: 'Informational', volume: 27100, kd: 87, cpc: 1.52, cd: 0.05, ft: 0, pa: 0, cp: 0, cisco: 32, cs: 0 },
  { keyword: 'cybersecurity best practices', intent: 'Commercial', volume: 27100, kd: 64, cpc: 6.23, cd: 0.13, ft: 0, pa: 0, cp: 74, cisco: 33, cs: 0 },
  { keyword: 'quantum cryptography', intent: 'Informational', volume: 14800, kd: 71, cpc: 2.11, cd: 0.13, ft: 0, pa: 0, cp: 0, cisco: 17, cs: 0 },
  { keyword: 'owasp top 10', intent: 'Informational, Navigational', volume: 12100, kd: 68, cpc: 3.88, cd: 0.13, ft: 0, pa: 0, cp: 58, cisco: 0, cs: 0 },
  { keyword: 'cloud ai', intent: 'Informational', volume: 9900, kd: 85, cpc: 4.21, cd: 0.45, ft: 0, pa: 0, cp: 0, cisco: 8, cs: 0 },
  { keyword: 'nist cybersecurity framework', intent: 'Informational', volume: 9900, kd: 65, cpc: 5.34, cd: 0.46, ft: 0, pa: 0, cp: 25, cisco: 4, cs: 0 },
  { keyword: 'quantum ai', intent: 'Informational', volume: 8100, kd: 57, cpc: 2.45, cd: 0.16, ft: 0, pa: 0, cp: 73, cisco: 0, cs: 0 },
  { keyword: 'cloud migration', intent: 'Informational', volume: 5400, kd: 48, cpc: 15.6, cd: 0.39, ft: 0, pa: 0, cp: 0, cisco: 27, cs: 13 },
  { keyword: 'cloud-native application development', intent: 'Informational', volume: 4400, kd: 54, cpc: 0, cd: 0, ft: 0, pa: 0, cp: 0, cisco: 92, cs: 0 },
  { keyword: 'cybersecurity risk assessment', intent: 'Informational', volume: 2900, kd: 41, cpc: 14, cd: 0.14, ft: 0, pa: 1, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'iaas in cloud computing', intent: 'Informational', volume: 2400, kd: 63, cpc: 4.3, cd: 0.03, ft: 0, pa: 0, cp: 0, cisco: 0, cs: 15 },
  { keyword: 'cloud computing providers', intent: 'Informational', volume: 1900, kd: 68, cpc: 10.59, cd: 0.09, ft: 0, pa: 37, cp: 0, cisco: 95, cs: 0 },
  { keyword: 'network security monitoring', intent: 'Informational', volume: 1900, kd: 21, cpc: 15.99, cd: 0.25, ft: 0, pa: 78, cp: 14, cisco: 3, cs: 0 },
  { keyword: 'quantum apocalypse', intent: 'Informational', volume: 1900, kd: 33, cpc: 0, cd: 0, ft: 0, pa: 20, cp: 0, cisco: 0, cs: 0 },
  { keyword: 'cybersecurity for small business', intent: 'Informational', volume: 1600, kd: 62, cpc: 30.03, cd: 0.26, ft: 0, pa: 4, cp: 0, cisco: 19, cs: 3 },
  { keyword: 'network security assessment', intent: 'Informational', volume: 1000, kd: 18, cpc: 8.02, cd: 0.09, ft: 0, pa: 27, cp: 12, cisco: 0, cs: 0 },
  { keyword: 'devsecops best practices', intent: 'Commercial', volume: 880, kd: 14, cpc: 11.21, cd: 0.24, ft: 0, pa: 0, cp: 0, cisco: 0, cs: 15 },
  { keyword: 'network security best practices', intent: 'Commercial', volume: 880, kd: 28, cpc: 7.7, cd: 0.15, ft: 0, pa: 0, cp: 24, cisco: 5, cs: 0 },
  { keyword: 'devsecops vs devops', intent: 'Commercial, Informational', volume: 720, kd: 22, cpc: 4.1, cd: 0.07, ft: 0, pa: 0, cp: 79, cisco: 0, cs: 2 },
  { keyword: 'enterprise cloud computing', intent: 'Informational', volume: 720, kd: 20, cpc: 15.47, cd: 0.11, ft: 0, pa: 0, cp: 0, cisco: 78, cs: 0 },
  { keyword: 'cloud security posture management', intent: 'Informational', volume: 2900, kd: 45, cpc: 22.65, cd: 0.2, ft: 0, pa: 4, cp: 28, cisco: 0, cs: 11 },
  { keyword: 'cloud security management', intent: 'Informational', volume: 1000, kd: 24, cpc: 20.93, cd: 0.25, ft: 0, pa: 57, cp: 62, cisco: 40, cs: 9 },
];

// Multi-Competitor Comparison Data / Weak Keywords (Image 3)
const multiCompetitorData = [
  { keyword: 'endpoint protection software', intent: 'Commercial, Informational', volume: 1000, kd: 33, ft: 13, pa: 10, cp: 4, cisco: 9, cs: 2 },
  { keyword: 'what is vulnerability management', intent: 'Informational', volume: 1000, kd: 42, ft: 66, pa: 44, cp: 28, cisco: 11, cs: 2 },
  { keyword: 'cyber threat management', intent: 'Informational', volume: 720, kd: 20, ft: 75, pa: 13, cp: 38, cisco: 1, cs: 12 },
  { keyword: 'ai threat intelligence', intent: 'Informational', volume: 480, kd: 35, ft: 73, pa: 3, cp: 18, cisco: 37, cs: 5 },
];

export function SlideKeywordGap({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<'missing' | 'untapped' | 'multiCompetitor'>('missing');

  const getCurrentData = () => {
    switch (activeTab) {
      case 'missing': return missingKeywordsData;
      case 'untapped': return untappedKeywordsData;
      case 'multiCompetitor': return multiCompetitorData;
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'missing': return AlertTriangle;
      case 'untapped': return Target;
      case 'multiCompetitor': return Users;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'missing': return 'Missing Keywords';
      case 'untapped': return 'Untapped Keywords';
      case 'multiCompetitor': return 'Weak Keywords';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'missing': return 'Critical gaps in Fortinet\'s content strategy';
      case 'untapped': return 'High-potential keywords with minimal competition';
      case 'multiCompetitor': return 'Competitive keyword comparison with ranking positions';
    }
  };

  const IconComponent = getTabIcon();

  return (
    <SlideContainer slideNumber={22} onNavigateHome={onNavigateHome}>
      <SlideHeader 
        title="Keyword Gap" 
      />
      
      <div className="flex-1 flex flex-col gap-4 pb-4">
        {/* Main Tab Navigation - Curved Folder Style */}
        <div className="flex items-start gap-1">
          <button
            onClick={() => setActiveTab('missing')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'missing'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'missing'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Missing Keywords
          </button>
          <button
            onClick={() => setActiveTab('untapped')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'untapped'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'untapped'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Untapped Keywords
          </button>
          <button
            onClick={() => setActiveTab('multiCompetitor')}
            className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
              activeTab === 'multiCompetitor'
                ? 'bg-white text-red-600 z-10'
                : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
            }`}
            style={{
              borderRadius: '12px 12px 0 0',
              marginBottom: '-2px',
              boxShadow: activeTab === 'multiCompetitor'
                ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                : '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            Weak Keywords
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-200">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activeTab === 'untapped' ? 'bg-blue-50' : 'bg-red-50'
              }`}>
                <IconComponent className={`w-6 h-6 ${
                  activeTab === 'untapped' ? 'text-blue-500' : 'text-red-500'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{getTabTitle()}</h3>
                <p className="text-sm text-gray-600">{getTabDescription()}</p>
              </div>
            </div>

            {/* Table */}
            <div className="bg-gray-50 rounded-lg overflow-hidden flex-1">
              <div className="overflow-x-auto h-full max-h-[500px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200 sticky top-0 z-20">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">Keyword</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        {activeTab === 'multiCompetitor' ? 'Intent' : 'Intents'}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">
                        {activeTab === 'multiCompetitor' ? 'Volume' : 'Volume'}
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-900">KD</th>
                      {(activeTab === 'missing' || activeTab === 'untapped') && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-red-50">FT</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-orange-50">PA</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-purple-50">CP</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-blue-50">CISCO</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-gray-100">CS</th>
                        </>
                      )}
                      {(activeTab === 'multiCompetitor') && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-red-50">FT</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-orange-50">PA</th>
                        </>
                      )}
                      {activeTab === 'multiCompetitor' && (
                        <>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-purple-50">CP</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-blue-50">CISCO</th>
                          <th className="px-3 py-3 text-center font-semibold text-gray-900 bg-gray-100">CS</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {getCurrentData().map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{row.keyword}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{row.intent}</td>
                        <td className="px-4 py-3 text-center text-gray-900 font-medium">{row.volume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{row.kd}</td>
                        {(activeTab === 'missing' || activeTab === 'untapped') && 'ft' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-red-50 text-red-700">{row.ft}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-orange-50 text-orange-700">{(row as any).pa}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-purple-50 text-purple-700">{(row as any).cp}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-blue-50 text-blue-700">{(row as any).cisco}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-gray-50 text-gray-700">{(row as any).cs}</td>
                          </>
                        )}
                        {(activeTab === 'multiCompetitor') && 'ft' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-red-50 text-red-700">{row.ft}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-orange-50 text-orange-700">{row.pa}</td>
                          </>
                        )}
                        {activeTab === 'multiCompetitor' && 'cp' in row && (
                          <>
                            <td className="px-3 py-3 text-center font-semibold bg-purple-50 text-purple-700">{(row as any).cp}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-blue-50 text-blue-700">{(row as any).cisco}</td>
                            <td className="px-3 py-3 text-center font-semibold bg-gray-50 text-gray-700">{(row as any).cs}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Semrush Keyword Gap Tool" />
    </SlideContainer>
  );
}