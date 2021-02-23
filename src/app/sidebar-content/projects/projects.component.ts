import { Component, OnInit } from '@angular/core';
import {ParticlesService} from '../../particles.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(private particles: ParticlesService) {
  }
  public whiteBackground = true;
  private backgroundIn;
  private scaleRepulse;
  private repulseOut;

  ngOnInit(): void {
  }
  mouseEnter(cardNumber) {
    // Timer is undefined on first run
    if (this.backgroundIn !== undefined) {
      this.backgroundIn.abort();
    }
    this.particles.repulse = true;
    this.whiteBackground = false;
    this.scaleRepulse = setInterval(() => {
      console.log(this.particles.repulseScale);
      if (this.particles.repulseScale < 0.9) {
        this.particles.repulseScale += 0.01;
      }
      else {
        this.particles.speed = 0;
      }
    }, 10);
    this.repulseOut = this.Timer(1000);
    this.repulseOut.start().then(() => {
      clearInterval(this.scaleRepulse);
    });
  }
  mouseLeave() {
    this.repulseOut.abort();
    clearInterval(this.scaleRepulse);
    this.particles.repulse = false;
    this.particles.repulseScale = 0;
    this.particles.speed = 6;
    this.backgroundIn = this.Timer(3000);
    this.backgroundIn.start().then(() => this.whiteBackground = true);
  }
  Timer = (ms: number) => {
    let id: number;
    const start = () => new Promise(resolve => {
      if (id === -1) {
        throw new Error('Timer already aborted');
      }
      id = setTimeout(resolve, ms);
    });
    const abort = () => {
      if (id !== -1 || id === undefined) {
        clearTimeout(id);
        id = -1;
      }
    };
    return {
      start, abort
    };
  }
}
