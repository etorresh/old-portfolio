import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-particles-test',
  templateUrl: './particles-test.component.html',
  styleUrls: ['./particles-test.component.css']
})
export class ParticlesTestComponent implements OnInit {
  myStyle: object = {};
  myParams: object = {};
  width = 100;
  height = 100;

  constructor() {
  }

  ngOnInit() {
  }
}
