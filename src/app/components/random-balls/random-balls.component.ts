import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { Particle } from 'src/app/model/circularParticle/particle';
import { Coordinate } from 'src/app/model/coordinate';
import { Helper } from 'src/app/helper/helper';
import { Ball } from 'src/app/model/randomBalls/ball';

var gameLoop;
var soundLoop;

@Component({
  selector: 'app-random-balls',
  templateUrl: './random-balls.component.html',
  styleUrls: ['./random-balls.component.css']
})
export class RandomBallsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('myCanvas') public canvas: ElementRef;

  public context: CanvasRenderingContext2D;
  public balls: Ball[];
  private particleCount: number
  private mouse: Coordinate;

  public constructor() { 
      this.balls = [];
      this.particleCount = 500;
      this.mouse = new Coordinate(Helper.maxWidth/2, Helper.maxHeight/2);
  }

  public ngOnInit(): void {
      for(let i = 0; i < this.particleCount; i++) {
          this.balls.push(new Ball());
      }
  }

  public ngAfterViewInit(): void {
      this.setCanvas();

      this.runGame();
      //this.playBackgroundAudio();
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {  
      this.mouse.x = event.x;
      this.mouse.y = event.y;
  }

  // #region Game rules
  private runGame(): void {
      gameLoop = setInterval(() => {
          this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
          this.context.fillRect(0, 0, Helper.maxWidth, Helper.maxHeight);
          for(let i = 0; i < this.balls.length; i++) {
              this.balls[i].move(this.mouse);
          }

          this.drawArc();
      }, 10);
  }

  // #endregion

  // #region Draw logic

  /*
  private draw() : void{
      for(let i = 0; i < this.particles.length; i++) {
          this.context.beginPath();
          this.context.strokeStyle = this.particles[i].color;
          this.context.lineWidth = this.particles[i].radius;

          this.context.moveTo(this.particles[i].lastPosition.x, this.particles[i].lastPosition.y)
          this.context.lineTo(this.particles[i].position.x, this.particles[i].position.y)

          this.context.stroke();
          this.context.closePath();
      }
  }
  */

  private drawArc() : void{
      for(let i = 0; i < this.balls.length; i++) {
          this.context.beginPath();
          this.context.arc(
              this.balls[i].position.x, 
              this.balls[i].position.y, 
              this.balls[i].radius, 
              0, 
              Math.PI * 2, 
              false);

          this.context.fillStyle = this.balls[i].color;
          this.context.fill();
          this.context.closePath();
      }
  }

  private setCanvas(): void {
      const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

      // set the width and height
      canvasEl.width = Helper.maxWidth;
      canvasEl.height = Helper.maxHeight;

      this.context = this.canvas.nativeElement.getContext('2d');
  }

  // #endregion


  public ngOnDestroy() : void {
      clearInterval(gameLoop);
      clearInterval(soundLoop);
  }

}
