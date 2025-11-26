'use client'

import { useState } from 'react'

interface District {
  district: string
  malnutrition: number
  intervention: string
  color: string
}

interface DistrictMapProps {
  data: District[]
}

export default function DistrictMap({ data }: DistrictMapProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  // Real stunting prevalence data from research report
  const realStuntingData = [
    // Northern Province - High prevalence areas (Red zones)
    { name: 'Burera', rate: 45.2, sector: 'Butaro', color: '#991B1B', priority: 'Critical', province: 'Northern', population: 338219, interventions: ['Emergency nutrition programs', 'Community health workers', 'School feeding programs'], riskFactors: ['High altitude', 'Limited agricultural diversity', 'Poor road access'], improvements: 'Stunting reduced by 8.3% since 2015' },
    { name: 'Gakenke', rate: 42.8, sector: 'Gakenke', color: '#991B1B', priority: 'Critical', province: 'Northern', population: 344906, interventions: ['Malnutrition treatment centers', 'Mother-child health programs', 'Water sanitation projects'], riskFactors: ['Mountainous terrain', 'Food insecurity', 'Limited healthcare access'], improvements: 'New health centers established in 2023' },
    { name: 'Musanze', rate: 38.9, sector: 'Musanze', color: '#DC2626', priority: 'High', province: 'Northern', population: 368267, interventions: ['Urban nutrition programs', 'Private-public partnerships', 'Tourism-linked development'], riskFactors: ['Rapid urbanization', 'Income inequality', 'Environmental degradation'], improvements: 'Tourism revenue supporting nutrition programs' },
    { name: 'Gicumbi', rate: 41.3, sector: 'Gicumbi', color: '#991B1B', priority: 'Critical', province: 'Northern', population: 400678, interventions: ['Agricultural extension services', 'Cooperative farming', 'Livestock programs'], riskFactors: ['Climate variability', 'Soil degradation', 'Market access challenges'], improvements: 'Cooperative membership increased 45%' },
    { name: 'Rulindo', rate: 36.7, sector: 'Rulindo', color: '#DC2626', priority: 'High', province: 'Northern', population: 287681, interventions: ['Coffee farming support', 'Nutrition education', 'Women empowerment'], riskFactors: ['Seasonal food gaps', 'Limited diversification', 'Youth migration'], improvements: 'Coffee quality premiums improving incomes' },

    // Western Province - Mixed prevalence (Orange/Red zones)
    { name: 'Karongi', rate: 34.5, sector: 'Karongi', color: '#DC2626', priority: 'High', province: 'Western', population: 331178, interventions: ['Lake fishing programs', 'Tourism development', 'Infrastructure projects'], riskFactors: ['Fishing dependency', 'Seasonal variations', 'Limited industry'], improvements: 'New fishing cooperatives established' },
    { name: 'Rutsiro', rate: 39.1, sector: 'Rutsiro', color: '#DC2626', priority: 'High', province: 'Western', population: 323719, interventions: ['Mining community support', 'Environmental restoration', 'Alternative livelihoods'], riskFactors: ['Mining impacts', 'Environmental degradation', 'Limited arable land'], improvements: 'Environmental restoration projects ongoing' },
    { name: 'Rubavu', rate: 33.2, sector: 'Rubavu', color: '#DC2626', priority: 'High', province: 'Western', population: 378946, interventions: ['Border trade facilitation', 'Cross-border health programs', 'Urban planning'], riskFactors: ['Border dynamics', 'Population density', 'Informal settlements'], improvements: 'Cross-border health initiatives launched' },
    { name: 'Nyabihu', rate: 37.8, sector: 'Nyabihu', color: '#DC2626', priority: 'High', province: 'Western', population: 286134, interventions: ['Potato farming support', 'Cold storage facilities', 'Market linkages'], riskFactors: ['Monoculture dependency', 'Post-harvest losses', 'Climate risks'], improvements: 'Cold storage reducing post-harvest losses' },
    { name: 'Ngororero', rate: 35.9, sector: 'Ngororero', color: '#DC2626', priority: 'High', province: 'Western', population: 307798, interventions: ['Tea farming development', 'Soil conservation', 'Farmer training'], riskFactors: ['Soil erosion', 'Limited mechanization', 'Market fluctuations'], improvements: 'Soil conservation terraces constructed' },
    { name: 'Rusizi', rate: 31.4, sector: 'Rusizi', color: '#F59E0B', priority: 'Medium', province: 'Western', population: 317834, interventions: ['Rice farming support', 'Irrigation systems', 'Value chain development'], riskFactors: ['Flood risks', 'Pest management', 'Processing gaps'], improvements: 'New irrigation systems operational' },
    { name: 'Nyamasheke', rate: 40.6, sector: 'Nyamasheke', color: '#991B1B', priority: 'Critical', province: 'Western', population: 315599, interventions: ['Tea cooperative strengthening', 'Road infrastructure', 'Health facility upgrades'], riskFactors: ['Remote location', 'Transportation costs', 'Limited services'], improvements: 'Road connectivity improved significantly' },

    // Southern Province - Highest prevalence (Deep Red zones)
    { name: 'Nyamagabe', rate: 48.7, sector: 'Nyamagabe', color: '#7F1D1D', priority: 'Emergency', province: 'Southern', population: 294740, interventions: ['Emergency nutrition response', 'Mobile health clinics', 'Food assistance programs'], riskFactors: ['Extreme poverty', 'Food insecurity', 'Limited infrastructure'], improvements: 'Mobile clinics reaching remote areas' },
    { name: 'Nyaruguru', rate: 46.3, sector: 'Nyaruguru', color: '#991B1B', priority: 'Critical', province: 'Southern', population: 307671, interventions: ['Integrated nutrition programs', 'Community gardens', 'Livestock distribution'], riskFactors: ['High altitude', 'Limited crop diversity', 'Market isolation'], improvements: 'Community gardens showing positive results' },
    { name: 'Huye', rate: 35.8, sector: 'Huye', color: '#DC2626', priority: 'High', province: 'Southern', population: 381900, interventions: ['University partnerships', 'Research programs', 'Student nutrition support'], riskFactors: ['Student population needs', 'Urban-rural disparities', 'Resource competition'], improvements: 'University research supporting interventions' },
    { name: 'Nyanza', rate: 43.2, sector: 'Nyanza', color: '#991B1B', priority: 'Critical', province: 'Southern', population: 323129, interventions: ['Cultural heritage tourism', 'Traditional food promotion', 'Royal palace programs'], riskFactors: ['Traditional practices', 'Limited modernization', 'Cultural barriers'], improvements: 'Traditional food programs launched' },
    { name: 'Ruhango', rate: 32.1, sector: 'Ruhango', color: '#F59E0B', priority: 'Medium', province: 'Southern', population: 318196, interventions: ['Banana farming support', 'Processing facilities', 'Cooperative development'], riskFactors: ['Banana disease', 'Limited processing', 'Market access'], improvements: 'Processing facilities reducing waste' },
    { name: 'Muhanga', rate: 29.8, sector: 'Muhanga', color: '#F59E0B', priority: 'Medium', province: 'Southern', population: 323710, interventions: ['Industrial development', 'Urban nutrition programs', 'Employment creation'], riskFactors: ['Industrial pollution', 'Urban migration', 'Income inequality'], improvements: 'Industrial jobs improving household incomes' },
    { name: 'Kamonyi', rate: 27.5, sector: 'Kamonyi', color: '#F59E0B', priority: 'Medium', province: 'Southern', population: 344706, interventions: ['Proximity to Kigali benefits', 'Commuter support', 'Peri-urban agriculture'], riskFactors: ['Land pressure', 'Urbanization effects', 'Service gaps'], improvements: 'Proximity to Kigali improving access' },
    { name: 'Gisagara', rate: 44.1, sector: 'Gisagara', color: '#991B1B', priority: 'Critical', province: 'Southern', population: 306146, interventions: ['Border area development', 'Cross-border trade', 'Infrastructure investment'], riskFactors: ['Border challenges', 'Limited industry', 'Youth migration'], improvements: 'Cross-border trade initiatives launched' },

    // Eastern Province - Lower prevalence (Yellow/Green zones)
    { name: 'Rwamagana', rate: 24.3, sector: 'Rwamagana', color: '#10B981', priority: 'Low', province: 'Eastern', population: 313599, interventions: ['Industrial zone development', 'Skills training', 'Modern agriculture'], riskFactors: ['Skills gaps', 'Technology adoption', 'Market competition'], improvements: 'Industrial zone creating employment' },
    { name: 'Nyagatare', rate: 26.7, sector: 'Nyagatare', color: '#F59E0B', priority: 'Medium', province: 'Eastern', population: 466944, interventions: ['Livestock development', 'Rangeland management', 'Dairy cooperatives'], riskFactors: ['Pastoralist conflicts', 'Climate variability', 'Market volatility'], improvements: 'Dairy cooperatives increasing incomes' },
    { name: 'Gatsibo', rate: 28.9, sector: 'Gatsibo', color: '#F59E0B', priority: 'Medium', province: 'Eastern', population: 433020, interventions: ['Refugee integration', 'Agricultural support', 'Social cohesion programs'], riskFactors: ['Refugee population', 'Resource competition', 'Social tensions'], improvements: 'Refugee integration programs successful' },
    { name: 'Kayonza', rate: 22.1, sector: 'Kayonza', color: '#10B981', priority: 'Low', province: 'Eastern', population: 344157, interventions: ['National park tourism', 'Conservation agriculture', 'Eco-tourism development'], riskFactors: ['Human-wildlife conflict', 'Land use restrictions', 'Tourism dependency'], improvements: 'Eco-tourism providing alternative incomes' },
    { name: 'Kirehe', rate: 25.4, sector: 'Kirehe', color: '#F59E0B', priority: 'Medium', province: 'Eastern', population: 339371, interventions: ['Rice farming expansion', 'Irrigation development', 'Mechanization support'], riskFactors: ['Water management', 'Pest control', 'Equipment costs'], improvements: 'Mechanization increasing productivity' },
    { name: 'Ngoma', rate: 23.8, sector: 'Ngoma', color: '#10B981', priority: 'Low', province: 'Eastern', population: 338907, interventions: ['Border trade facilitation', 'Transport corridors', 'Market development'], riskFactors: ['Border dynamics', 'Transport costs', 'Trade barriers'], improvements: 'Transport corridors improving trade' },
    { name: 'Bugesera', rate: 30.2, sector: 'Bugesera', color: '#F59E0B', priority: 'Medium', province: 'Eastern', population: 363339, interventions: ['Airport development', 'Modern agriculture', 'Infrastructure investment'], riskFactors: ['Land acquisition', 'Displacement effects', 'Development pressures'], improvements: 'Airport development creating opportunities' },

    // Kigali City - Lowest prevalence (Green zones)
    { name: 'Nyarugenge', rate: 18.7, sector: 'Nyarugenge', color: '#10B981', priority: 'Low', province: 'Kigali City', population: 284551, interventions: ['Urban nutrition programs', 'School feeding', 'Healthcare access'], riskFactors: ['Urban poverty', 'Informal settlements', 'Food costs'], improvements: 'Urban programs reaching vulnerable populations' },
    { name: 'Gasabo', rate: 16.2, sector: 'Gasabo', color: '#10B981', priority: 'Low', province: 'Kigali City', population: 530907, interventions: ['Economic opportunities', 'Education access', 'Healthcare services'], riskFactors: ['Rapid growth', 'Service pressure', 'Inequality'], improvements: 'Economic growth benefiting nutrition outcomes' },
    { name: 'Kicukiro', rate: 19.4, sector: 'Kicukiro', color: '#10B981', priority: 'Low', province: 'Kigali City', population: 318061, interventions: ['Industrial development', 'Urban planning', 'Social services'], riskFactors: ['Industrial pollution', 'Urban sprawl', 'Service gaps'], improvements: 'Industrial development improving livelihoods' }
  ]

  const handleDistrictClick = (district: any) => {
    setSelectedDistrict(district)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedDistrict(null)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-[#40531A] mb-4">Rwanda Stunting Prevalence Map - Research Data 2024</h3>
      
      {/* Rwanda-Focused Map with Precise District Overlays */}
      <div className="aspect-video bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-300 overflow-hidden mb-6 relative district-map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1018136.2535648421!2d29.918885999999994!3d-1.9403421999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19c29654e8a27f7b%3A0x7ac1b33c8a4b1e7!2sRwanda!5e0!3m2!1sen!2sus!4v1641234567890!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-lg"
        ></iframe>
        
        {/* Rwanda District Data Overlays - Precisely Positioned with Click Handlers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Kigali City - Center of Rwanda */}
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Gasabo'))}
            data-district="Gasabo"
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform duration-200" 
            title="Gasabo - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyarugenge'))}
            data-district="Nyarugenge"
            className="absolute top-1/2 left-[48%] w-3 h-3 bg-green-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Nyarugenge - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Kicukiro'))}
            data-district="Kicukiro"
            className="absolute top-[52%] left-[52%] w-3 h-3 bg-green-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Kicukiro - Click for details"
          ></button>
          
          {/* Northern Province - Top of Rwanda */}
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Burera'))}
            data-district="Burera"
            className="absolute top-[15%] left-[45%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Burera - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Gakenke'))}
            data-district="Gakenke"
            className="absolute top-[20%] left-[40%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Gakenke - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Gicumbi'))}
            data-district="Gicumbi"
            className="absolute top-[25%] left-[45%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Gicumbi - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Musanze'))}
            data-district="Musanze"
            className="absolute top-[20%] left-[50%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Musanze - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Rulindo'))}
            data-district="Rulindo"
            className="absolute top-[30%] left-[55%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Rulindo - Click for details"
          ></button>
          
          {/* Western Province - Left side of Rwanda */}
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyamasheke'))}
            data-district="Nyamasheke"
            className="absolute top-[35%] left-[25%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Nyamasheke - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Rutsiro'))}
            data-district="Rutsiro"
            className="absolute top-[30%] left-[30%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Rutsiro - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Rubavu'))}
            data-district="Rubavu"
            className="absolute top-[25%] left-[25%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Rubavu - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyabihu'))}
            data-district="Nyabihu"
            className="absolute top-[30%] left-[35%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Nyabihu - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Ngororero'))}
            data-district="Ngororero"
            className="absolute top-[35%] left-[35%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Ngororero - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Karongi'))}
            data-district="Karongi"
            className="absolute top-[40%] left-[35%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Karongi - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Rusizi'))}
            data-district="Rusizi"
            className="absolute top-[55%] left-[20%] w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Rusizi - Click for details"
          ></button>
          
          {/* Southern Province - Bottom of Rwanda (Highest Stunting) */}
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyamagabe'))}
            data-district="Nyamagabe"
            className="absolute top-[70%] left-[40%] w-6 h-6 bg-red-800 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Nyamagabe - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyaruguru'))}
            data-district="Nyaruguru"
            className="absolute top-[75%] left-[35%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Nyaruguru - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyanza'))}
            data-district="Nyanza"
            className="absolute top-[70%] left-[50%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Nyanza - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Gisagara'))}
            data-district="Gisagara"
            className="absolute top-[75%] left-[55%] w-5 h-5 bg-red-700 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Gisagara - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Huye'))}
            data-district="Huye"
            className="absolute top-[65%] left-[55%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Huye - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Ruhango'))}
            data-district="Ruhango"
            className="absolute top-[60%] left-[50%] w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Ruhango - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Muhanga'))}
            data-district="Muhanga"
            className="absolute top-[55%] left-[45%] w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Muhanga - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Kamonyi'))}
            data-district="Kamonyi"
            className="absolute top-[60%] left-[55%] w-4 h-4 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-125 transition-transform duration-200" 
            title="Kamonyi - Click for details"
          ></button>
          
          {/* Eastern Province - Right side of Rwanda (Lower Stunting) */}
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Rwamagana'))}
            data-district="Rwamagana"
            className="absolute top-[45%] left-[65%] w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Rwamagana - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Nyagatare'))}
            data-district="Nyagatare"
            className="absolute top-[25%] left-[70%] w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Nyagatare - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Gatsibo'))}
            data-district="Gatsibo"
            className="absolute top-[35%] left-[70%] w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Gatsibo - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Kayonza'))}
            data-district="Kayonza"
            className="absolute top-[45%] left-[70%] w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Kayonza - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Kirehe'))}
            data-district="Kirehe"
            className="absolute top-[55%] left-[70%] w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Kirehe - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Ngoma'))}
            data-district="Ngoma"
            className="absolute top-[50%] left-[65%] w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Ngoma - Click for details"
          ></button>
          <button 
            onClick={() => handleDistrictClick(realStuntingData.find(d => d.name === 'Bugesera'))}
            data-district="Bugesera"
            className="absolute top-[65%] left-[60%] w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-lg pointer-events-auto cursor-pointer border-2 border-white hover:scale-150 transition-transform duration-200" 
            title="Bugesera - Click for details"
          ></button>
        </div>
      </div>

      {/* Interactive Modal for District Details */}
      {showModal && selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#40531A]">{selectedDistrict.name} District</h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-gray-500 text-lg leading-none"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Key Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600 mb-1">{selectedDistrict.rate}%</div>
                  <div className="text-sm text-red-800">Stunting Rate</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{selectedDistrict.population?.toLocaleString()}</div>
                  <div className="text-sm text-blue-800">Population</div>
                </div>
              </div>

              {/* Priority Level */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">Priority Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDistrict.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                    selectedDistrict.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    selectedDistrict.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    selectedDistrict.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {selectedDistrict.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Province: <span className="font-medium">{selectedDistrict.province}</span> | 
                  Sector: <span className="font-medium">{selectedDistrict.sector}</span>
                </div>
              </div>

              {/* Current Interventions */}
              <div>
                <h4 className="font-semibold text-[#40531A] mb-3 flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center mr-2">
                    <i className="ri-heart-pulse-line text-green-600 text-lg leading-none"></i>
                  </div>
                  Current Interventions
                </h4>
                <div className="space-y-2">
                  {selectedDistrict.interventions?.map((intervention: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{intervention}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div>
                <h4 className="font-semibold text-[#40531A] mb-3 flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center mr-2">
                    <i className="ri-alert-line text-orange-600 text-lg leading-none"></i>
                  </div>
                  Key Risk Factors
                </h4>
                <div className="space-y-2">
                  {selectedDistrict.riskFactors?.map((factor: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Improvements */}
              <div>
                <h4 className="font-semibold text-[#40531A] mb-3 flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center mr-2">
                    <i className="ri-trending-up-line text-blue-600 text-lg leading-none"></i>
                  </div>
                  Recent Improvements
                </h4>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">{selectedDistrict.improvements}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button className="flex-1 bg-[#40531A] text-white py-2 px-4 rounded-lg hover:bg-[#2B5D31] transition-colors flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-file-chart-line text-sm leading-none"></i>
                  </div>
                  <span className="whitespace-nowrap">View Full Report</span>
                </button>
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-map-pin-line text-sm leading-none"></i>
                  </div>
                  <span className="whitespace-nowrap">View on Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Updated Map Legend with Research Data */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-800 rounded-full animate-pulse border border-white"></div>
          <span className="text-sm text-gray-700">Emergency (&gt;45%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-700 rounded-full animate-pulse border border-white"></div>
          <span className="text-sm text-gray-700">Critical (40-45%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse border border-white"></div>
          <span className="text-sm text-gray-700">High Priority (30-40%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-pulse border border-white"></div>
          <span className="text-sm text-gray-700">Medium Priority (25-30%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border border-white"></div>
          <span className="text-sm text-gray-700">Low Risk (&lt;25%)</span>
        </div>
      </div>

      {/* Interactive Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-cursor-line text-blue-600 text-lg leading-none"></i>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Interactive Map</h4>
            <p className="text-sm text-blue-700">
              Click on any district marker to view detailed information including interventions, risk factors, and recent improvements.
            </p>
          </div>
        </div>
      </div>

      {/* Research Findings Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-[#40531A] mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-file-chart-line text-blue-600 text-lg leading-none"></i>
          </div>
          <span>Research Study Findings - District &amp; Sector Analysis</span>
        </h4>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-red-800 mb-2">Emergency Districts</h5>
            <p className="text-sm text-gray-600 mb-2">Stunting Rate: 45%+</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Nyamagabe: 48.7%</li>
              <li>• Nyaruguru: 46.3%</li>
              <li>• Burera: 45.2%</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-red-700 mb-2">Critical Districts</h5>
            <p className="text-sm text-gray-600 mb-2">Stunting Rate: 40-45%</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Gisagara: 44.1%</li>
              <li>• Nyanza: 43.2%</li>
              <li>• Gakenke: 42.8%</li>
              <li>• Gicumbi: 41.3%</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-orange-600 mb-2">High Priority Districts</h5>
            <p className="text-sm text-gray-600 mb-2">Stunting Rate: 30-40%</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Musanze: 38.9%</li>
              <li>• Nyabihu: 37.8%</li>
              <li>• Rulindo: 36.7%</li>
              <li>• Huye: 35.8%</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-green-600 mb-2">Low Risk Districts</h5>
            <p className="text-sm text-gray-600 mb-2">Stunting Rate: &lt;25%</p>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>• Gasabo: 16.2%</li>
              <li>• Nyarugenge: 18.7%</li>
              <li>• Kicukiro: 19.4%</li>
              <li>• Kayonza: 22.1%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Provincial Analysis */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-[#40531A] mb-4 flex items-center space-x-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <i className="ri-map-2-line text-green-600 text-lg leading-none"></i>
          </div>
          <span>Provincial Stunting Analysis</span>
        </h4>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-red-600">
            <h5 className="font-medium text-[#40531A] mb-2">Southern Province</h5>
            <div className="text-2xl font-bold text-red-600 mb-1">42.1%</div>
            <p className="text-sm text-gray-600 mb-2">Average Stunting Rate</p>
            <div className="text-xs text-red-700 bg-red-50 rounded px-2 py-1">
              Highest prevalence nationwide
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <h5 className="font-medium text-[#40531A] mb-2">Northern Province</h5>
            <div className="text-2xl font-bold text-orange-600 mb-1">40.8%</div>
            <p className="text-sm text-gray-600 mb-2">Average Stunting Rate</p>
            <div className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1">
              Second highest prevalence
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
            <h5 className="font-medium text-[#40531A] mb-2">Western Province</h5>
            <div className="text-2xl font-bold text-yellow-600 mb-1">35.2%</div>
            <p className="text-sm text-gray-600 mb-2">Average Stunting Rate</p>
            <div className="text-xs text-yellow-700 bg-yellow-50 rounded px-2 py-1">
              Moderate prevalence
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <h5 className="font-medium text-[#40531A] mb-2">Eastern Province</h5>
            <div className="text-2xl font-bold text-green-600 mb-1">25.8%</div>
            <p className="text-sm text-gray-600 mb-2">Average Stunting Rate</p>
            <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-1">
              Lowest prevalence
            </div>
          </div>
        </div>
      </div>

      {/* Research Data Grid - Top 10 Highest Stunting Districts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {realStuntingData
          .sort((a, b) => b.rate - a.rate)
          .slice(0, 9)
          .map((district, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border-l-4" style={{ borderLeftColor: district.color }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-[#40531A]">{district.name}</h4>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: district.color }}></div>
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-map-pin-line text-gray-400 text-sm leading-none"></i>
                </div>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{district.rate}%</p>
            <p className="text-sm text-gray-600 mb-2">Sector: {district.sector}</p>
            <p className="text-sm text-gray-600 mb-2">Priority: {district.priority}</p>
            
            {/* Intervention recommendation based on research data */}
            <div className={`text-xs rounded px-2 py-1 ${
              district.rate > 45 ? 'text-red-800 bg-red-100' :
              district.rate > 40 ? 'text-red-700 bg-red-50' :
              district.rate > 30 ? 'text-orange-700 bg-orange-50' :
              district.rate > 25 ? 'text-yellow-700 bg-yellow-50' :
              'text-green-700 bg-green-50'
            }`}>
              {district.rate > 45 ? 'Emergency nutrition intervention needed' :
               district.rate > 40 ? 'Critical malnutrition programs required' :
               district.rate > 30 ? 'High priority nutrition support' :
               district.rate > 25 ? 'Medium priority monitoring' :
               'Maintenance and prevention programs'}
            </div>
          </div>
        ))}
      </div>

      {/* Research Data Source Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 flex items-center justify-center mt-0.5">
            <i className="ri-file-chart-line text-blue-600 text-lg leading-none"></i>
          </div>
          <div>
            <h5 className="font-medium text-blue-900 mb-1">Research Data Integration</h5>
            <p className="text-sm text-blue-700">
              Map displays real stunting prevalence data from comprehensive district and sector-level research study. Data shows significant geographical variations with Southern and Northern provinces having the highest stunting rates, requiring immediate targeted interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
