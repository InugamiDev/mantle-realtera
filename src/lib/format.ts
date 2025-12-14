// Vietnamese date formatting utilities

const MONTHS_VI = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

// Format date as "DD/MM/YYYY"
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Format date as "DD Tháng MM, YYYY"
export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = MONTHS_VI[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
}

// Format relative time (e.g., "2 ngày trước", "1 tuần trước")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Hôm nay";
  } else if (diffDays === 1) {
    return "Hôm qua";
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} tuần trước`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} năm trước`;
  }
}

// Format number with Vietnamese locale
export function formatNumber(num: number): string {
  return num.toLocaleString("vi-VN");
}

// Format price (e.g., "45-60 triệu/m²")
export function formatPriceRange(min: number, max: number, unit: string = "triệu/m²"): string {
  return `${formatNumber(min)}-${formatNumber(max)} ${unit}`;
}
