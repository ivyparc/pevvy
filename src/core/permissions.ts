import type { Capability, PetAccess, PetScope } from './contracts';

// UI guidance only. The backend must enforce every capability in Phase 1.1.
export function canAccess(access: PetAccess | null, userId: string, petId: string, capability: Capability, now = Date.now()): boolean {
  if (!access || access.userId !== userId || access.petId !== petId || access.revokedAt) return false;
  const start = access.startsAt ? Date.parse(access.startsAt) : -Infinity;
  const end = access.expiresAt ? Date.parse(access.expiresAt) : Infinity;
  if (Number.isNaN(start) || Number.isNaN(end) || now < start || now >= end) return false;
  if (access.role === 'sitter' && !access.expiresAt) return false;
  return access.capabilities.includes(capability);
}
export function requireIndividualPet(scope: PetScope): string {
  if (scope.kind !== 'pet' || !scope.petId.trim()) throw new Error('An individual pet is required to create a record.');
  return scope.petId;
}
