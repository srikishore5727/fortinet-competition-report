import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
  SlideSource,
  ChartContainer,
  InsightCard,
  InsightsSection,
  EditButton,
  CompetitorFilter,
  CustomChartTooltip,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NGFW_COMPETITORS = [
  { id: 'fortinet', name: 'Fortinet', color: '#EF4444' },
  { id: 'cisco', name: 'Cisco', color: '#FF7AB6' },
  { id: 'hpe', name: 'HPE', color: '#7ED957' },
  { id: 'paloalto', name: 'Palo Alto', color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point', color: '#6C9AFF' },
  { id: 'crowdstrike', name: 'CrowdStrike', color: '#1F2937' },
  { id: 'catonetworks', name: 'Cato Networks', color: '#8B5CF6' },
  { id: 'sentinelone', name: 'SentinelOne', color: '#10B981' },
];

const MONTHS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
};

const TOTAL_KEYWORDS_ABS = {
  fortinet:    [1240, 1421, 995, 896, 944, 981, 998, 999],
  cisco:       [1132, 1177, 756, 665, 700, 742, 755, 825],
  hpe:         [170,  174,  87,  85, 103, 102, 109, 109],
  paloalto:    [1129, 1224, 848, 727, 756, 860, 909, 917],
  checkpoint:  [1115, 1198, 708, 564, 560, 562, 562, 567],
  crowdstrike: [null, null, null, null,  63,  74,  80,  89], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  89,  99,  86], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,  25,  32,  34], // Data starts Dec 2025
};

const PAGE_ONE_KW_ABS = {
  fortinet:    [653, 762, 791, 788, 849, 862, 879, 859],
  cisco:       [494, 510, 535, 556, 584, 601, 604, 661],
  hpe:         [ 41,  41,  45,  51,  64,  55,  66,  63],
  paloalto:    [517, 557, 611, 608, 634, 719, 760, 758],
  checkpoint:  [425, 430, 445, 413, 400, 371, 381, 361],
  crowdstrike: [null, null, null, null,  38,  39,  36,  40], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  22,  29,  21], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,   6,   7,   6], // Data starts Dec 2025
};

const CUMULATIVE_TRAFFIC_ABS = {
  fortinet:    [18947, 23092, 25392, 23104, 24692, 27746, 30861, 30105],
  cisco:       [16293, 15420, 16155, 15861, 15826, 24132, 29153, 30462],
  hpe:         [  256,   413,   384,   782,   836,   626,   687,   702],
  paloalto:    [10265, 11043, 11770, 11946, 12637, 21611, 23649, 23938],
  checkpoint:  [ 5250,  6262,  5016,  4294,  5126,  4772,  4814,  5881],
  crowdstrike: [null, null, null, null,  407,  338,  317,  451], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  270,  306,  351], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,   62,   60,   62], // Data starts Dec 2025
};

const AIO_DATA_ABS = {
  fortinet:    [538, 611, 474, 498, 588, 615, 637, 652],
  cisco:       [484, 530, 374, 389, 462, 490, 498, 534],
  hpe:         [ 82,  98,  61,  55,  77,  77,  79,  87],
  paloalto:    [497, 550, 420, 413, 496, 558, 587, 613],
  checkpoint:  [500, 542, 359, 353, 389, 396, 384, 406],
  crowdstrike: [null, null, null, null,  47,  47,  53,  61], // Data starts Nov 2025
  catonetworks:[null, null, null, null, null,  68,  74,  73], // Data starts Dec 2025
  sentinelone: [null, null, null, null, null,  18,  22,  27], // Data starts Dec 2025
};

type TabType = 'keywords' | 'page-one' | 'traffic' | 'aio';

interface SlideNGFWProps {
  onNavigateHome?: () => void;
}

