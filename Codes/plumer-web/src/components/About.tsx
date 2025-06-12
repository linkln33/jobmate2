const About = () => {
  return (
    <section id="about" className="section bg-light relative overflow-hidden">
      <div className="container">
        <h2 className="section-title">About Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Your Trusted Local Plumbing Experts</h3>
            <p className="mb-4 text-gray-700">
              With over 15 years of experience, Plumer Pro has been providing top-notch plumbing services to homeowners and businesses throughout the area. Our team of licensed and insured professionals is dedicated to solving your plumbing problems quickly and efficiently.
            </p>
            <p className="mb-6 text-gray-700">
              We pride ourselves on our attention to detail, transparent pricing, and exceptional customer service. When you choose Plumer Pro, you're choosing a team that treats your home with respect and gets the job done right the first time.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { number: "15+", text: "Years Experience" },
                { number: "1000+", text: "Happy Customers" },
                { number: "24/7", text: "Emergency Service" },
                { number: "100%", text: "Satisfaction Guarantee" }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <div className="text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-gray-700">{stat.text}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Licensed & Insured</h4>
                    <p className="text-sm text-gray-600">All our plumbers are fully certified</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Fast Response Time</h4>
                    <p className="text-sm text-gray-600">We arrive within 1 hour for emergencies</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 bg-primary/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold">Transparent Pricing</h4>
                    <p className="text-sm text-gray-600">No hidden fees or surprise costs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-md">
                <div className="flex items-center mb-2">
                  <div className="text-yellow-500 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 font-bold">5.0</span>
                  <span className="ml-2 text-sm text-gray-600">(120+ Reviews)</span>
                </div>
                <p className="text-sm italic text-gray-700">
                  "Best plumbing service in town! They arrived quickly and fixed our issue in no time."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
