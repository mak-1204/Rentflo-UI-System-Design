'use client';

import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Testimonial {
  name: string;
  duration: string;
  rating: number;
  comment: string;
  avatar?: string;
  role?: string;
}

interface TestimonialsProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({
  testimonials = [
    {
      name: 'Vijay Nair',
      duration: 'Staying since 8 months',
      rating: 5,
      comment: 'Absolutely clean PG with prompt support. The food tastes just like home. Management is helpful and bills are transparent. Highly recommended!',
      role: 'Software Engineer',
    },
    {
      name: 'Rohit K.',
      duration: 'Staying since 1 year',
      rating: 5,
      comment: 'Very clean common areas, the WiFi speed is constant at 150Mbps, food menu is varied and fresh. Best PG in the area!',
      role: 'Graphic Designer',
    },
    {
      name: 'Priya Singh',
      duration: 'Staying since 6 months',
      rating: 5,
      comment: 'Amazing experience! The staff is very cooperative and the maintenance is top-notch. I feel safe and comfortable here.',
      role: 'Marketing Manager',
    },
    {
      name: 'Amit Patel',
      duration: 'Staying since 10 months',
      rating: 4,
      comment: 'Great value for money. The rooms are spacious and well-maintained. The management responds quickly to any issues.',
      role: 'Business Analyst',
    },
  ],
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.ceil(testimonials.length / 3) - 1 : prev - 1
    );
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-blue-50 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            What Our Residents Say
          </h2>
          <p className="text-lg text-gray-600">
            Join 500+ happy tenants who trust us
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="text-gray-600 mt-2">4.8/5 Average Rating</p>
        </div>

        {/* Testimonials Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {testimonials
              .slice(
                currentIndex * 3,
                Math.min((currentIndex + 1) * 3, testimonials.length)
              )
              .map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
                >
                  {/* Star Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-6 line-clamp-4">
                    "{testimonial.comment}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {testimonial.name}
                        </h4>
                        {testimonial.role && (
                          <p className="text-xs text-gray-500">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {testimonial.duration}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Navigation */}
          {Math.ceil(testimonials.length / 3) > 1 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <div className="flex gap-2 items-center">
                {[...Array(Math.ceil(testimonials.length / 3))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentIndex ? 'bg-blue-600 w-8' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial set ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-gray-600 mt-2">Happy Residents</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">4.8/5</p>
            <p className="text-gray-600 mt-2">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">98%</p>
            <p className="text-gray-600 mt-2">Renewal Rate</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">2 Yrs</p>
            <p className="text-gray-600 mt-2">Avg. Stay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
