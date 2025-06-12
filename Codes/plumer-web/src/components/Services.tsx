const Services = () => {
  const serviceItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: "Drain Cleaning",
      description: "Fast and effective solutions for clogged drains in sinks, tubs, showers, and toilets.",
      image: "/images/service1.png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Leak Detection & Repair",
      description: "Advanced equipment to locate and fix hidden leaks before they cause serious damage.",
      image: "/images/service2.png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Emergency Plumbing",
      description: "24/7 emergency service for burst pipes, major leaks, and other plumbing disasters.",
      image: "/images/service3.png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      title: "Water Heater Services",
      description: "Installation, repair, and maintenance for all types of water heaters.",
      image: "/images/service1.png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Pipe Repair & Replacement",
      description: "Expert repair and replacement of damaged or old pipes with minimal disruption.",
      image: "/images/service2.png"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Fixture Installation",
      description: "Professional installation of sinks, faucets, toilets, showers, and other fixtures.",
      image: "/images/service3.png"
    },
  ];

  return (
    <section id="services" className="section bg-light relative overflow-hidden">
      
      <div className="container relative z-10" role="region" aria-label="Services section">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg mb-12">
          <h2 className="section-title mb-6">Our Services</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto">
            We offer a comprehensive range of plumbing services to meet all your residential and commercial needs. Our experienced team is equipped to handle any plumbing challenge.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${service.image})` }}></div>
              </div>
              
              {/* Simple overlay */}
              <div className="absolute inset-0 bg-white group-hover:bg-gray-50 transition-all duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="text-primary mb-4 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-dark">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
                
                {/* Hidden details that appear on hover */}
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 mt-0 group-hover:mt-4">
                  <a href="#booking" className="text-primary font-medium hover:text-primary/80 transition-colors inline-flex items-center">
                    Book this service
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#booking" className="btn btn-primary hover:bg-primary/80 transition-all duration-300 shadow-md">
            Schedule a Service
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
