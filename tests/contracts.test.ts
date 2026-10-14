import { canAccess, requireIndividualPet } from '../src/core/permissions';
import type { PetAccess } from '../src/core/contracts';
import { formatDate, formatMeasurement, formatMoney } from '../src/core/format';
import { en, ko } from '../src/core/i18n';
describe('future domain boundaries', () => {
  const grant: PetAccess = { userId: 'u1', petId: 'p1', role: 'sitter', capabilities: ['readCare', 'createLog'], startsAt: '2026-10-14T10:00:00Z', expiresAt: '2026-10-14T12:00:00Z' };
  const now = Date.parse('2026-10-14T11:00:00Z');
  it('allows only a matching, current, explicit capability', () => {
    expect(canAccess(grant, 'u1', 'p1', 'createLog', now)).toBe(true);
    expect(canAccess(grant, 'u2', 'p1', 'createLog', now)).toBe(false);
    expect(canAccess(grant, 'u1', 'p2', 'createLog', now)).toBe(false);
    expect(canAccess(grant, 'u1', 'p1', 'readHealth', now)).toBe(false);
    expect(canAccess(null, 'u1', 'p1', 'readCare', now)).toBe(false);
  });
  it('rejects not-yet-valid, expired, revoked, malformed and unbounded sitter grants', () => {
    expect(canAccess(grant, 'u1', 'p1', 'readCare', Date.parse(grant.startsAt!) - 1)).toBe(false);
    expect(canAccess(grant, 'u1', 'p1', 'readCare', Date.parse(grant.expiresAt!))).toBe(false);
    for (const override of [{ revokedAt: '2026-10-14T10:30:00Z' }, { expiresAt: 'invalid' }, { expiresAt: undefined }]) expect(canAccess({ ...grant, ...override }, 'u1', 'p1', 'readCare', now)).toBe(false);
  });
  it('requires an individual pet when creating a record', () => {
    expect(() => requireIndividualPet({ kind: 'all' })).toThrow();
    expect(() => requireIndividualPet({ kind: 'pet', petId: ' ' })).toThrow();
    expect(requireIndividualPet({ kind: 'pet', petId: 'cat-1' })).toBe('cat-1');
  });
});
describe('global formatting', () => {
  it('covers every English key with Korean text', () => { expect(Object.keys(ko).sort()).toEqual(Object.keys(en).sort()); expect(Object.values(ko).every(Boolean)).toBe(true); });
  it('preserves currency and correctly converts canonical units', () => {
    expect(formatMoney(79.99, 'CAD', 'en', 'CA')).toContain('79.99');
    expect(formatMeasurement(10, 'weight', 'imperial', 'en')).toBe('22 lb');
    expect(formatMeasurement(1.609344, 'distance', 'imperial', 'en')).toBe('1 mi');
    expect(formatMeasurement(0, 'temperature', 'imperial', 'en')).toBe('32 °F');
  });
  it('formats dates in the requested timezone', () => {
    const instant = new Date('2026-10-15T01:00:00Z');
    expect(formatDate(instant, 'en', 'CA', 'America/Toronto')).toContain('14');
    expect(formatDate(instant, 'ko', 'KR', 'Asia/Seoul')).toContain('15');
  });
});
