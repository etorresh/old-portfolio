import {Component} from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {ThemeService} from '../theme.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('animateText', [
      state('gray', style({
        color: '#353e3d'
      })),
      state('blue', style({
        color: '#2472a3'
      })),
      state('orange', style({
        color: '#a35024'
      })),
      state('yellow', style({
        color: '#a39024'
      })),
      state('purple', style({
        color: '#7d24a3'
      })),
      transition('gray => blue', [
        animate('1s')
      ]),
      transition('blue => orange', [
        animate('1s')
      ]),
      transition('orange => yellow', [
        animate('1s')
      ]),
      transition('yellow => purple', [
        animate('1s')
      ]),
      transition('purple => blue', [
        animate('1s')
      ]),
    ]),
  ]
})
export class AboutComponent {
  constructor(public theme: ThemeService) { }
}
