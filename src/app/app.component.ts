import {Component} from '@angular/core';
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {ParticlesService} from './particles.service';

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
      group([
        animate('0.5s'),
      ])
    ]),
    transition('close => open', [
      group([
        animate('0.25s'),
      ])
    ]),
  ]),
    trigger('openCloseContent', [
      state('open', style({
        marginLeft: '244px'
      })),
      state('close', style({
        marginLeft: '0'
      })),
      transition('open => close', [
        group([
          animate('0.5s'),
          query('@openClose', animateChild())
        ])
      ]),
      transition('close => open', [
        group([
          query('@openClose', animateChild()),
          animate('0.25s'),
        ])
      ]),
    ]),
  ]
})
export class AppComponent {
  constructor(private particles: ParticlesService) {
  }
  title = 'portfolio';
  faAlignLeft = faAlignLeft;
  status = true;

  toggleSidebar() {
    this.status = !this.status;
    this.particles.sidebar = this.status;
  }
}
