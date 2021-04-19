import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SidebarService} from '../../sidebar.service';
import {Subscription} from 'rxjs';

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
    trigger('cardAnimation', [
      state('full', style({
        width: '320px',
        opacity: 1
      })),
      state('empty', style({
        width: 0,
        opacity: 0
      })),
      state('fullNoTran', style({
        width: '320px',
        opacity: 1
      })),
      state('emptyNoTran', style({
        width: 0,
        opacity: 0
      })),
      transition('full => empty', [
        animate('0.25s')
      ]),
      transition('empty => full', [
        animate('0.5s')
      ]),
      transition('emptyNoTran => full', [
        animate('0.49s')
      ]),
    ]),
  ]
})
export class AboutComponent implements  OnInit, OnDestroy{
  constructor(public sidebarService: SidebarService) { }
  public animateFlexbox: boolean;
  public animateFlexboxState = 'full';
  private firstRun = true;
  private innerWidth: number;
  private sidebarSubscription: Subscription;
  ngOnInit() {
    this.onResize();
    this.firstRun = false;
  }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:variable-name
  onResize(_event?) {
    this.innerWidth = window.innerWidth;
    this.animateFlexbox = (this.innerWidth <= 1297) && (this.innerWidth >= 1020);
    if (!(this.sidebarSubscription === undefined) && !this.animateFlexbox && !this.sidebarSubscription.closed) {
      this.sidebarSubscription.unsubscribe();
    }
    console.log(this.sidebarSubscription);
    if (this.animateFlexbox && (this.sidebarSubscription === undefined || this.sidebarSubscription.closed)) {
      this.sidebarSubscription = this.sidebarService.getActive().subscribe(status => {
        if (!this.firstRun) {
          if (status) {
            this.animateFlexboxState = 'empty';
            setTimeout(() => {
              this.animateFlexboxState = 'fullNoTran';
            }, 240);
          } else {
            this.animateFlexboxState = 'emptyNoTran';
            setTimeout(() => {
              this.animateFlexboxState = 'full';
            }, 10);
          }
        }
      });
    }
  }
}
