import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Helper } from 'src/app/helper/helper';
import { Bubble } from 'src/app/model/bubblesCollision/bubble';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-bubbles-collision',
    templateUrl: './bubbles-collision.component.html',
    styleUrls: ['./bubbles-collision.component.css']
})
export class BubblesCollisionComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('myCanvas') public canvas: ElementRef;

    public context: CanvasRenderingContext2D;
    public bubbles: Bubble[];
    private bubbleCount: number

    public constructor() {
        this.bubbles = [];
        this.bubbleCount = 10;
    }

    public ngOnInit(): void {
        for (let i = 0; i < this.bubbleCount; i++) {
            this.bubbles.push(new Bubble());
        }
    }

    public ngAfterViewInit(): void {
        this.setCanvas();

        this.runGame();
        //this.playBackgroundAudio();
    }

    // #region Game rules
    private runGame(): void {
        gameLoop = setInterval(() => {
            this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
            this.context.fillRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            this.checkCollission();

            for (let i = 0; i < this.bubbles.length; i++) {
                this.bubbles[i].move();
            }

            this.drawArc();
        }, 10);
    }

    private checkCollission() : void {
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = i + 1; j < this.bubbles.length; j++) {
                let distance = this.bubbles[i].radius + this.bubbles[j].radius;
                if (Helper.distance(this.bubbles[i].position, this.bubbles[j].position) <= distance) {
                    this.resolveCollision(i, j);
                }
            }
        }
    }

    public resolveCollision(i: number, j: number) : void {
        let xVelocityDiff = this.bubbles[i].xSpeed - this.bubbles[j].xSpeed;
        let yVelocityDiff = this.bubbles[i].ySpeed - this.bubbles[j].ySpeed;
    
        let xDist = this.bubbles[j].position.x - this.bubbles[i].position.x;
        let yDist = this.bubbles[j].position.y - this.bubbles[i].position.y;

        // Prevent accidental overlap of particles
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
            // Grab angle between the two colliding particles
            let angle = -Math.atan2(this.bubbles[j].position.y - this.bubbles[i].position.y, this.bubbles[j].position.x - this.bubbles[i].position.x);

            this.bubbles[i].rotate(angle);
            this.bubbles[j].rotate(angle);

            this.bubbles[j] = this.bubbles[i].collission(this.bubbles[j]);

            this.bubbles[i].rotate(-angle);
            this.bubbles[j].rotate(-angle);
        }
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

    private drawArc() : void{
        for(let i = 0; i < this.bubbles.length; i++) {
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
