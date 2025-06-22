"use client";

import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HomePage() {
  const currentYear = new Date().getFullYear();
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Local Specialists for Any Home Job
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Connect with trusted professionals for plumbing, electrical, HVAC, and more. 
              Get instant quotes, book appointments, and pay securely all in one place.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg">
                <Link href="/post-job">Post a Job</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/browse-jobs">Find Work</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-80 md:h-96 w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-blue-500 rounded-lg transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Hero Image Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How JobMate Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Post Your Job",
                description: "Describe what you need done, upload photos or use voice commands. Our AI will help categorize and suggest specialists."
              },
              {
                step: 2,
                title: "Get Matched",
                description: "Available specialists in your area will be notified. Browse profiles, reviews, and choose the best fit for your job."
              },
              {
                step: 3,
                title: "Job Complete",
                description: "Once the work is done, payment is released securely. Rate your specialist and build the community trust."
              }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl text-brand-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Cleaning', 'Landscaping', 'Appliance Repair'].map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="h-12 w-12 mx-auto mb-4 bg-brand-100 rounded-full flex items-center justify-center">
                    <span className="text-brand-600">🔧</span>
                  </div>
                  <h3 className="font-medium">{service}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Homeowner',
                quote: 'JobMate made finding a reliable plumber so easy! The app guided me through describing the issue and I had a professional at my door within hours.'
              },
              {
                name: 'Mike Rodriguez',
                role: 'Electrician',
                quote: 'As a specialist on JobMate, I\'ve been able to grow my business and find consistent work in my area. The platform handles all the scheduling and payments.'
              },
              {
                name: 'Emily Chen',
                role: 'Property Manager',
                quote: 'Managing maintenance for multiple properties used to be a headache. With JobMate, I can coordinate all repairs through one simple platform.'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of customers and specialists on JobMate today and experience the future of home services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button asChild variant="secondary" size="lg">
              <Link href="/signup">Create an Account</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-brand-700">
              <Link href="/post-job">Post Your First Job</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
