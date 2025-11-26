
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, KeyMetric, StuntingData, NutritionOverview, SanitationData, OverweightUnderFive } from '@/lib/supabase';
import MetricCard from '@/components/dashboard/MetricCard';
import DistrictMap from '@/components/dashboard/DistrictMap';
import EChartsLineChart from '@/components/dashboard/EChartsLineChart';
import EChartsBarChart from '@/components/dashboard/EChartsBarChart';
import EChartsPieChart from '@/components/dashboard/EChartsPieChart';
import EChartsRadarChart from '@/components/dashboard/EChartsRadarChart';
import EChartsGenderTrendChart from '@/components/dashboard/EChartsGenderTrendChart';
import { stuntingUnderFiveData } from '@/data/stuntingUnderFive';

export default function KeyInsights() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('gis');
  const [loading, setLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(false);
  
  // Data states
  const [keyMetrics, setKeyMetrics] = useState<KeyMetric[]>([]);
  const [stuntingData, setStuntingData] = useState<StuntingData[]>([]);
  const [nutritionData, setNutritionData] = useState<NutritionOverview[]>([]);
  const [sanitationData, setSanitationData] = useState<SanitationData[]>([]);
  const [overweightRecords, setOverweightRecords] = useState<OverweightUnderFive[]>([]);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchAllData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.fade-in-section');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          section.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [metricsRes, stuntingRes, nutritionRes, sanitationRes, overweightRes] = await Promise.all([
        supabase.from('key_metrics').select('*'),
        supabase.from('stunting_data').select('*').order('year', { ascending: true }),
        supabase.from('nutrition_overview').select('*').order('year', { ascending: true }),
        supabase.from('sanitation_data').select('*').order('year', { ascending: true }),
        supabase.from('over_weight-under-five').select('*').order('year', { ascending: true })
      ]);

      if (metricsRes.data) setKeyMetrics(metricsRes.data);
      if (stuntingRes.data) setStuntingData(stuntingRes.data);
      if (nutritionRes.data) setNutritionData(nutritionRes.data);
      if (sanitationRes.data) setSanitationData(sanitationRes.data);
      if (overweightRes.data) setOverweightRecords(overweightRes.data);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      setPredictionsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/nutrition-ml-predictions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch predictions');
      
      const result = await response.json();
      if (result.success) {
        setPredictions(result.data);
      }
    } catch (error) {
      console.error('Error fetching ML predictions:', error);
    } finally {
      setPredictionsLoading(false);
    }
  };

  const tabs = [
    { id: 'gis', label: 'GIS Mapping', icon: 'ri-map-2-line' },
    { id: 'analytics', label: 'DASHBOARD', icon: 'ri-bar-chart-line' },
    { id: 'statistics', label: 'Key Statistics', icon: 'ri-pie-chart-line' }
  ];

  // New function to view a district on the map
  const handleViewOnMap = (districtName: string) => {
    // Switch to GIS tab
    setActiveTab('gis');
    
    // Scroll to the map section
    setTimeout(() => {
      const mapSection = document.querySelector('.district-map-section');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Highlight the specific district on the map
      const districtPoint = document.querySelector(`[data-district="${districtName}"]`);
      if (districtPoint) {
        // Add highlight effect
        districtPoint.classList.add('highlighted-district');
        
        // Simulate click to show district info
        setTimeout(() => {
          (districtPoint as HTMLElement).click();
        }, 500);
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          districtPoint.classList.remove('highlighted-district');
        }, 3000);
      }
    }, 100);
  };

  // Transform data for charts
  const trendChartData = stuntingData.map(item => ({
    year: item.year,
    stunting: parseFloat(item.stunting),
    overweight: parseFloat(item.overweight)
  }));

  const nutritionChartData = nutritionData.map(item => ({
    year: item.year,
    underweight: parseFloat(item.underweight),
    mortality: parseFloat(item.mortality)
  }));

  const sanitationChartData = sanitationData.map(item => ({
    year: item.year,
    handwashing: parseFloat(item.handwashing),
    sanitation: parseFloat(item.sanitation),
    open_defecation: parseFloat(item.open_defecation)
  }));

  const supabaseOverweightData = overweightRecords.map(item => {
    const male = parseFloat(item.male_rate);
    const female = parseFloat(item.female_rate);
    const total = item.total_rate
      ? parseFloat(item.total_rate)
      : parseFloat(((male + female) / 2).toFixed(2));

    return {
      year: item.year,
      male,
      female,
      total
    };
  });

  const overweightTrendData = supabaseOverweightData.length ? supabaseOverweightData : stuntingUnderFiveData;
  const genderChartTitle = supabaseOverweightData.length
    ? 'Overweight Under-Five Trends by Gender'
    : 'Stunting Under-Five Trends by Gender';

  // Mock district data for GIS (this could be fetched from another table)
  const districtData = [
    { district: 'Nyarugenge', malnutrition: 23.4, intervention: 'High Priority', color: '#DC2626' },
    { district: 'Gasabo', malnutrition: 18.7, intervention: 'Medium Priority', color: '#F59E0B' },
    { district: 'Kicukiro', malnutrition: 15.2, intervention: 'Medium Priority', color: '#F59E0B' },
    { district: 'Nyanza', malnutrition: 31.8, intervention: 'Critical', color: '#991B1B' },
    { district: 'Huye', malnutrition: 28.5, intervention: 'High Priority', color: '#DC2626' },
    { district: 'Muhanga', malnutrition: 25.9, intervention: 'High Priority', color: '#DC2626' },
    { district: 'Ruhango', malnutrition: 22.1, intervention: 'Medium Priority', color: '#F59E0B' },
    { district: 'Nyamagabe', malnutrition: 35.2, intervention: 'Critical', color: '#991B1B' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C7D59F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#40531A] font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#40531A] shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <img
                  src="https://readdy.ai/api/search-image?query=Circular%20logo%20design%20with%20NDI%20UMUHUZA%20text%20in%20bold%20letters%20around%20the%20circle%20border%20and%20RWANDA%20NUTRITION%20CONNECT%20subtitle%20in%20smaller%20text%20below%2C%20clean%20white%20background%2C%20professional%20green%20and%20white%20color%20scheme%2C%20minimalist%20design%2C%20high%20contrast%20for%20easy%20background%20removal%2C%20similar%20to%20official%20government%20emblem%20style&width=200&height=200&seq=ndi-umuhuza-logo&orientation=squarish"
                  alt="Ndi Umuhuza Logo"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="text-white">
                <div className="font-bold text-lg leading-tight">NDI UMUHUZA</div>
                <div className="text-xs text-[#C7D59F] font-light">RWANDA NUTRITION CONNECT</div>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Home
              </Link>
              <Link href="/insights" className="text-[#C7D59F] font-medium whitespace-nowrap">
                Key Insights
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-[#40531A] to-[#2B5D31] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=Advanced%20data%20visualization%20dashboard%20showing%20Rwanda%20geographic%20information%20system%20GIS%20mapping%20with%20nutrition%20statistics%20colorful%20charts%20graphs%20and%20analytics%20displays%20modern%20technology%20meeting%20healthcare%20data%20science%20professional%20workspace&width=1920&height=1080&seq=insights-hero&orientation=landscape"
            alt="Data Analytics Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#40531A]/90 to-[#2B5D31]/80"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl lg:text-6xl font-light text-white mb-6">
              Key <span className="font-normal text-[#C7D59F]">Insights</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Real-time nutrition analytics powered by NISR data - Advanced GIS mapping, predictive modeling, and actionable insights for Rwanda's nutrition security
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white shadow-sm sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 border-b-2 whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-[#C7D59F] text-[#40531A] bg-[#C7D59F]/5'
                    : 'border-transparent text-gray-600 hover:text-[#40531A] hover:border-gray-300'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`${tab.icon} text-lg leading-none`}></i>
                </div>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* GIS Mapping Tab */}
        {activeTab === 'gis' && (
          <div className="space-y-12">
            <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
              <h2 className="text-3xl font-light text-[#40531A] mb-8">Geographic Information System Mapping</h2>
              
              <DistrictMap data={districtData} />

              {/* District Data Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
                <div className="px-6 py-4 bg-[#40531A] text-white">
                  <h3 className="text-lg font-semibold">District-Level Malnutrition Data</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Malnutrition Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intervention Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {districtData.map((district, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.district}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{district.malnutrition}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{district.intervention}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: district.color }}></div>
                              <span className="text-sm text-gray-900">{district.intervention}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewOnMap(district.district)}
                                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                              >
                                <div className="w-3 h-3 flex items-center justify-center">
                                  <i className="ri-map-pin-line text-xs leading-none"></i>
                                </div>
                                <span className="whitespace-nowrap">View on Map</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-12">
            <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
              <h2 className="text-3xl font-light text-[#40531A] mb-8">Advanced Data Analytics Dashboard</h2>
              
              {/* Main Analytics Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {trendChartData.length > 0 && (
                  <EChartsLineChart 
                    data={trendChartData} 
                    title="Stunting & Overweight Trends (2000-2020)" 
                  />
                )}
                
                {sanitationChartData.length > 0 && (
                  <EChartsBarChart 
                    data={sanitationChartData} 
                    title="Sanitation & Hygiene Access (2020-2022)" 
                  />
                )}
              </div>

              {/* Secondary Charts Grid */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {nutritionChartData.length > 0 && (
                  <EChartsPieChart 
                    data={nutritionChartData} 
                    title="Current Nutrition Status Distribution" 
                  />
                )}
                
                {overweightTrendData.length > 0 ? (
                  <EChartsGenderTrendChart 
                    data={overweightTrendData} 
                    title={genderChartTitle} 
                  />
                ) : (
                <EChartsRadarChart 
                  data={[]} 
                  title="Multi-Dimensional Health Indicators" 
                />
                )}
              </div>

              {/* Data Sources Section */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-[#40531A] mb-6">Live Data Sources & Analytics</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-database-2-line text-white text-lg leading-none"></i>
                    </div>
                    <h4 className="font-medium text-[#40531A] mb-2">Supabase Connected</h4>
                    <p className="text-sm text-gray-600">Real-time NISR data</p>
                    <div className="mt-3 text-xs text-green-600 font-semibold">
                      {stuntingData.length + nutritionData.length + sanitationData.length} Records
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-refresh-line text-white text-lg leading-none"></i>
                    </div>
                    <h4 className="font-medium text-[#40531A] mb-2">Auto-Updated</h4>
                    <p className="text-sm text-gray-600">Latest data refresh</p>
                    <div className="mt-3 text-xs text-blue-600 font-semibold">
                      Last: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-line-chart-line text-white text-lg leading-none"></i>
                    </div>
                    <h4 className="font-medium text-[#40531A] mb-2">ECharts Powered</h4>
                    <p className="text-sm text-gray-600">Interactive visualizations</p>
                    <div className="mt-3 text-xs text-purple-600 font-semibold">
                      4 Chart Types
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-bar-chart-box-line text-white text-lg leading-none"></i>
                    </div>
                    <h4 className="font-medium text-[#40531A] mb-2">Advanced Analytics</h4>
                    <p className="text-sm text-gray-600">Multi-dimensional analysis</p>
                    <div className="mt-3 text-xs text-orange-600 font-semibold">
                      Real-time Processing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-12">
            <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
              <h2 className="text-3xl font-light text-[#40531A] mb-8">Live Key Statistics & Indicators</h2>
              
              {/* Statistics Grid - Clean Circular Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {keyMetrics.map((metric, index) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* Historical Comparison - Clean Circular Layout */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stuntingData.length >= 2 && (
                  <>
                    <div className="bg-white rounded-full shadow-lg border-4 border-red-500 p-6 aspect-square flex flex-col items-center justify-center text-center relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <i className="ri-arrow-down-line text-red-600 text-sm leading-none"></i>
                      </div>
                      <div className="text-2xl font-bold text-red-600 mb-2">
                        {stuntingData[stuntingData.length - 1]?.stunting}%
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">Stunting Rate</div>
                      <div className="text-xs text-gray-500">Current Level</div>
                    </div>
                    
                    <div className="bg-white rounded-full shadow-lg border-4 border-blue-500 p-6 aspect-square flex flex-col items-center justify-center text-center relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <i className="ri-scales-line text-blue-600 text-sm leading-none"></i>
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {stuntingData[stuntingData.length - 1]?.overweight}%
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">Overweight Rate</div>
                      <div className="text-xs text-gray-500">Current Level</div>
                    </div>
                  </>
                )}
                {nutritionData.length >= 2 && (
                  <>
                    <div className="bg-white rounded-full shadow-lg border-4 border-orange-500 p-6 aspect-square flex flex-col items-center justify-center text-center relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <i className="ri-user-line text-orange-600 text-sm leading-none"></i>
                      </div>
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        {nutritionData[nutritionData.length - 1]?.underweight}%
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">Underweight</div>
                      <div className="text-xs text-gray-500">Current Level</div>
                    </div>
                    
                    <div className="bg-white rounded-full shadow-lg border-4 border-purple-500 p-6 aspect-square flex flex-col items-center justify-center text-center relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <i className="ri-heart-pulse-line text-purple-600 text-sm leading-none"></i>
                      </div>
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {nutritionData[nutritionData.length - 1]?.mortality}%
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">Child Mortality</div>
                      <div className="text-xs text-gray-500">Current Level</div>
                    </div>
                  </>
                )}
              </div>

              {/* Progress Indicators - Clean Circular Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-full shadow-lg border-4 border-green-500 p-8 aspect-square flex flex-col items-center justify-center text-center relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <i className="ri-trophy-line text-green-600 text-xl leading-none"></i>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                  <div className="text-sm font-medium text-gray-800 mb-1">SDG Progress</div>
                  <div className="text-xs text-gray-500">Nutrition Goals</div>
                </div>

                <div className="bg-white rounded-full shadow-lg border-4 border-cyan-500 p-8 aspect-square flex flex-col items-center justify-center text-center relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <i className="ri-shield-check-line text-cyan-600 text-xl leading-none"></i>
                  </div>
                  <div className="text-3xl font-bold text-cyan-600 mb-2">92%</div>
                  <div className="text-sm font-medium text-gray-800 mb-1">Data Accuracy</div>
                  <div className="text-xs text-gray-500">ML Confidence</div>
                </div>

                <div className="bg-white rounded-full shadow-lg border-4 border-indigo-500 p-8 aspect-square flex flex-col items-center justify-center text-center relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <i className="ri-time-line text-indigo-600 text-xl leading-none"></i>
                  </div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
                  <div className="text-sm font-medium text-gray-800 mb-1">Real-time</div>
                  <div className="text-xs text-gray-500">Data Updates</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-[#40531A] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            <div className="text-center sm:text-left">
              <h3 className="font-['Pacifico'] text-xl text-[#C7D59F] mb-2">Ndi Umuhuza</h3>
              <p className="text-stone-300 text-sm">Rwanda Nutrition Connect</p>
            </div>

            <div className="text-center">
              <p className="text-stone-300 text-sm mb-2">Real-Time Analytics Platform</p>
              <p className="text-white font-semibold">Big Data Hackathon 2025</p>
            </div>

            <div className="text-center sm:text-right">
              <Link href="/" className="text-stone-300 hover:text-white transition-colors text-sm">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-section.visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .highlighted-district {
          animation: pulse-highlight 2s ease-in-out;
          transform: scale(1.3) !important;
          z-index: 1000 !important;
        }
        @keyframes pulse-highlight {
          0%, 100% { 
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
      `}</style>
    </div>
  );
}
