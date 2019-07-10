import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Helper } from 'src/app/helper/helper';
import { Particle } from 'src/app/model/circularParticle/particle';
import { Coordinate } from 'src/app/model/coordinate';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-circular-motion-particles',
    templateUrl: './circular-motion-particles.component.html',
    styleUrls: ['./circular-motion-particles.component.css']
})

export class CircularMotionParticlesComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('myCanvas') public canvas: ElementRef;

    public context: CanvasRenderingContext2D;
    public particles: Particle[];
    private particleCount: number
    private center: Coordinate;
    private smoothCenter: Coordinate;
    private smoothnessFactor: number;

    public constructor() { 
        this.particles = [];
        this.particleCount = 100;
        this.smoothnessFactor = 0.05;
        this.center = new Coordinate(Helper.maxWidth/2, Helper.maxHeight/2);
        this.smoothCenter = new Coordinate(this.center.x, this.center.y);
    }

    public ngOnInit(): void {
        for(let i = 0; i < this.particleCount; i++) {
            this.particles.push(new Particle(this.center));
        }
    }

    public ngAfterViewInit(): void {
        this.setCanvas();

        this.runGame();
        //this.playBackgroundAudio();
    }

    @HostListener('mousemove', ['$event'])
    onMousemove(event: MouseEvent) {  
        this.center.x = event.x;
        this.center.y = event.y;

        this.smoothCenter.x += (this.center.x - this.smoothCenter.x) * this.smoothnessFactor;
        this.smoothCenter.y += (this.center.y - this.smoothCenter.y) * this.smoothnessFactor;
    }

    // #region Game rules
    private runGame(): void {
        gameLoop = setInterval(() => {
            this.context.fillStyle = 'rgba(0, 0, 0, 0.05)';
            this.context.fillRect(0, 0, Helper.maxWidth, Helper.maxHeight);
            for(let i = 0; i < this.particles.length; i++) {
                this.particles[i].move(this.smoothCenter);
            }

            this.draw();
        }, 10);
    }

    // #endregion

    // #region Draw logic

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

    private drawArc() : void{
        for(let i = 0; i < this.particles.length; i++) {
            this.context.beginPath();
            this.context.arc(
                this.particles[i].position.x, 
                this.particles[i].position.y, 
                this.particles[i].radius, 
                0, 
                Math.PI * 2, 
                false);

            this.context.fillStyle = this.particles[i].color;
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
