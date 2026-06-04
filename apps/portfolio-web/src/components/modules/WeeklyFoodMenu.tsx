'use client';

import { useState } from 'react';
import { ChefHat } from 'lucide-react';

interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

interface WeeklyFoodMenuProps {
  meals?: MealPlan[];
}

export function WeeklyFoodMenu({
  meals = [
    {
      day: 'Mon',
      breakfast: 'Idli, Vada, Sambar',
      lunch: 'Rice, Dal Fry, Potato Roast, Papad',
      dinner: 'Chapati, Paneer Butter Masala, Salad',
    },
    {
      day: 'Tue',
      breakfast: 'Poha, Upma, Chutney',
      lunch: 'Biryani, Raita, Pickle',
      dinner: 'Rice, Chole Curry, Carrot Salad',
    },
    {
      day: 'Wed',
      breakfast: 'Dosa, Sambar, Coconut Chutney',
      lunch: 'Roti, Paneer Tikka Masala, Mixed Veg',
      dinner: 'Pulao, Raita, Cucumber Salad',
    },
    {
      day: 'Thu',
      breakfast: 'Puri, Aloo, Pickle',
      lunch: 'Rice, Rajma, Potato Curry',
      dinner: 'Naan, Butter Chicken, Green Salad',
    },
    {
      day: 'Fri',
      breakfast: 'Dhokla, Green Chutney',
      lunch: 'Rice, Egg Curry, Brinjal Fry',
      dinner: 'Roti, Chole Masala, Lemon Pickle',
    },
    {
      day: 'Sat',
      breakfast: 'Parathe, Pickle, Curd',
      lunch: 'Biryani, Raita, Salad',
      dinner: 'Chapati, Paneer Tikka, Mixed Veg',
    },
    {
      day: 'Sun',
      breakfast: 'Waffles, Honey, Berries',
      lunch: 'Rice, Tandoori Chicken, Naan',
      dinner: 'Dal Makhani, Basmati Rice, Salad',
    },
  ],
}: WeeklyFoodMenuProps) {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday

  const currentMeal = meals[selectedDay];

  return (
    <div className="w-full bg-gray-50 py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Structured Weekly Food Menu
          </h2>
          <p className="text-lg text-gray-600">
            We serve fresh, nutritious meals daily. View this week's menu preview below.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
                selectedDay === index
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-teal-300'
              }`}
            >
              {meal.day}
            </button>
          ))}
        </div>

        {/* Meal Plan */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Breakfast */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-teal-600 mb-4 uppercase">BREAKFAST - 8:00 AM</h3>
            <p className="text-gray-900 font-semibold leading-relaxed">{currentMeal.breakfast}</p>
          </div>

          {/* Lunch */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-teal-600 mb-4 uppercase">LUNCH - 12:30 PM</h3>
            <p className="text-gray-900 font-semibold leading-relaxed">{currentMeal.lunch}</p>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <h3 className="text-sm font-bold text-teal-600 mb-4 uppercase">DINNER - 7:30 PM</h3>
            <p className="text-gray-900 font-semibold leading-relaxed">{currentMeal.dinner}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="bg-teal-100 p-3 rounded-lg flex-shrink-0">
              <ChefHat size={28} className="text-teal-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">StayFlo Food Tech System</h4>
              <p className="text-gray-700 text-sm">
                We minimize food waste to keep your rent affordable. Book/skip meals effortlessly via our tenant app before 6 PM cutoff once you move in!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
