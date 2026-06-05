'use client';

import { Home, Shield, Users, Zap, Calendar, Smartphone } from 'lucide-react';

export function FeaturesAndFAQ() {
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
    <div className="w-full bg-surface dark:bg-navy-deep transition-colors duration-200">
      {/* Features Section */}
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white mb-3">
              Why We Stand Out
            </h2>
            <p className="text-lg text-on-surface-variant dark:text-outline-variant">
              Everything you need for comfortable living
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-2xl bg-white dark:bg-navy-deep border border-border-subtle dark:border-outline-variant/60 hover:border-stayflow-teal dark:hover:border-stayflow-teal hover:shadow-lg transition-all group duration-300"
                >
                  <div className="mb-4 p-3 bg-primary/10 dark:bg-primary-fixed/20 rounded-xl w-fit group-hover:bg-stayflow-teal/20 transition-colors">
                    <Icon size={28} className="text-primary dark:text-primary-fixed group-hover:text-stayflow-teal transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-deep dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant dark:text-outline-variant leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
