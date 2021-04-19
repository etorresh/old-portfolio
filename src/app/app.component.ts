import {Component, OnDestroy, OnInit} from '@angular/core';
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {SidebarService} from './sidebar.service';
import {Subscription} from 'rxjs';

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
        marginLeft: '288px'
      })),
      state('close', style({
        marginLeft: '0'
      })),
      transition('open => close', [
        group([
          animate('0.5s'),
          query('@openClose', animateChild(), {optional: true}),
          query('@cardAnimation', animateChild(), {optional: true})
        ])
      ]),
      transition('close => open', [
        group([
          query('@openClose', animateChild(), {optional: true}),
          query('@cardAnimation', animateChild(), {optional: true}),
          animate('0.25s'),
        ])
      ]),
    ]),
  ]
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(public sidebarService: SidebarService) {
  }
  title = 'portfolio';
  faAlignLeft = faAlignLeft;
  private sidebarSubscription: Subscription;
  private sidebarStatus: boolean;
  ngOnInit() {
    this.sidebarSubscription = this.sidebarService.getActive().subscribe(status => {
      this.sidebarStatus = status;
    });
  }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.setActive(!this.sidebarStatus);
  }
}
