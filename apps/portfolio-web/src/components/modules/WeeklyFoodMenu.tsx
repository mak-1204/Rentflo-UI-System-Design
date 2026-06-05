'use client';

import { ChefHat } from 'lucide-react';

interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  isSpecial?: boolean;
}

interface WeeklyFoodMenuProps {
  meals?: MealPlan[];
}

export function WeeklyFoodMenu({
  meals = [
    {
      day: 'Mon',
      breakfast: 'Aloo Paratha & Curd',
      lunch: 'Dal Makhani, Rice, Paneer',
      dinner: 'Veg Pulao & Raita',
    },
    {
      day: 'Tue',
      breakfast: 'Poha & Tea',
      lunch: 'Mix Veg, Chapatis, Curd',
      dinner: 'Pasta Arrabiata & Garlic Bread',
    },
    {
      day: 'Wed',
      breakfast: 'Idli Sambar & Chutney',
      lunch: 'Chicken/Paneer Biryani',
      dinner: 'Dosa & Masala Chai',
      isSpecial: true,
    },
    {
      day: 'Thu',
      breakfast: 'Omelette & Toast',
      lunch: 'Chole Bhature & Lassi',
      dinner: 'Rajma Chawal',
    },
    {
      day: 'Fri',
      breakfast: 'Dhokla & Chutney',
      lunch: 'Rice, Egg Curry, Veg Fry',
      dinner: 'Roti, Chole Masala',
    },
    {
      day: 'Sat',
      breakfast: 'Parathe & Curd',
      lunch: 'Veg Biryani & Raita',
      dinner: 'Pasta / Noodles & Soup',
    },
    {
      day: 'Sun',
      breakfast: 'Waffles & Honey',
      lunch: 'Special Chicken Curry / Paneer, Rice',
      dinner: 'Dal Makhani & Basmati Rice',
    },
  ],
}: WeeklyFoodMenuProps) {
  return (
    <div className="w-full bg-white dark:bg-navy-deep/20 py-12 md:py-16 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 text-left space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white mb-2">
            Chef's Curated Weekly Menu
          </h2>
          <p className="text-base text-on-surface-variant dark:text-outline-variant">
            Fresh, healthy, and locally-sourced meals prepared daily in our centralized kitchen.
          </p>
        </div>

        {/* Food Table */}
        <div className="overflow-x-auto hide-scrollbar rounded-2xl border border-border-subtle dark:border-outline-variant shadow-sm bg-white dark:bg-navy-deep transition-colors duration-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-navy-deep text-white text-left">
                <th className="p-5 text-xs font-bold uppercase tracking-wider border-b border-white/10">Day</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider border-b border-white/10">Breakfast (8-10 AM)</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider border-b border-white/10">Lunch (1-3 PM)</th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider border-b border-white/10">Dinner (8-10 PM)</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal, idx) => (
                <tr 
                  key={idx}
                  className={`border-b border-border-subtle dark:border-outline-variant/30 hover:bg-surface-container-low dark:hover:bg-navy-deep/50 transition-colors ${
                    meal.isSpecial ? 'bg-stayflow-teal/5 dark:bg-stayflow-teal/10' : ''
                  }`}
                >
                  <td className={`p-5 font-bold ${meal.isSpecial ? 'text-stayflow-teal text-lg' : 'text-navy-deep dark:text-white'}`}>
                    {meal.day}
                  </td>
                  <td className={`p-5 text-sm ${meal.isSpecial ? 'text-navy-deep dark:text-white font-bold' : 'text-on-surface-variant dark:text-outline-variant'}`}>
                    {meal.breakfast}
                  </td>
                  <td className={`p-5 text-sm ${meal.isSpecial ? 'text-navy-deep dark:text-white font-bold' : 'text-on-surface-variant dark:text-outline-variant'}`}>
                    {meal.lunch}
                  </td>
                  <td className={`p-5 text-sm ${meal.isSpecial ? 'text-navy-deep dark:text-white font-bold' : 'text-on-surface-variant dark:text-outline-variant'}`}>
                    {meal.dinner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info Box */}
        <div className="bg-surface-container-low dark:bg-navy-deep/30 border border-stayflow-teal/20 rounded-2xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="bg-stayflow-teal/10 p-3 rounded-lg flex-shrink-0 text-stayflow-teal">
              <ChefHat size={28} />
            </div>
            <div>
              <h4 className="font-bold text-navy-deep dark:text-white mb-1">StayFlo Smart Food Planning</h4>
              <p className="text-on-surface-variant dark:text-outline-variant text-sm leading-relaxed">
                Enjoy hassle-free meal management. Once onboarded, residents can easily view, select preferences, or skip daily meals directly via the StayFlo Mobile App to help us ensure high quality and minimize food waste.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

