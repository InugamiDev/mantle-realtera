// Area pricing data for Vietnamese districts
// Prices are in VND per m²

export interface AreaPricing {
  district: string;
  city: string;
  avgPricePerSqm: number; // VND/m²
  avgRentPerSqm: number; // VND/m²/month
  priceToRentRatio: number;
  trend: "up" | "stable" | "down";
  yoyChange: number; // Year-over-year change in %
}

export const areaPricingData: AreaPricing[] = [
  // Hà Nội
  { district: "Ba Đình", city: "Hà Nội", avgPricePerSqm: 180_000_000, avgRentPerSqm: 450_000, priceToRentRatio: 33.3, trend: "up", yoyChange: 12 },
  { district: "Hoàn Kiếm", city: "Hà Nội", avgPricePerSqm: 250_000_000, avgRentPerSqm: 600_000, priceToRentRatio: 34.7, trend: "stable", yoyChange: 5 },
  { district: "Đống Đa", city: "Hà Nội", avgPricePerSqm: 140_000_000, avgRentPerSqm: 380_000, priceToRentRatio: 30.7, trend: "up", yoyChange: 8 },
  { district: "Hai Bà Trưng", city: "Hà Nội", avgPricePerSqm: 130_000_000, avgRentPerSqm: 350_000, priceToRentRatio: 30.9, trend: "up", yoyChange: 10 },
  { district: "Cầu Giấy", city: "Hà Nội", avgPricePerSqm: 120_000_000, avgRentPerSqm: 350_000, priceToRentRatio: 28.6, trend: "up", yoyChange: 15 },
  { district: "Thanh Xuân", city: "Hà Nội", avgPricePerSqm: 90_000_000, avgRentPerSqm: 280_000, priceToRentRatio: 26.8, trend: "up", yoyChange: 12 },
  { district: "Hoàng Mai", city: "Hà Nội", avgPricePerSqm: 70_000_000, avgRentPerSqm: 220_000, priceToRentRatio: 26.5, trend: "up", yoyChange: 18 },
  { district: "Long Biên", city: "Hà Nội", avgPricePerSqm: 65_000_000, avgRentPerSqm: 200_000, priceToRentRatio: 27.1, trend: "up", yoyChange: 14 },
  { district: "Nam Từ Liêm", city: "Hà Nội", avgPricePerSqm: 85_000_000, avgRentPerSqm: 280_000, priceToRentRatio: 25.3, trend: "up", yoyChange: 20 },
  { district: "Tây Hồ", city: "Hà Nội", avgPricePerSqm: 160_000_000, avgRentPerSqm: 500_000, priceToRentRatio: 26.7, trend: "stable", yoyChange: 6 },
  { district: "Gia Lâm", city: "Hà Nội", avgPricePerSqm: 50_000_000, avgRentPerSqm: 150_000, priceToRentRatio: 27.8, trend: "up", yoyChange: 22 },

  // TP. Hồ Chí Minh
  { district: "Quận 1", city: "TP. Hồ Chí Minh", avgPricePerSqm: 300_000_000, avgRentPerSqm: 800_000, priceToRentRatio: 31.3, trend: "stable", yoyChange: 3 },
  { district: "Quận 2", city: "TP. Hồ Chí Minh", avgPricePerSqm: 150_000_000, avgRentPerSqm: 450_000, priceToRentRatio: 27.8, trend: "up", yoyChange: 8 },
  { district: "Quận 3", city: "TP. Hồ Chí Minh", avgPricePerSqm: 180_000_000, avgRentPerSqm: 500_000, priceToRentRatio: 30.0, trend: "stable", yoyChange: 5 },
  { district: "Quận 4", city: "TP. Hồ Chí Minh", avgPricePerSqm: 100_000_000, avgRentPerSqm: 320_000, priceToRentRatio: 26.0, trend: "up", yoyChange: 10 },
  { district: "Quận 5", city: "TP. Hồ Chí Minh", avgPricePerSqm: 120_000_000, avgRentPerSqm: 350_000, priceToRentRatio: 28.6, trend: "stable", yoyChange: 4 },
  { district: "Quận 7", city: "TP. Hồ Chí Minh", avgPricePerSqm: 110_000_000, avgRentPerSqm: 380_000, priceToRentRatio: 24.1, trend: "up", yoyChange: 12 },
  { district: "Quận 9", city: "TP. Hồ Chí Minh", avgPricePerSqm: 60_000_000, avgRentPerSqm: 180_000, priceToRentRatio: 27.8, trend: "up", yoyChange: 25 },
  { district: "Bình Thạnh", city: "TP. Hồ Chí Minh", avgPricePerSqm: 120_000_000, avgRentPerSqm: 380_000, priceToRentRatio: 26.3, trend: "up", yoyChange: 9 },
  { district: "Thủ Đức", city: "TP. Hồ Chí Minh", avgPricePerSqm: 80_000_000, avgRentPerSqm: 250_000, priceToRentRatio: 26.7, trend: "up", yoyChange: 18 },
  { district: "Gò Vấp", city: "TP. Hồ Chí Minh", avgPricePerSqm: 70_000_000, avgRentPerSqm: 220_000, priceToRentRatio: 26.5, trend: "up", yoyChange: 14 },
  { district: "Tân Bình", city: "TP. Hồ Chí Minh", avgPricePerSqm: 90_000_000, avgRentPerSqm: 300_000, priceToRentRatio: 25.0, trend: "up", yoyChange: 11 },
  { district: "Phú Nhuận", city: "TP. Hồ Chí Minh", avgPricePerSqm: 130_000_000, avgRentPerSqm: 400_000, priceToRentRatio: 27.1, trend: "stable", yoyChange: 6 },

  // Đà Nẵng
  { district: "Hải Châu", city: "Đà Nẵng", avgPricePerSqm: 80_000_000, avgRentPerSqm: 250_000, priceToRentRatio: 26.7, trend: "down", yoyChange: -5 },
  { district: "Sơn Trà", city: "Đà Nẵng", avgPricePerSqm: 70_000_000, avgRentPerSqm: 220_000, priceToRentRatio: 26.5, trend: "stable", yoyChange: 2 },
  { district: "Ngũ Hành Sơn", city: "Đà Nẵng", avgPricePerSqm: 60_000_000, avgRentPerSqm: 200_000, priceToRentRatio: 25.0, trend: "down", yoyChange: -8 },

  // Bình Dương
  { district: "Thủ Dầu Một", city: "Bình Dương", avgPricePerSqm: 45_000_000, avgRentPerSqm: 150_000, priceToRentRatio: 25.0, trend: "up", yoyChange: 15 },
  { district: "Dĩ An", city: "Bình Dương", avgPricePerSqm: 35_000_000, avgRentPerSqm: 120_000, priceToRentRatio: 24.3, trend: "up", yoyChange: 20 },
  { district: "Thuận An", city: "Bình Dương", avgPricePerSqm: 38_000_000, avgRentPerSqm: 130_000, priceToRentRatio: 24.4, trend: "up", yoyChange: 18 },

  // Đồng Nai
  { district: "Biên Hòa", city: "Đồng Nai", avgPricePerSqm: 40_000_000, avgRentPerSqm: 130_000, priceToRentRatio: 25.6, trend: "up", yoyChange: 16 },
  { district: "Long Thành", city: "Đồng Nai", avgPricePerSqm: 30_000_000, avgRentPerSqm: 100_000, priceToRentRatio: 25.0, trend: "up", yoyChange: 30 },
];

export function getAreaPricingByCity(city: string): AreaPricing[] {
  return areaPricingData.filter((a) => a.city === city);
}

export function getAreaPricingByDistrict(district: string): AreaPricing | undefined {
  return areaPricingData.find((a) => a.district === district);
}

export function getAllCities(): string[] {
  return [...new Set(areaPricingData.map((a) => a.city))];
}

export function getAllDistrictsWithPricing(): string[] {
  return areaPricingData.map((a) => a.district);
}

// Get average for a city
export function getCityAverage(city: string): { avgPrice: number; avgRent: number } | null {
  const cityData = getAreaPricingByCity(city);
  if (cityData.length === 0) return null;

  const avgPrice = cityData.reduce((sum, d) => sum + d.avgPricePerSqm, 0) / cityData.length;
  const avgRent = cityData.reduce((sum, d) => sum + d.avgRentPerSqm, 0) / cityData.length;

  return { avgPrice, avgRent };
}
