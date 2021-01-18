// Customized branch of:
// https://github.com/audrenbdb/angular-particlesjs

import {Directive, ElementRef, Input, OnDestroy, HostListener, OnInit, OnChanges} from '@angular/core';
import {ParticlesConfigService} from './particles-config.service';

/*
  Variables to be used outside of directive scope
  To improve performance.
*/
const TAU: number = Math.PI * 2;
const QUADTREE_CAPACITY = 4;
const linkBatches = 10;
const mouse: {x: number, y: number} = {x: 0, y: 0};


/*
  Variables to be initiated
*/
let linkDistance: number;
let linkDistance2: number;
let repulseDistance: number;
let particleSpeed: number;
let particleSize: number;
let quadTree: QuadTree;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;



@Directive({
  selector: '[appParticles]'
})
export class ParticlesDirective implements OnDestroy, OnInit, OnChanges {

  @Input() number = 80;
  @Input() speed = 6;
  @Input() linkWidth = 0;
  @Input() linkDistance = 140;
  @Input() size = 100;
  // TO DO: distance relative to screen size
  @Input() repulseDistance = 500;
  @Input() particleHex = '#FFF';
  @Input() linkHex = '#FFF';
  @Input() densityArea = 800;

  particlesNumber: number;
  particlesList: Particle[] = [];
  links: Link[][] = [];
  linkBatchAlphas: number[] = [];
  linkPool: Link[] = [];
  candidates: Particle[] = [];

  animationFrame;

  constructor(
    public el: ElementRef,
    private particles: ParticlesConfigService
  ) {
    canvas = this.el.nativeElement;
    canvas.style.height = '100%';
    canvas.style.width = '100%';
    ctx = canvas.getContext('2d');
    for (let i = 1 / (linkBatches + 1); i < 1; i += 1 / (linkBatches + 1)) {
      this.links.push([]);
      this.linkBatchAlphas.push(i);
    }
    this.setCanvasSize();
    this.initVariables();
  }

  ngOnInit() {
    this.animate();
  }

  @HostListener('window:resize') onResize() {
    this.setCanvasSize();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.stopMouse();
  }

  @HostListener('touchend') onTouchEnd() {
    this.stopMouse();
  }

  @HostListener('mousemove', ['$event']) onMouseMove(e) {
    this.setMousePos(e.offsetX, e.offsetY);
  }

  @HostListener('touchmove', ['$event']) onTouchMove(e) {
    this.setMousePos(e.touches[0].clientX, e.touches[0].clientY);
  }

  @HostListener('change') ngOnChanges() {
    this.initVariables();
    this.resetParticles();
  }
  setMousePos(x, y) {
    mouse.x = x;
    mouse.y = y;
  }

  stopMouse() {
    mouse.x = null;
  }

  initVariables() {
    linkDistance = this.linkDistance;
    linkDistance2 = (0.7 * linkDistance) ** 2;
    repulseDistance = this.repulseDistance;
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
    quadTree.close();
    ctx.fillStyle = this.particleHex;
    ctx.beginPath();
    for (const p of this.particlesList)
    {
      if (this.particles.repulse) {
        p.repulse();
      }
      p.update(ctx, this.particles.speed);
    }
    console.log(this.particlesList.length);
    ctx.fill();
  }

  resetParticles() {
    this.particlesList = [];
    for (let i = 0; i < this.particlesNumber; i++) {
      this.particlesList.push(new Particle(canvas, particleSize, this.particles));
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

class Link {
  p1: Particle;
  p2: Particle;
  alpha: number;
  batchId: number;
  constructor() {  }
  // tslint:disable-next-line:no-shadowed-variable
  addPath(ctx) {
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    return this;
  }
}


class Particle {
  r: number;
  speedScale: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  quad: QuadTree;
  explored: boolean;
  // tslint:disable-next-line:no-shadowed-variable
  constructor(canvas, r) {
    this.r = r;
    this.speedScale = particleSpeed / 2;
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
  near(p) {
    return ((p.x - this.x) ** 2 + (p.y - this.y) ** 2) <= linkDistance2;
  }
  intersects(range) {
    const xd = Math.abs(range.x - this.x);
    const yd = Math.abs(range.y - this.y);
    const r = linkDistance;
    const w = range.w;
    const h = range.h;
    if (xd > r + w || yd > r + h) { return false; }
    if (xd <= w || yd <= h) { return true; }
    return  ((xd - w) ** 2 + (yd - h) ** 2) <= linkDistance2;

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
  repulse() {
    // TO DO: position relative to screen size
    const dx = this.x - 960;
    const dy = this.y - 540;

    const dist = (dx * dx + dy * dy) ** 0.5;
    let rf = ((1 - (dist / repulseDistance) ** 2)  * 100);
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

  near(p) {
    if (!this.contains(p)) {
      const dx = p.x - this.x;
      const dy = p.y - this.y;
      const dist = (dx * dx + dy * dy) - this.diagonal - linkDistance2;
      return dist < 0;
    }
    return true;
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
  query(part, fc, found) {
    let i = this.pointCount;
    if (this.depth === 0 || this.boundary.near(part)) {
      if (this.depth > 1) {
        while (i--) {
          const p = this.points[i];
          if (!p.explored && part.near(p)) { found[fc++] = p; }
        }
        if (this.divided) {
          fc = this.NE.pointCount ? this.NE.query(part, fc, found) : fc;
          fc = this.NW.pointCount ? this.NW.query(part, fc, found) : fc;
          fc = this.SE.pointCount ? this.SE.query(part, fc, found) : fc;
          fc = this.SW.pointCount ? this.SW.query(part, fc, found) : fc;
        }
      } else if (this.divided) {
        fc = this.NE.query(part, fc, found);
        fc = this.NW.query(part, fc, found);
        fc = this.SE.query(part, fc, found);
        fc = this.SW.query(part, fc, found);
      }
    }
    return fc;
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
