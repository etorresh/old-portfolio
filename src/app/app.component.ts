import { Component } from '@angular/core';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import {trigger, state, style, animate, transition} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('openClose', [
    state('open', style({
      marginLeft: '0px'
    })),
    state('close', style({
      marginLeft: '-288px'
    })),
    transition('open => close', [
      animate('0.5s')
    ]),
    transition('close => open', [
      animate('0.25s')
    ]),
  ]),
  ]
})
export class AppComponent {
  title = 'portfolio';
  faAlignLeft = faAlignLeft;
  status = true;

  toggleSidebar() {
    this.status = !this.status;
  }
}
