import { useEffect, useRef, useState } from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const Testimonials = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the card animations
            dummyTestimonial.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards(prev => [...new Set([...prev, index])]);
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Add floating animation with CSS keyframes
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(1deg); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }
        50% { box-shadow: 0 8px 30px rgba(59, 130, 246, 0.15); }
      }
      
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      
      .float-animation { animation: float 6s ease-in-out infinite; }
      .pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
      .shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        background-size: 1000px 100%;
        animation: shimmer 3s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-3xl float-animation"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/8 to-orange-400/8 rounded-full blur-3xl float-animation" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-gradient-to-r from-green-400/6 to-cyan-400/6 rounded-full blur-2xl float-animation" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Container - Centered */}
      <div className="max-w-6xl mx-auto w-full relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 md:mb-8 transition-all duration-1000 transform ${
            visibleCards.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
              Testimonials
            </span>
          </h2>
          
          <p className={`text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 transform ${
            visibleCards.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.3s' }}>
            Hear from our learners as they share their journey of transformation, 
            success, and how our platform has made a difference in their lives
          </p>
        </div>

        {/* Testimonials Grid - Perfectly Centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl">
            {dummyTestimonial.map((testimonial, index) => (
              <div
                key={index}
                ref={(el) => cardsRef.current[index] = el}
                className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform-gpu ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-16 scale-95'
                } hover:-translate-y-4 hover:scale-105 pulse-glow`}
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  transformOrigin: 'center',
                  animationDelay: `${index * 0.5}s`
                }}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                
                {/* Premium gradient border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Header Section */}
                <div className="relative flex items-center gap-4 px-6 py-6 bg-gradient-to-r from-gray-50/80 via-white/60 to-gray-50/80">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 sm:h-18 sm:w-18 rounded-full object-cover border-3 border-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    />

                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 transition-all duration-300 group-hover:text-blue-600">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-6">
                  {/* Stars Rating with enhanced animation */}
                  <div className="flex justify-center gap-1 mb-6">
                    {Array.from({ length: 5 }, (_, i) => (
                      <img
                        key={i}
                        src={
                          i < Math.floor(testimonial.rating)
                            ? assets.star
                            : assets.star_blank
                        }
                        alt="star"
                        className={`h-6 w-6 transition-all duration-500 transform ${
                          visibleCards.includes(index) 
                            ? 'opacity-100 scale-100 rotate-0' 
                            : 'opacity-0 scale-0 -rotate-180'
                        } hover:scale-125 hover:rotate-12 cursor-pointer`}
                        style={{ 
                          transitionDelay: `${(index * 200) + (i * 100)}ms`
                        }}
                      />
                    ))}
                  </div>

                  {/* Feedback Text with enhanced styling */}
                  <div className="relative">
                    <p className={`text-sm sm:text-base text-gray-700 leading-relaxed text-center transition-all duration-800 ${
                      visibleCards.includes(index) ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: `${(index * 200) + 400}ms` }}>
                      <span className="text-gray-800 font-medium">"</span>
                      {testimonial.feedback}
                      <span className="text-gray-800 font-medium">"</span>
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className={`text-center mt-4 transition-all duration-600 ${
                    visibleCards.includes(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${(index * 200) + 500}ms` }}>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all duration-300 transform hover:scale-105">
                      Read More
                    </button>
                  </div>

                  {/* Trust indicators */}
                  <div className={`flex justify-center items-center gap-2 mt-4 transition-all duration-600 ${
                    visibleCards.includes(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${(index * 200) + 600}ms` }}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500 font-medium">Verified Review</span>
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>

                  {/* Decorative quote marks */}
                  <div className="absolute -top-2 left-3 text-5xl text-blue-200/40 font-serif leading-none select-none transition-all duration-500 group-hover:text-blue-300/60 group-hover:scale-110">
                    "
                  </div>
                  <div className="absolute -bottom-4 right-3 text-5xl text-purple-200/40 font-serif leading-none select-none rotate-180 transition-all duration-500 group-hover:text-purple-300/60 group-hover:scale-110">
                    "
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;