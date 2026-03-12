import { useState } from 'react';
import { Award, TrendingUp, TrendingDown, Link, Trophy, Target } from 'lucide-react';
import { formatNumber } from '@/app/utils/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  SlideContainer,
  SlideHeader,
  SlideSource,
  SlideFooter,
  ChartContainer,
  InsightCard,
  InsightsSection,
  CompetitorFilter,
  CHART_CONFIG,
  TimeRangeFilter,
  TimeRange,
  getTimeRangeOffset,
} from './design-system';

const VENDORS = [
  { id: 'fortinet',    name: 'Fortinet',      color: '#EF4444' },
  { id: 'paloalto',   name: 'Palo Alto',      color: '#FFB14A' },
  { id: 'checkpoint', name: 'Check Point',    color: '#6C9AFF' },
  { id: 'hpe',        name: 'HPE',            color: '#7ED957' },
  { id: 'cisco',      name: 'Cisco',          color: '#FF7AB6' },
  { id: 'crowdstrike',name: 'Crowdstrike',    color: '#1F2937' },
  { id: 'cato',       name: 'Cato Networks',  color: '#A78BFA' },
  { id: 'sentinelone',name: 'SentinelOne',    color: '#06B6D4' },
];

// Referring Domains — Jul 2025 → Feb 2026 (Source: SEMrush, Location: WW)
const REFERRING_DOMAINS_DATA_INITIAL: Record<string, number[]> = {
  fortinet:    [54366,  54824,  54764,  55753,  55664,  55539,  54676,  54800],
  paloalto:    [42176,  42110,  41804,  43395,  43492,  42913,  42607,  43274],
  checkpoint:  [59363,  59664,  59675,  60931,  61349,  60699,  60302,  60848],
  hpe:         [84611,  84164,  83241,  84928,  85049,  81908,  79383,  78234],
  cisco:       [238434, 239069, 238654, 240813, 238909, 234233, 231358, 234186],
  crowdstrike: [39155,  39201,  39187,  39829,  41063,  40497,  40061,  40158],
  cato:        [ 5142,   5337,   5440,   5740,   6034,   6142,   6337,   6341],
  sentinelone: [19295,  19329,  19424,  20013,  20742,  20604,  20452,  20615],
};

// Backlinks — Jul 2025 → Feb 2026 (Source: SEMrush, Location: WW)
const BACKLINKS_DATA_INITIAL: Record<string, number[]> = {
  fortinet:    [ 3200000,  2900000,  3000000,  3000000,  2800000,  2800000,  2800000,  2800000],
  paloalto:    [ 3300000,  3300000,  3200000,  3100000,  3000000,  2700000,  2600000,  2600000],
  checkpoint:  [ 5800000,  5900000,  6700000,  7200000,  6800000,  6500000,  5900000,  5700000],
  hpe:         [24400000, 23700000, 23100000, 27600000, 30000000, 29900000, 29600000, 29600000],
  cisco:       [43200000, 44400000, 43900000, 48300000, 49900000, 48000000, 46700000, 46300000],
  crowdstrike: [ 1700000,  1700000,  1600000,  1700000,  1700000,  1600000,  1400000,  1400000],
  cato:        [ 1100000,   700000,   400000,   200000,   100000,   100000,   100000,   100000],
  sentinelone: [ 1100000,  1100000,  1300000,  1500000,  1400000,  1200000,  1100000,  1100000],
};

// Helper function to format month keys for display
const formatMonth = (monthKey: string) => {
  const monthMap: { [key: string]: string } = {
    '2025-07': 'Jul 2025',
    '2025-08': 'Aug 2025',
    '2025-09': 'Sep 2025',
    '2025-10': 'Oct 2025',
    '2025-11': 'Nov 2025',
    '2025-12': 'Dec 2025',
    '2026-01': 'Jan 2026',
    '2026-02': 'Feb 2026',
  };
  return monthMap[monthKey] || monthKey;
};

const MONTH_KEYS = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];

type TabType = 'referringDomains' | 'backlinks';

