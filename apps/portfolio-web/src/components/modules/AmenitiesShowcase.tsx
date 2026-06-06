'use client';

interface AmenityItem {
  name: string;
  icon: string;
}

interface AmenitiesShowcaseProps {
  amenities?: AmenityItem[];
}

export function AmenitiesShowcase({
  amenities = [
    { name: '1 Gbps WiFi', icon: 'wifi' },
    { name: 'Air Conditioned', icon: 'ac_unit' },
    { name: 'Daily Cleaning', icon: 'cleaning_services' },
    { name: 'In-house Laundry', icon: 'local_laundry_service' },
  ],
}: AmenitiesShowcaseProps) {
  return (
    <div className="w-full bg-surface dark:bg-navy-deep py-12 md:py-16 border-b border-border-subtle dark:border-outline-variant transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 text-left space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-deep dark:text-white">
            World-Class Amenities
          </h2>
        </div>

        {/* Horizontal scroll list on mobile, grid on larger screens */}
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-4 md:gap-6 pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {amenities.map((item, index) => (
            <div
              key={index}
              className="min-w-[160px] md:min-w-0 flex-shrink-0 snap-start p-6 md:p-8 bg-white dark:bg-navy-deep rounded-2xl border border-border-subtle dark:border-outline-variant/60 flex flex-col items-center text-center gap-4 hover:border-stayflow-teal dark:hover:border-stayflow-teal hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <span 
                className="material-symbols-outlined text-primary dark:text-primary-fixed text-4xl md:text-5xl group-hover:scale-110 group-hover:text-stayflow-teal transition-all duration-300"
              >
                {item.icon}
              </span>
              <span className="text-sm md:text-base font-bold text-navy-deep dark:text-white group-hover:text-stayflow-teal transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

