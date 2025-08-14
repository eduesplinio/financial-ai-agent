import { formatCurrency, formatDate, isValidEmail, generateId } from './index';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format BRL currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('US$ 1.234,56');
    });
  });

  describe('formatDate', () => {
    it('should format date in Portuguese', () => {
      const date = new Date('2023-12-25');
      const formatted = formatDate(date);
      expect(formatted).toContain('dezembro');
      expect(formatted).toContain('2023');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });
});