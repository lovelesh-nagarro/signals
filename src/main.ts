import 'zone.js/dist/zone';
import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="content">
    <p [ngStyle]="{color:'#fff', margin: 0}">Change mug size</p>
    <input type="range" min="1" max="2" step=".1" value="1" (change)="onSliderChange($event)">  
    <button (click)="handleFilling()">{{fillingInProgress ? 'Stop filling': 'Start filling'}}</button>
    <div class="cup" [ngStyle]="{'height.px': mugHeight(), 'width.px': mugWidth()}">
      <div class="fill" [ngStyle]="{'height.%': filled()}"></div>
    </div>
    <div class="details">
      Fill: {{filled()}}% <br>
      Water volume: {{volume()}}
    </div>
  </div>
  `,
})
export class App {
  private initialMugHeight = 180;
  private initialMugWidth = 150;

  mugHeight = signal<number>(this.initialMugHeight);
  mugWidth = signal<number>(this.initialMugWidth);

  filled = signal<number>(40);

  volume = computed<number>(() => this.mugWidth() * this.filled());
  volumeChanged = effect(() => {
    console.log(`Volume changed to: ${this.volume()}`);
  });

  fillingInProgress = false;
  intervalId: undefined | number = undefined;

  handleFilling() {
    if (this.fillingInProgress) {
      clearInterval(this.intervalId);
    } else {
      this.intervalId = setInterval(() => {
        if (this.filled() == 100) {
          clearInterval(this.intervalId);
          this.fillingInProgress = false;
          return;
        }
        this.filled.set(this.filled() + 1);
        // In case of array and object and we do not want to change the reference we can use update method
        // this.height.update((h) => h + 1);
      }, 1000);
    }
    this.fillingInProgress = !this.fillingInProgress;
  }

  onSliderChange(data: any) {
    const changeBy = data.target?.valueAsNumber;
    this.mugHeight.set(this.initialMugHeight * changeBy);
    this.mugWidth.set(this.initialMugWidth * changeBy);
  }
}

bootstrapApplication(App);