export function SlideNGFW({ onNavigateHome }: SlideNGFWProps) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(NGFW_COMPETITORS.map((c) => c.id))
  );

  const [editableData, setEditableData] = useState<{
    keywords: Record<string, number[]>;
    pageOne: Record<string, number[]>;
    traffic: Record<string, number[]>;
    aio: Record<string, number[]>;
  }>(() => ({
    keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_ABS)),
    pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KW_ABS)),
    traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_ABS)),
    aio: JSON.parse(JSON.stringify(AIO_DATA_ABS)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const toggleCompetitor = (competitorId: string) => {
    setVisibleCompetitors((prev) => {
      const newSet = new Set(prev);
      newSet.has(competitorId) ? newSet.delete(competitorId) : newSet.add(competitorId);
      return newSet;
    });
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  const handleCancel = () => {
    setEditableData({
      keywords: JSON.parse(JSON.stringify(TOTAL_KEYWORDS_ABS)),
      pageOne: JSON.parse(JSON.stringify(PAGE_ONE_KW_ABS)),
      traffic: JSON.parse(JSON.stringify(CUMULATIVE_TRAFFIC_ABS)),
      aio: JSON.parse(JSON.stringify(AIO_DATA_ABS)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'keywords' | 'pageOne' | 'traffic' | 'aio',
    competitorId: string,
    index: number,
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setEditableData((prev) => ({
      ...prev,
      [dataset]: {
        ...prev[dataset],
        [competitorId]: prev[dataset][competitorId].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Prepare chart data
  const tro = getTimeRangeOffset(timeRange);
  const keywordsChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.keywords[comp.id]) {
        dataPoint[comp.id] = editableData.keywords[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const trafficChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.traffic[comp.id]) {
        dataPoint[comp.id] = editableData.traffic[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const pageOneChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.pageOne[comp.id]) {
        dataPoint[comp.id] = editableData.pageOne[comp.id][i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const aioChartData = MONTHS.slice(tro).map((month, i) => {
    const dataPoint: any = { month };
    NGFW_COMPETITORS.forEach((comp) => {
      if (visibleCompetitors.has(comp.id) && editableData.aio[comp.id]) {
        dataPoint[comp.id] = editableData.aio[comp.id][i + tro] ?? null;
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
      case 'keywords': return keywordsChartData;
      case 'page-one': return pageOneChartData;
      case 'traffic': return trafficChartData;
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
              content="From Jul 2025 to Feb 2026, keywords declined 1240 → 999 (−19.4%), remaining competitive."
            />
            <InsightCard
              icon={TrendingDown}
              type="error"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco declined 1132 → 825 (−27.1%), while Palo Alto declined 1129 → 917 (−18.8%)."
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
              content="From Jul 2025 to Feb 2026, page-1 keywords increased 653 → 859 (+31.6%)."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco increased 494 → 661 (+33.8%), while Palo Alto increased 517 → 758 (+46.6%)."
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
              content="From Jul 2025 to Feb 2026, traffic increased 18,947 → 30,105 (+58.9%)."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco increased 16,293 → 30,462 (+87.0%)."
            />
          </InsightsSection>
        );
      case 'aio':
        return (
          <InsightsSection>
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Fortinet"
              content="From Jul 2025 to Feb 2026, AIO keywords increased 538 → 652 (+21.2%)."
            />
            <InsightCard
              icon={TrendingUp}
              type="success"
              title="Competitions"
              content="From Jul 2025 to Feb 2026, Cisco increased 484 → 534 (+10.3%), while Palo Alto increased 497 → 613 (+23.3%)."
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
    let metricName: string;
    let formatValue: (val: number) => string;

    switch (activeTab) {
      case 'keywords':
        dataSource = editableData.keywords;
        metricName = 'Keywords';
        formatValue = (val) => val.toLocaleString();
        break;
      case 'page-one':
        dataSource = editableData.pageOne;
        metricName = 'Page 1 Rankings';
        formatValue = (val) => val.toLocaleString();
        break;
      case 'traffic':
        dataSource = editableData.traffic;
        metricName = 'Traffic';
        formatValue = (val) => `${(val / 1000).toFixed(1)}K`;
        break;
      case 'aio':
        dataSource = editableData.aio;
        metricName = 'AIO Rankings';
        formatValue = (val) => val.toLocaleString();
        break;
      default:
        return null;
    }

    // Get latest values for all competitors
    const rankings = NGFW_COMPETITORS.map(comp => ({
      id: comp.id,
      name: comp.name,
      value: dataSource[comp.id]?.[latestIndex] ?? 0,
      color: comp.color,
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
    const visibleCompetitorsList = NGFW_COMPETITORS.filter(comp => visibleCompetitors.has(comp.id));
    
    if (activeTab === 'traffic') {
      return (
        <ResponsiveContainer key={`${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}`} width="100%" height="100%">
          <LineChart data={chartData} margin={CHART_CONFIG.margin}>
            <CartesianGrid id={`ngfw-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
            <XAxis id={`ngfw-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
            <YAxis id={`ngfw-yaxis-${activeTab}`} {...CHART_CONFIG.yAxis} />
            <Tooltip id={`ngfw-tooltip-${activeTab}`} content={(props) => <CustomChartTooltip {...props} />} />
            {visibleCompetitorsList.map((comp) => (
              <Line
                key={comp.id}
                id={`ngfw-line-${activeTab}-${comp.id}`}
                name={comp.name}
                type="monotone"
                dataKey={comp.id}
                stroke={comp.color}
                {...CHART_CONFIG.line}
                dot={{ fill: comp.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Bar chart for all other tabs
    return (
      <ResponsiveContainer key={`${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}`} width="100%" height="100%">
        <BarChart 
          id={`ngfw-${activeTab}-bar`}
          data={chartData} 
          margin={CHART_CONFIG.margin}
        >
          <CartesianGrid id={`ngfw-bar-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
          <XAxis id={`ngfw-bar-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} tickFormatter={formatMonth} />
          <YAxis id={`ngfw-bar-yaxis-${activeTab}`} {...CHART_CONFIG.yAxis} />
          <Tooltip id={`ngfw-bar-tooltip-${activeTab}`} content={(props) => <CustomChartTooltip {...props} />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
          {visibleCompetitorsList.map((comp) => (
            <Bar
              key={comp.id}
              id={`ngfw-bar-${activeTab}-${comp.id}`}
              name={comp.name}
              dataKey={comp.id}
              fill={comp.color}
              radius={CHART_CONFIG.bar.radius}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <SlideContainer slideNumber={8} onNavigateHome={onNavigateHome} source="Ahrefs">
      <div className="mb-6">
      <SlideHeader
        title="NGFW / Firewall"
        subtitle="(Jul 2025 - Feb 2026)"
      />
      <SlideSource source="Ahrefs" slideNumber={8} />
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
                      competitors={NGFW_COMPETITORS}
                      visibleCompetitors={visibleCompetitors}
                      onToggle={toggleCompetitor}
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit NGFW Metrics Data</h3>
            <div className="space-y-6">
              {NGFW_COMPETITORS.map((comp) => (
                <div key={comp.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: comp.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{comp.name}</h4>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Total Keywords:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.keywords[comp.id][idx]}
                            onChange={(e) => handleValueChange('keywords', comp.id, idx, e.target.value)}
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
                            value={editableData.pageOne[comp.id][idx]}
                            onChange={(e) => handleValueChange('pageOne', comp.id, idx, e.target.value)}
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
                            value={editableData.traffic[comp.id][idx]}
                            onChange={(e) => handleValueChange('traffic', comp.id, idx, e.target.value)}
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
                            value={editableData.aio[comp.id][idx]}
                            onChange={(e) => handleValueChange('aio', comp.id, idx, e.target.value)}
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