// models/measurand.model.ts

export type DataType =
  | 'number.int'
  | 'number.float'
  | 'degrees'
  | 'degrees_sd'
  | 'position'
  | 'time'
  | 'clock';

export type MeasurandId =
  | 'sog' | 'cog' | 'wind_speed' | 'wind_angle'
  | 'depth' | 'pos' | 'destination_dist'
  | 'destination_eta' | 'hdg' | 'rpm' | 'water_temp';

export interface Measurand {
  id: MeasurandId;
  label: string;
  shortLabel: string;
  unit: string;
  decimals: number;
  dataType: DataType;
}

export const MEASURANDS: Record<MeasurandId, Measurand> = {
  sog:              { id: 'sog',              label: 'Velocità sul fondo', shortLabel: 'SOG', unit: 'kn',  decimals: 1, dataType: 'number.float' },
  cog:              { id: 'cog',              label: 'Rotta sul fondo',    shortLabel: 'COG', unit: '°',   decimals: 0, dataType: 'degrees'      },
  wind_speed:       { id: 'wind_speed',       label: 'Velocità vento',     shortLabel: 'AWS', unit: 'kn',  decimals: 1, dataType: 'number.float' },
  wind_angle:       { id: 'wind_angle',       label: 'Angolo vento',       shortLabel: 'AWA', unit: '°',   decimals: 0, dataType: 'degrees_sd'   },
  depth:            { id: 'depth',            label: 'Profondità',         shortLabel: 'DPT', unit: 'm',   decimals: 1, dataType: 'number.float' },
  pos:              { id: 'pos',              label: 'Posizione',          shortLabel: 'POS', unit: '',    decimals: 4, dataType: 'position'     },
  destination_dist: { id: 'destination_dist', label: 'Distanza dest.',     shortLabel: 'DTW', unit: 'nm',  decimals: 1, dataType: 'number.float' },
  destination_eta:  { id: 'destination_eta',  label: 'Tempo dest.',        shortLabel: 'ETA', unit: '',    decimals: 0, dataType: 'time'         },
  hdg:              { id: 'hdg',              label: 'Prua',               shortLabel: 'HDG', unit: '°',   decimals: 0, dataType: 'degrees'      },
  rpm:              { id: 'rpm',              label: 'Giri motore',        shortLabel: 'RPM', unit: 'rpm', decimals: 0, dataType: 'number.int'   },
  water_temp:       { id: 'water_temp',       label: 'Temp. acqua',        shortLabel: 'TMP', unit: '°C',  decimals: 1, dataType: 'number.float' },
};

export const MEASURANDS_LIST: Measurand[] = Object.values(MEASURANDS);