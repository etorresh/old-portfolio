import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticlesService {
  public speed = 6;
  public repulse = false;

  constructor() { }
}
