import {Component, HostListener, OnInit} from '@angular/core';
import {ParticlesConfigService} from '../../particles-config.service';

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

  constructor(private particles: ParticlesConfigService) {
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyBoardEvent(event: KeyboardEvent) {
    if (event.key === 'f') {
      this.particles.repulse = !this.particles.repulse;
    }
    else if (event.key === 's') {
      if (this.particles.speed === 6) {
        this.particles.speed = 1;
        console.log(this.particles.speed);
      }
      else {
        this.particles.speed = 6;
        console.log(this.particles.speed);
      }
    }
  }
  ngOnInit() {
  }
}
