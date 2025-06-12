const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Book a Service",
      description: "Schedule an appointment online or call us. We'll confirm your booking and provide a time window for arrival.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Plumber Arrives",
      description: "Our licensed plumber arrives at your location, diagnoses the issue, and provides a transparent quote.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Problem Solved",
      description: "We complete the work efficiently, clean up after ourselves, and ensure everything is working perfectly.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="how-it-works" className="section bg-light relative overflow-hidden">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Getting your plumbing problems solved has never been easier. Our simple three-step process ensures you get fast, reliable service every time.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md relative border border-gray-200">
              <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">
                {step.number}
              </div>
              <div className="text-primary mb-6">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg border border-gray-200 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-gray-700">Book your service now and we'll be there when you need us.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#booking" className="btn btn-primary">Book Online</a>
              <a href="tel:+1234567890" className="btn bg-white border border-primary text-primary hover:bg-primary/5">
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
