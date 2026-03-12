import leadWalnutLogo from 'figma:asset/a333b5825a4a62c2c92f9a565cc6c2e7687f36c8.png';
import fortinetLogo from 'figma:asset/291fe7dc7e80adc4e8b6918682e87e66ec6d5520.png';

interface SlideCoverProps {
  onNavigateHome?: () => void;
}

export function SlideCover({ onNavigateHome }: SlideCoverProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col relative">
      {/* Logo bar — absolutely positioned so it doesn't shift the centred content */}
      <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-10">
        
        
      </div>

      {/* Main content — centred across the full slide height */}
      <div className="w-full h-full flex items-center justify-center px-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-6">
            <div className="inline-block px-8 py-3 bg-blue-600 text-white text-2xl font-bold rounded-xl mb-8">
              SEO &amp; AI VISIBILITY
            </div>
            <h1 className="text-[44px] font-bold text-black leading-tight tracking-tight mb-4 uppercase">
              Competitive Analysis - Feb 2026
            </h1>
          </div>

          {/* Competitors List */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'Fortinet',     color: '#EF4444' },
              { name: 'Cisco',        color: '#FF7AB6' },
              { name: 'HPE',          color: '#7ED957' },
              { name: 'Palo Alto',    color: '#FFB14A' },
              { name: 'Check Point',  color: '#6C9AFF' },
              { name: 'Crowdstrike',  color: '#1F2937' },
              { name: 'Cato Networks', color: '#8B5CF6' },
              { name: 'SentinelOne',  color: '#EC4899' },
            ].map((comp) => (
              <div
                key={comp.name}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: comp.color }}
                />
                <span className="text-sm font-medium text-gray-700">{comp.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}