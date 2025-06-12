import { useState } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Downtown",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      text: "Plumer Pro saved us during a major pipe burst emergency. They arrived within 30 minutes and fixed everything so efficiently. Their team was professional, courteous, and explained everything they were doing. Highly recommend!",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      location: "Westside",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      text: "I've been using Plumer Pro for all my rental properties for over 5 years. Their pricing is fair, work quality is excellent, and they're always available when I need them. They're my go-to plumbers for any issue, big or small.",
      rating: 5
    },
    {
      name: "Jennifer Lee",
      location: "Northside",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "After trying several plumbing companies, I finally found Plumer Pro. They installed a new water heater for us and the difference in service quality was night and day. No mess left behind and they even helped me understand how to maintain it properly.",
      rating: 5
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section bg-light relative overflow-hidden">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-white p-8 rounded-lg shadow-md border border-gray-200">
            {/* Decorative quote mark */}
            <div className="absolute top-4 left-4 text-6xl text-primary/10 font-serif">
              "
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={testimonials[activeIndex].image} 
                    alt={testimonials[activeIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="text-yellow-500 flex justify-center mb-4">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <blockquote className="text-center italic text-gray-700 mb-6">
                {testimonials[activeIndex].text}
              </blockquote>
              
              <div className="text-center">
                <div className="font-bold text-lg">{testimonials[activeIndex].name}</div>
                <div className="text-sm text-gray-600">{testimonials[activeIndex].location}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6 space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 text-primary hover:bg-gray-100"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeIndex ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white border border-gray-200 text-primary hover:bg-gray-100"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
