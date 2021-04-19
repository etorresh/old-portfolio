import {Directive, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ParticlesService} from './sidebar-content/projects/particles.service';
import {async} from 'rxjs/internal/scheduler/async';
import {SidebarService} from './sidebar.service';

/*
  Variables to be used outside of directive scope
  To improve performance.
*/
const TAU: number = Math.PI * 2;
const QUADTREE_CAPACITY = 4;


/*
  Variables to be initiated
*/
let repulseDistance: number;
let particleSpeed: number;
let particleSize: number;
let quadTree: QuadTree;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;



@Directive({
  selector: '[appParticles]'
})
export class ParticlesDirective implements OnDestroy, OnInit {

  number = 200;
  speed = 6;
  size = 100;
  particleHex = '#FFF';
  densityArea = 800;

  particlesNumber: number;
  particlesList: Particle[] = [];

  animationFrame;

  constructor(
    public sidebarService: SidebarService,
    public el: ElementRef,
    private particles: ParticlesService
  ) {
    canvas = this.el.nativeElement;
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    ctx = canvas.getContext('2d');
    this.setCanvasSize();
    this.initVariables();
  }

  ngOnInit() {
    this.animate();
    this.setCanvasSize();
    this.initVariables();
    this.resetParticles();
  }


  @HostListener('window:resize') onResize() {
    this.setCanvasSize();
    this.initVariables();
  }

  initVariables() {
    if (canvas.height < canvas.width) {
      repulseDistance = Math.floor(canvas.height * 0.62);
    }
    else {
      repulseDistance = Math.floor(canvas.width * 0.62);
    }
    particleSpeed = this.speed;
    particleSize = this.size;
    if (this.densityArea) { this.scaleDensity(); }
  }


  animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.updateParticles();
    this.animationFrame = requestAnimationFrame(this.animate.bind(this));
  }

  updateParticles() {
    let rWidth;
    let rHeight;
    if ((this.sidebarService.getActive() || async)) {
      rWidth = Math.round((canvas.width - 288) / 2);
    }
    else {
      rWidth = Math.round(canvas.width / 2);
    }
    rHeight = Math.round(canvas.height / 2);
    quadTree.close();
    quadTree.close();
    ctx.fillStyle = this.particleHex;
    ctx.beginPath();
    for (const p of this.particlesList)
    {
      if (this.particles.repulse) {
        p.repulse(rWidth, rHeight, this.particles.repulseScale);
      }
      p.update(ctx, this.particles.speed);
    }
    ctx.fill();
  }

  resetParticles() {
    this.particlesList = [];
    for (let i = 0; i < this.particlesNumber; i++) {
      this.particlesList.push(new Particle(canvas, particleSize));
    }
    quadTree = new QuadTree();
    for (const p of this.particlesList) { p.reset(canvas); }
  }

  scaleDensity() {
    const area = canvas.width * canvas.height / 1000;
    // tslint:disable-next-line:no-bitwise
    this.particlesNumber = (area * this.number / this.densityArea) | 0;
  }

  setCanvasSize() {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    if (this.densityArea) { this.scaleDensity(); }
    this.resetParticles();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrame);
  }
}

class Particle {
  particles;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  quad: QuadTree;
  explored: boolean;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(canvas, r) {
    this.r = r;
    this.reset(canvas, r);
  }
  // tslint:disable-next-line:no-shadowed-variable
  reset(canvas, r = this.r) {
    const W = canvas.width - r * 2;
    const H = canvas.height - r * 2;
    this.x = Math.random() * W + r;
    this.y = Math.random() * H + r;
    this.vx = Math.random() - 0.5;
    this.vy = Math.random() - 0.5;
    this.quad = undefined;
    this.explored = false;

  }
  // tslint:disable-next-line:no-shadowed-variable
  addPath(ctx) {
    ctx.moveTo(this.x + this.r,  this.y);
    ctx.arc(this.x,  this.y, this.r, 0, TAU);
  }
  // tslint:disable-next-line:no-shadowed-variable
  update(ctx, speed) {
    this.explored = false;
    const r = this.r;
    let W;
    let H;
    this.x += this.vx * speed;
    this.y += this.vy * speed;
    W = ctx.canvas.width + r;
    H = ctx.canvas.height + r;
    if (this.x > W) {
      this.x = 0;
      this.y = Math.random() * (H - r);
    } else if (this.x < -r) {
      this.x = W - r;
      this.y = Math.random() * (H - r);
    }
    if (this.y > H) {
      this.y = 0;
      this.x = Math.random() * (W - r);
    } else if (this.y < -r) {
      this.y = H - r;
      this.x = Math.random() * (W - r);
    }
    this.addPath(ctx);
    quadTree.insert(this);
  }
  repulse(width, height, repulseScale) {
    const dx = this.x - width;
    const dy = this.y - height;

    const dist = (dx * dx + dy * dy) ** 0.5;
    let rf = ((1 - (dist / (repulseDistance * repulseScale)) ** 2)  * 100);
    rf = (rf < 0 ? 0 : rf > 50  ? 50 : rf) / dist;

    const posX = this.x + dx * rf;
    const posY = this.y + dy * rf;
    this.x = posX;
    this.y = posY;
  }
}

