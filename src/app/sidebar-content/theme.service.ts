import {BehaviorSubject, Observable} from 'rxjs';

export class ThemeService {
  private started = false;
  private colors = ['gray', 'pink', 'orange', 'green', 'purple'];
  private colorsIndex = 0;
  private color = this.colors[this.colorsIndex];

  private startAnimation() {
    if (!this.started) {
      this.started = true;
      setTimeout(() => {
        this.colorsIndex++;
        this.color = this.colors[this.colorsIndex];
        console.log(this.color);
        this.changeColors();
      }, 1500);
    }
  }

  private changeColors() {
    setTimeout(() => {
      this.colorsIndex++;
      if (this.colorsIndex === 5) {
        this.colorsIndex = 0;
      }
      this.color = this.colors[this.colorsIndex];
      console.log(this.color);
      this.changeColors();
    }, 10000);
  }

  public currentTheme() {
    if (!this.started) {
      this.startAnimation();
    }
    return this.color;
  }
}
