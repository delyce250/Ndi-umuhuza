'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const slides = [
    {
      title: 'Ndi Umuhuza',
      subtitle:
        'Rwanda Nutrition Connect - Data-driven solutions for sustainable nutrition and food security',
      description:
        'Leveraging advanced analytics and machine learning to combat micronutrient deficiency and build resilient food systems across Rwanda.',
      image:
        "https://readdy.ai/api/search-image?query=African%20farmers%20in%20Rwanda%20working%20in%20green%20agricultural%20fields%20with%20mountains%20in%20background%2C%20showing%20sustainable%20farming%20practices%2C%20vibrant%20green%20crops%2C%20rural%20landscape%20with%20clear%20blue%20sky%2C%20documentary%20style%20photography%20emphasizing%20food%20security%20and%20nutrition&width=1920&height=1080&seq=slide1&orientation=landscape",
    },
    {
      title: 'Ndi Umuhuza',
      subtitle: 'Micronutrient deficiency affects 2 billion people globally',
      description:
        'Hidden hunger occurs when people consume enough calories but lack essential vitamins and minerals, leading to stunted growth, weakened immunity, and reduced cognitive development.',
      image:
        "https://readdy.ai/api/search-image?query=Close-up%20of%20nutritious%20vegetables%20and%20fruits%20arranged%20beautifully%2C%20showing%20micronutrients%20and%20vitamins%2C%20colorful%20fresh%20produce%20from%20Rwanda%2C%20emphasizing%20nutrition%20and%20health%20clean%20white%20background%20with%20natural%20lighting&width=1920&height=1080&seq=slide2&orientation=landscape",
    },
    {
      title: 'Ndi Umuhuza',
      subtitle: 'Transforming lives through better nutrition',
      description:
        'Our data-driven approach identifies at-risk populations and provides targeted interventions to improve maternal health, child development, and community resilience.',
      image:
        "https://i.postimg.cc/vTPpKj90/525c9edb-f8eb-469a-b581-712d7d13f358.jpg",
    },
    {
      title: 'Ndi Umuhuza',
      subtitle: "Sustainable solutions for Rwanda's future",
      description:
        "Through predictive analytics and community partnerships, we're creating lasting change in nutrition practices and food system resilience across all 30 districts of Rwanda.",
      image:
        "https://readdy.ai/api/search-image?query=Modern%20data%20analytics%20dashboard%20showing%20Rwanda%20map%20with%20nutrition%20statistics%2C%20computer%20screens%20displaying%20charts%20and%20graphs%2C%20clean%20office%20environment%2C%20technology%20meeting%20agriculture%2C%20professional%20workspace&width=1920&height=1080&seq=slide4&orientation=landscape",
    },
  ];

  // Preload all images on component mount - Client‑side only
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = slides.length;

    const preloadImages = () => {
      slides.forEach((slide) => {
        const img = document.createElement('img');
        img.onload = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            setImagesLoaded(true);
          }
        };
        img.src = slide.image;
      });
    };

    if (typeof window !== 'undefined') {
      preloadImages();
    } else {
      setImagesLoaded(true);
    }

    const fallbackTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, 3000);
    return () => clearTimeout(fallbackTimer);
  }, [slides]);

  // Show content after component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Fade‑in sections when they scroll into view
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

  // Auto‑rotate slideshow
  useEffect(() => {
    if (!imagesLoaded) return;

    const startSlideshow = () => {
      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setIsTransitioning(false);
        }, 600);
      }, 4000);
    };

    startSlideshow();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imagesLoaded, slides.length]);

  const goToNextSlide = () => {
    if (isTransitioning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 600);

    setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setIsTransitioning(false);
        }, 600);
      }, 4000);
    }, 600);
  };

  const goToPrevSlide = () => {
    if (isTransitioning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 600);

    setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setIsTransitioning(false);
        }, 600);
      }, 4000);
    }, 600);
  };

  const goToSlide = (index: number) => {
    if (index === currentSlide || isTransitioning) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 600);

    setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          setIsTransitioning(false);
        }, 600);
      }, 4000);
    }, 600);
  };

  // Search functionality
  const searchableContent = [
    { id: 'home', title: 'Home', content: 'Ndi Umuhuza Rwanda Nutrition Connect Data Analytics Food Security' },
    { id: 'about', title: 'Hidden Hunger', content: 'micronutrient deficiency malnutrition Rwanda development nutrition' },
    { id: 'data', title: 'Data Analytics', content: 'NISR datasets geospatial mapping machine learning predictions interventions' },
    { id: 'partners', title: 'Partners', content: 'NISR MINISANTE UN UNICEF RBC NAEB World Bank partnerships collaboration' },
    { id: 'contact', title: 'Contact', content: 'contact email github project information support' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchableContent.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.content.toLowerCase().includes(query.toLowerCase())
      );

      if (results.length > 0) {
        const element = document.getElementById(results[0].id);
        if (element) {
          setIsSearchOpen(false);
          setSearchQuery('');
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setSearchQuery('');
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#40531A] shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                {/* Custom Logo */}
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
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Home
              </a>
              <a href="#about" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                About Project
              </a>
              <a href="#data" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Data Analytics
              </a>
              <Link href="/insights" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Key Insights
              </Link>
              <Link href="/predictor" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Nutrition Predictor
              </Link>
              <a href="#impact" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Our Impact
              </a>
              <a href="#team" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Our Team
              </a>
              <a href="#research" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Research
              </a>
              <a href="#contact" className="text-white hover:text-[#C7D59F] transition-colors duration-200 font-medium whitespace-nowrap">
                Contact
              </a>
            </div>

            {/* Search Icon */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={toggleSearch}
                className="text-white hover:text-[#C7D59F] transition-colors duration-200 w-6 h-6 flex items-center justify-center"
              >
                <i className="ri-search-line text-xl leading-none"></i>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#C7D59F] transition-colors duration-200 w-8 h-8 flex items-center justify-center"
              >
                <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-2xl leading-none`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-[#40531A] border-t border-[#C7D59F]/20">
              <div className="px-4 py-4 space-y-3">
                <a href="#home" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Home
                </a>
                <a href="#about" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  About Project
                </a>
                <a href="#data" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Data Analytics
                </a>
                <Link href="/insights" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Key Insights
                </Link>
                <Link href="/predictor" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Nutrition Predictor
                </Link>
                <a href="#impact" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Our Impact
                </a>
                <a href="#team" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Our Team
                </a>
                <a href="#research" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Research
                </a>
                <a href="#contact" className="block text-white hover:text-[#C7D59F] transition-colors duration-200 py-2">
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Slideshow */}
      <section id="home" className="min-h-screen relative flex items-center pt-16 overflow-hidden">
        {/* Background slides */}
        <div className="absolute inset-0 bg-gray-900">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="absolute inset-0 transition-all duration-600 ease-in-out"
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: index === currentSlide ? 1 : 0,
                transform: index === currentSlide ? 'scale(1)' : 'scale(1.05)',
                zIndex: index === currentSlide ? 2 : 1,
              }}
            />
          ))}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
        </div>

        {/* Slide Content */}
        <div className="relative z-20 w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div
              className={`transform transition-all duration-1200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white mb-6 font-sans tracking-wide whitespace-nowrap">
                Ndi Umuhuza
              </h1>

              <div
                className={`transition-all duration-500 ease-in-out ${
                  isTransitioning ? 'opacity-70 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                }`}
              >
                <p className="text-xl lg:text-2xl text-gray-200 mb-6 font-normal leading-relaxed max-w-3xl mx-auto font-sans">
                  {slides[currentSlide].subtitle}
                </p>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto font-sans font-light">
                  {slides[currentSlide].description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/predictor"
                  className="group bg-[#C7D59F] text-[#40531A] px-8 py-4 rounded-lg font-semibold hover:bg-[#C7D59F]/90 transition-all duration-300 whitespace-nowrap flex items-center justify-center space-x-3"
                >
                  <span>Try AI Predictor</span>
                  <div className="w-5 h-5 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-brain-line text-lg leading-none"></i>
                  </div>
                </Link>
                <a
                  href="#about"
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 hover:border-white/50 transition-all duration-300 whitespace-nowrap backdrop-blur-sm flex items-center justify-center space-x-3"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-play-circle-line text-lg leading-none"></i>
                  </div>
                  <span>Learn More</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4">
          <button
            onClick={goToPrevSlide}
            disabled={isTransitioning}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <i className="ri-arrow-left-line text-lg leading-none transform group-hover:-translate-x-0.5 transition-transform"></i>
          </button>

          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                disabled={isTransitioning}
                className={`rounded-full transition-all duration-400 ease-out disabled:cursor-not-allowed ${
                  index === currentSlide
                    ? 'bg-[#C7D59F] w-8 h-2 shadow-lg shadow-[#C7D59F]/30'
                    : 'bg-white/50 hover:bg-white/70 w-2 h-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goToNextSlide}
            disabled={isTransitioning}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <i className="ri-arrow-right-line text-lg leading-none transform group-hover:translate-x-0.5 transition-transform"></i>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
          <div
            className="h-full bg-[#C7D59F] transition-all duration-300 ease-linear"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>

        {/* Loading indicator */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gray-900 z-40 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-8 h-8 border-2 border-[#C7D59F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm">Loading slideshow...</p>
            </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://static.readdy.ai/image/68f78f51b501d592c8ce06dc878d94d3/2169ec343034b1967921af7e34f7f2aa.jfif')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side */}
            <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6">
                  What is <span className="font-normal text-[#C7D59F]">Hidden Hunger?</span>
                </h2>
                <div className="w-16 h-1 bg-[#C7D59F] rounded-full mb-8"></div>
                <p className="text-lg text-white/90 leading-relaxed font-light mb-8">
                  Hidden hunger affects over 2 billion people globally, representing a critical challenge in Rwanda's
                  development journey toward sustainable nutrition and food security.
                </p>
              </div>

              {/* Logo/Visual Element */}
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 floating-element">
                  <div className="w-20 h-20 bg-[#C7D59F] rounded-full flex items-center justify-center">
                    <i className="ri-heart-pulse-line text-[#2B5D31] text-3xl leading-none"></i>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#C7D59F] rounded-full flex items-center justify-center floating-element-delayed">
                  <i className="ri-leaf-line text-[#2B5D31] text-sm leading-none"></i>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800 delay-100">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 floating-card">
                  <p className="text-[#2B5D31] leading-relaxed">
                    <span className="font-semibold text-[#C7D59F]">Hidden hunger</span> is a strategic initiative by the
                    Government of Rwanda to address local market gaps in micronutrient deficiency. Despite remarkable
                    progress in reducing overall malnutrition, micronutrient deficiencies remain a silent epidemic affecting
                    cognitive development, immune function, and economic productivity.
                  </p>
                </div>
              </div>

              <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800 delay-200">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 floating-card-delayed">
                  <p className="text-[#2B5D31] leading-relaxed">
                    It takes a holistic and value‑chain approach to address the existing roadblocks in access to adequate
                    nutrition. The facility intends to be agile and responsive to evolving market needs. Hidden Hunger has
                    two components: a
                    <span className="font-semibold text-[#C7D59F]"> Data Analytics Platform</span>
                    to provide insights to eligible projects, managed by advanced machine learning algorithms, and a
                    <span className="font-semibold text-[#C7D59F]"> Community Intervention System</span>
                    to support project implementation.
                  </p>
                </div>
              </div>

              <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800 delay-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 floating-card">
                  <p className="text-[#2B5D31] leading-relaxed">
                    The social and economic consequences are profound: stunted growth in children, reduced learning
                    capacity, increased susceptibility to diseases, and diminished workforce productivity. These effects
                    perpetuate cycles of poverty and limit Rwanda's potential for sustainable development. Through
                    evidence‑based solutions and predictive analytics, we can create measurable impact and build resilient
                    food systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Section */}
      <section id="data" className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Close-up%20of%20gentle%20hands%20cupping%20grain%20or%20seeds%2C%20soft%20natural%20lighting%2C%20blurred%20background%20showing%20agricultural%20fields%2C%20warm%20earth%20tones%2C%20symbolic%20representation%20of%20nourishment%20and%20care%2C%20shallow%20depth%20of%20field%2C%20documentary%20photography%20style&width=1200&height=800&seq=project-bg&orientation=landscape')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-[#40531A]/85"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-12 sm:mb-16 text-center">
              About Our <span className="font-normal">Project</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-8 sm:gap-12">
              {/* Left Column */}
              <div className="space-y-8 sm:space-y-12">
                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-database-2-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Real Public Datasets
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Utilizing comprehensive datasets from NISR (National Institute of Statistics of Rwanda) to
                      ensure our analysis is grounded in authentic, reliable data sources.
                    </p>
                  </div>
                </div>

                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-map-pin-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Geospatial Mapping
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Advanced geospatial analysis to visualize malnutrition patterns across Rwanda's districts,
                      identifying geographical hotspots and vulnerable communities.
                    </p>
                  </div>
                </div>

                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-brain-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Machine Learning Predictions
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Sophisticated algorithms predict at‑risk zones and populations, enabling proactive interventions
                      before malnutrition crises develop.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8 sm:space-y-12">
                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-lightbulb-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Data‑Driven Interventions
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Evidence‑based recommendations spanning health services, education programs,
                      and agricultural initiatives tailored to specific community needs.
                    </p>
                  </div>
                </div>

                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-line-chart-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Impact Measurement
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Comprehensive tracking and evaluation systems to monitor intervention effectiveness and
                      optimize resource allocation for maximum impact.
                    </p>
                  </div>
                </div>

                <div className="project-item flex items-start space-x-4 sm:space-x-6">
                  <div className="project-icon-wrapper group flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/30 flex items-center justify-center transition-all duration-300 group-hover:border-[#C7D59F] group-hover:shadow-lg group-hover:shadow-[#C7D59F]/30">
                      <i className="ri-team-line text-white/80 text-xl sm:text-2xl transition-all duration-300 group-hover:text-[#C7D59F] group-hover:scale-110 leading-none"></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">
                      Community Integration
                    </h3>
                    <p className="text-white/80 leading-relaxed font-light text-sm sm:text-base">
                      Solutions designed with community stakeholders to ensure cultural appropriateness and sustainable
                      implementation across Rwanda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://readdy.ai/api/search-image?query=Professional%20team%20workspace%20with%20computers%20data%20analytics%20screens%20showing%20nutrition%20charts%20and%20Rwanda%20maps%2C%20modern%20office%20environment%2C%20collaborative%20atmosphere%2C%20soft%20natural%20lighting%2C%20technology%20meeting%20healthcare%20research&width=1920&height=1080&seq=team-bg&orientation=landscape')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 bg-[#40531A]/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 text-center">
              Our <span className="font-normal text-[#C7D59F]">Team</span>
            </h2>
            <div className="w-32 h-1 bg-[#C7D59F] rounded-full mx-auto mb-16 sm:mb-20"></div>

            <p className="text-xl text-white/90 text-center max-w-4xl mx-auto mb-16 sm:mb-20 leading-relaxed">
              Meet the dedicated professionals behind Ndi Umuhuza - combining expertise in machine learning, data science,
              and nutrition analytics to create impactful solutions for Rwanda.
            </p>

            {/* Team Members Grid */}
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 max-w-6xl mx-auto">
              {/* UWINEZA DELYCE */}
              <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800 delay-100">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 sm:p-12 shadow-2xl border border-white/20 text-center group hover:shadow-3xl transition-all duration-300">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-[#C7D59F] shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="https://i.postimg.cc/7YXm4052/Delyce.jpg"
                        alt="delyce"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#C7D59F] rounded-full flex items-center justify-center shadow-xl">
                      <i className="ri-brain-line text-[#40531A] text-2xl leading-none"></i>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#40531A] mb-3">UWINEZA DELYCE</h3>
                  <p className="text-[#C7D59F] font-semibold mb-6 text-lg">Machine Learning & GIS Specialist</p>
                  <p className="text-gray-600 leading-relaxed mb-8 text-base">
                    Expert in machine learning algorithms, geospatial mapping, and data pipeline architecture. Specializes
                    in predictive modeling for nutrition analytics and advanced GIS visualization systems.
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">
                      Machine Learning
                    </span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">GIS Mapping</span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">Data Pipeline</span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">Python</span>
                  </div>

                  {/* Social Media */}
                  <div className="flex justify-center space-x-4">
                    <a
                      href="mailto:delyce.uwineza@ndiumuhuza.rw"
                      className="w-12 h-12 bg-[#40531A] text-white rounded-full flex items-center justify-center hover:bg-[#2B5D31] transition-colors"
                    >
                      <i className="ri-mail-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://github.com/delyce250"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <i className="ri-github-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://twitter.com/delyce_uwineza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <i className="ri-twitter-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://linkedin.com/in/delyce-uwineza"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <i className="ri-linkedin-line text-lg leading-none"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* IGIHOZO Ange Nicole */}
              <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800 delay-200">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 sm:p-12 shadow-2xl border border-white/20 text-center group hover:shadow-3xl transition-all duration-300">
                  <div className="relative mb-8">
                    <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full overflow-hidden border-4 border-[#C7D59F] shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="https://i.postimg.cc/Yq8b7YvF/ANGE.jpg"
                        alt="IGIHOZO Ange Nicole"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#C7D59F] rounded-full flex items-center justify-center shadow-xl">
                      <i className="ri-bar-chart-line text-[#40531A] text-2xl leading-none"></i>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-[#40531A] mb-3">IGIHOZO Ange Nicole</h3>
                  <p className="text-[#C7D59F] font-semibold mb-6 text-lg">UI/UX Designer & Data Analyst</p>
                  <p className="text-gray-600 leading-relaxed mb-8 text-base">
                    Specializes in user interface design and data analysis for nutrition platforms. Expert in creating
                    intuitive dashboards and transforming complex data into actionable insights.
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">
                      UI/UX Design
                    </span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">Data Analysis</span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">
                      Dashboard Design
                    </span>
                    <span className="px-4 py-2 bg-[#40531A]/10 text-[#40531A] rounded-full text-sm font-medium">React</span>
                  </div>

                  {/* Social Media */}
                  <div className="flex justify-center space-x-4">
                    <a
                      href="mailto:ange.igihozo@ndiumuhuza.rw"
                      className="w-12 h-12 bg-[#40531A] text-white rounded-full flex items-center justify-center hover:bg-[#2B5D31] transition-colors"
                    >
                      <i className="ri-mail-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://github.com/ange-igihozo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <i className="ri-github-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://twitter.com/ange_igihozo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                      <i className="ri-twitter-line text-lg leading-none"></i>
                    </a>
                    <a
                      href="https://linkedin.com/in/ange-igihozo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <i className="ri-linkedin-line text-lg leading-none"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Statement */}
            <div className="mt-20 sm:mt-24 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-10 sm:p-16 max-w-5xl mx-auto border border-white/20">
                <p className="text-xl sm:text-2xl text-white leading-relaxed font-medium">
                  "Our interdisciplinary team combines technical expertise with deep understanding of Rwanda's nutrition
                  challenges, creating innovative solutions that make a real difference in communities across the
                  country."
                </p>
                <div className="mt-8 flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 bg-[#C7D59F] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#C7D59F] rounded-full"></div>
                  <div className="w-3 h-3 bg-[#C7D59F] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="fade-in-section opacity-0 transform translate-y-10 transition-all duration-800">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#40531A] mb-4 text-center">
              Our <span className="font-normal text-[#C7D59F]">Partners</span>
            </h2>
            <div className="w-24 h-1 bg-[#C7D59F] rounded-full mx-auto mb-12 sm:mb-16"></div>

            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed">
              Collaborating with leading institutions and organizations to create sustainable solutions for Rwanda's
              nutrition challenges.
            </p>

            {/* Partners Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
              {/* NISR */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-100 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/G29srBsn/NISR.png"
                    alt="NISR"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=Rwanda%20National%20Institute%20of%20Statistics%20NISR%20official%20government%20logo%20with%20Rwanda%20coat%20of%20arms%20professional%20design%20with%20clear%20background%20high%20contrast%20for%20visibility%20statistical%20bureau%20emblem&width=120&height=120&seq=nisr-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">NISR</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">National Institute of Statistics</p>
              </div>

              {/* MINISANTE */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-200 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/jjMJG62h/MINISANTE.png"
                    alt="MINISANTE"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=Rwanda%20Ministry%20of%20Health%20MINISANTE%20official%20logo%20with%20medical%20cross%20and%20Rwanda%20government%20emblem%20green%20blue%20colors%20healthcare%20symbol%20professional%20design%20clear%20white%20background%20high%20visibility&width=120&height=120&seq=minisante-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">MINISANTE</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Ministry of Health</p>
              </div>

              {/* UN */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-300 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/BQX9DHd1/UN.png"
                    alt="United Nations"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=United%20Nations%20official%20logo%20with%20olive%20branches%20and%20world%20map%20blue%20and%20white%20colors%20UN%20emblem%20international%20organization%20symbol%20clear%20background%20high%20contrast%20professional%20design&width=120&height=120&seq=un-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">United Nations</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Global Partnership</p>
              </div>

              {/* UNICEF */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-400 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/NGNv5pPc/UNICEF.png"
                    alt="UNICEF"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=UNICEF%20official%20logo%20with%20children%20silhouette%20blue%20and%20white%20colors%20United%20Nations%20Children%20Fund%20emblem%20international%20humanitarian%20organization%20clear%20background%20high%20visibility%20professional%20design&width=120&height=120&seq=unicef-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">UNICEF</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Children's Fund</p>
              </div>

              {/* RBC */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-500 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/rwLWWF75/RBC.jpg"
                    alt="RBC"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=Rwanda%20Biomedical%20Center%20RBC%20official%20logo%20with%20medical%20symbols%20DNA%20helix%20laboratory%20healthcare%20research%20emblem%20government%20health%20institution%20clear%20white%20background%20professional%20design&width=120&height=120&seq=rbc-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">RBC</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Biomedical Center</p>
              </div>

              {/* NAEB */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-600 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/xTmMcbp0/NAEB.jpg"
                    alt="NAEB"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=Rwanda%20National%20Agricultural%20Export%20Board%20NAEB%20official%20logo%20with%20agricultural%20symbols%20coffee%20tea%20crops%20export%20trade%20emblem%20government%20agriculture%20institution%20clear%20background%20professional%20design&width=120&height=120&seq=naeb-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">NAEB</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Agricultural Export Board</p>
              </div>

              {/* World Bank */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-700 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://www.worldbank.org/content/dam/wbr-redesign/logos/logo-wb-header-en.svg"
                    alt="World Bank"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://readdy.ai/api/search-image?query=World%20Bank%20official%20logo%20with%20globe%20and%20development%20symbols%20international%20finance%20institution%20blue%20and%20white%20colors%20clear%20background%20high%20contrast%20professional%20design%20development%20bank%20emblem&width=120&height=120&seq=worldbank-clear&orientation=squarish';
                    }}
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">World Bank</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Development Finance</p>
              </div>

              {/* RMS */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-800 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/8Cp6KXp5/RMS.jpg"
                    alt="RMS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">RMS</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Management Services</p>
              </div>

              {/* NCNM */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-900 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://i.postimg.cc/wTZKk3p4/NCNM.png"
                    alt="NCNM"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">NCNM</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Nurses & Midwives Council</p>
              </div>

              {/* Chuck */}
              <div className="fade-in-section opacity-0 transform translate-y-6 transition-all duration-600 delay-1000 flex flex-col items-center group cursor-pointer">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#C7D59F]/10 group-hover:shadow-lg group-hover:scale-105 p-4">
                  <img
                    src="https://readdy.ai/api/search-image?query=Chuck%20organization%20logo%20modern%20development%20partner%20humanitarian%20aid%20international%20cooperation%20professional%20design%20clean%20background%20high%20contrast%20institutional%20emblem&width=120&height=120&seq=chuck-clear&orientation=squarish"
                    alt="Chuck"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#40531A] text-center">Chuck</h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mt-1">Development Partner</p>
              </div>
            </div>

            {/* Partnership Statement */}
            <div className="mt-16 sm:mt-20 text-center">
              <div className="bg-[#40531A]/5 rounded-xl p-8 sm:p-12 max-w-4xl mx-auto">
                <p className="text-lg sm:text-xl text-[#40531A] leading-relaxed font-medium">
                  "Through strategic partnerships with government institutions, international organizations, and local
                  stakeholders, we are building a comprehensive ecosystem for sustainable nutrition solutions in Rwanda."
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-[#C7D59F] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#C7D59F] rounded-full"></div>
                  <div className="w-2 h-2 bg-[#C7D59F] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#40531A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative w-12 h-12">
                  <img
                    src="https://readdy.ai/api/search-image?query=Circular%20logo%20design%20with%20NDI%20UMUHUZA%20text%20in%20bold%20letters%20around%20the%20circle%20border%20and%20RWANDA%20NUTRITION%20CONNECT%20subtitle%20in%20smaller%20text%20below%2C%20clean%20white%20background%2C%20professional%20green%20and%20white%20color%20scheme%2C%20minimalist%20design%2C%20high%20contrast%20for%20easy%20background%20removal%2C%20similar%20to%20official%20government%20emblem%20style&width=200&height=200&seq=ndi-umuhuza-logo&orientation=squarish"
                    alt="Ndi Umuhuza Logo"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-['Pacifico'] text-xl text-[#C7D59F] mb-1">Ndi Umuhuza</h3>
                  <p className="text-stone-300 text-sm">Rwanda Nutrition Connect</p>
                </div>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Data-driven solutions for sustainable nutrition and food security across Rwanda, powered by advanced analytics and machine learning.
              </p>
              <div className="flex space-x-4">
                <a
                  href="mailto:contact@ndiumuhuza.rw"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C7D59F] text-white hover:text-[#40531A] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <i className="ri-mail-line text-lg leading-none"></i>
                </a>
                <a
                  href="https://github.com/project/ndi-umuhuza-rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C7D59F] text-white hover:text-[#40531A] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <i className="ri-github-line text-lg leading-none"></i>
                </a>
                <a
                  href="https://twitter.com/ndiumuhuza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C7D59F] text-white hover:text-[#40531A] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <i className="ri-twitter-line text-lg leading-none"></i>
                </a>
                <a
                  href="https://linkedin.com/company/ndi-umuhuza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 hover:bg-[#C7D59F] text-white hover:text-[#40531A] rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <i className="ri-linkedin-line text-lg leading-none"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#home" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    About Project
                  </a>
                </li>
                <li>
                  <Link href="/insights" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Key Insights
                  </Link>
                </li>
                <li>
                  <Link href="/predictor" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Nutrition Predictor
                  </Link>
                </li>
                <li>
                  <a href="#team" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#research" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Research
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#data" className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm">
                    Data Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.statistics.gov.rw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm"
                  >
                    NISR Data Portal
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.moh.gov.rw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm"
                  >
                    Ministry of Health
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.who.int/nutrition"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm"
                  >
                    WHO Nutrition
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/project/ndi-umuhuza-rwanda/wiki"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/project/ndi-umuhuza-rwanda/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-[#C7D59F] transition-colors duration-200 text-sm"
                  >
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact Information</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-mail-line text-[#C7D59F] text-sm leading-none"></i>
                  </div>
                  <div>
                    <p className="text-stone-300 text-sm">Email</p>
                    <a
                      href="mailto:contact@ndiumuhuza.rw"
                      className="text-white hover:text-[#C7D59F] transition-colors text-sm"
                    >
                      contact@ndiumuhuza.rw
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-github-line text-[#C7D59F] text-sm leading-none"></i>
                  </div>
                  <div>
                    <p className="text-stone-300 text-sm">GitHub</p>
                    <a
                      href="https://github.com/project/ndi-umuhuza-rwanda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#C7D59F] transition-colors text-sm"
                    >
                      ndi-umuhuza-rwanda
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-map-pin-line text-[#C7D59F] text-sm leading-none"></i>
                  </div>
                  <div>
                    <p className="text-stone-300 text-sm">Location</p>
                    <p className="text-white text-sm">Kigali, Rwanda</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                    <i className="ri-calendar-line text-[#C7D59F] text-sm leading-none"></i>
                  </div>
                  <div>
                    <p className="text-stone-300 text-sm">Event</p>
                    <p className="text-white text-sm">Big Data Hackathon 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
              {/* Copyright */}
              <div className="text-center sm:text-left">
                <p className="text-stone-300 text-sm">
                  © 2025 Ndi Umuhuza. All rights reserved.
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  Rwanda Nutrition Connect Platform
                </p>
              </div>

              {/* Vision Coders Team */}
              <div className="text-center">
                <p className="text-stone-300 text-sm mb-1">Developed by</p>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-6 h-6 bg-[#C7D59F] rounded-full flex items-center justify-center">
                    <i className="ri-code-line text-[#40531A] text-sm leading-none"></i>
                  </div>
                  <span className="text-white font-semibold">Vision Coders</span>
                </div>
                <p className="text-stone-400 text-xs mt-1">
                  UWINEZA Delyce & IGIHOZO Ange Nicole
                </p>
              </div>

              {/* Made with Readdy */}
              <div className="text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-end space-x-2 mb-2">
                  <span className="text-stone-300 text-sm">Powered by NISR Data</span>
                </div>
                <a
                  href="https://readdy.ai/?origin=logo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-stone-300 hover:text-[#C7D59F] transition-colors text-sm"
                >
                  <span>Made with</span>
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-heart-line text-xs leading-none"></i>
                  </div>
                  <span>Readdy</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#40531A]">Search Content</h3>
                <button
                  onClick={toggleSearch}
                  className="text-gray-400 hover:text-[#40531A] transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                >
                  <i className="ri-close-line text-xl leading-none"></i>
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search for data, insights, partners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C7D59F] focus:border-transparent text-sm"
                  autoFocus
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <i className="ri-search-line text-gray-400 text-sm leading-none"></i>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-4">Quick links:</p>
                {searchableContent.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const element = document.getElementById(item.id);
                      if (element) {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-[#C7D59F]/10 transition-colors flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-[#40531A]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <i
                        className={`ri-${item.id === 'home' ? 'home' : item.id === 'about' ? 'information' : item.id === 'data' ? 'bar-chart' : item.id === 'partners' ? 'team' : 'mail'}-line text-[#40531A] text-sm leading-none`}
                      />
                    </div>
                    <div>
                      <div className="font-medium text-[#40531A]">{item.title}</div>
                      <div className="text-sm text-gray-500">Go to {item.title.toLowerCase()} section</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="w-full bg-[#40531A] text-white py-3 rounded-lg hover:bg-[#40531A]/90 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-search-line text-sm leading-none"></i>
                  </div>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
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
        .fade-in-section.visible .project-item {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-subtle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .slide-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }

        .content-transition {
          transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
        }

        .enhanced-button {
          position: relative;
          overflow: hidden;
        }

        .enhanced-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .enhanced-button:hover::before {
          left: 100%;
        }
      `}</style>
    </div>
  );
}
