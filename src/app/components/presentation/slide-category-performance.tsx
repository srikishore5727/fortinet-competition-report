import { useState } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Target, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  SlideSource,
  ChartContainer,
  CHART_CONFIG,
  COLORS,
  TEXT_STYLES,
  InsightCard,
  InsightsSection,
} from './design-system';

type CategoryType = 'sase' | 'otSecurity' | 'ztna' | 'cloudSecurity' | 'secOps' | 'firewall' | 'quantumSecurity' | 'aiCybersecurity';

// Helper function to format month for display
const formatMonth = (monthKey: string) => {
  const monthMap: { [key: string]: string } = {
    '2025-11': 'Nov 2025',
    '2025-12': 'Dec 2025',
    '2026-01': 'Jan 2026',
    '2026-02': 'Feb 2026',
  };
  return monthMap[monthKey] || monthKey;
};

// Category performance data with insights
const categories = [
  {
    id: 'sase' as CategoryType,
    name: 'Secure Access Service Edge (SASE)',
    topPerformer: 'Palo Alto',
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 86.3, top: 92.6, paloAlto: 92.6 },
      { period: '2025-12', fortinet: 89.6, top: 94.7, paloAlto: 94.7 },
      { period: '2026-01', fortinet: 90.9, top: 95.3, paloAlto: 95.3 },
      { period: '2026-02', fortinet: 94.1, top: 94.1, paloAlto: 93.7 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'From Nov 2025 to Feb 2026, visibility improved 86.3% → 94.1%, overtaking Palo Alto.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'Palo Alto led Nov–Jan (92.6% → 95.3%) but dropped to 93.7% in Feb, losing the lead.' },
  },
  {
    id: 'otSecurity' as CategoryType,
    name: 'OT Security',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    data: [
      { period: '2025-11', fortinet: 86.8, top: 86.8, paloAlto: 75.2 },
      { period: '2025-12', fortinet: 90.3, top: 90.3, paloAlto: 78.5 },
      { period: '2026-01', fortinet: 91.4, top: 91.4, paloAlto: 79.8 },
      { period: '2026-02', fortinet: 92.4, top: 92.4, paloAlto: 81.3 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'From Nov 2025 to Feb 2026, maintained leadership 86.8% → 92.4%.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'No competitor surpassed Fortinet\'s visibility during this period.' },
  },
  {
    id: 'ztna' as CategoryType,
    name: 'ZTNA',
    topPerformer: 'Palo Alto',
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 67.4, top: 88.4 },
      { period: '2025-12', fortinet: 75.4, top: 93.9 },
      { period: '2026-01', fortinet: 74.1, top: 90.3 },
      { period: '2026-02', fortinet: 78.5, top: 91.3 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'From Nov 2025 to Feb 2026, improved 67.4% → 78.5%.' },
    competitionInsight: { icon: TrendingUp, type: 'success' as const, content: 'Palo Alto consistently led 88.4% → 91.3% across the period.' },
  },
  {
    id: 'cloudSecurity' as CategoryType,
    name: 'Cloud Security',
    topPerformer: 'Palo Alto',
    topPerformerColor: '#FFB14A',
    data: [
      { period: '2025-11', fortinet: 52.0, top: 96.3 },
      { period: '2025-12', fortinet: 60.9, top: 92.9 },
      { period: '2026-01', fortinet: 64.4, top: 90.6 },
      { period: '2026-02', fortinet: 73.0, top: 92.3 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'From Nov 2025 to Feb 2026, visibility increased 52.0% → 73.0%.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'Palo Alto maintained leadership with ~90% visibility across all months.' },
  },
  {
    id: 'secOps' as CategoryType,
    name: 'SecOps',
    topPerformer: 'CrowdStrike',
    topPerformerColor: '#1F2937',
    data: [
      { period: '2025-11', fortinet: 23.8, top: 58.5 },
      { period: '2025-12', fortinet: 16.4, top: 63.2 },
      { period: '2026-01', fortinet: 18.7, top: 58.6 },
      { period: '2026-02', fortinet: 22.0, top: 63.6 },
    ],
    fortinetInsight: { icon: TrendingDown, type: 'error' as const, content: 'From Nov 2025 to Feb 2026, visibility fluctuated 23.8% → 22.0%.' },
    competitionInsight: { icon: TrendingUp, type: 'success' as const, content: 'CrowdStrike dominated 58.5% → 63.6% during the same period.' },
  },
  {
    id: 'firewall' as CategoryType,
    name: 'Firewall',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    data: [
      { period: '2025-11', fortinet: 95.0, top: 95.0, cisco: 42.0 },
      { period: '2025-12', fortinet: 96.0, top: 96.0, cisco: 40.0 },
      { period: '2026-01', fortinet: 98.0, top: 98.0, cisco: 39.0 },
      { period: '2026-02', fortinet: 100.0, top: 100.0, cisco: 38.0 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'In Feb 2026, achieved 100% visibility, leading the firewall category.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'Cisco recorded 38% visibility, significantly trailing Fortinet.' },
  },
  {
    id: 'quantumSecurity' as CategoryType,
    name: 'Quantum Security',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    data: [
      { period: '2025-11', fortinet: 90.0, top: 90.0, paloAlto: 18.0 },
      { period: '2025-12', fortinet: 93.0, top: 93.0, paloAlto: 16.5 },
      { period: '2026-01', fortinet: 95.0, top: 95.0, paloAlto: 15.5 },
      { period: '2026-02', fortinet: 96.9, top: 96.9, paloAlto: 14.7 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'In Feb 2026, dominated with 96.9% visibility.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'Palo Alto recorded 14.7% visibility, far behind Fortinet.' },
  },
  {
    id: 'aiCybersecurity' as CategoryType,
    name: 'AI Cybersecurity',
    topPerformer: 'Fortinet',
    topPerformerColor: '#EF4444',
    data: [
      { period: '2025-11', fortinet: 68.0, top: 68.0, crowdstrike: 25.0 },
      { period: '2025-12', fortinet: 71.0, top: 71.0, crowdstrike: 23.0 },
      { period: '2026-01', fortinet: 73.0, top: 73.0, crowdstrike: 21.5 },
      { period: '2026-02', fortinet: 75.4, top: 75.4, crowdstrike: 20.5 },
    ],
    fortinetInsight: { icon: TrendingUp, type: 'success' as const, content: 'In Feb 2026, led with 75.4% visibility.' },
    competitionInsight: { icon: TrendingDown, type: 'error' as const, content: 'CrowdStrike followed with 20.5% visibility.' },
  },
];

// Custom label to show percentage on top of bars
const renderCustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  // Safety check for undefined values
  if (value === undefined || value === null) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 4}
      fill="#374151"
      textAnchor="middle"
      fontSize="11"
      fontWeight="500"
    >
      {value.toFixed(1)}%
    </text>
  );
};

export function SlideCategoryPerformance({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<CategoryType>('sase');

  const tabs = categories.map(cat => ({
    id: cat.id,
    label: cat.name,
  }));

  const activeCategory = categories.find(cat => cat.id === activeTab)!;
  const isFortinetTopPerformer = activeCategory.topPerformer === 'Fortinet';

  // For these tabs show only Feb 2026; for OT Security show only Fortinet bar
  const febOnlyTabs: CategoryType[] = ['firewall', 'quantumSecurity', 'aiCybersecurity'];
  const isFebOnly = febOnlyTabs.includes(activeTab);

  const chartData = activeCategory.data
    .filter((item) => !isFebOnly || item.period === '2026-02')
    .map((item: any) => {
      const dataPoint: any = {
        period: item.period,
        fortinet: item.fortinet,
      };
      
      if (activeTab === 'sase' && item.paloAlto !== undefined) {
        dataPoint['paloalto'] = item.paloAlto;
      } 
      else if (activeTab === 'firewall' && item.cisco !== undefined) {
        dataPoint['cisco'] = item.cisco;
      }
      else if (activeTab === 'quantumSecurity' && item.paloAlto !== undefined) {
        dataPoint['paloalto'] = item.paloAlto;
      }
      else if (activeTab === 'aiCybersecurity' && item.crowdstrike !== undefined) {
        dataPoint['crowdstrike'] = item.crowdstrike;
      }
      else if (activeTab !== 'otSecurity') {
        dataPoint[activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '')] = item.top;
        if (item.paloAlto !== undefined && activeCategory.topPerformer !== 'Palo Alto') {
          dataPoint['paloalto'] = item.paloAlto;
        }
      }
      
      return dataPoint;
    });

  const getPerformanceSummary = () => {
    const latestData = activeCategory.data[activeCategory.data.length - 1]; // Feb 2026
    const fortinetValue = latestData.fortinet;
    
    // Determine competitor based on tab
    let competitorName = '';
    let competitorValue = 0;
    
    if (activeTab === 'sase' || activeTab === 'quantumSecurity') {
      competitorName = 'Palo Alto';
      competitorValue = latestData.paloAlto || latestData.top || 0;
    } else if (activeTab === 'firewall') {
      competitorName = 'Cisco';
      competitorValue = latestData.cisco || 0;
    } else if (activeTab === 'aiCybersecurity') {
      competitorName = 'CrowdStrike';
      competitorValue = latestData.crowdstrike || 0;
    } else {
      competitorName = activeCategory.topPerformer;
      competitorValue = latestData.top || 0;
    }

    const isLeader = fortinetValue >= competitorValue;
    
    const formatValue = (val: number) => `${val.toFixed(1)}%`;
    
    if (isLeader) {
      // Fortinet is #1, show who's in second
      const gap = fortinetValue - competitorValue;
      const gapPercent = ((gap / fortinetValue) * 100).toFixed(1);
      
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-green-900">Top Performer - <span className="font-bold">Fortinet</span></span>
              <span className="text-sm text-green-900 font-semibold">{formatValue(fortinetValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-800">2nd position - {competitorName}</span>
              <span className="text-sm text-green-800 font-semibold">{formatValue(competitorValue)}</span>
            </div>
            <div>
              <span className="text-sm text-green-900"><span className="font-semibold">Lead:</span> +{formatValue(gap)} ({gapPercent}% ahead)</span>
            </div>
          </div>
        </div>
      );
    } else {
      const gap = competitorValue - fortinetValue;
      const gapPercent = ((gap / competitorValue) * 100).toFixed(1);
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-orange-900">Top Performer - <span className="font-bold">{competitorName}</span></span>
              <span className="text-sm text-orange-900 font-semibold">{formatValue(competitorValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-orange-800">2nd position - Fortinet</span>
              <span className="text-sm text-orange-800 font-semibold">{formatValue(fortinetValue)}</span>
            </div>
            <div>
              <span className="text-sm text-orange-900"><span className="font-semibold">Gap to #1:</span> {formatValue(gap)} ({gapPercent}% behind)</span>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <SlideContainer slideNumber={20} onNavigateHome={onNavigateHome}>
      <div className="mb-6">
      <SlideHeader 
        title="Focused Category" 
        subtitle="(Nov 2025 - Feb 2026)"
      />
      <SlideSource source="Profound" slideNumber={20} />
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex items-start gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-xs font-semibold leading-tight transition-all duration-200 relative whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
              }`}
              style={{
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
                fontSize: '11px',
                fontWeight: 600,
                lineHeight: '1.3',
                letterSpacing: '0.01em',
                boxShadow: activeTab === tab.id
                  ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 grid grid-cols-12 gap-6">
          {/* Chart Section - 8 columns */}
          <div className="col-span-8 flex flex-col gap-4">
            <ChartContainer title="" height={420}>
              <div className="h-full flex flex-col">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      id={`category-chart-${activeTab}`}
                      key={`chart-${activeTab}`}
                      data={chartData}
                      margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                      barGap={0}
                      barCategoryGap="25%"
                    >
                      <CartesianGrid 
                        id={`cartesian-${activeTab}`}
                        {...CHART_CONFIG.cartesianGrid} 
                      />
                      <XAxis
                        dataKey="period"
                        {...CHART_CONFIG.xAxis}
                        tick={{ fontSize: 11 }}
                        tickFormatter={formatMonth}
                        interval={0}
                        id={`xaxis-${activeTab}`}
                      />
                      <YAxis
                        {...CHART_CONFIG.yAxis}
                        tick={{ fontSize: 11 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        id={`yaxis-${activeTab}`}
                      />
                      <Tooltip
                        id={`tooltip-${activeTab}`}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value: any) => `${value.toFixed(1)}%`}
                        labelFormatter={(label) => formatMonth(label)}
                      />
                      {isFortinetTopPerformer ? (
                        <>
                          <Bar
                            key="bar-fortinet"
                            dataKey="fortinet"
                            name="Fortinet"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            label={renderCustomLabel}
                            maxBarSize={90}
                          />
                          {/* OT Security: Fortinet only — no competitor bar */}
                          {activeTab === 'firewall' && (
                            <Bar
                              key="bar-cisco-firewall"
                              dataKey="cisco"
                              name="Cisco"
                              fill="#1EAEDB"
                              radius={[4, 4, 0, 0]}
                              label={renderCustomLabel}
                              maxBarSize={90}
                            />
                          )}
                          {activeTab === 'quantumSecurity' && (
                            <Bar
                              key="bar-paloalto-quantum"
                              dataKey="paloalto"
                              name="Palo Alto"
                              fill="#F59E0B"
                              radius={[4, 4, 0, 0]}
                              label={renderCustomLabel}
                              maxBarSize={90}
                            />
                          )}
                          {activeTab === 'aiCybersecurity' && (
                            <Bar
                              key="bar-crowdstrike-ai"
                              dataKey="crowdstrike"
                              name="CrowdStrike"
                              fill="#1F2937"
                              radius={[4, 4, 0, 0]}
                              label={renderCustomLabel}
                              maxBarSize={90}
                            />
                          )}
                        </>
                      ) : (
                        <>
                          <Bar
                            key="bar-fortinet"
                            dataKey="fortinet"
                            name="Fortinet"
                            fill="#EF4444"
                            radius={[4, 4, 0, 0]}
                            label={renderCustomLabel}
                            maxBarSize={90}
                          />
                          {activeTab === 'sase' ? (
                            <Bar
                              key="bar-paloalto-sase"
                              dataKey="paloalto"
                              name="Palo Alto"
                              fill="#F59E0B"
                              radius={[4, 4, 0, 0]}
                              label={renderCustomLabel}
                              maxBarSize={90}
                            />
                          ) : (
                            <Bar
                              key={`bar-${activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '-')}`}
                              dataKey={activeCategory.topPerformer.toLowerCase().replace(/\s+/g, '')}
                              name={activeCategory.topPerformer}
                              fill={activeCategory.topPerformerColor}
                              radius={[4, 4, 0, 0]}
                              label={renderCustomLabel}
                              maxBarSize={90}
                            />
                          )}
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </ChartContainer>
          </div>

          {/* Insights Section - 4 columns */}
          <div className="col-span-4 flex flex-col gap-4">
            <InsightsSection>
              <InsightCard
                icon={activeCategory.fortinetInsight.icon}
                type={activeCategory.fortinetInsight.type}
                title="Fortinet"
                content={activeCategory.fortinetInsight.content}
              />
              <InsightCard
                icon={activeCategory.competitionInsight.icon}
                type={activeCategory.competitionInsight.type}
                title="Competitions"
                content={activeCategory.competitionInsight.content}
              />
            </InsightsSection>
            {getPerformanceSummary()}
          </div>
        </div>

        {/* Competitor Legend at bottom */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className={`${TEXT_STYLES.sectionLabel} mb-3`}>Top Performers by Category</h4>
          <div className="flex gap-6 text-xs flex-wrap">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: '#EF4444' }}
              />
              <span className="font-semibold text-gray-900">Fortinet</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">SASE (Feb), OT Security, Firewall, Quantum Security, AI Cybersecurity</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: '#FFB14A' }}
              />
              <span className="font-semibold text-gray-900">Palo Alto</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">SASE (Nov-Jan), ZTNA, Cloud Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: '#1F2937' }}
              />
              <span className="font-semibold text-gray-900">CrowdStrike</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">SecOps</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: '#1EAEDB' }}
              />
              <span className="font-semibold text-gray-900">Cisco</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-600">Runner-up in Firewall</span>
            </div>
          </div>
        </div>
      </div>

      <SlideFooter source="Source: Profound" />
    </SlideContainer>
  );
}