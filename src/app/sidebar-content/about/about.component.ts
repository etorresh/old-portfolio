import {Component} from '@angular/core';
import {ParticlesService} from '../../particles.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('openClose', [
      state('open', style({
        left: '288px'
      })),
      state('close', style({
        left: '0'
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
export class AboutComponent {
  constructor(public particles: ParticlesService) { }
}

