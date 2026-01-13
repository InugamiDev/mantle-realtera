// Researched Vietnamese Real Estate Project Details
// Data sourced from batdongsan.com.vn, rever.vn, VnExpress, and official developer websites

export interface ProjectDetails {
  slug: string;
  name: string;
  developer: string;
  district: string;
  city: string;
  // Pricing
  pricePerSqm: { min: number; max: number }; // million VND/m²
  priceRange: string;
  // Scale
  totalUnits: number;
  totalArea: number; // m² or hectares
  towers: number;
  floors: number;
  // Unit types
  unitSizes: { min: number; max: number }; // m²
  bedrooms: string; // e.g., "1-3BR" or "Studio, 1-4BR"
  // Status
  completionYear: number | null;
  status: "For Sale" | "Completed" | "Under Construction" | "Coming Soon";
  // Features
  amenities: string[];
  highlights: string[];
}

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  // ========== MASTERISE HOMES PROJECTS ==========
  "masteri-west-heights": {
    slug: "masteri-west-heights",
    name: "Masteri West Heights",
    developer: "Masterise Homes",
    district: "Nam Tu Liem",
    city: "Hanoi",
    pricePerSqm: { min: 78, max: 108 },
    priceRange: "78 - 108 million VND/m²",
    totalUnits: 3599,
    totalArea: 21087,
    towers: 4,
    floors: 39,
    unitSizes: { min: 27, max: 150 },
    bedrooms: "Studio, 1-3BR, Duplex",
    completionYear: 2025,
    status: "For Sale",
    amenities: ["Sky Pool", "Gym", "Cinema", "10.2ha Park", "Vincom Mega Mall", "Vinschool", "Vinmec"],
    highlights: ["51 premium amenities", "Singapore-style design", "Located in Vinhomes Smart City"]
  },

  "masteri-thao-dien": {
    slug: "masteri-thao-dien",
    name: "Masteri Thao Dien",
    developer: "Masterise Homes",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 80, max: 90 },
    priceRange: "80 - 90 million VND/m²",
    totalUnits: 3000,
    totalArea: 80000,
    towers: 5,
    floors: 45,
    unitSizes: { min: 45, max: 200 },
    bedrooms: "1-3BR, Duplex, Penthouse",
    completionYear: 2017,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Vincom Thao Dien Mall", "An Phu Metro Station"],
    highlights: ["Metro Line 1 connection", "Prime Thao Dien location", "Title deed available"]
  },

  // ========== VINHOMES PROJECTS ==========
  "vinhomes-central-park": {
    slug: "vinhomes-central-park",
    name: "Vinhomes Central Park",
    developer: "Vingroup",
    district: "Binh Thanh",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 95, max: 120 },
    priceRange: "95 - 120 million VND/m²",
    totalUnits: 10000,
    totalArea: 439000,
    towers: 18,
    floors: 50,
    unitSizes: { min: 48, max: 188 },
    bedrooms: "1-4BR, Officetel",
    completionYear: 2018,
    status: "Completed",
    amenities: ["Landmark 81", "14ha Park", "Swimming Pool", "Gym", "Vincom Center", "Vinschool", "Vinmec"],
    highlights: ["Landmark 81 - Vietnam's tallest building", "Saigon River view", "14ha riverside park"]
  },

  "vinhomes-grand-park": {
    slug: "vinhomes-grand-park",
    name: "Vinhomes Grand Park",
    developer: "Vingroup",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 45, max: 100 },
    priceRange: "45 - 100 million VND/m²",
    totalUnits: 40000,
    totalArea: 2710000,
    towers: 100,
    floors: 35,
    unitSizes: { min: 30, max: 150 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["36ha Park", "Artificial Beach Lake", "VinUni", "Vinschool", "Vinmec", "Vincom Mega Mall"],
    highlights: ["271ha mega township", "36ha Light Park", "Rainbow - The Origami - Glory Heights"]
  },

  "vinhomes-ocean-park": {
    slug: "vinhomes-ocean-park",
    name: "Vinhomes Ocean Park",
    developer: "Vingroup",
    district: "Gia Lam",
    city: "Hanoi",
    pricePerSqm: { min: 29, max: 130 },
    priceRange: "29 - 130 million VND/m²",
    totalUnits: 50000,
    totalArea: 4200000,
    towers: 66,
    floors: 35,
    unitSizes: { min: 28, max: 200 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2022,
    status: "Completed",
    amenities: ["6.1ha Saltwater Lake", "100ha Park", "VinUni", "Vinschool", "Vinmec"],
    highlights: ["Vietnam's largest saltwater lake", "420ha mega township", "Ocean District"]
  },

  "vinhomes-smart-city": {
    slug: "vinhomes-smart-city",
    name: "Vinhomes Smart City",
    developer: "Vingroup",
    district: "Nam Tu Liem",
    city: "Hanoi",
    pricePerSqm: { min: 48, max: 62 },
    priceRange: "48 - 62 million VND/m²",
    totalUnits: 35000,
    totalArea: 2800000,
    towers: 49,
    floors: 35,
    unitSizes: { min: 28, max: 94 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2023,
    status: "Completed",
    amenities: ["Central Park", "Japanese Garden", "Vincom Mega Mall", "Vinschool", "Vinmec", "VinBus"],
    highlights: ["Smart City", "AI & IoT integrated", "Only 14.7% building density"]
  },

  "vinhomes-riverside": {
    slug: "vinhomes-riverside",
    name: "Vinhomes Riverside",
    developer: "Vingroup",
    district: "Long Bien",
    city: "Hanoi",
    pricePerSqm: { min: 80, max: 150 },
    priceRange: "80 - 150 million VND/m²",
    totalUnits: 600,
    totalArea: 1830000,
    towers: 0,
    floors: 4,
    unitSizes: { min: 150, max: 500 },
    bedrooms: "4-6BR (Villas)",
    completionYear: 2012,
    status: "Completed",
    amenities: ["Golf Course", "Lake", "Park", "Vinschool", "Vinmec Hospital", "Vincom Mall"],
    highlights: ["Eco villa community", "Venice green township", "183ha campus"]
  },

  "vinhomes-times-city": {
    slug: "vinhomes-times-city",
    name: "Vinhomes Times City",
    developer: "Vingroup",
    district: "Hai Ba Trung",
    city: "Hanoi",
    pricePerSqm: { min: 70, max: 100 },
    priceRange: "70 - 100 million VND/m²",
    totalUnits: 8000,
    totalArea: 360000,
    towers: 12,
    floors: 40,
    unitSizes: { min: 53, max: 180 },
    bedrooms: "1-4BR",
    completionYear: 2015,
    status: "Completed",
    amenities: ["Vincom Mega Mall", "Vinmec Hospital", "Vinschool", "Park", "Swimming Pool"],
    highlights: ["Premium urban district", "36ha campus", "Central Hanoi location"]
  },

  "vinhomes-golden-river": {
    slug: "vinhomes-golden-river",
    name: "Vinhomes Golden River",
    developer: "Vingroup",
    district: "District 1",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 180, max: 300 },
    priceRange: "180 - 300 million VND/m²",
    totalUnits: 1500,
    totalArea: 65000,
    towers: 4,
    floors: 50,
    unitSizes: { min: 50, max: 250 },
    bedrooms: "1-4BR, Penthouse",
    completionYear: 2018,
    status: "Completed",
    amenities: ["Saigon River View", "Infinity Pool", "Gym", "Riverside Park", "Mall"],
    highlights: ["Prime Ba Son location", "Direct Saigon River view", "Luxury design"]
  },

  "vinhomes-west-point": {
    slug: "vinhomes-west-point",
    name: "Vinhomes West Point",
    developer: "Vingroup",
    district: "Nam Tu Liem",
    city: "Hanoi",
    pricePerSqm: { min: 55, max: 75 },
    priceRange: "55 - 75 million VND/m²",
    totalUnits: 2500,
    totalArea: 55000,
    towers: 3,
    floors: 35,
    unitSizes: { min: 45, max: 130 },
    bedrooms: "1-3BR",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "School", "Mall"],
    highlights: ["Near Thang Long Boulevard", "Modern design", "Affordable price"]
  },

  // ========== PHU MY HUNG PROJECTS ==========
  "midtown": {
    slug: "midtown",
    name: "Midtown Phu My Hung",
    developer: "Phu My Hung",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 85, max: 130 },
    priceRange: "85 - 130 million VND/m²",
    totalUnits: 2150,
    totalArea: 56331,
    towers: 17,
    floors: 27,
    unitSizes: { min: 60, max: 259 },
    bedrooms: "2-4BR, Tophouse",
    completionYear: 2022,
    status: "Completed",
    amenities: ["Sakura Park", "Swimming Pool", "Gym", "45,000m² Nam Vien Park"],
    highlights: ["Vietnam's only cherry blossom park", "Joint venture with 3 Japanese partners", "4 phases: Grande, Symphony, Signature, Peak"]
  },

  "scenic-valley": {
    slug: "scenic-valley",
    name: "Scenic Valley",
    developer: "Phu My Hung",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 65, max: 90 },
    priceRange: "65 - 90 million VND/m²",
    totalUnits: 1200,
    totalArea: 45000,
    towers: 6,
    floors: 18,
    unitSizes: { min: 71, max: 145 },
    bedrooms: "2-3BR",
    completionYear: 2017,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "BBQ", "Kids Playground"],
    highlights: ["Low-rise design", "Phu My Hung township", "Green living environment"]
  },

  // ========== CAPITALAND PROJECTS ==========
  "vista-verde": {
    slug: "vista-verde",
    name: "Vista Verde",
    developer: "CapitaLand",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 75, max: 100 },
    priceRange: "75 - 100 million VND/m²",
    totalUnits: 1152,
    totalArea: 25295,
    towers: 4,
    floors: 34,
    unitSizes: { min: 45, max: 381 },
    bedrooms: "1-3BR, Duplex, Penthouse",
    completionYear: 2017,
    status: "Completed",
    amenities: ["57 amenities", "Resort Pool", "Hanging Gardens of Babylon", "23rd Floor Observatory", "Gym", "Library"],
    highlights: ["Best Apartment Award Vietnam 2015", "Top landscape design", "Reputable Singapore developer"]
  },

  // ========== NOVALAND PROJECTS ==========
  "the-grand-manhattan": {
    slug: "the-grand-manhattan",
    name: "The Grand Manhattan",
    developer: "Novaland",
    district: "District 1",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 150, max: 220 },
    priceRange: "150 - 220 million VND/m²",
    totalUnits: 1000,
    totalArea: 14000,
    towers: 3,
    floors: 39,
    unitSizes: { min: 67, max: 168 },
    bedrooms: "2-3BR, Sky Villas",
    completionYear: 2025,
    status: "Under Construction",
    amenities: ["5-star Hotel", "Swimming Pool", "Gym", "Sky Bar", "Mall"],
    highlights: ["Prime District 1 location", "International 5-star hotel standard", "Co Giang - Co Bac frontage"]
  },

  "sunrise-city": {
    slug: "sunrise-city",
    name: "Sunrise City",
    developer: "Novaland",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 55, max: 80 },
    priceRange: "55 - 80 million VND/m²",
    totalUnits: 2500,
    totalArea: 85000,
    towers: 8,
    floors: 32,
    unitSizes: { min: 56, max: 200 },
    bedrooms: "1-4BR, Penthouse",
    completionYear: 2015,
    status: "Completed",
    amenities: ["Lotte Mart Mall", "Swimming Pool", "Gym", "Park", "School"],
    highlights: ["Mixed-use complex", "Near Phu My Bridge", "Saigon River view"]
  },

  // ========== NAM LONG PROJECTS ==========
  "akari-city": {
    slug: "akari-city",
    name: "Akari City",
    developer: "Nam Long",
    district: "Binh Tan",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 40, max: 55 },
    priceRange: "40 - 55 million VND/m²",
    totalUnits: 4500,
    totalArea: 80000,
    towers: 12,
    floors: 25,
    unitSizes: { min: 56, max: 121 },
    bedrooms: "2-3BR",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["Japanese Park", "Swimming Pool", "Gym", "School", "Mall", "Healthcare"],
    highlights: ["Japanese-style township", "Mid-range price", "Japan joint venture"]
  },

  // ========== HUNG THINH PROJECTS ==========
  "the-ascentia": {
    slug: "the-ascentia",
    name: "The Ascentia",
    developer: "Hung Thinh",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 70, max: 95 },
    priceRange: "70 - 95 million VND/m²",
    totalUnits: 800,
    totalArea: 15000,
    towers: 2,
    floors: 30,
    unitSizes: { min: 53, max: 156 },
    bedrooms: "1-3BR",
    completionYear: 2023,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Sky Garden", "BBQ", "Kids Playground"],
    highlights: ["Near Phu My Hung", "Luxury design", "Full amenities"]
  },

  // ========== INDOCHINA PROJECTS (Da Nang) ==========
  "the-filmore-da-nang": {
    slug: "the-filmore-da-nang",
    name: "The Filmore Da Nang",
    developer: "Indochina Capital",
    district: "Hai Chau",
    city: "Da Nang",
    pricePerSqm: { min: 65, max: 90 },
    priceRange: "65 - 90 million VND/m²",
    totalUnits: 450,
    totalArea: 12000,
    towers: 2,
    floors: 35,
    unitSizes: { min: 50, max: 150 },
    bedrooms: "1-3BR",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["Infinity Pool", "Gym", "Spa", "Sky Bar", "Restaurant"],
    highlights: ["Han River view", "International standard", "Central Da Nang location"]
  },

  "azura-da-nang": {
    slug: "azura-da-nang",
    name: "Azura Da Nang",
    developer: "Indochina Capital",
    district: "Hai Chau",
    city: "Da Nang",
    pricePerSqm: { min: 55, max: 75 },
    priceRange: "55 - 75 million VND/m²",
    totalUnits: 350,
    totalArea: 8000,
    towers: 1,
    floors: 30,
    unitSizes: { min: 45, max: 120 },
    bedrooms: "1-3BR",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Restaurant", "Cafe"],
    highlights: ["Han River view", "Central location", "Indochina quality"]
  },

  // ========== OTHER MASTERISE PROJECTS ==========
  "lumiere-boulevard": {
    slug: "lumiere-boulevard",
    name: "Lumiere Boulevard",
    developer: "Masterise Homes",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 60, max: 100 },
    priceRange: "60 - 100 million VND/m²",
    totalUnits: 3000,
    totalArea: 50000,
    towers: 6,
    floors: 35,
    unitSizes: { min: 30, max: 120 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["Infinity Pool", "Gym", "Park", "Mall", "School"],
    highlights: ["Located in Vinhomes Grand Park", "French light-inspired design", "European style"]
  },

  // ========== ECO GREEN / XUAN MAI PROJECTS ==========
  "eco-green-saigon": {
    slug: "eco-green-saigon",
    name: "Eco Green Saigon",
    developer: "Xuan Mai Saigon",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 55, max: 70 },
    priceRange: "55 - 70 million VND/m²",
    totalUnits: 4200,
    totalArea: 143600,
    towers: 8,
    floors: 35,
    unitSizes: { min: 52, max: 155 },
    bedrooms: "2-3BR, Officetel",
    completionYear: 2023,
    status: "Completed",
    amenities: ["69-floor Grand Hyatt Tower", "5-floor AEON Mall", "Mini Golf", "25ha Park", "500m² Pool", "National Standard School"],
    highlights: ["14.36ha total area", "Only 24% building density", "Title deed available", "Adjacent 22ha Huong Tram Park"]
  },

  // ========== GRAND MARINA / MASTERISE PROJECTS ==========
  "grand-marina-saigon": {
    slug: "grand-marina-saigon",
    name: "Grand Marina Saigon",
    developer: "Masterise Homes",
    district: "District 1",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 350, max: 500 },
    priceRange: "350 - 500 million VND/m²",
    totalUnits: 1200,
    totalArea: 65000,
    towers: 8,
    floors: 45,
    unitSizes: { min: 57, max: 265 },
    bedrooms: "1-3BR, Sky Villa",
    completionYear: 2025,
    status: "For Sale",
    amenities: ["JW Marriott managed", "Marriott managed", "Infinity Pool", "Gym", "Spa", "5-star Restaurant"],
    highlights: ["Saigon's most expensive apartments", "Prime Ba Son location", "Saigon River view", "International 5-star hotel standard"]
  },

  // ========== NOVALAND PROJECTS - THE SUN AVENUE ==========
  "the-sun-avenue": {
    slug: "the-sun-avenue",
    name: "The Sun Avenue",
    developer: "Novaland",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 75, max: 85 },
    priceRange: "75 - 85 million VND/m²",
    totalUnits: 3000,
    totalArea: 60000,
    towers: 8,
    floors: 33,
    unitSizes: { min: 31, max: 109 },
    bedrooms: "Officetel, 1-3BR",
    completionYear: 2018,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Mall", "Shophouse"],
    highlights: ["Mai Chi Tho frontage", "Title deed available (5/2025)", "8 towers spanning 500m"]
  },

  // ========== SUNSHINE GROUP PROJECTS ==========
  "sunshine-city-saigon": {
    slug: "sunshine-city-saigon",
    name: "Sunshine Sky City",
    developer: "Sunshine Group",
    district: "District 7",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 60, max: 70 },
    priceRange: "60 - 70 million VND/m²",
    totalUnits: 3455,
    totalArea: 90000,
    towers: 9,
    floors: 38,
    unitSizes: { min: 76, max: 234 },
    bedrooms: "2-3BR, Sky Villa",
    completionYear: 2025,
    status: "Under Construction",
    amenities: ["Gold-plated Interior", "Swimming Pool", "Gym", "Spa", "Mall"],
    highlights: ["Saigon's first 4.0 apartments", "AI smart interior", "9 blocks from 26-38 floors"]
  },

  "sunshine-city-hanoi": {
    slug: "sunshine-city-hanoi",
    name: "Sunshine City Hanoi",
    developer: "Sunshine Group",
    district: "Bac Tu Liem",
    city: "Hanoi",
    pricePerSqm: { min: 75, max: 85 },
    priceRange: "75 - 85 million VND/m²",
    totalUnits: 1791,
    totalArea: 50000,
    towers: 6,
    floors: 35,
    unitSizes: { min: 58, max: 192 },
    bedrooms: "1-5BR, Duplex",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Premium Kohler, Hafele, Daikin Interior", "4-season Pool", "Gym", "Spa", "Supermarket", "Restaurant"],
    highlights: ["Ciputra Township", "Red River view", "VND 5,000 billion investment"]
  },

  // ========== MIK GROUP PROJECTS ==========
  "imperia-garden": {
    slug: "imperia-garden",
    name: "Imperia Garden",
    developer: "MIK Group",
    district: "Thanh Xuan",
    city: "Hanoi",
    pricePerSqm: { min: 85, max: 98 },
    priceRange: "85 - 98 million VND/m²",
    totalUnits: 1652,
    totalArea: 42000,
    towers: 4,
    floors: 35,
    unitSizes: { min: 60, max: 154 },
    bedrooms: "2-4BR",
    completionYear: 2018,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "School", "Mall"],
    highlights: ["4.2ha total area", "Central Thanh Xuan location", "Semi-detached villas + apartments"]
  },

  "imperia-smart-city": {
    slug: "imperia-smart-city",
    name: "Imperia Smart City",
    developer: "MIK Group",
    district: "Nam Tu Liem",
    city: "Hanoi",
    pricePerSqm: { min: 50, max: 65 },
    priceRange: "50 - 65 million VND/m²",
    totalUnits: 2500,
    totalArea: 28000,
    towers: 3,
    floors: 35,
    unitSizes: { min: 30, max: 100 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2023,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Vincom Mall"],
    highlights: ["Located in Vinhomes Smart City", "Smart design", "Affordable price"]
  },

  // ========== ECOPARK PROJECTS ==========
  "ecopark-rung-co": {
    slug: "ecopark-rung-co",
    name: "Rung Co Ecopark",
    developer: "Ecopark",
    district: "Van Giang",
    city: "Hung Yen",
    pricePerSqm: { min: 40, max: 45 },
    priceRange: "40 - 45 million VND/m²",
    totalUnits: 2000,
    totalArea: 500000,
    towers: 20,
    floors: 25,
    unitSizes: { min: 45, max: 130 },
    bedrooms: "1-3BR",
    completionYear: 2016,
    status: "Completed",
    amenities: ["110ha Park", "Lake", "Chadwick International School", "Hospital", "Mall"],
    highlights: ["Eco township", "125 trees per person ratio", "20 minutes from Hanoi"]
  },

  "ecopark-west-bay": {
    slug: "ecopark-west-bay",
    name: "West Bay Ecopark",
    developer: "Ecopark",
    district: "Van Giang",
    city: "Hung Yen",
    pricePerSqm: { min: 45, max: 50 },
    priceRange: "45 - 50 million VND/m²",
    totalUnits: 1500,
    totalArea: 80000,
    towers: 8,
    floors: 30,
    unitSizes: { min: 29, max: 90 },
    bedrooms: "Studio, 1-3BR",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Mall", "Healthcare"],
    highlights: ["Ecopark's most affordable", "Lake view", "Modern design"]
  },

  "ecopark-aqua-bay": {
    slug: "ecopark-aqua-bay",
    name: "Aqua Bay Ecopark",
    developer: "Ecopark",
    district: "Van Giang",
    city: "Hung Yen",
    pricePerSqm: { min: 50, max: 70 },
    priceRange: "50 - 70 million VND/m²",
    totalUnits: 1200,
    totalArea: 60000,
    towers: 6,
    floors: 32,
    unitSizes: { min: 35, max: 120 },
    bedrooms: "1-3BR",
    completionYear: 2022,
    status: "Completed",
    amenities: ["4-season Pool", "Gym", "10,000m² Sky Park", "Cinema", "Restaurant"],
    highlights: ["8 sky parks", "Resort amenities", "Lake view"]
  },

  // ========== NOVAWORLD PROJECTS ==========
  "novaworld-ho-tram": {
    slug: "novaworld-ho-tram",
    name: "NovaWorld Ho Tram",
    developer: "Novaland",
    district: "Xuyen Moc",
    city: "Ba Ria - Vung Tau",
    pricePerSqm: { min: 50, max: 80 },
    priceRange: "50 - 80 million VND/m²",
    totalUnits: 5000,
    totalArea: 10000000,
    towers: 0,
    floors: 3,
    unitSizes: { min: 105, max: 300 },
    bedrooms: "Shophouse, 2-4BR Villas",
    completionYear: 2025,
    status: "For Sale",
    amenities: ["Private Beach", "Golf Course", "Water Park", "5-star Resort", "Mall"],
    highlights: ["10 phases", "50-year ownership", "Sakura Park", "The Tropicana"]
  },

  "novaworld-phan-thiet": {
    slug: "novaworld-phan-thiet",
    name: "NovaWorld Phan Thiet",
    developer: "Novaland",
    district: "Phan Thiet",
    city: "Binh Thuan",
    pricePerSqm: { min: 32, max: 52 },
    priceRange: "32 - 52 million VND/m²",
    totalUnits: 10000,
    totalArea: 10000000,
    towers: 0,
    floors: 3,
    unitSizes: { min: 160, max: 360 },
    bedrooms: "3-5BR Villas",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["PGA Golf Course", "Theme Park", "Beach", "Resort", "Mall"],
    highlights: ["1000ha total area", "PGA Garden Golf", "The Kingdom", "Japanese-style Mizumi Villas", "50-year ownership"]
  },

  // ========== CAPITALAND PROJECTS ==========
  "d-edge-thao-dien": {
    slug: "d-edge-thao-dien",
    name: "D'Edge Thao Dien",
    developer: "CapitaLand",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 115, max: 190 },
    priceRange: "115 - 190 million VND/m²",
    totalUnits: 273,
    totalArea: 12000,
    towers: 2,
    floors: 22,
    unitSizes: { min: 63, max: 256 },
    bedrooms: "1-4BR",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Glass-bottom Sky Pool", "Gym", "Spa", "6,300m² Park", "3-sided Saigon River View"],
    highlights: ["Ultra-luxury apartments", "Thao Dien district", "CapitaLand Singapore developed", "3-sided Saigon River view"]
  },

  // ========== PHAT DAT PROJECTS ==========
  "the-everrich-infinity": {
    slug: "the-everrich-infinity",
    name: "The EverRich Infinity",
    developer: "Phat Dat",
    district: "District 5",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 73, max: 93 },
    priceRange: "73 - 93 million VND/m²",
    totalUnits: 761,
    totalArea: 8048,
    towers: 1,
    floors: 40,
    unitSizes: { min: 35, max: 150 },
    bedrooms: "1-3BR, Officetel, Duplex, Penthouse",
    completionYear: 2019,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Sky Garden", "Mall", "Office"],
    highlights: ["Freehold ownership", "Title deed available", "District 1 gateway location", "Mixed apartment + office complex"]
  },

  // ========== DAT XANH PROJECTS ==========
  "gem-riverside": {
    slug: "gem-riverside",
    name: "Gem Riverside",
    developer: "Dat Xanh",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 90, max: 120 },
    priceRange: "90 - 120 million VND/m²",
    totalUnits: 3175,
    totalArea: 80000,
    towers: 12,
    floors: 34,
    unitSizes: { min: 71, max: 201 },
    bedrooms: "2-3BR, DuplexVilla",
    completionYear: 2027,
    status: "Coming Soon",
    amenities: ["Swimming Pool", "Gym", "Park", "Mall", "School"],
    highlights: ["Nam Rach Chiec area", "12 blocks 32-34 floors", "Relaunched 10/2024"]
  },

  // ========== SUN GROUP PROJECTS ==========
  "sun-grand-city-ancora": {
    slug: "sun-grand-city-ancora",
    name: "Sun Grand City Ancora",
    developer: "Sun Group",
    district: "Hai Ba Trung",
    city: "Hanoi",
    pricePerSqm: { min: 41, max: 58 },
    priceRange: "41 - 58 million VND/m²",
    totalUnits: 710,
    totalArea: 25000,
    towers: 3,
    floors: 35,
    unitSizes: { min: 72, max: 165 },
    bedrooms: "2-4BR, Penthouse",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Mall", "Swimming Pool", "Gym", "Savills managed"],
    highlights: ["3 Luong Yen Street", "Sun Group developed", "Savills property management"]
  },

  "sun-grand-city-69-thuy-khue": {
    slug: "sun-grand-city-69-thuy-khue",
    name: "Sun Grand City 69 Thuy Khue",
    developer: "Sun Group",
    district: "Tay Ho",
    city: "Hanoi",
    pricePerSqm: { min: 85, max: 120 },
    priceRange: "85 - 120 million VND/m²",
    totalUnits: 800,
    totalArea: 18000,
    towers: 2,
    floors: 35,
    unitSizes: { min: 60, max: 180 },
    bedrooms: "2-4BR, Penthouse",
    completionYear: 2021,
    status: "Completed",
    amenities: ["West Lake View", "Infinity Pool", "Gym", "Mall", "Park"],
    highlights: ["Thuy Khue frontage", "West Lake view", "Prime Tay Ho location"]
  },

  // ========== VIDC PROJECTS ==========
  "park-city-hanoi": {
    slug: "park-city-hanoi",
    name: "Park City Hanoi",
    developer: "VIDC",
    district: "Ha Dong",
    city: "Hanoi",
    pricePerSqm: { min: 90, max: 150 },
    priceRange: "90 - 150 million VND/m²",
    totalUnits: 3000,
    totalArea: 770000,
    towers: 5,
    floors: 25,
    unitSizes: { min: 60, max: 360 },
    bedrooms: "2-4BR, Villas, Townhouses",
    completionYear: 2023,
    status: "Completed",
    amenities: ["Club House", "Mini Golf", "International School", "The Village Mall", "Park"],
    highlights: ["77ha total area", "15 sub-zones named after 15 flowers", "Model urban township"]
  },

  // ========== KEPPEL LAND PROJECTS ==========
  "celesta-rise": {
    slug: "celesta-rise",
    name: "Celesta Rise",
    developer: "Keppel Land & Phu Long",
    district: "Nha Be",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 45, max: 60 },
    priceRange: "45 - 60 million VND/m²",
    totalUnits: 923,
    totalArea: 27800,
    towers: 5,
    floors: 20,
    unitSizes: { min: 50, max: 105 },
    bedrooms: "1-3BR",
    completionYear: 2024,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "BBQ", "Kids Playground"],
    highlights: ["Nguyen Huu Tho frontage", "Keppel Land Singapore", "Only 25% building density"]
  },

  // ========== FPT PROJECTS ==========
  "fpt-city-da-nang": {
    slug: "fpt-city-da-nang",
    name: "FPT City Da Nang",
    developer: "FPT Da Nang",
    district: "Ngu Hanh Son",
    city: "Da Nang",
    pricePerSqm: { min: 32, max: 45 },
    priceRange: "32 - 45 million VND/m²",
    totalUnits: 5000,
    totalArea: 1816000,
    towers: 10,
    floors: 25,
    unitSizes: { min: 45, max: 495 },
    bedrooms: "2-3BR, Villas, Townhouses",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["FPT School", "Green Park", "Landscape Lake", "Mall", "Healthcare"],
    highlights: ["181ha smart township", "SOM (USA) design", "Near Co Co River", "FPT Plaza 1-4"]
  },

  // ========== HUNG THINH PROJECTS ==========
  "lavita-charm": {
    slug: "lavita-charm",
    name: "Lavita Charm",
    developer: "Hung Thinh",
    district: "Thu Duc",
    city: "Ho Chi Minh",
    pricePerSqm: { min: 40, max: 55 },
    priceRange: "40 - 55 million VND/m²",
    totalUnits: 1800,
    totalArea: 35000,
    towers: 4,
    floors: 32,
    unitSizes: { min: 50, max: 100 },
    bedrooms: "1-3BR",
    completionYear: 2023,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Mall", "School"],
    highlights: ["Next to Binh Thai Metro Station", "Saigon River view", "Mid-range price"]
  },

  "opal-boulevard": {
    slug: "opal-boulevard",
    name: "Opal Boulevard",
    developer: "Hung Thinh",
    district: "Di An",
    city: "Binh Duong",
    pricePerSqm: { min: 35, max: 45 },
    priceRange: "35 - 45 million VND/m²",
    totalUnits: 2000,
    totalArea: 40000,
    towers: 6,
    floors: 28,
    unitSizes: { min: 53, max: 90 },
    bedrooms: "2-3BR",
    completionYear: 2022,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "Mall", "School"],
    highlights: ["Pham Van Dong Boulevard frontage", "5,000m² lake view", "Affordable price"]
  },

  // ========== VINPEARL PROJECTS ==========
  "vinpearl-condotel-riverfront": {
    slug: "vinpearl-condotel-riverfront",
    name: "VinPearl Condotel Riverfront",
    developer: "Vingroup",
    district: "Hai Chau",
    city: "Da Nang",
    pricePerSqm: { min: 60, max: 90 },
    priceRange: "60 - 90 million VND/m²",
    totalUnits: 800,
    totalArea: 20000,
    towers: 2,
    floors: 35,
    unitSizes: { min: 45, max: 120 },
    bedrooms: "1-3BR, Condotel",
    completionYear: 2020,
    status: "Completed",
    amenities: ["Vinpearl managed", "Swimming Pool", "Gym", "Spa", "Restaurant"],
    highlights: ["Han River view", "Vinpearl property management", "Tourism rental"]
  },

  "vinpearl-nha-trang": {
    slug: "vinpearl-nha-trang",
    name: "VinPearl Nha Trang",
    developer: "Vingroup",
    district: "Nha Trang",
    city: "Khanh Hoa",
    pricePerSqm: { min: 80, max: 150 },
    priceRange: "80 - 150 million VND/m²",
    totalUnits: 1500,
    totalArea: 800000,
    towers: 0,
    floors: 5,
    unitSizes: { min: 100, max: 500 },
    bedrooms: "2-5BR Villas, Condotel",
    completionYear: 2018,
    status: "Completed",
    amenities: ["Private Beach", "Amusement Park", "Golf Course", "Spa", "5-star Restaurant"],
    highlights: ["Hon Tre Island", "Resort & Villas", "Adjacent Vinpearl Land"]
  },

  // ========== HINODE PROJECTS ==========
  "hinode-city": {
    slug: "hinode-city",
    name: "Hinode City",
    developer: "WHA",
    district: "Hai Ba Trung",
    city: "Hanoi",
    pricePerSqm: { min: 50, max: 70 },
    priceRange: "50 - 70 million VND/m²",
    totalUnits: 1100,
    totalArea: 25000,
    towers: 3,
    floors: 35,
    unitSizes: { min: 60, max: 150 },
    bedrooms: "2-4BR",
    completionYear: 2021,
    status: "Completed",
    amenities: ["AEON Mall", "Swimming Pool", "Gym", "Park", "School"],
    highlights: ["201 Minh Khai Street", "Japan joint venture", "Adjacent AEON Mall"]
  },

  // ========== BINH DUONG PROJECTS ==========
  "the-habitat-binh-duong": {
    slug: "the-habitat-binh-duong",
    name: "The Habitat Binh Duong",
    developer: "VSIP & CapitaLand",
    district: "Thuan An",
    city: "Binh Duong",
    pricePerSqm: { min: 45, max: 60 },
    priceRange: "45 - 60 million VND/m²",
    totalUnits: 700,
    totalArea: 25000,
    towers: 4,
    floors: 24,
    unitSizes: { min: 55, max: 110 },
    bedrooms: "1-3BR",
    completionYear: 2022,
    status: "Completed",
    amenities: ["Swimming Pool", "Gym", "Park", "AEON Mall", "VSIP Township"],
    highlights: ["VSIP Township", "CapitaLand developed", "Next to AEON Mall"]
  },

  "binh-duong-new-city": {
    slug: "binh-duong-new-city",
    name: "Binh Duong New City",
    developer: "Becamex IDC",
    district: "Binh Duong New City",
    city: "Binh Duong",
    pricePerSqm: { min: 25, max: 40 },
    priceRange: "25 - 40 million VND/m²",
    totalUnits: 5000,
    totalArea: 10000000,
    towers: 20,
    floors: 30,
    unitSizes: { min: 45, max: 120 },
    bedrooms: "1-3BR, Townhouses",
    completionYear: 2024,
    status: "For Sale",
    amenities: ["Administrative Center", "Vietnam-Germany University", "Mall", "Park"],
    highlights: ["1000ha township", "Binh Duong New City", "Becamex developed"]
  },
};

// Helper function to get project details by slug
export function getProjectDetails(slug: string): ProjectDetails | null {
  return PROJECT_DETAILS[slug] || null;
}

// Helper function to get price range
export function getProjectPriceRange(slug: string): string {
  const details = PROJECT_DETAILS[slug];
  if (details) {
    return details.priceRange;
  }
  return "";
}