class Bounds {
  x: number;
  y: number;
  w: number;
  h: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  diagonal: number;
  constructor(x, y, w, h) { this.init(x, y, w, h); }
  init(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.left = x - w;
    this.right = x + w;
    this.top = y - h;
    this.bottom = y + h;
    this.diagonal = (w * w + h * h);
  }

  contains(p) {
    return (p.x >= this.left && p.x <= this.right && p.y >= this.top && p.y <= this.bottom);
  }
}

class QuadTree {
  boundary: Bounds;
  divided: boolean;
  points: Particle[];
  pointCount: number;
  drawn: boolean;
  depth: number;

  NE: QuadTree;
  NW: QuadTree;
  SE: QuadTree;
  SW: QuadTree;
  constructor(boundary: Bounds = new Bounds(canvas.width / 2, canvas.height / 2, canvas.width / 2 , canvas.height / 2), depth = 0) {
    this.boundary = boundary;
    this.divided = false;
    this.points = depth > 1 ? [] : null;
    this.pointCount = 0;
    this.drawn = false;
    this.depth = depth;
    if (depth === 0) {   // BM67 Fix on resize
      this.subdivide();
      this.NE.subdivide();
      this.NW.subdivide();
      this.SE.subdivide();
      this.SW.subdivide();
    }
  }

  addPath() {
    const b = this.boundary;
    ctx.rect(b.left, b.top, b.w * 2, b.h * 2);
    this.drawn = true;
  }
  addToSubQuad(particle) {
    if (this.NE.insert(particle)) { return true; }
    if (this.NW.insert(particle)) { return true; }
    if (this.SE.insert(particle)) { return true; }
    if (this.SW.insert(particle)) { return true; }
    particle.quad = undefined;
  }
  insert(particle) {
    if (this.depth > 0 && !this.boundary.contains(particle)) { return false; }

    if (this.depth > 1 && this.pointCount < QUADTREE_CAPACITY) {
      this.points[this.pointCount++] = particle;
      particle.quad = this;
      return true;
    }
    if (!this.divided) { this.subdivide(); }
    return this.addToSubQuad(particle);
  }

  subdivide() {
    if (!this.NW) {
      const x = this.boundary.x;
      const y = this.boundary.y;
      const w = this.boundary.w / 2;
      const h = this.boundary.h / 2;
      const depth = this.depth + 1;

      this.NE = new QuadTree(new Bounds(x + w, y - h, w, h), depth);
      this.NW = new QuadTree(new Bounds(x - w, y - h, w, h), depth);
      this.SE = new QuadTree(new Bounds(x + w, y + h, w, h), depth);
      this.SW = new QuadTree(new Bounds(x - w, y + h, w, h), depth);
    } else {
      this.NE.pointCount = 0;
      this.NW.pointCount = 0;
      this.SE.pointCount = 0;
      this.SW.pointCount = 0;
    }

    this.divided = true;
  }

  close() {
    if (this.divided) {
      this.NE.close();
      this.NW.close();
      this.SE.close();
      this.SW.close();
    }

    if (this.depth === 2 && this.divided) {
      this.NE.pointCount = 0;
      this.NW.pointCount = 0;
      this.SE.pointCount = 0;
      this.SW.pointCount = 0;
    } else if (this.depth > 2) {
      this.divided = false;
    }
  }
}
