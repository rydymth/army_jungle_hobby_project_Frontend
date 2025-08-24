import { Component} from '@angular/core';
import { ArmyHandler } from './army-handler/army-handler';
import { ArmyHandlrMarker } from './army-handlr-marker/army-handlr-marker';

@Component({
  selector: 'app-root',
  imports: [ArmyHandler, ArmyHandlrMarker],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { 
  polyLine: boolean = false;
  
  switchView()
  {
    this.polyLine = !this.polyLine
  }
}