/**
 * Calculate the number of days between two dates
 * @param startDate - Start date (ISO string or Date)
 * @param endDate - End date (ISO string or Date)
 * @returns Number of days (rounded up)
 * @throws Error if start date is >= end date
 */
export function calculateDays(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format');
  }

  if (start >= end) {
    throw new Error('Start date must be before end date');
  }

  // Calculate difference in milliseconds and convert to days
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return Math.ceil(diffInDays);
}

/**
 * Calculate total price for a rental period
 * @param pricePerDay - Price per day
 * @param startDate - Start date (ISO string or Date)
 * @param endDate - End date (ISO string or Date)
 * @returns Total price for the rental period
 */
export function calculateTotalPrice(
  pricePerDay: number,
  startDate: string | Date,
  endDate: string | Date
): number {
  if (pricePerDay <= 0) {
    throw new Error('Price per day must be positive');
  }

  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
}