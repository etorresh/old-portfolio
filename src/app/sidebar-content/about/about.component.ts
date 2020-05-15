import { Component } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';
import {ThemeService} from '../theme.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('animateText', [
      state('gray', style({
        color: '#212429'
      })),
      state('pink', style({
        color: '#f2006e'
      })),
      state('orange', style({
        color: '#ff613a'
      })),
      state('green', style({
        color: '#04e762'
      })),
      state('purple', style({
        color: '#8c53c8'
      })),
      transition('gray => pink', [
        animate('1s')
      ]),
      transition('pink => orange', [
        animate('1s')
      ]),
      transition('orange => green', [
        animate('1s')
      ]),
      transition('green => purple', [
        animate('1s')
      ]),
      transition('purple => pink', [
        animate('1s')
      ]),
    ]),
  ]
})
export class AboutComponent {
  constructor(public theme: ThemeService) { }
  newWindow(url) {
    window.open(url, '_blank');
  }
}
