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
  private scaleTimer;
  private scalebackTimer;

  ngOnInit(): void {
  }
  mouseEnter(cardNumber) {
      clearInterval(this.scalebackTimer);
      this.particles.repulse = true;
      this.whiteBackground = false;
      this.scaleTimer = setInterval(() => {
        if (this.particles.repulseScale < 0.9) {
          this.particles.repulseScale += 0.01;
        }
        else {
          this.particles.speed = 0;
          clearInterval(this.scaleTimer);
        }
      }, 10);
  }
  mouseLeave() {
      clearInterval(this.scaleTimer);
      this.particles.repulse = false;
      this.particles.speed = 6;
      this.scalebackTimer = setInterval(() => {
        if (this.particles.repulseScale > 0) {
          this.particles.repulseScale -= 0.01;
        }
        else {
          this.whiteBackground = true;
          clearInterval(this.scalebackTimer);
        }
      }, 30);
  }
}
