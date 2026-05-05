// models/measurand.model.ts

export type DataType =
  | 'number.int'
  | 'number.float'
  | 'degrees'
  | 'degrees_sd' //gradi con indicazione se sono a sinistra o dritta
  | 'position'
  | 'time'
  | 'clock'
  | 'string';

export type MeasurandId =
  | 'sog' | 'max' | 'cog' | 'pos' | 'vmg'| 'eff' | 'brg'| 'cdi' | 'wind_speed' | 'wind_angle'
  | 'depth' | 'destination_dist'
  | 'destination_eta' | 'hdg' | 'rpm' | 'water_temp';

export interface Measurand {
  id: MeasurandId;
  label: string;
  shortLabel: string;
  unit: string;
  decimals: number;
  dataType: DataType;
  relatedId?: MeasurandId; //Grandezza correlata mostrata nell'angolo a destra (Esempio SOG e SOG MAX, VMG ed EFF CDI e BRG,...)
}

export const MEASURANDS: Record<MeasurandId, Measurand> = {
  sog:              { id: 'sog',              label: 'Velocità sul fondo', shortLabel: 'SOG', unit: 'kn',  decimals: 1, dataType: 'number.float', relatedId: 'max' },
  max:              { id: 'max',              label: 'Velocità massima',   shortLabel: 'MAX', unit: 'kn',  decimals: 1, dataType: 'number.float' },
  cog:              { id: 'cog',              label: 'Rotta sul fondo',    shortLabel: 'COG', unit: '°',   decimals: 0, dataType: 'degrees'      },
  pos:              { id: 'pos',              label: 'Posizione',          shortLabel: 'POS', unit: '',    decimals: 4, dataType: 'position'     },
  vmg:              { id: 'vmg',              label: 'Velocita di avvicinamento',          shortLabel: 'VMG', unit: 'kn',  decimals: 1, dataType: 'number.float', relatedId: 'eff' },
  eff:              { id: 'eff',              label: 'Efficienza',          shortLabel: 'EFF', unit: 'kn',  decimals: 1, dataType: 'string' },
  brg:              { id: 'brg',              label: 'Rotta da seguire',    shortLabel: 'BRG', unit: '°',   decimals: 0, dataType: 'degrees'  },
  cdi:              { id: 'cdi',              label: 'Deviazione da rotta', shortLabel: 'CDI', unit: '°',   decimals: 0, dataType: 'degrees_sd', relatedId: 'brg'  },
  
  
  wind_speed:       { id: 'wind_speed',       label: 'Velocità vento',     shortLabel: 'AWS', unit: 'kn',  decimals: 1, dataType: 'number.float' },
  wind_angle:       { id: 'wind_angle',       label: 'Angolo vento',       shortLabel: 'AWA', unit: '°',   decimals: 0, dataType: 'degrees_sd'   },
  depth:            { id: 'depth',            label: 'Profondità',         shortLabel: 'DPT', unit: 'm',   decimals: 1, dataType: 'number.float' },
  destination_dist: { id: 'destination_dist', label: 'Distanza dest.',     shortLabel: 'DTW', unit: 'nm',  decimals: 1, dataType: 'number.float' },
  destination_eta:  { id: 'destination_eta',  label: 'Tempo dest.',        shortLabel: 'ETA', unit: '',    decimals: 0, dataType: 'time'         },
  hdg:              { id: 'hdg',              label: 'Prua',               shortLabel: 'HDG', unit: '°',   decimals: 0, dataType: 'degrees'      },
  rpm:              { id: 'rpm',              label: 'Giri motore',        shortLabel: 'RPM', unit: 'rpm', decimals: 0, dataType: 'number.int'   },
  water_temp:       { id: 'water_temp',       label: 'Temp. acqua',        shortLabel: 'TMP', unit: '°C',  decimals: 1, dataType: 'number.float' },
};

export const MEASURANDS_LIST: Measurand[] = Object.values(MEASURANDS);