// Customer images data
const customerImages = [
  // These would be real customer images in a production environment
  // Using placeholder data for now
  { src: 'https://randomuser.me/api/portraits/men/32.jpg', alt: 'Happy male customer' },
  { src: 'https://randomuser.me/api/portraits/women/44.jpg', alt: 'Happy female customer' },
  { src: 'https://randomuser.me/api/portraits/men/22.jpg', alt: 'Happy male customer' },
];

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
      {/* Simple background with solid color */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-primary"></div>
      </div>

      {/* No floating circles */}

      <div className="container relative py-24 md:py-32 z-10" role="region" aria-label="Hero section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg flex flex-col justify-between">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-secondary drop-shadow-lg">
              Need a Plumber Fast?
            </h1>
            <p className="text-xl mb-8 text-primary">
              Professional plumbing services available 24/7. 
              We fix everything from clogged drains to complete pipe replacements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="btn btn-secondary backdrop-blur-sm hover:bg-secondary/80 transition-all duration-300 shadow-lg">
                Book a Plumber Now
              </a>
              <a href="tel:+1234567890" className="btn bg-white border border-primary text-primary hover:bg-gray-100 transition-all duration-300 shadow-md">
                Call Us: (123) 456-7890
              </a>
            </div>
            <div className="mt-8 flex items-center bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex -space-x-4">
                {customerImages.map((customer, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white/80 overflow-hidden shadow-lg">
                    <img 
                      src={customer.src} 
                      alt={customer.alt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21v-2a7 7 0 0 0-14 0v2"/></svg>';
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="text-sm text-primary">Trusted by</div>
                <div className="font-medium text-secondary">1000+ Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="hidden md:block h-full">
            <div className="relative h-full">
              {/* Simple card - no glow or blur */}
              <div className="relative bg-white p-6 rounded-2xl border border-gray-200 shadow-lg flex flex-col">

                <div className="relative flex-1 flex flex-col">
                  {/* Plumber image - using the image from pictures folder */}
                  <div className="flex-1 relative overflow-hidden rounded-xl shadow-inner mb-4">
                    {/* Using direct image with correct path - EXACT path from file system */}
                    <img 
                      src="/images/Plumber.jpg" 
                      alt="Professional plumber" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center text-white">
                    <div className="font-bold text-xl">Professional Service</div>
                    <div className="text-white/80">Licensed & insured plumbers at your service</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating animation is defined in index.css */}
    </section>
  );
};

export default Hero;
