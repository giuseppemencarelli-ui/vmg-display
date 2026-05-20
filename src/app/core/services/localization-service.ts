import { Injectable, inject } from '@angular/core';
import { SettingsService } from '../../core/services/settings';


@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private settingsSvc = inject(SettingsService);

  // Translate Italian text to English based on provided locale (default 'it')
  translate(ita: string): string {
    const traduzioni: [string, string][] = [
      ["Impostazioni", "Settings"],
      ["Aspetto", "Theme"],
      ["Scegli lo schema di colori da usare", "Choose the colour scheme to use"],
      ["Come dispositivo", "Device itself"],
      ["Risparmio batteria", "Battery saving"],
      ["In notturna", "At night"],
      ["Scegli l'unità di misura per la velocità","Choose unit for speed"],
      ["Velocità", "Speed"],
      ["Nodi", "Knots"],
      ["Chilometri ora", "Kilometres per hour"],
      ["Scegli l'unità di misura per la distanza","Choose unit for distance"],
      ["Distanza", "Distance"],
      ["Miglia", "Miles"],
      ["Chilometri", "Kilometres"],
      ["Scegli come visualizzare le coordinate", "Choose how to display coordinates"],
      ["Formato Coordinate", "Coordinates Format"],
      ["Impostazioni orario", "Time settings"],
      ["Scegli tra ora locale ed UTC", "Choose between local time and UTC"],
      ["ora locale", "local time"],
      ["loc", "loc"],
      ["UTC", "UTC"],
      ["Rotta", "Course"],
      ["Imposta la rotta da seguire", "Set a course"],
      ["Imposta la rotta inserendo un numero tra 000° e 359°", "Set the course by entering a number between 000° and 359°"],
      ["Impostando la rotta è possibile calcolare la", "By setting the route, it is possible to calculate the"],
      ["e la", "and the"],
      ["deviazione dalla rotta", "deviation from course"],
      ["che saranno visibili negli appositi display", "that will be visible in the displays"],
      ["se la rotta non viene indicata viene visualizzato", "if the route is not indicated is displayed"],
      ["versione", "version"],
      ["Strumenti navigazione e calcolo VMG", "Navigation tools and VMG calculation"],
      ["Contattaci", "Contact us"],
      ["Puoi raggiungerci direttamente a questi canali", "You can reach us directly at these channels"],
      ["sito web", "web site"],
      ["chiama", "call"],
      ["Istruzioni", "Instructions"],
      ["Dati visualizzati", "Displayed data"],
      ["indica la rotta seguita rispetto al fondale", "indicates the course followed with respect to the seabed"],
      ["indica la velocità rispetto al fondale", "indicates the speed with respect to the bottom"],
      ["indica dove ti trovi (punto nave)", "indicates where you are (ship point)"],
      ["indica la rotta che vuoi seguire", "indicates the course you want to follow"],
      ["Se hai impostato una rotta (BRG) si attivano anche i seguenti strumenti", "If you have set a route (BRG), the following tools are also activated"],
      ["indica l'eventuale fuori rotta ('nr' se non hai impostato la rotta)", "indicates any off-route (‘nr’ if you have not set the route)"],
      ["indica la velocità effettiva lungo la rotta ('nr' se non hai impostato la rotta)", "indicates the actual speed along the route (‘nr’ if you have not set the route)"],
      ["indica la percentuale tra SOG e VMG, è tanto più alta tanto più siamo vicini alla rotta desiderata ('nr' se non hai impostato la rotta)", "indicates the percentage between SOG and VMG, it is the higher the closer we are to the desired route (‘nr’ if you have not set the route)"],
      ["Comandi", "Controls"],
      ["visualizza a tutto schermo il display desiderato", "displays the desired display in full screen"],
      ["ritorna allo schermo principale", "returns to the main screen"],
      ["esci dalla modalità a schermo intero", "exits full screen mode"],
      ["scambia le schermate tra 6, 4 e 2 strumenti (oppure scorri a sinistra o dritta)","swap screens between 6, 4 and 2 instrument (or swipe left or right)"],
      ["per impostare la rotta (BRG) è necessario per calcolare CDI e VMG", "to set the route (BRG) is required to calculate CDI and VMG"],
      ["modifica impostazioni di visualizzazione", "change display settings"],
      ["mostra questa pagina di aiuto", "show this help page"],
      ["Visita il sito o usa i nostri contatti per maggiori informazioni", "Visit the site or use our contact details for more information"],
      ["La tua privacy è importante per noi ecco quali sono i dati utilizzati e come vengono usati", "Your privacy is important to us here is what data is used and how it is used"],
      ["Dati sensibili utilizzati", "Sensitive data usede"],
      ["Posizione esatta del dispositivo", "Exact position of the device"],
      ["Direzione e velocita di spostamento", "Direction and speed of movement"],
      ["Modalità di utilizzo", "Modalities of use"],
      ["VMG Display utilizza la tua posizione per visualizzare la tua velocità e direzione e calcolare la VMG. La tua posizione non viene memorizzata nel dispositivo o condivisa in nessun modo", "VMG Display uses your position to display your speed and direction and calculate VMG. Your position is not stored in the device or shared in any way"],
      ["Memorizzazione e condivisione dati", "Data storage and sharingn"],
      ["Le tue preferenze vengono salvate nel dispositivo, la tua posizione viene usata ma mai memorizzata permanentemente ne sul dispositivo ne in altri sistemi (ad esempio cloud)", "Your preferences are saved on the device, your location is used but never stored permanently either on the device or in other systems (e.g. cloud)"],
      ["Nessun dato utilizzato viene trasmesso o condiviso al di fuori del dispositivo in uso", "No data used is transmitted or shared outside the device in use"],
      ["Leggi di più su", "Read more on"],
      ["L'applicazione VMG Display è aggiornata !", "The VMG Display application has been updated!"],
      ["Queste sono le novità", "These are the novelties"],
      ["Non mostrare più questa finestra", "Do not show this window again"],
      ["Chiudi", "Close"],
      ["Velocità massima", "Max Speed"],
      ["Azzera il valore di Velocità massima", "Reset the Maximum Speed value"],
      ["Azzera", "Reset"],
      ["Carattere", "Font"],
      ["Cambia il tipo di carattere", "Change the font style"],
      ["Tecnico", "Technical"],
      ["Arrotondato", "Rounded"],
      ["Design", "Design"], 
      ["Stile degli strumenti", "Instrument style"],
      ["Squadrato", "Square"],
      ["Arrotondato", "Rounded"],
      ["Scegli il formato orario", "Choose the time format"],
      ["ita", "en"], 
      ["ita", "en"],
      ["ita", "en"],
      ["ita", "en"],
      ["ita", "en"],
      ["ita", "en"], 
      ["ita", "en"],
      ["settembre 2025", "september 2025"],
      ["Aggiunta la visualizzazione dell'ora locale o UTC", "Local or UTC time display added"],
      ["Visualizzazione coordinate in formato decimale o in gradi", "Coordinate display in decimal or degree format"],
      ["Nuove schermate a due e quattro strumenti", "New two- and four-instrument screens"],
      ["Indicazione velocità massima con azzeramento manuale del valore", "Maximum speed indication with manual value reset"],
      ["Corretto calcolo deviazione rotta", "Correct course deviation calculation"],
      ["Corretta formattazione coordinate negative", "Correct formatting of negative coordinates"],
      ["ita", "en"],
      ["ita", "en"],
      ["ita", "en"]
    ];

    let retVal = ita;
    var locale = this.settingsSvc.currentSettings.language || 'it';
    if (locale === 'en') {
      for (let i = 0; i < traduzioni.length; i++) {
        if (traduzioni[i][0] === ita) {
          retVal = traduzioni[i][1];
          break;
        }
      }
    }
    return retVal;
  }
}
