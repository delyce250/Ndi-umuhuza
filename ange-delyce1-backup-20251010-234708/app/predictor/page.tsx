
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PredictionInput {
  age_months: number;
  weight_kg: number;
  height_cm: number;
  district: string;
  gender: 'male' | 'female';
  household_income?: number;
  food_security_score?: number;
  access_to_clean_water: boolean;
  maternal_education?: string;
}

interface NutritionPrediction {
  stunting_risk: number;
  overweight_risk: number;
  underweight_risk: number;
  nutritional_status: 'Normal' | 'At Risk' | 'Malnourished' | 'Severely Malnourished';
  recommended_interventions: string[];
  confidence_score: number;
  risk_factors: string[];
  agricultural_solutions: string[];
}

export default function NutritionPredictor() {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<NutritionPrediction | null>(null);
  const [formData, setFormData] = useState<PredictionInput>({
    age_months: 24,
    weight_kg: 12,
    height_cm: 85,
    district: 'Gasabo',
    gender: 'male',
    access_to_clean_water: true,
    household_income: 100000,
    food_security_score: 4,
    maternal_education: 'primary'
  });

  const rwandaDistricts = [
    'Nyarugenge', 'Gasabo', 'Kicukiro', 'Nyanza', 'Huye', 'Muhanga', 
    'Ruhango', 'Nyamagabe', 'Kamonyi', 'Rusizi', 'Nyamasheke',
    'Karongi', 'Rutsiro', 'Ngororero', 'Nyabihu', 'Rubavu', 'Musanze',
    'Burera', 'Gicumbi', 'Rulindo', 'Gakenke', 'Kayonza', 'Rwamagana',
    'Nyagatare', 'Gatsibo', 'Kirehe', 'Ngoma', 'Bugesera', 'Nyaruguru', 'Gisagara'
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (field: keyof PredictionInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const runPrediction = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/individual-nutrition-predictor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to get prediction');
      
      const result = await response.json();
      if (result.success) {
        setPrediction(result.data.prediction);
      }
    } catch (error) {
      console.error('Error getting prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-50';
      case 'At Risk': return 'text-yellow-600 bg-yellow-50';
      case 'Malnourished': return 'text-orange-600 bg-orange-50';
      case 'Severely Malnourished': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk > 80) return 'bg-red-500';
    if (risk > 60) return 'bg-orange-500';
    if (risk > 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

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
              <Link href="/insights" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Key Insights
              </Link>
              <Link href="/predictor" className="text-[#C7D59F] font-medium whitespace-nowrap">
                Nutrition Predictor
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-to-br from-[#40531A] to-[#2B5D31] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://readdy.ai/api/search-image?query=AI%20machine%20learning%20interface%20showing%20child%20nutrition%20analysis%20with%20medical%20charts%20graphs%20and%20prediction%20models%2C%20healthcare%20technology%20meeting%20data%20science%2C%20professional%20medical%20workspace%20with%20Rwanda%20context%2C%20modern%20clinical%20setting&width=1920&height=1080&seq=predictor-hero&orientation=landscape"
            alt="Nutrition Prediction Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#40531A]/90 to-[#2B5D31]/80"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl lg:text-6xl font-light text-white mb-6">
              Nutrition <span className="font-normal text-[#C7D59F]">Predictor</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              AI-powered individual nutrition assessment using WHO growth standards and Rwanda-specific risk factors
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#40531A] mb-6">Child Information</h2>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age (months)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={formData.age_months}
                    onChange={(e) => handleInputChange('age_months', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent pr-8"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.height_cm}
                    onChange={(e) => handleInputChange('height_cm', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent pr-8"
                >
                  {rwandaDistricts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Optional Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-[#40531A] mb-4">Additional Information (Optional)</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Household Income (RWF)</label>
                    <input
                      type="number"
                      value={formData.household_income}
                      onChange={(e) => handleInputChange('household_income', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Food Security Score (1-5)</label>
                    <select
                      value={formData.food_security_score}
                      onChange={(e) => handleInputChange('food_security_score', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent pr-8"
                    >
                      <option value="">Select score</option>
                      <option value="1">1 - Very Food Insecure</option>
                      <option value="2">2 - Food Insecure</option>
                      <option value="3">3 - Moderately Secure</option>
                      <option value="4">4 - Food Secure</option>
                      <option value="5">5 - Very Food Secure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access to Clean Water</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="water_access"
                          checked={formData.access_to_clean_water === true}
                          onChange={() => handleInputChange('access_to_clean_water', true)}
                          className="mr-2"
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="water_access"
                          checked={formData.access_to_clean_water === false}
                          onChange={() => handleInputChange('access_to_clean_water', false)}
                          className="mr-2"
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maternal Education</label>
                    <select
                      value={formData.maternal_education}
                      onChange={(e) => handleInputChange('maternal_education', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent pr-8"
                    >
                      <option value="">Select education level</option>
                      <option value="none">No Education</option>
                      <option value="primary">Primary Education</option>
                      <option value="secondary">Secondary Education</option>
                      <option value="tertiary">Tertiary Education</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Predict Button */}
              <button
                onClick={runPrediction}
                disabled={loading}
                className="w-full bg-[#40531A] text-white py-3 rounded-lg hover:bg-[#2B5D31] transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={`ri-brain-line text-lg leading-none ${loading ? 'animate-pulse' : ''}`}></i>
                </div>
                <span>{loading ? 'Analyzing...' : 'Run AI Prediction'}</span>
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-16 h-16 border-4 border-[#C7D59F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#40531A] mb-2">Processing ML Analysis</h3>
                <p className="text-gray-600">Running WHO growth standard calculations and environmental risk assessment...</p>
              </div>
            )}

            {!prediction && !loading && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-heart-line text-blue-600 text-2xl leading-none"></i>
                </div>
                <h3 className="text-lg font-semibold text-[#40531A] mb-2">AI Nutrition Assessment Ready</h3>
                <p className="text-gray-600 mb-4">Enter child information and click "Run AI Prediction" to get personalized nutrition analysis</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-[#40531A]">WHO Standards</div>
                    <div className="text-gray-600">Growth analysis</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-[#40531A]">Risk Assessment</div>
                    <div className="text-gray-600">Environmental factors</div>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-[#40531A]">Solutions</div>
                    <div className="text-gray-600">Agricultural interventions</div>
                  </div>
                </div>
              </div>
            )}

            {prediction && (
              <>
                {/* Nutritional Status */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-[#40531A] mb-4">Nutritional Status Assessment</h3>
                  
                  <div className={`text-center py-4 px-6 rounded-lg mb-4 ${getStatusColor(prediction.nutritional_status)}`}>
                    <div className="text-2xl font-bold mb-1">{prediction.nutritional_status}</div>
                    <div className="text-sm">Overall Assessment</div>
                  </div>

                  <div className="text-center text-sm text-gray-600 mb-4">
                    Confidence Score: {prediction.confidence_score}%
                  </div>

                  {/* Risk Indicators */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Stunting Risk</span>
                        <span className="font-semibold">{prediction.stunting_risk}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getRiskColor(prediction.stunting_risk)}`}
                          style={{ width: `${prediction.stunting_risk}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overweight Risk</span>
                        <span className="font-semibold">{prediction.overweight_risk}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getRiskColor(prediction.overweight_risk)}`}
                          style={{ width: `${prediction.overweight_risk}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Underweight Risk</span>
                        <span className="font-semibold">{prediction.underweight_risk}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getRiskColor(prediction.underweight_risk)}`}
                          style={{ width: `${prediction.underweight_risk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {prediction.risk_factors.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-[#40531A] mb-4">Identified Risk Factors</h3>
                    <ul className="space-y-2">
                      {prediction.risk_factors.map((factor, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Interventions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-[#40531A] mb-4">Recommended Interventions</h3>
                  <ul className="space-y-3">
                    {prediction.recommended_interventions.map((intervention, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-[#C7D59F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-check-line text-[#40531A] text-sm leading-none"></i>
                        </div>
                        <span className="text-gray-700">{intervention}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agricultural Solutions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-[#40531A] mb-4">Agricultural Solutions for {formData.district}</h3>
                  <ul className="space-y-3">
                    {prediction.agricultural_solutions.map((solution, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <i className="ri-plant-line text-white text-sm leading-none"></i>
                        </div>
                        <span className="text-gray-700">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#40531A] text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg leading-tight">Ndi Umuhuza</h3>
              <p className="text-stone-300 text-sm">Rwanda Nutrition Connect</p>
            </div>

            <div className="text-center">
              <p className="text-stone-300 text-sm mb-2">AI-Powered Nutrition Assessment</p>
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
    </div>
  );
}
