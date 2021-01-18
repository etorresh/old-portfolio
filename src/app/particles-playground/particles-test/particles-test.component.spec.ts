import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticlesTestComponent } from './particles-test.component';

describe('ParticlesTestComponent', () => {
  let component: ParticlesTestComponent;
  let fixture: ComponentFixture<ParticlesTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticlesTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticlesTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
