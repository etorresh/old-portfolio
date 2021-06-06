import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {SidebarService} from './sidebar.service';
import {Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common';

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
      marginLeft: '{{left_indent}}',
    }), {params: {left_indent: 0}}),
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
  constructor(public sidebarService: SidebarService, private router: Router, private location: Location) {
  }
  title = 'portfolio';
  faAlignLeft = faAlignLeft;
  private sidebarSubscription: Subscription;
  private routeSubscription: Subscription = Subscription.EMPTY;
  private sidebarStatus: boolean;
  public amountToShiftSidebar: string;
  public mobile: boolean;
  public sidebarAnimation: string;
  ngOnInit() {
    this.onResize();
    this.sidebarSubscription = this.sidebarService.getActive().subscribe(status => {
      this.sidebarStatus = status;
      if (this.sidebarStatus && !this.mobile) {
        this.sidebarAnimation = 'open';
      } else {
        this.sidebarAnimation = 'close';
      }
    });
    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this.mobile && event.url !== '/') {
        this.sidebarService.setActive(false);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:variable-name
  onResize(_event?) {
    if (window.innerWidth <= 992) {
      this.mobile = true;
      this.sidebarAnimation = 'close';
      this.amountToShiftSidebar = '-100vw';
    }
    else {
      this.mobile = false;
      if (this.sidebarStatus) {
        this.sidebarAnimation = 'open';
      }
      else {
        this.sidebarAnimation = 'close';
      }
      this.amountToShiftSidebar = '-288px';
      if (this.location.path() === '') {
        this.router.navigateByUrl('/about');
      }
    }
  }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  toggleSidebar() {
    this.sidebarService.setActive(!this.sidebarStatus);
  }
}
