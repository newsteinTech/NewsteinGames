import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Helper } from 'src/app/helper/helper';
import { BubbleFade } from 'src/app/model/bubblesFade/bubble-fade';
import { Coordinate } from 'src/app/model/coordinate';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-bubble-fade',
    templateUrl: './bubble-fade.component.html',
    styleUrls: ['./bubble-fade.component.css']
})
export class BubbleFadeComponent implements OnInit, AfterViewInit, OnDestroy {
    private static bubbleMaxCount: number = 100;

    @ViewChild('myCanvas') public canvas: ElementRef;

    public context: CanvasRenderingContext2D;
    public bubbles: BubbleFade[];
    private mouse: Coordinate; 

    public constructor() {
        this.bubbles = [];
        this.mouse = new Coordinate(Helper.maxWidth / 2, Helper.maxHeight / 2);
    }

    public ngOnInit(): void {
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
            //this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
            //this.context.fillRect(0, 0, Helper.maxWidth, Helper.maxHeight);
            this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (this.bubbles.length < BubbleFadeComponent.bubbleMaxCount) {
                this.bubbles.push(new BubbleFade(this.mouse));
            }

            for (let i = this.bubbles.length - 1; i >= 0; i--) {
                this.bubbles[i].update();

                if (this.bubbles[i].radius < 10) {
                    this.bubbles.splice(i, 1);
                }
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
  
    private drawCircle(): void {
        for (let i = 0; i < this.bubbles.length; i++) {
            this.context.beginPath();
            this.context.arc(
                this.bubbles[i].position.x,
                this.bubbles[i].position.y,
                this.bubbles[i].radius,
                0,
                Math.PI * 2,
                false);
  
            this.context.fillStyle = this.bubbles[i].color;
            this.context.fill();
            this.context.closePath();
        }
    }
    */

    private drawArc(): void {
        for (let i = 0; i < this.bubbles.length; i++) {
            this.context.beginPath();
            this.context.arc(
                this.bubbles[i].position.x,
                this.bubbles[i].position.y,
                this.bubbles[i].radius,
                0,
                Math.PI * 2,
                false);

            this.context.strokeStyle = this.bubbles[i].color;
            this.context.stroke();
            this.context.closePath();
        }
    }

    private setCanvas(): void {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

        // set the width and height
        canvasEl.width = window.innerWidth; //Helper.maxWidth;
        canvasEl.height = window.innerHeight; //Helper.maxHeight;

        this.context = this.canvas.nativeElement.getContext('2d');
    }

    // #endregion


    public ngOnDestroy(): void {
        clearInterval(gameLoop);
        clearInterval(soundLoop);
    }
}