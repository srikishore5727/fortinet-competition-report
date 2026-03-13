import { TrendingUp, TrendingDown, Shield, Zap, Sparkles } from 'lucide-react';
import { useState } from 'react';
import {
  SlideContainer,
  SlideHeader,
  SlideSource,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  EditButton,
  CompetitorFilter,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// OT Security Vendors with design system colors
const OT_VENDORS = [
  { id: 'fortinet', name: 'Fortinet', color: '#EF4444' },
  { id: 'cisco', name: 'Cisco', color: '#FF7AB6' },
  { id: 'hpe', name: 'HPE', color: '#7ED957' },
  { id: 'paloalto', name: 'Palo Alto', color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point', color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike', color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#A78BFA' },
  { id: 'sentinelone', name: 'SentinelOne', color: '#34D399' },
];

// OT Security full data - Jul 2025 to Feb 2026 (8 months)
const TOTAL_KEYWORDS_DATA_INITIAL = {
  fortinet: [40, 46, 34, 30, 24, 29, 29, 28],
  cisco: [40, 44, 24, 21, 18, 17, 18, 20],
  hpe: [0, 0, 0, 1, 0, 1, 0, null], // Explicit 0s Jul-Jan, Feb is Nil
  paloalto: [34, 43, 24, 19, 14, 20, 20, 20],
  checkpoint: [25, 25, 8, 2, 6, 7, 9, 8],
  crowdstrike: [null, null, null, null, 1, 1, 1, 1], // Data starts Nov 2025
  catonetworks: [null, null, null, null, null, null, null, 1], // Data starts Feb 2026
  sentinelone: [null, null, null, null, null, 9, 10, 9], // Data starts Dec 2025
};

const CUMULATIVE_TRAFFIC_DATA_INITIAL = {
  fortinet: [566, 872, 939, 1073, 1043, 1043, 1018, 1258],
  cisco: [295, 330, 343, 392, 349, 480, 497, 438],
  hpe: [0, 0, 0, 0, 0, 0, 0, null], // Explicit 0s Jul-Jan, Feb is Nil
  paloalto: [302, 232, 270, 244, 267, 674, 642, 703],
  checkpoint: [10, 4, 0, 0, 2, 0, 1, 1], // Explicit 0s
  crowdstrike: [null, null, null, null, 15, 16, 16, 14], // Data starts Nov 2025
  catonetworks: [null, null, null, null, null, null, null, 0], // Data starts Feb 2026 with explicit 0
  sentinelone: [null, null, null, null, null, 6, 9, 12], // Data starts Dec 2025
};

const PAGE_ONE_KEYWORDS_DATA_INITIAL = {
  fortinet: [25, 27, 29, 28, 24, 28, 28, 28],
  cisco: [14, 17, 20, 16, 17, 13, 14, 16],
  hpe: [0, 0, 0, 0, 0, 0, 0, null], // Explicit 0s Jul-Jan, Feb is Nil
  paloalto: [10, 18, 15, 15, 13, 18, 18, 19],
  checkpoint: [1, 0, 0, 0, 0, 0, 2, 2], // Explicit 0s
  crowdstrike: [null, null, null, null, 1, 1, 1, 1], // Data starts Nov 2025
  catonetworks: [null, null, null, null, null, null, null, 0], // Data starts Feb 2026 with explicit 0
  sentinelone: [null, null, null, null, null, 1, 3, 3], // Data starts Dec 2025
};

const AIO_DATA_INITIAL = {
  fortinet: [19, 22, 17, 18, 13, 15, 16, 14],
  cisco: [20, 21, 16, 14, 11, 12, 15, 14],
  hpe: [null, null, null, null, 0, 0, 1, 0], // Nov-Feb only, with explicit 0s
  paloalto: [18, 22, 15, 13, 9, 13, 16, 14],
  checkpoint: [15, 15, 6, 2, 6, 7, 9, 6],
  crowdstrike: [null, null, null, null, 0, 1, 1, 1], // Data starts Nov 2025 with explicit 0
  catonetworks: [null, null, null, null, null, null, null, 1], // Data starts Feb 2026
  sentinelone: [null, null, null, null, null, 7, 8, 6], // Data starts Dec 2025
};

const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

// Format function for month display
const formatMonth = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export function SlideOTSecurity({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(OT_VENDORS.map((v) => v.id))
  );
  
  const [editableData, setEditableData] = useState<{
    keywords: Record<string, number[]>;
    traffic: Record<string, number[]>;
    pageOne: Record<string, number[]>;
    aio: Record<string, number[]>;
  }>(() => ({
    keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_DATA_INITIAL)),
    traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_DATA_INITIAL)),
    pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KEYWORDS_DATA_INITIAL)),
    aio: JSON.parse(JSON.stringify(AIO_DATA_INITIAL)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableData({
      keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_DATA_INITIAL)),
      traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_DATA_INITIAL)),
      pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KEYWORDS_DATA_INITIAL)),
      aio: JSON.parse(JSON.stringify(AIO_DATA_INITIAL)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'keywords' | 'traffic' | 'pageOne' | 'aio',
    vendorId: string,
    index: number,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setEditableData((prev) => ({
      ...prev,
      [dataset]: {
        ...prev[dataset],
        [vendorId]: prev[dataset][vendorId].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  const toggleVendor = (vendorId: string) => {
    setVisibleVendors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId);
      } else {
        newSet.add(vendorId);
      }
      return newSet;
    });
  };

  const tro = getTimeRangeOffset(timeRange);
  const totalKeywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.keywords[vendor.id]) {
        dataPoint[vendor.id] = editableData.keywords[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const cumulativeTrafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.traffic[vendor.id]) {
        dataPoint[vendor.id] = editableData.traffic[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const getTrafficYMax = () => {
    let max = 0;
    cumulativeTrafficChartData.forEach((point) => {
      OT_VENDORS.forEach((vendor) => {
        if (visibleVendors.has(vendor.id) && point[vendor.id] != null) {
          max = Math.max(max, point[vendor.id]);
        }
      });
    });
    return Math.ceil(max * 1.15);
  };

  const trafficYMax = getTrafficYMax();

  const pageOneKeywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.pageOne[vendor.id]) {
        dataPoint[vendor.id] = editableData.pageOne[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    OT_VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id) && editableData.aio[vendor.id]) {
        dataPoint[vendor.id] = editableData.aio[vendor.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const tabs = [
    { id: 'keywords' as TabType, label: 'Total Keywords' },
    { id: 'page-one' as TabType, label: 'Page 1 Keywords' },
    { id: 'traffic' as TabType, label: 'Cumulative Traffic' },
    { id: 'aio' as TabType, label: 'AIO (AI Overview)' },
  ];

  const getChartData = () => {
    switch (activeTab) {
      case 'keywords': return totalKeywordsChartData;
      case 'page-one': return pageOneKeywordsChartData;
      case 'traffic': return cumulativeTrafficChartData;
      case 'aio': return aioChartData;
      default: return [];
    }
  };

  const getInsights = () => {
    switch (activeTab) {
      case 'keywords':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Jul 2025 to Feb 2026, keywords declined 40 → 28 (−30.0%)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco declined 40 → 20 (−50.0%), while Palo Alto declined 34 → 20 (−41.2%)."
            />
          </InsightsSection>
        );
      case 'page-one':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Jul 2025 to Feb 2026, rankings increased 25 → 28 (+12%)."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco increased 14 → 16 (+14.3%), while Palo Alto increased 10 → 19 (+90%)."
            />
          </InsightsSection>
        );
      case 'traffic':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Jul 2025 to Feb 2026, traffic increased 566 → 1,258 (+122.2%)."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco increased 295 → 438 (+48.5%), while Palo Alto increased 302 → 703 (+132.8%)."
            />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Fortinet"
              content="From Jul 2025 to Feb 2026, AIO rankings declined 19 → 14 (−26.3%)."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco declined 20 → 14 (−30%), while Palo Alto declined 18 → 14 (−22.2%)."
            />
          </InsightsSection>
        );
      default:
        return null;
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 7; // Feb 2026
    let dataSource: Record<string, number[]>;
    let formatValue: (val: number) => string;

    switch (activeTab) {
      case 'keywords':
        dataSource = editableData.keywords;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'page-one':
        dataSource = editableData.pageOne;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'traffic':
        dataSource = editableData.traffic;
        formatValue = (val) => val.toLocaleString();
        break;
      case 'aio':
        dataSource = editableData.aio;
        formatValue = (val) => val.toLocaleString();
        break;
      default:
        return null;
    }

    // Get latest values for all vendors
    const rankings = OT_VENDORS.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      value: dataSource[vendor.id]?.[latestIndex] ?? 0,
      color: vendor.color,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find(r => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex(r => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];

    if (isLeader) {
      // Fortinet is #1, show who's in second
      const gap = fortinetRanking.value - secondPlace.value;
      const gapPercent = ((gap / fortinetRanking.value) * 100).toFixed(1);
      
      return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-green-900">Top Performer - <span className="font-bold">Fortinet</span></span>
              <span className="text-sm text-green-900 font-semibold">{formatValue(fortinetRanking.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-green-800">2nd position - {secondPlace.name}</span>
              <span className="text-sm text-green-800 font-semibold">{formatValue(secondPlace.value)}</span>
            </div>
            <div>
              <span className="text-sm text-green-900"><span className="font-semibold">Lead:</span> +{formatValue(gap)} ({gapPercent}% ahead)</span>
            </div>
          </div>
        </div>
      );
    } else {
      const gap = firstPlace.value - fortinetRanking.value;
      const gapPercent = ((gap / firstPlace.value) * 100).toFixed(1);
      const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;
      return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-orange-900">Top Performer - <span className="font-bold">{firstPlace.name}</span></span>
              <span className="text-sm text-orange-900 font-semibold">{formatValue(firstPlace.value)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-orange-800">{ordinal(fortinetPosition)} position - Fortinet</span>
              <span className="text-sm text-orange-800 font-semibold">{formatValue(fortinetRanking.value)}</span>
            </div>
            <div>
              <span className="text-sm text-orange-900"><span className="font-semibold">Gap to #1:</span> {formatValue(gap)} ({gapPercent}% behind)</span>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderChart = () => {
    const chartData = getChartData();
    const visibleVendorsList = OT_VENDORS.filter(v => visibleVendors.has(v.id));
    
    if (activeTab === 'traffic') {
      return (
        <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
          <LineChart data={chartData} margin={CHART_CONFIG.margin}>
            <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
            <XAxis dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
            <YAxis domain={[0, trafficYMax]} {...CHART_CONFIG.yaxis} />
            <Tooltip content={<CustomTooltip />} />
            {visibleVendorsList.map((vendor) => (
              <Line 
                key={vendor.id} 
                name={vendor.name}
                type="monotone" 
                dataKey={vendor.id} 
                stroke={vendor.color} 
                {...CHART_CONFIG.line}
                dot={{ fill: vendor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Bar chart for all other tabs
    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
        <BarChart id={`ot-${activeTab}-bar`} data={chartData} margin={CHART_CONFIG.margin}>
          <CartesianGrid id={`ot-bar-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`ot-bar-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`ot-bar-yaxis-${activeTab}`} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`ot-bar-tooltip-${activeTab}`} content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          {visibleVendorsList.map((vendor) => (
            <Bar key={vendor.id} name={vendor.name} dataKey={vendor.id} fill={vendor.color} radius={CHART_CONFIG.bar.radius} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <SlideContainer slideNumber={10} onNavigateHome={onNavigateHome} source="Ahrefs">
      <div className="mb-6">
      <SlideHeader 
        title="OT Security" 
        subtitle="(Jul 2025 - Feb 2026)"
      />
      <SlideSource source="Ahrefs" slideNumber={10} />
      </div>
      
      {!isEditing ? (
        <div className="flex-1 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 text-sm font-semibold transition-all duration-200 relative ${
                    activeTab === tab.id
                      ? 'bg-white text-red-600 z-10'
                      : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
                  }`}
                  style={{
                    borderRadius: '12px 12px 0 0',
                    marginBottom: '-2px',
                    boxShadow: activeTab === tab.id
                      ? '0 -2px 8px rgba(0, 0, 0, 0.08), 0 2px 0 0 white'
                      : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
          </div>

          {/* Content Area */}
          <div className="flex-1 grid grid-cols-12 gap-6">
            {/* Chart Section - 8 columns */}
            <div className="col-span-8 flex flex-col gap-4">
              <ChartContainer
                title=""
                actions={<EditButton isEditing={isEditing} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} />}
                height={420}
              >
                <div className="h-full flex flex-col">
                  <div className="pb-4 border-b border-gray-200 mb-4">
                    <CompetitorFilter
                      competitors={OT_VENDORS}
                      visibleCompetitors={visibleVendors}
                      onToggle={toggleVendor}
                    />
                  </div>
                  <div className="flex-1">
                    {renderChart()}
                  </div>
                </div>
              </ChartContainer>
            </div>

            {/* Insights Section - 4 columns */}
            <div className="col-span-4 flex flex-col gap-4">
              {getInsights()}
              {getPerformanceSummary()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit OT Security Metrics Data (Jul 2025 - Feb 2026)</h3>
            <div className="space-y-6">
              {OT_VENDORS.map((vendor) => (
                <div key={vendor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{vendor.name}</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Total Keywords:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.keywords[vendor.id][idx]}
                            onChange={(e) => handleValueChange('keywords', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Page 1 KWs:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.pageOne[vendor.id][idx]}
                            onChange={(e) => handleValueChange('pageOne', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Traffic:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.traffic[vendor.id][idx]}
                            onChange={(e) => handleValueChange('traffic', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">AIO:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.aio[vendor.id][idx]}
                            onChange={(e) => handleValueChange('aio', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SlideFooter source="Source: Ahrefs" />
    </SlideContainer>
  );
}