// models/dashboard.model.ts
import { MeasurandId } from './measurand.model';

export type LayoutSize = 1 | 2 | 4 | 6;

export interface InstrumentSlot {
  position: number;
  measurandId: MeasurandId;  // ← rinominato da quantityId
}

export interface DashboardConfig {
  layout: LayoutSize;
  slots: InstrumentSlot[];
}

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
    { position: 2, measurandId: 'wind_speed' },
    { position: 3, measurandId: 'depth' },
  ],
  6: [
    { position: 0, measurandId: 'sog' },
    { position: 1, measurandId: 'cog' },
    { position: 2, measurandId: 'wind_speed' },
    { position: 3, measurandId: 'wind_angle' },
    { position: 4, measurandId: 'depth' },
    { position: 5, measurandId: 'destination_dist' },
  ],
};

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  layout: 4,
  slots: DEFAULT_SLOTS[4],
};