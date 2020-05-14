export class ThemeService {
  private started = false;
  private colors = ['pink', 'orange', 'green', 'purple'];
  private colorsIndex = 0;
  private color = 'gray';

  private startAnimation() {
    if (!this.started) {
      this.started = true;
      setTimeout(() => {
        this.color = 'pink';
        this.changeColors();
      }, 1500);
    }
  }

  private changeColors() {
    setTimeout(() => {
      this.colorsIndex++;
      if (this.colorsIndex === this.colors.length) {
        this.colorsIndex = 0;
      }
      this.color = this.colors[this.colorsIndex];
      this.changeColors();
    }, 6000);
  }

  public currentTheme() {
    if (!this.started) {
      this.startAnimation();
    }
    return this.color;
  }
}
