import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COMPETITORS, MONTHS } from '@/app/data/seo-data';
import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import { formatNumber } from '@/app/utils/format';
import {
  SlideContainer,
  SlideHeader,
  SlideFooter,
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

// Format month for display
const formatMonth = (month: string) => {
  const [year, monthNum] = month.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(monthNum) - 1]} ${year}`;
};

// ─────────────────────────────────────────────────────────────
// WW Traffic Data  (Source: Semrush · Location: WW · Jul 2025 – Feb 2026)
// ─────────────────────────────────────────────────────────────
const ORGANIC_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [4600000, 5200000, 4700000, 4500000, 4400000, 4900000, 4800000, 4900000],
  cisco:        [6100000, 6100000, 5800000, 19700000, 33500000, 26300000, 4400000, 5400000],
  hpe:          [1800000, 2000000, 1900000, 1700000, 1600000, 1700000, 1600000, 1500000],
  paloalto:     [700000,  900000,  1000000, 1300000, 1000000, 1000000, 900000,  1000000],
  checkpoint:   [1000000, 1000000, 1000000, 1100000, 862000,  838000,  737000,  742000],
  crowdstrike:  [1065000, 2074000, 946000,  679000,  799000,  569000,  545000,  701000],
  catonetworks: [49000,   58000,   52000,   53000,   51000,   55000,   58000,   58000],
  sentinelone:  [346000,  348000,  363000,  405000,  511000,  383000,  413000,  509000],
};

const BRANDED_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [915790,  909300,  945910,  876570,  699660,  592310,  539740,  535500],
  cisco:        [2400000, 2400000, 2510000, 2170000, 1880000, 1680000, 1510000, 2290000],
  hpe:          [437920,  472980,  511020,  482410,  411390,  412380,  376850,  349900],
  paloalto:     [213470,  265170,  425440,  303500,  228210,  256460,  222660,  229450],
  checkpoint:   [191110,  209410,  203580,  192480,  179210,  159230,  157640,  139400],
  crowdstrike:  [647550,  1534900, 514460,  267720,  218810,  143380,  147050,  198360],
  catonetworks: [23650,   26240,   23690,   25650,   25090,   22370,   27170,   26710],
  sentinelone:  [166620,  156590,  157690,  155380,  156220,  149490,  142120,  151600],
};

const NON_BRANDED_TRAFFIC_WW: Record<string, (number | null)[]> = {
  fortinet:     [3690000, 4260000, 3740000, 3620000, 3730000, 4300000, 4280000, 4330000],
  cisco:        [3660000, 3730000, 3310000, 17550000,31650000,24620000,2880000, 3130000],
  hpe:          [1390000, 1570000, 1380000, 1240000, 1160000, 1300000, 1190000, 1170000],
  paloalto:     [527750,  612870,  609700,  950640,  747050,  722390,  678780,  772520],
  checkpoint:   [825450,  827280,  824600,  870940,  682380,  678830,  579010,  602100],
  crowdstrike:  [417500,  539290,  431240,  411780,  579770,  425580,  397580,  502550],
  catonetworks: [25620,   32200,   28490,   27670,   26010,   32320,   30760,   30970],
  sentinelone:  [179060,  191390,  204820,  249250,  354290,  233820,  271010,  357130],
};

type TabType = 'overall' | 'branded' | 'non-branded';

interface EditableData {
  branded: (number | null)[];
  nonBranded: (number | null)[];
}

interface SlideTrafficOverviewTabsWWProps {
  onNavigateHome?: () => void;
}

export function SlideTrafficOverviewTabsWW({ onNavigateHome }: SlideTrafficOverviewTabsWWProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overall');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [visibleCompetitors, setVisibleCompetitors] = useState<Set<string>>(
    new Set(COMPETITORS.map((c) => c.id))
  );

  const [editableTraffic, setEditableTraffic] = useState<Record<string, (number | null)[]>>(() => {
    const initial: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = [...ORGANIC_TRAFFIC_WW[comp.id]];
    });
    return initial;
  });

  const [editableBrandedData, setEditableBrandedData] = useState<Record<string, EditableData>>(() => {
    const initial: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      initial[comp.id] = {
        branded: [...BRANDED_TRAFFIC_WW[comp.id]],
        nonBranded: [...NON_BRANDED_TRAFFIC_WW[comp.id]],
      };
    });
    return initial;
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleCompetitor = (competitorId: string) => {
    setVisibleCompetitors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(competitorId)) {
        newSet.delete(competitorId);
      } else {
        newSet.add(competitorId);
      }
      return newSet;
    });
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);

  const handleCancel = () => {
    const reset: Record<string, (number | null)[]> = {};
    COMPETITORS.forEach((comp) => {
      reset[comp.id] = [...ORGANIC_TRAFFIC_WW[comp.id]];
    });
    setEditableTraffic(reset);

    const resetBranded: Record<string, EditableData> = {};
    COMPETITORS.forEach((comp) => {
      resetBranded[comp.id] = {
        branded: [...BRANDED_TRAFFIC_WW[comp.id]],
        nonBranded: [...NON_BRANDED_TRAFFIC_WW[comp.id]],
      };
    });
    setEditableBrandedData(resetBranded);
    setIsEditing(false);
  };

  const handleValueChange = (competitorId: string, index: number, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableTraffic((prev) => ({
      ...prev,
      [competitorId]: prev[competitorId].map((v, i) => (i === index ? numValue : v)),
    }));
  };

  const handleBrandedValueChange = (
    competitorId: string,
    type: 'branded' | 'nonBranded',
    index: number,
    value: string
  ) => {
    const numValue = value === '' ? null : parseFloat(value);
    setEditableBrandedData((prev) => ({
      ...prev,
      [competitorId]: {
        ...prev[competitorId],
        [type]: prev[competitorId][type].map((v, i) => (i === index ? numValue : v)),
      },
    }));
  };

  // Chart data builders
  const tro = getTimeRangeOffset(timeRange);
  const overallChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableTraffic[competitor.id][i + tro];
      }
    });
    return dataPoint;
  });

  const brandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableBrandedData[competitor.id].branded[i + tro];
      }
    });
    return dataPoint;
  });

  const nonBrandedChartData = MONTHS.slice(tro).map((label, i) => {
    const dataPoint: any = { month: label };
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        dataPoint[competitor.id] = editableBrandedData[competitor.id].nonBranded[i + tro];
      }
    });
    return dataPoint;
  });

  const getYAxisDomain = (type: TabType) => {
    let maxValue = 0;
    COMPETITORS.forEach((competitor) => {
      if (visibleCompetitors.has(competitor.id)) {
        let trafficData: (number | null)[] = [];
        if (type === 'overall') {
          trafficData = editableTraffic[competitor.id];
        } else if (type === 'branded') {
          trafficData = editableBrandedData[competitor.id].branded;
        } else {
          trafficData = editableBrandedData[competitor.id].nonBranded;
        }
        trafficData.forEach((value) => {
          if (value !== null && value > maxValue) maxValue = value;
        });
      }
    });
    return [0, maxValue > 0 ? Math.ceil(maxValue * 1.1) : 100];
  };

  const tabs = [
    { id: 'overall' as TabType, label: 'Overall Traffic' },
    { id: 'branded' as TabType, label: 'Branded' },
    { id: 'non-branded' as TabType, label: 'Non-Branded' },
  ];

  const getChartData = () => {
    if (activeTab === 'overall') return overallChartData;
    if (activeTab === 'branded') return brandedChartData;
    return nonBrandedChartData;
  };

  const getInsights = () => {
    if (activeTab === 'overall') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Feb 2026, traffic slightly increased 4.6M → 4.9M (+6.5%), remaining stable around ~5M."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Feb 2026, Cisco declined 6.1M → 5.4M (−11.5%), while Palo Alto grew 0.7M → 1.0M (+42.9%)."
          />
        </InsightsSection>
      );
    } else if (activeTab === 'branded') {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Fortinet"
            content="From Jul 2025 to Feb 2026, branded traffic declined 915.8K → 535.5K (−41.5%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Feb 2026, Cisco declined 2.40M → 2.29M (−4.6%), while Palo Alto grew 213K → 229K (+7.5%)."
          />
        </InsightsSection>
      );
    } else {
      return (
        <InsightsSection>
          <InsightCard
            icon={TrendingUp}
            type="success"
            title="Fortinet"
            content="From Jul 2025 to Feb 2026, non-branded traffic increased 3.69M → 4.33M (+17.3%)."
          />
          <InsightCard
            icon={TrendingDown}
            type="error"
            title="Competitions"
            content="From Jul 2025 to Feb 2026, Cisco declined 3.66M → 3.13M (−14.5%), while Palo Alto grew 528K → 773K (+46.4%)."
          />
        </InsightsSection>
      );
    }
  };

  const getPerformanceSummary = () => {
    const latestIndex = 7; // Feb 2026
    let dataSource: Record<string, number[]>;

    if (activeTab === 'overall') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableTraffic[c.id] as number[]; });
    } else if (activeTab === 'branded') {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].branded as number[]; });
    } else {
      dataSource = {};
      COMPETITORS.forEach((c) => { dataSource[c.id] = editableBrandedData[c.id].nonBranded as number[]; });
    }

    const rankings = COMPETITORS.map((c) => ({
      id: c.id,
      name: c.name,
      value: dataSource[c.id]?.[latestIndex] ?? 0,
    })).sort((a, b) => b.value - a.value);

    const fortinetRanking = rankings.find((r) => r.id === 'fortinet');
    if (!fortinetRanking) return null;

    const fortinetPosition = rankings.findIndex((r) => r.id === 'fortinet') + 1;
    const isLeader = fortinetPosition === 1;
    const secondPlace = rankings[1];
    const firstPlace = rankings[0];
    const formatValue = (val: number) => formatNumber(val);
    const ordinal = (n: number) => n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`;

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

  const visibleCompetitorsList = COMPETITORS.filter((c) => visibleCompetitors.has(c.id));

  return (
    <SlideContainer slideNumber={4} onNavigateHome={onNavigateHome}>
      <SlideHeader
        title="Organic Traffic Performance Overview"
        subtitle="(Jul 2025 - Feb 2026)"
      />

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-10 py-3.5 text-sm font-semibold transition-all duration-200 relative ${
                activeTab === tab.id
                  ? 'bg-white text-red-600 z-10'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 hover:text-gray-800'
              }`}
              style={{
                borderRadius: '12px 12px 0 0',
                marginBottom: '-2px',
                boxShadow:
                  activeTab === tab.id
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

      <div className="flex-1 grid grid-cols-12 gap-6">
        {/* Chart Section – 8 columns */}
        <div className="col-span-8 flex flex-col gap-4">
          <ChartContainer
            title=""
            actions={
              <EditButton
                isEditing={isEditing}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            }
            height={400}
          >
            {!isEditing ? (
              <div className="h-full flex flex-col">
                <div className="pb-4 border-b border-gray-200 mb-4">
                  <CompetitorFilter
                    competitors={COMPETITORS}
                    visibleCompetitors={visibleCompetitors}
                    onToggle={toggleCompetitor}
                  />
                </div>
                <div className="flex-1">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    key={`ww-${activeTab}-${Array.from(visibleCompetitors).sort().join('-')}`}
                  >
                    <LineChart id={`ww-linechart-${activeTab}`} data={getChartData()} margin={CHART_CONFIG.margin}>
                      <CartesianGrid id={`ww-cartesian-${activeTab}`} {...CHART_CONFIG.cartesianGrid} />
                      <XAxis id={`ww-xaxis-${activeTab}`} dataKey="month" {...CHART_CONFIG.xAxis} interval={0} tickFormatter={formatMonth} />
                      <YAxis
                        id={`ww-yaxis-${activeTab}`}
                        {...CHART_CONFIG.yAxis}
                        tickFormatter={(value) => formatNumber(value)}
                        domain={getYAxisDomain(activeTab)}
                      />
                      <Tooltip
                        id={`ww-tooltip-${activeTab}`}
                        content={(props) => (
                          <CustomChartTooltip {...props} formatter={formatNumber} monthFormatter={formatMonth} />
                        )}
                      />
                      {visibleCompetitorsList.map((competitor) => (
                        <Line
                          key={`ww-${competitor.id}-${activeTab}`}
                          id={`ww-line-${activeTab}-${competitor.id}`}
                          name={competitor.name}
                          type="monotone"
                          dataKey={competitor.id}
                          stroke={competitor.color}
                          {...CHART_CONFIG.line}
                          dot={{ fill: competitor.color, r: 5, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, strokeWidth: 2 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-auto">
                <div className="space-y-4">
                  {activeTab === 'overall' &&
                    COMPETITORS.map((competitor) => (
                      <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: competitor.color }}
                          />
                          <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                        </div>
                        <div className="grid grid-cols-8 gap-2">
                          {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                            <div key={month}>
                              <label className="text-xs text-gray-600 font-medium mb-1 block">
                                {month}:
                              </label>
                              <input
                                type="number"
                                value={editableTraffic[competitor.id][idx] ?? ''}
                                onChange={(e) => handleValueChange(competitor.id, idx, e.target.value)}
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="null"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                  {(activeTab === 'branded' || activeTab === 'non-branded') &&
                    COMPETITORS.map((competitor) => (
                      <div key={competitor.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: competitor.color }}
                          />
                          <h4 className="text-sm font-semibold text-gray-900">{competitor.name}</h4>
                        </div>
                        <div className="grid grid-cols-8 gap-2">
                          {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map((month, idx) => (
                            <div key={month}>
                              <label className="text-xs text-gray-600 font-medium mb-1 block">
                                {month}:
                              </label>
                              <input
                                type="number"
                                value={
                                  activeTab === 'branded'
                                    ? editableBrandedData[competitor.id].branded[idx] ?? ''
                                    : editableBrandedData[competitor.id].nonBranded[idx] ?? ''
                                }
                                onChange={(e) =>
                                  handleBrandedValueChange(
                                    competitor.id,
                                    activeTab === 'branded' ? 'branded' : 'nonBranded',
                                    idx,
                                    e.target.value
                                  )
                                }
                                className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="null"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Insights Section – 4 columns */}
        <div className="col-span-4 flex flex-col gap-4">
          {getInsights()}
          {getPerformanceSummary()}
        </div>
      </div>

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}