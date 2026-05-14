import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FitTextDirective } from '../../directives/fit-text.directive';

import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { caretBackOutline, caretForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-display-degsd',
  templateUrl: './display-degsd.component.html',
  styleUrls: ['./display-degsd.component.scss'],
  standalone: true,
  imports: [IonIcon, FitTextDirective]
})
export class DisplayDegsdComponent  implements OnInit {

  @Input() valore: string;
  @Input() slotPosition: number;

  @Output() fitted = new EventEmitter<{size: number, index: number}>();

  constructor() {
    addIcons({caretBackOutline,  caretForwardOutline });
    this.valore = "ntbs"; //never to be seen, placeholder per evitare errori di binding su stringa vuota
    this.slotPosition = 0; //placeholder per evitare errori di binding su numero negativo
  }

  ngOnInit() {}

  showRightArrow(): boolean {
    var retVal: boolean = false;
    if (this.valore === '—' || this.valore === 'ntbs' || this.valore === '0') {
      retVal = false; // Consideriamo "—" e "ntbs" come non validi
    }
    else if(this.valore.includes('-') == false)
      retVal = true;
    return retVal;
  }


  showLeftArrow(): boolean {
    var retVal: boolean = false;
    if (this.valore === '—' || this.valore === 'ntbs' || this.valore === '0' || this.valore === '-0') {
      retVal = false; // Consideriamo "—" e "ntbs" come non validi
    }
    else if(this.valore.includes('-') == true)
      retVal = true;
    return retVal;
  }

  onFitted(size: number, index: number) {
    //console.log(`Slot ${index} - Font size calcolata: ${size}px`);

    this.fitted.emit({
      size: size,
      index: index
    });
  }

}
