import { Component, OnInit, AfterViewInit } from '@angular/core';
import {trigger, state, style, animate, transition} from '@angular/animations';

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
      transition('purple => gray', [
        animate('1s')
      ]),
    ]),
  ]
})
export class AboutComponent implements AfterViewInit {
  colors = ['gray', 'pink', 'orange', 'green', 'purple']
  state = 'gray';
  i = 2;
  doAsyncTask() {
      setTimeout(() => {
        if (this.i === 5) {
          this.i = 0;
        }
        this.state = this.colors[this.i];
        this.i++;
        this.doAsyncTask();
      }, 10000);
  }
  startAnimation() {
    this.state = 'pink';
    this.doAsyncTask();
  }
  ngAfterViewInit() {
      setTimeout(() => this.startAnimation(), 1500);
    }
  }
