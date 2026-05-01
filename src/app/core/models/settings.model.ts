// models/settings.model.ts
import { DashboardConfig, DEFAULT_DASHBOARD_CONFIG } from './dashboard.model';

export type Theme = 'device' | 'battery' | 'night';
export type Language = 'it' | 'en';
export type FontFamily = 'Orbitron' | 'JetBrains Mono';
export type StyleVersion = 'versione3' | 'versione4';
export type SpeedUnit = 'kn' | 'km/h';
export type DistanceUnit = 'nm' | 'km';
export type DepthUnit = 'm' | 'ft';
export type PositionFormat = 'decimal' | 'ddmm' | 'ddmmss';

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
}

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'device',
  language: 'it',
  fontFamily: 'Orbitron',
  styleVersion: 'versione4',
  speedUnit: 'kn',
  distanceUnit: 'nm',
  depthUnit: 'm',
  positionFormat: 'ddmm',
  dashboardConfig: DEFAULT_DASHBOARD_CONFIG,
};