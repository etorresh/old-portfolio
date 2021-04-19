import {Component, HostListener, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SidebarService} from '../../sidebar.service';

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
      state('open', style({
        width: '320px'
      })),
      state('close', style({
        width: 0
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
export class AboutComponent implements  OnInit{
  constructor(public sidebarService: SidebarService) { }
  public animateFlexbox = false;
  public animateFlexboxState: string;
  private innerWidth: number;
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 1297) {
      this.animateFlexbox = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:variable-name
  onResize(_event) {
    this.innerWidth = window.innerWidth;
    this.animateFlexbox = this.innerWidth <= 1297;
  }
}
