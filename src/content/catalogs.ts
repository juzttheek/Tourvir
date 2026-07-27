export interface TourPackage {
  id: string;
  category: string;
  duration: number;
  price: number;
  image: string;
  alt: string;
  durationMarkup: string;
  categoryLabel: string;
  title: string;
  ratingMarkup: string;
  highlights: string[];
  priceMarkup: string;
  linkMarkup: string;
  routeMap?: { name: string; coordinates: [number, number] }[];
}
export interface Vehicle {
  id: string;
  revealClass: string;
  image: string;
  alt: string;
  badge: string;
  name: string;
  specs: string[];
  priceMarkup: string;
  linkMarkup: string;
}
export const tourPackages = [
  {
    id: 'package-1-cultural-triangle-explorer',
    category: 'cultural',
    duration: 5,
    price: 649,
    image: 'images/packages/cultural_triangle_explorer.webp',
    alt: 'Cultural Triangle Tour',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>5 Days / 4 Nights',
    categoryLabel: 'Cultural',
    title: 'Cultural Triangle Explorer',
    ratingMarkup:
      '\n                  <div class="stars">★★★★★</div>\n                  <span class="package-card__rating-text">(128 reviews)</span>\n                ',
    highlights: ['Sigiriya', 'Dambulla', 'Kandy', 'Polonnaruwa'],
    priceMarkup: '$649 <span>per person</span>',
    linkMarkup: '<a href="/packages/package-1-cultural-triangle-explorer.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Sigiriya', coordinates: [7.9570, 80.7603] },
      { name: 'Polonnaruwa', coordinates: [7.9403, 81.0028] },
      { name: 'Dambulla', coordinates: [7.8592, 80.6485] },
      { name: 'Kandy', coordinates: [7.2906, 80.6337] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
  {
    id: 'package-2-beach-paradise-retreat',
    category: 'beach',
    duration: 7,
    price: 799,
    image: 'images/packages/beach_paradise_retreat.webp',
    alt: 'Beach Paradise Tour',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>7 Days / 6 Nights',
    categoryLabel: 'Beach',
    title: 'Beach Paradise Retreat',
    ratingMarkup:
      '\n                  <div class="stars">★★★★★</div>\n                  <span class="package-card__rating-text">(96 reviews)</span>\n                ',
    highlights: ['Bentota', 'Mirissa', 'Unawatuna', 'Galle'],
    priceMarkup: '$799 <span>per person</span>',
    linkMarkup: '<a href="/packages/package-2-beach-paradise-retreat.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Bentota', coordinates: [6.4200, 79.9967] },
      { name: 'Galle', coordinates: [6.0535, 80.2210] },
      { name: 'Unawatuna', coordinates: [6.0174, 80.2489] },
      { name: 'Mirissa', coordinates: [5.9483, 80.4572] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
  {
    id: 'package-3-wildlife-safari-adventure',
    category: 'wildlife',
    duration: 3,
    price: 399,
    image: 'images/packages/wild_life_safari_adventure.webp',
    alt: 'Wildlife Safari Tour',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>3 Days / 2 Nights',
    categoryLabel: 'Wildlife',
    title: 'Wildlife Safari Adventure',
    ratingMarkup:
      '\n                  <div class="stars">★★★★☆</div>\n                  <span class="package-card__rating-text">(74 reviews)</span>\n                ',
    highlights: ['Yala Park', 'Udawalawe', 'Leopards', 'Elephants'],
    priceMarkup: '$399 <span>per person</span>',
    linkMarkup: '<a href="/packages/package-3-wildlife-safari-adventure.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Udawalawe', coordinates: [6.4357, 80.8872] },
      { name: 'Yala Park', coordinates: [6.3683, 81.5161] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
  {
    id: 'package-4-hill-country-adventure',
    category: 'adventure',
    duration: 4,
    price: 549,
    image: 'images/packages/hill_country_adventure.webp',
    alt: 'Hill Country Adventure',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>4 Days / 3 Nights',
    categoryLabel: 'Adventure',
    title: 'Hill Country Adventure',
    ratingMarkup:
      '\n                  <div class="stars">★★★★★</div>\n                  <span class="package-card__rating-text">(112 reviews)</span>\n                ',
    highlights: ['Ella', 'Nuwara Eliya', 'Train Ride', 'Tea Factory'],
    priceMarkup: '$549 <span>per person</span>',
    linkMarkup: '<a href="/packages/package-4-hill-country-adventure.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Kandy', coordinates: [7.2906, 80.6337] },
      { name: 'Nuwara Eliya', coordinates: [6.9497, 80.7828] },
      { name: 'Ella', coordinates: [6.8667, 81.0466] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
  {
    id: 'package-5-honeymoon-special',
    category: 'honeymoon',
    duration: 6,
    price: 1299,
    image: 'images/packages/honeymoon_special.webp',
    alt: 'Honeymoon Special',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>6 Days / 5 Nights',
    categoryLabel: 'Honeymoon',
    title: 'Honeymoon Special',
    ratingMarkup:
      '\n                  <div class="stars">★★★★★</div>\n                  <span class="package-card__rating-text">(67 reviews)</span>\n                ',
    highlights: ['Couples Spa', 'Sunset Cruise', 'Private Villa', 'Candlelight Dinner'],
    priceMarkup: '$1,299 <span>per couple</span>',
    linkMarkup: '<a href="/packages/package-5-honeymoon-special.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Nuwara Eliya', coordinates: [6.9497, 80.7828] },
      { name: 'Bentota', coordinates: [6.4200, 79.9967] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
  {
    id: 'package-6-ancient-cities-heritage',
    category: 'cultural',
    duration: 8,
    price: 899,
    image: 'images/packages/ancient_cities_and_heritage.webp',
    alt: 'Ancient Cities Tour',
    durationMarkup:
      '<svg style="display:inline-block; vertical-align:text-bottom; margin-right:0.25rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>8 Days / 7 Nights',
    categoryLabel: 'Cultural',
    title: 'Ancient Cities & Heritage',
    ratingMarkup:
      '\n                  <div class="stars">★★★★★</div>\n                  <span class="package-card__rating-text">(89 reviews)</span>\n                ',
    highlights: ['Anuradhapura', 'Polonnaruwa', 'Mihintale', '8 UNESCO Sites'],
    priceMarkup: '$899 <span>per person</span>',
    linkMarkup: '<a href="/packages/package-6-ancient-cities-heritage.html" class="btn btn--primary btn--sm">View Details</a>',
    routeMap: [
      { name: 'Colombo', coordinates: [6.9271, 79.8612] },
      { name: 'Anuradhapura', coordinates: [8.3114, 80.4037] },
      { name: 'Mihintale', coordinates: [8.3512, 80.5097] },
      { name: 'Polonnaruwa', coordinates: [7.9403, 81.0028] },
      { name: 'Colombo', coordinates: [6.9271, 79.8612] }
    ]
  },
] satisfies TourPackage[];
export const vehicles = [
  {
    id: 'vehicle-1-comfortable-sedan',
    revealClass: 'vehicle-card reveal delay-1',
    image: 'images/vehicles/comfortable_sedan.webp',
    alt: 'Comfortable Sedan',
    badge: 'Popular',
    name: 'Comfortable Sedan',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2-3 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 2 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12.01" y1="20" y2="20"></line></svg></span> WiFi Available\n                  ',
    ],
    priceMarkup: '$55 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-2-luxury-sedan',
    revealClass: 'vehicle-card reveal delay-2',
    image: 'images/vehicles/luxury_sedan.webp',
    alt: 'Luxury Sedan',
    badge: 'VIP',
    name: 'Luxury Sedan',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2-3 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Climate Control\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 3 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Premium Interior\n                  ',
    ],
    priceMarkup: '$150 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-3-mini-suv',
    revealClass: 'vehicle-card reveal delay-3',
    image: 'images/vehicles/mini_suv.webp',
    alt: 'Mini SUV',
    badge: 'Compact',
    name: 'Mini SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 3-4 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 2 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" x2="12.01" y1="20" y2="20"></line></svg></span> WiFi Available\n                  ',
    ],
    priceMarkup: '$65 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-4-suv',
    revealClass: 'vehicle-card reveal delay-4',
    image: 'images/vehicles/suv.webp',
    alt: 'SUV',
    badge: 'Adventure',
    name: 'SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 4-5 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 3 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span> Off-Road Ready\n                  ',
    ],
    priceMarkup: '$85 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-5-luxury-suv',
    revealClass: 'vehicle-card reveal delay-1',
    image: 'images/vehicles/luxury_suv.webp',
    alt: 'Luxury SUV',
    badge: 'Premium',
    name: 'Luxury SUV',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 5-6 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Climate Control\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 4 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Premium Interior\n                  ',
    ],
    priceMarkup: '$120 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-6-van',
    revealClass: 'vehicle-card reveal delay-2',
    image: 'images/vehicles/van.webp',
    alt: 'Van',
    badge: 'Family',
    name: 'Van',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 6-8 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 6 Large Bags\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg></span> Entertainment\n                  ',
    ],
    priceMarkup: '$75 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-7-coach-bus',
    revealClass: 'vehicle-card reveal delay-3',
    image: 'images/vehicles/coach_bus.webp',
    alt: 'Coach Bus',
    badge: 'Groups',
    name: 'Coach Bus',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 20-40 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="2" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg></span> Air Conditioned\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> Large Storage\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg></span> PA System\n                  ',
    ],
    priceMarkup: '$200 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
  {
    id: 'vehicle-8-tuk-tuk-city-tour',
    revealClass: 'vehicle-card reveal delay-4',
    image: 'images/vehicles/tuk_tuk.webp',
    alt: 'Tuk-Tuk City Tour',
    badge: 'Fun',
    name: 'Tuk-Tuk City Tour',
    specs: [
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></span> 2 Passengers\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"></path><path d="M17.5 8a2.5 2.5 0 1 1 2 4H2"></path><path d="M9.8 4.4A2 2 0 1 1 11 8H2"></path></svg></span> Open-Air\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg></span> 1 Small Bag\n                  ',
      '\n                    <span class="vehicle-card__spec-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg></span> Photo-Ready\n                  ',
    ],
    priceMarkup: '$25 <span>/day</span>',
    linkMarkup: '<a href="inquiry.html" class="btn btn--primary btn--sm">Reserve</a>',
  },
] satisfies Vehicle[];

function assertCatalog(items: Array<{ id: string; image: string; alt: string }>, name: string) {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id || ids.has(item.id))
      throw new Error(`Duplicate or missing ${name} ID: ${item.id}`);
    if (!item.image.startsWith('images/') || !item.alt)
      throw new Error(`Invalid ${name} media: ${item.id}`);
    ids.add(item.id);
  }
}
assertCatalog(tourPackages, 'package');
assertCatalog(vehicles, 'vehicle');
