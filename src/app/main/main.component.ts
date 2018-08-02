import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  imgs = [];
  isPlaying = false;
  isTurning = false;
  interval;
  intervalTurn;
  speed = 7470;
  metersInPixel = 120;
  // yPeriod = this.metersInPixel / this.speed * 1000;
  lastImage = -1;

  totalTime = 129745;
  freqency = 24;
  yPeriod = 1000 / this.freqency;
  totalSteps = this.totalTime / this.yPeriod;
  yStep = 100 / this.totalSteps;
  xStep = 0.5;
  angTarget = 0;
  angTargetPercentage = 50;
  xPeriod = this.yPeriod;
  angSpeed = 1;


  mapWidth = 1130;
  mapHeight = 8192;
  imgWidth = 590;
  imgHeight = this.imgWidth;
  xPercentage = 50;
  yPercentage = 100;

  ngOnInit() {
    $(document).ready(() => {
      $('#screen').css({
        'background-position-x': this.xPercentage + '%',
        'background-position-y': this.yPercentage + '%'
      });

      $(document).on('keydown', (event) => {
        if (event.keyCode === 37) { // left
          if (this.xPercentage - this.xStep > 0) {
            this.xPercentage -= this.xStep;
          }
        } else if (event.keyCode === 39) { // right
          if (this.xPercentage + this.xStep < 100) {
            this.xPercentage += this.xStep;
          }
        }

        $('#screen').css({
          'background-position-x': this.xPercentage + '%'
        });
      });
    });
  }

  play() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.interval = setInterval(() => {
        if (this.yPercentage > 0) {
          this.yPercentage -= 0.05;

          $('#screen').css({
            'background-position-y': this.yPercentage + '%'
          });
        } else {
          this.stop();
        }
      }, this.yPeriod);
    }
  }

  pause() {
    if (this.interval && this.isPlaying) {
      this.isPlaying = false;
      clearInterval(this.interval);
    }
  }

  stop() {
    if (this.interval && this.isPlaying) {
      this.isPlaying = false;
      clearInterval(this.interval);
    }

    this.xPercentage = 50;
    this.yPercentage = 100;

    $('#screen').css({
      'background-position-x': this.xPercentage + '%',
      'background-position-y': this.yPercentage + '%'
    });
  }


  turn() {
    if (this.intervalTurn && this.isTurning) {
      this.isTurning = false;
      clearInterval(this.intervalTurn);
    } else {
      this.isTurning = true;
      this.angTargetPercentage = 50 + (+this.angTarget / 5 * 50);

      this.xStep = this.angTargetPercentage > this.xPercentage ? +this.angSpeed/100*this.xPeriod : -(+this.angSpeed/100*this.xPeriod);

      this.intervalTurn = setInterval(() => {
        if (Math.abs(this.xPercentage - this.angTargetPercentage) > Math.abs(this.xStep)) {
          this.xPercentage += this.xStep;

          $('#screen').css({
            'background-position-x': this.xPercentage + '%'
          });
        } else {
          this.isTurning = false;
          clearInterval(this.intervalTurn);
        }
      }, this.xPeriod);
    }
  }
}
