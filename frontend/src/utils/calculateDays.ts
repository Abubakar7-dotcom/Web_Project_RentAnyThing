export function calculateDays(startDate: Date | string, endDate: Date | string): number {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (start >= end) {
    throw new Error('Start date must be before end date');
  }
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

export function calculateTotalPrice(pricePerDay: number, startDate: Date | string, endDate: Date | string): number {
  const days = calculateDays(startDate, endDate);
  return pricePerDay * days;
}
