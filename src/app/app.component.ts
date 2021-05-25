import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {faAlignLeft} from '@fortawesome/free-solid-svg-icons';
import {animate, animateChild, group, query, state, style, transition, trigger} from '@angular/animations';
import {SidebarService} from './sidebar.service';
import {Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

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
  constructor(public sidebarService: SidebarService, private router: Router) {
  }
  title = 'portfolio';
  faAlignLeft = faAlignLeft;
  private sidebarSubscription: Subscription;
  private sidebarStatus: boolean;
  public amountToShiftSidebar = '-288px';
  public mobile = false;
  ngOnInit() {
    this.sidebarSubscription = this.sidebarService.getActive().subscribe(status => {
      this.sidebarStatus = status;
    });
    if (window.innerWidth <= 992) {
      this.mobile = true;
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.url !== '/') {
          this.sidebarService.setActive(false);
        }
      });
      this.amountToShiftSidebar = '-100vw';
    }
    else {
      this.router.navigateByUrl('/about');
    }
  }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:variable-name
  onResize(_event?) {
    this.mobile = window.innerWidth <= 992;
  }

  toggleSidebar() {
    this.sidebarService.setActive(!this.sidebarStatus);
  }
}
