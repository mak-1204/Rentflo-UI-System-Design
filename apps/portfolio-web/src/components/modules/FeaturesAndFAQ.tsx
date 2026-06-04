'use client';

import { useState } from 'react';
import { ChevronDown, Home, Shield, Users, Zap, Calendar, Smartphone } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FeaturesAndFAQProps {
  faqs?: FAQItem[];
}

export function FeaturesAndFAQ({
  faqs = [
    {
      question: 'How do I book a room?',
      answer:
        'Simply fill out our inquiry form above, and our team will contact you within 24 hours with available options. You can then schedule a virtual or physical tour and confirm your booking online.',
    },
    {
      question: 'What are the lease terms?',
      answer:
        'We offer flexible lease terms ranging from 6 months to 2 years. No long-term commitment required. You can also opt for monthly renewal after the initial term.',
    },
    {
      question: 'Is there a security deposit?',
      answer:
        'Yes, a one-time security deposit equivalent to one month\'s rent is required. This is fully refundable after your stay ends in good condition.',
    },
    {
      question: 'What utilities are included?',
      answer:
        'Electricity, water, WiFi, and maintenance are included in the rent. Electricity usage beyond the limit attracts additional charges at ₹5/unit.',
    },
    {
      question: 'Can I bring guests?',
      answer:
        'Yes, you can have guests during visiting hours (9 AM - 10 PM). Overnight guests require prior approval from management.',
    },
    {
      question: 'What is the cancellation policy?',
      answer:
        'You can cancel up to 60 days before your move-in date for a full refund. Later cancellations may incur a 50% penalty.',
    },
  ],
}: FeaturesAndFAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const features = [
    {
      icon: Home,
      title: 'Spacious Rooms',
      description: 'Well-designed, ventilated rooms with modern furnishing',
    },
    {
      icon: Shield,
      title: '24/7 Security',
      description: 'CCTV surveillance, trained staff, secure entry system',
    },
    {
      icon: Users,
      title: 'Community Feel',
      description: 'Regular events, sports, and networking opportunities',
    },
    {
      icon: Zap,
      title: 'Always Connected',
      description: 'Gigabit WiFi, 24/7 power backup, premium utilities',
    },
    {
      icon: Calendar,
      title: 'Flexible Terms',
      description: '6 months to 2 years, no long-term commitment required',
    },
    {
      icon: Smartphone,
      title: 'Easy Management',
      description: 'Online payment, quick maintenance request, digital support',
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Features Section */}
      <div className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Why We Stand Out
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for comfortable living
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all group"
                >
                  <div className="mb-4 p-3 bg-blue-100 rounded-lg w-fit group-hover:bg-blue-200 transition-colors">
                    <Icon size={28} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about living with us
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
              >
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="w-full px-6 py-4 md:py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 text-left">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={24}
                    className={`text-blue-600 flex-shrink-0 ml-4 transition-transform ${
                      expandedIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedIndex === index && (
                  <div className="px-6 py-4 md:py-5 bg-blue-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Support */}
          <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Didn't find your answer?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help. Contact us anytime, we respond within 24 hours.
            </p>
            <div className="flex gap-4">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                📞 Call Us
              </a>
              <a
                href="mailto:support@stayflo.com"
                className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                ✉️ Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
