// models/status.model.ts

export interface GpsStatus {    
    enabled: boolean;  // Indica se il GPS è abilitato all'uso sempre disponibile in quanto è una funzionalità di base del dispositivo
    hasFix: boolean;     // Indica se il GPS ha una posizione valida da impostare in base ad accuracy
    accuracy: number;    // Precisione in metri
}

export interface NmeaStatus {
    enabled: boolean;  // Indica se la ricezione NMEA è attiva (utente ha pagato)
    isConnected: boolean; // Indica se attualmente collegato alla rete NMEA
}

export interface WearablesStatus {
    enabled: boolean;  // Indica se utente ha pagato il serivizio Wearables
    isConnected: boolean; // Indica se attualmente collegato al wearable
}

export interface Status {
    gps: GpsStatus;
    nmea: NmeaStatus;
    wearables: WearablesStatus;
}

// ============================================================================
// DEFAULT STATUS VALUES
// ============================================================================
export const DEFAULT_STATUS: Status = {
    gps: {
        enabled: true,
        hasFix: false,
        accuracy: 0
    },
    nmea: {
        enabled: true,
        isConnected: false
    },
    wearables: {
        enabled: true,
        isConnected: false
    }
};