const CustomTooltip = ({ active, payload, label, isBacklinks }: any) => {
  if (!active || !payload || !payload.length) return null;
  const validPayload = payload.filter((entry: any) => entry.value !== null && entry.value !== undefined);
  if (!validPayload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-gray-900 mb-2">{formatMonth(label)}</p>
      {validPayload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-700">{entry.name}:</span>
          <span className="font-semibold text-gray-900">
            {isBacklinks ? formatNumber(entry.value) : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export function SlideBacklinks({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>('referringDomains');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleVendors, setVisibleVendors] = useState<Set<string>>(
    new Set(VENDORS.map((v) => v.id))
  );

  const [editableData, setEditableData] = useState<{
    referringDomains: Record<string, number[]>;
    backlinks: Record<string, number[]>;
  }>(() => ({
    referringDomains: JSON.parse(JSON.stringify(REFERRING_DOMAINS_DATA_INITIAL)),
    backlinks: JSON.parse(JSON.stringify(BACKLINKS_DATA_INITIAL)),
  }));

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => {
    setEditableData({
      referringDomains: JSON.parse(JSON.stringify(REFERRING_DOMAINS_DATA_INITIAL)),
      backlinks: JSON.parse(JSON.stringify(BACKLINKS_DATA_INITIAL)),
    });
    setIsEditing(false);
  };

  const handleValueChange = (
    dataset: 'referringDomains' | 'backlinks',
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
      if (newSet.has(vendorId)) newSet.delete(vendorId);
      else newSet.add(vendorId);
      return newSet;
    });
  };

  const tro = getTimeRangeOffset(timeRange);
  // Use vendor.id as dataKey (no spaces) to prevent Recharts duplicate key warnings
  const referringDomainsChartData = MONTH_KEYS.slice(tro).map((monthKey, i) => {
    const dataPoint: any = { month: monthKey };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.referringDomains[vendor.id]?.[i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const backlinksChartData = MONTH_KEYS.slice(tro).map((monthKey, i) => {
    const dataPoint: any = { month: monthKey };
    VENDORS.forEach((vendor) => {
      if (visibleVendors.has(vendor.id)) {
        dataPoint[vendor.id] = editableData.backlinks[vendor.id]?.[i + tro] ?? null;
      }
    });
    return dataPoint;
  });

  const getBacklinksYMax = () => {
    let max = 0;
    backlinksChartData.forEach((point) => {
      VENDORS.forEach((vendor) => {
        if (visibleVendors.has(vendor.id) && point[vendor.id] != null) {
          max = Math.max(max, point[vendor.id]);
        }
      });
    });
    return Math.ceil(max * 1.15);
  };

  const getDomainsYMax = () => {
    let max = 0;
    referringDomainsChartData.forEach((point) => {
      VENDORS.forEach((vendor) => {
        if (visibleVendors.has(vendor.id) && point[vendor.id] != null) {
          max = Math.max(max, point[vendor.id]);
        }
      });
    });
    return Math.ceil(max * 1.15);
  };

  const tabs = [
    { id: 'referringDomains' as TabType, label: 'Referring Domains' },
    { id: 'backlinks' as TabType, label: 'Total Backlinks' },
  ];

  const getChartData = () =>
    activeTab === 'referringDomains' ? referringDomainsChartData : backlinksChartData;

  const getInsights = () => {
    if (activeTab === 'referringDomains') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Feb 2026, referring domains remained stable 54.3K → 54.8K."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Feb 2026, Cisco maintained the largest domain base 238K → 234K, far ahead of competitors."
          />
        </InsightsSection>
      );
    } else {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Fortinet"
            content="From Jul 2025 to Feb 2026, backlinks slightly declined from 3.2M → 2.8M."
          />
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Competitions"
            content="From Jul 2025 to Feb 2026, Cisco maintained the strongest backlink profile 43.2M → 46.3M, leading the market."
          />
        </InsightsSection>
      );
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 7; // Feb 2026
    const dataSource = activeTab === 'referringDomains'
      ? editableData.referringDomains
      : editableData.backlinks;
    const formatValue = (val: number) => formatNumber(val);
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

    const rankings = VENDORS.map((v) => ({
      id: v.id,
      name: v.name,
      value: dataSource[v.id]?.[latestIndex] ?? 0,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find((r) => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex((r) => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];

    if (isLeader) {
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

  return (
    <SlideContainer slideNumber={23} onNavigateHome={onNavigateHome}>
      <div className="mb-6">
      <SlideHeader
        title="Competitions Backlink Performance"
        subtitle="(Jul 2025 - Feb 2026) • Location: WW"
      />
      <SlideSource source="Semrush" slideNumber={23} />
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
              <ChartContainer title="" height={420}>
                <div className="h-full flex flex-col">
                  <div className="pb-4 border-b border-gray-200 mb-4">
                    <CompetitorFilter
                      competitors={VENDORS}
                      visibleCompetitors={visibleVendors}
                      onToggle={toggleVendor}
                    />
                  </div>
                  <div className="flex-1">
                    <ResponsiveContainer key={`${activeTab}-${Array.from(visibleVendors).sort().join('-')}`} width="100%" height="100%">
                      <LineChart
                        data={getChartData()}
                        margin={CHART_CONFIG.margin}
                      >
                        <CartesianGrid {...CHART_CONFIG.cartesianGrid} />
                        <XAxis
                          dataKey="month"
                          {...CHART_CONFIG.xAxis}
                          tickFormatter={formatMonth}
                          interval={0}
                        />
                        <YAxis
                          {...CHART_CONFIG.yAxis}
                          domain={activeTab === 'backlinks' ? [0, getBacklinksYMax()] : [0, getDomainsYMax()]}
                          tickFormatter={(value) => formatNumber(value)}
                        />
                        <Tooltip content={(props) => <CustomTooltip {...props} isBacklinks={activeTab === 'backlinks'} />} />
                        {VENDORS.filter(v => visibleVendors.has(v.id)).map((vendor) => (
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
            <h3 className="text-sm font-bold text-gray-900 mb-4">Edit Backlink Data</h3>
            <div className="space-y-6">
              {VENDORS.map((vendor) => (
                <div key={vendor.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vendor.color }} />
                    <h4 className="text-sm font-bold text-gray-900">{vendor.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Referring Domains:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.referringDomains[vendor.id][idx]}
                            onChange={(e) => handleValueChange('referringDomains', vendor.id, idx, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 w-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Backlinks:</div>
                      {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                        <div key={month} className="mb-2">
                          <label className="text-xs text-gray-600 block mb-1">{month}:</label>
                          <input
                            type="number"
                            value={editableData.backlinks[vendor.id][idx]}
                            onChange={(e) => handleValueChange('backlinks', vendor.id, idx, e.target.value)}
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

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}