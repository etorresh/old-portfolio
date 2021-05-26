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
  public animateFlexboxState = 'full';
  private sidebarSubscription: Subscription = Subscription.EMPTY;
  private firstRun = true;
  private subActive = false;
  public mobile: boolean;
  public footerAnimation: string;
  private footerSubscription: Subscription = Subscription.EMPTY;
  ngOnInit() {
    this.onResize();
    this.firstRun = false;
    this.mobile = window.innerWidth <= 992;
    this.footerSubscription = this.sidebarService.getActive().subscribe(status => {
      if (status && !this.mobile) {
        this.footerAnimation = 'open';
      } else {
        this.footerAnimation = 'close';
      }});
    }

  ngOnDestroy() {
    this.sidebarSubscription.unsubscribe();
    this.footerSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:variable-name
  onResize(_event?) {
    this.mobile = window.innerWidth <= 992;
    if (window.innerWidth <= 1297 && window.innerWidth >= 1020) {
      if (!this.subActive) {
        this.subActive = true;
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
    } else {
      this.sidebarSubscription.unsubscribe();
      this.subActive = false;
    }
  }
}
