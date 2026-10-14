// Contracts are boundaries for later phases, not a client-side authorization system.
export type PetScope = { kind: 'all' } | { kind: 'pet'; petId: string };
export type PetSpecies = 'dog' | 'cat';
export interface Pet { id: string; householdId: string; name: string; species: PetSpecies; birthDate?: string }
export type Role = 'owner' | 'caregiver' | 'viewer' | 'sitter';
export type Capability = 'readCare' | 'readHealth' | 'createLog' | 'editOwnLog' | 'manageSchedules' | 'managePet' | 'share' | 'export';
export interface PetAccess {
  userId: string; petId: string; role: Role; capabilities: readonly Capability[];
  startsAt?: string; expiresAt?: string; revokedAt?: string;
}
export type CareKind = 'meal' | 'water' | 'walk' | 'toilet' | 'play' | 'medication' | 'grooming';
export interface Schedule {
  id: string; petId: string; kind: CareKind; timeZone: string; localTime: string;
  recurrence: { kind: 'daily' } | { kind: 'weekly'; weekdays: readonly number[] } | { kind: 'interval'; minutes: number };
}
export interface ScheduleOccurrence {
  id: string; scheduleId: string; petId: string; dueAt: string;
  status: 'pending' | 'completed' | 'skipped' | 'cancelled'; careLogId?: string;
}
export interface CareLog {
  id: string; petId: string; kind: CareKind; occurredAt: string; receivedAt?: string;
  authorId: string; performedBy: string; version: number; requestId: string; occurrenceId?: string;
}
export type ProviderResult<T> =
  | { status: 'available'; data: T; source: string; fetchedAt: string }
  | { status: 'unsupported'; reason: string }
  | { status: 'unconfigured' }
  | { status: 'error'; retryable: boolean; code: string };
export interface PlaceReference { providerId: string; name: string; latitude: number; longitude: number }
export interface PlacesProvider {
  search(query: { text: string; region: string; latitude?: number; longitude?: number }): Promise<ProviderResult<readonly PlaceReference[]>>;
}
export interface ProductOffer {
  productId: string; variantId: string; retailerId: string; country: string;
  amount: number; currency: string; shippingAmount: number | null; checkedAt: string; sourceUrl: string;
}
export interface ShoppingProvider {
  search(query: { text: string; shippingCountry: string; species?: PetSpecies }): Promise<ProviderResult<readonly ProductOffer[]>>;
}
export interface NotificationProvider {
  schedule(occurrence: ScheduleOccurrence, deliveryKey: string): Promise<ProviderResult<{ id: string }>>;
  cancel(id: string): Promise<void>;
}
export interface PetRepository { list(): Promise<readonly Pet[]> }
export type SyncOperation = { id: string; petId: string; entityId: string; baseVersion: number; action: 'upsert' | 'delete'; createdAt: string };
export interface SyncQueue {
  enqueue(operation: SyncOperation): Promise<void>;
  pending(): Promise<readonly SyncOperation[]>;
  acknowledge(id: string): Promise<void>;
}
export interface CacheStore<T> {
  read(ownerId: string, key: string): Promise<T | null>;
  write(ownerId: string, key: string, value: T): Promise<void>;
  clearOwner(ownerId: string): Promise<void>;
}
