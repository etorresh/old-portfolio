import {Injectable} from '@angular/core';

@Injectable()
export class ParticlesService {
  public speed = 6;
  public repulse = false;
  public repulseScale = 0;

  constructor() { }
}
