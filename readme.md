

moduli

https://github.com/capacitor-community/background-geolocation


Gestione a scomparsa dei menù

Meccanismo "Autohide" dei menù di configurazione, basta toccare lo schermo per attivarli
si disattivano:
- il burgher menù
- i setup dei singoli cruscotti



Gestione personalizzazione del cruscotto

icona ingranaggio che permette di scegliere la grandezza da visualizzare




/****************************************************/
Grandezze

SOG - Speed Over Ground                 - number float
COG - Course over Ground                - number 000
VMG - Velocity Made Good                - number float
HDG - Heading Rotta Bussola             - number 000
BRG - Rotta da seguire                  - number 000
TKE - Track Angle Error                 - number 000L/R
POS - Posizione lat,lon                 - position
TIM - Tempo UTC e locale                - time
AWA - Angolo vento apparente barca      - number 000L/R
TWA - Angolo vento apparente Vero       - number 000


Tipi di Indicatori:
1 number float
2 number 000
3 number 000L/R
4 position
5 time




              @if (getMeasurandValueCdi(slot.measurandId); as cdiValue) {
                <svg width="100%" height="100%" viewBox="0 0 230 110" preserveAspectRatio="xMidYMid meet">
                <!-- barra sfondo -->
                <rect x="16" y="50" width="198" height="5" rx="2.5" fill="#1a2530"/>

                <!-- dot scala: -45 -22 0 +22 +45 -->
                <circle cx="16"  cy="52" r="4" fill="#1e3a50"/>
                <circle cx="65"  cy="52" r="4" fill="#1e3a50"/>
                <circle cx="115" cy="52" r="4" fill="#2a4a6a"/>
                <circle cx="165" cy="52" r="4" fill="#1e3a50"/>
                <circle cx="214" cy="52" r="4" fill="#1e3a50"/>

                <!-- linea centrale -->
                <rect x="113" y="28" width="4" height="46" rx="2" fill="#2a4a6a"/>

                <!-- tacche scala -->
                <line x1="16"  y1="62" x2="16"  y2="70" stroke="#1e3a50" stroke-width="1.5"/>
                <line x1="65"  y1="62" x2="65"  y2="68" stroke="#1e3a50" stroke-width="1"/>
                <line x1="115" y1="62" x2="115" y2="70" stroke="#2a4a6a" stroke-width="1.5"/>
                <line x1="165" y1="62" x2="165" y2="68" stroke="#1e3a50" stroke-width="1"/>
                <line x1="214" y1="62" x2="214" y2="70" stroke="#1e3a50" stroke-width="1.5"/>

                <!-- ago -->
                <rect [attr.x]="cdiValue.value" y="26" width="4" height="50" rx="2" [attr.fill]="cdiValue.color"/>

                <!-- etichette scala -->
                <text x="16"  y="84" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="middle">-45°</text>
                <text x="65"  y="84" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="middle">-22°</text>
                <text x="115" y="84" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="middle">0</text>
                <text x="165" y="84" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="middle">+22°</text>
                <text x="214" y="84" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="middle">+45°</text>

                <!-- etichette PORT / STBD -->
                <text x="16"  y="100" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="start">◄ PORT</text>
                <text x="214" y="100" font-family="monospace" font-size="9" fill="#2a5070" text-anchor="end">STBD ►</text>

              </svg>


                             <ion-icon 
                        *ngIf="val.includes('-') && val.length > 1"
                        name="caret-back" 
                        class="val-icon">
                    </ion-icon>
                <span fitText (fitted)="onFitted($event, slot.position)">
                    
                    {{ val === '-' ? val : val.replace('-', '') }}
                </span>
                    <ion-icon 
                        *ngIf="!val.includes('-')" 
                        name="caret-forward" 
                        class="val-icon">
                    </ion-icon>
