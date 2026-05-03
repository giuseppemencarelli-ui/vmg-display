// models/dashboard.model.ts
import { MeasurandId } from './measurand.model';

export type LayoutSize = 1 | 2 | 4 | 6;
export type Orientation = 'portrait' | 'landscape';

export interface InstrumentSlot {
  position: number;
  measurandId: MeasurandId;  // ← rinominato da quantityId
}

export interface DashboardConfig {
  layout: LayoutSize;
  slots: InstrumentSlot[];
}

// Mappa layout → colonne per orientamento
// Formato: righe × colonne
export const LAYOUT_COLUMNS: Record<Orientation, Record<LayoutSize, number>> = {
  portrait: {
    1: 1,   // 1x1
    2: 1,   // 2x1
    4: 1,   // 4x1
    6: 1,   // 6x1
  },
  landscape: {
    1: 1,   // 1x1
    2: 2,   // 1x2
    4: 2,   // 2x2
    6: 3,   // 2x3
  },
};

export const DEFAULT_SLOTS: Record<LayoutSize, InstrumentSlot[]> = {
  1: [
    { position: 0, measurandId: 'sog' },
  ],
  2: [
    { position: 0, measurandId: 'sog' },
    { position: 1, measurandId: 'cog' },
  ],
  4: [
    { position: 0, measurandId: 'sog' },
    { position: 1, measurandId: 'cog' },
    { position: 2, measurandId: 'cdi' },
    { position: 3, measurandId: 'vmg' },
  ],
  6: [
    { position: 0, measurandId: 'sog' },
    { position: 1, measurandId: 'cog' },
    { position: 2, measurandId: 'pos' },
    { position: 3, measurandId: 'cdi' },
    { position: 4, measurandId: 'vmg' },
    { position: 5, measurandId: 'pos' },
  ],
};

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  layout: 6,
  slots: DEFAULT_SLOTS[6],
};