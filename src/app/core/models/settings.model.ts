// models/settings.model.ts
import { DashboardConfig, DEFAULT_DASHBOARD_CONFIG } from './dashboard.model';
import { MeasurandId } from './measurand.model';

export type Theme = 'device' | 'battery' | 'night';
export type Language = 'it' | 'en';
export type FontFamily = 'Orbitron' | 'JetBrains Mono';
export type StyleVersion = 'versione3' | 'versione4';
export type SpeedUnit = 'kn' | 'km/h';
export type DistanceUnit = 'nm' | 'km';
export type DepthUnit = 'm' | 'ft';
export type PositionFormat = 'decimal' | 'ddmm' | 'ddmmss';
export type TimeFormat = 'local' | 'utc';

// ============================================================================
// VALORI DEI MEASURANDS - Source of Truth
// ============================================================================
export type MeasurandValues = Record<MeasurandId, string>;

export const DEFAULT_MEASURAND_VALUES: MeasurandValues = {
  sog: '—',
  max: '—',
  cog: '—',
  pos: '—',
  vmg: '—',
  eff: '—',
  brg: '—',
  cdi: '—',

  wind_speed: '—',
  wind_angle: '—',
  depth: '—',
  destination_dist: '—',
  destination_eta: '—',
  hdg: '—',
  rpm: '—',
  water_temp: '—'
};

export interface UserSettings {
  theme: Theme;
  language: Language;
  fontFamily: FontFamily;
  styleVersion: StyleVersion;
  speedUnit: SpeedUnit;
  distanceUnit: DistanceUnit;
  depthUnit: DepthUnit;
  positionFormat: PositionFormat;
  dashboardConfig: DashboardConfig;
  timeFormat: TimeFormat;
  showSeconds: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'device',
  language: 'it',
  fontFamily: 'Orbitron',
  styleVersion: 'versione4',
  speedUnit: 'kn',
  distanceUnit: 'nm',
  depthUnit: 'm',
  timeFormat: 'local',
  showSeconds: false,
  positionFormat: 'ddmm',
  dashboardConfig: DEFAULT_DASHBOARD_CONFIG,
};