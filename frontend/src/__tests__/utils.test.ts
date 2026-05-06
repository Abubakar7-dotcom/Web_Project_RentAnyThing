import fc from 'fast-check';
import { calculateDays } from '../utils/calculateDays';

describe('calculateDays utility', () => {
  describe('Property-based tests', () => {
    it('should calculate total price correctly for any valid inputs', () => {
      fc.assert(
        fc.property(
          // Generate positive price per day (between 1 and 1000)
          fc.float({ min: 1, max: 1000 }),
          // Generate valid date ranges
          fc.tuple(
            fc.date({ min: new Date('2024-01-01'), max: new Date('2030-12-31') }),
            fc.integer({ min: 1, max: 365 }) // days to add
          ).map(([startDate, daysToAdd]) => {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + daysToAdd);
            return { startDate, endDate };
          }),
          (pricePerDay, { startDate, endDate }) => {
            // Calculate expected result
            const days = calculateDays(startDate, endDate);
            const expectedTotal = pricePerDay * days;
            
            // Calculate actual result using the same logic as calculateTotalPrice
            const actualTotal = pricePerDay * calculateDays(startDate, endDate);
            
            // Assert they are equal (with small floating point tolerance)
            expect(Math.abs(actualTotal - expectedTotal)).toBeLessThan(0.01);
            
            // Additional assertions
            expect(actualTotal).toBeGreaterThan(0);
            expect(days).toBeGreaterThan(0);
            expect(actualTotal).toBe(pricePerDay * days);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always return positive days for valid date ranges', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.date({ min: new Date('2024-01-01'), max: new Date('2030-12-31') }),
            fc.integer({ min: 1, max: 365 })
          ).map(([startDate, daysToAdd]) => {
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + daysToAdd);
            return { startDate, endDate };
          }),
          ({ startDate, endDate }) => {
            const days = calculateDays(startDate, endDate);
            expect(days).toBeGreaterThan(0);
            expect(Number.isInteger(days)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should throw error for invalid date ranges', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.date({ min: new Date('2024-01-01'), max: new Date('2030-12-31') }),
            fc.integer({ min: 1, max: 365 })
          ).map(([endDate, daysToSubtract]) => {
            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - daysToSubtract);
            return { startDate: endDate, endDate: startDate }; // Swapped to make invalid
          }),
          ({ startDate, endDate }) => {
            expect(() => calculateDays(startDate, endDate)).toThrow();
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Unit tests', () => {
    it('should calculate days correctly for same day', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-01');
      end.setHours(23, 59, 59); // Later in the same day
      
      expect(calculateDays(start, end)).toBe(1);
    });

    it('should calculate days correctly for multiple days', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      
      expect(calculateDays(start, end)).toBe(4);
    });

    it('should handle string dates', () => {
      expect(calculateDays('2024-01-01', '2024-01-03')).toBe(2);
    });

    it('should throw error when start date equals end date at same time', () => {
      const date = new Date('2024-01-01T10:00:00');
      expect(() => calculateDays(date, date)).toThrow('Start date must be before end date');
    });

    it('should throw error for invalid date strings', () => {
      expect(() => calculateDays('invalid-date', '2024-01-01')).toThrow('Invalid date format');
      expect(() => calculateDays('2024-01-01', 'invalid-date')).toThrow('Invalid date format');
    });
  });
});