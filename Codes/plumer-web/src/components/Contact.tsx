const Contact = () => {
  return (
    <section id="contact" className="section bg-light relative overflow-hidden">
      <div className="container">
        <h2 className="section-title">Contact Us</h2>
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Have questions or need immediate assistance? Reach out to our friendly team using any of the methods below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Card: Phone */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Available 24/7 for emergencies</p>
            <a href="tel:+1234567890" className="text-primary font-bold text-lg hover:underline">
              (123) 456-7890
            </a>
          </div>
          
          {/* Contact Card: Email */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
            <a href="mailto:info@plumerpro.com" className="text-primary font-bold text-lg hover:underline">
              info@plumerpro.com
            </a>
          </div>
          
          {/* Contact Card: Office */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Mon-Fri: 8am - 6pm</p>
            <address className="not-italic text-primary font-bold text-lg">
              123 Plumbing Ave<br />
              Cityville, ST 12345
            </address>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              {/* Google Maps embed */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1623164800158!5m2!1sen!2sus" 
                className="w-full h-96" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                aria-label="Map showing our office location"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* Service Area */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-center">Our Service Area</h3>
          <p className="text-center text-gray-700 mb-6">
            We proudly serve the following areas and surrounding neighborhoods:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
            {[
              "Downtown", "Westside", "Northside", "Eastside",
              "Southside", "Riverside", "Hillcrest", "Oakwood",
              "Pineville", "Maplewood", "Brookside", "Cedar Heights"
            ].map((area, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200">
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
