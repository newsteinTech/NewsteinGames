import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Coordinate } from 'src/app/model/coordinate';
import { Helper } from 'src/app/helper/helper';
import { MatrixSymbol } from 'src/app/model/maticx/matrix-symbol';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-matrix-rain',
    templateUrl: './matrix-rain.component.html',
    styleUrls: ['./matrix-rain.component.css']
})
export class MatrixRainComponent implements OnInit, AfterViewInit, OnDestroy {
    private static colSize: number = 15;
    private static matrixMaxCount: number = Helper.doubleToInt(Helper.maxWidth / MatrixRainComponent.colSize);

    @ViewChild('myCanvas') public canvas: ElementRef;

    @ViewChild('matrixAudio') matrixAudio: ElementRef;

    public context: CanvasRenderingContext2D;
    public maticxs: MatrixSymbol[];

    public constructor() {
        this.maticxs = [];
    }

    public ngOnInit(): void {
        for (let i = 0; i < MatrixRainComponent.matrixMaxCount; i++)
        this.maticxs.push(new MatrixSymbol(i * MatrixRainComponent.colSize));
    }

    public ngAfterViewInit(): void {
        this.setCanvas();

        this.runGame();
        this.playBackgroundAudio();
    }

    // #region Game rules
    private runGame(): void {
        gameLoop = setInterval(() => {

            // Blur effect
            //this.context.fillStyle = 'rgba(0, 0, 0, 0.005)';
            //this.context.fillRect(0, 0, Helper.maxWidth, Helper.maxHeight);
            //this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            for (let i = this.maticxs.length - 1; i >= 0; i--) {
                this.maticxs[i].update();
            }

            this.drawText();
        }, 10);
    }

    // #endregion

    // #region Draw logic

    private drawText(): void {
        for (let i = 0; i < this.maticxs.length; i++) {

            // Draw text till head touches ground else start clearing text.
            if (this.maticxs[i].head.y <= Helper.maxHeight + this.maticxs[i].fontSize) {
                // Draw metrix
                if (this.maticxs[i].speedCounter <= 0) {
                    this.context.font = "bold " + this.maticxs[i].fontSize + "px Arial";
                    this.context.fillStyle = Helper.matrixColors[this.maticxs[i].colorIndex];
                    
                    // Create gradient
                    //var gradient = this.context.createLinearGradient(this.maticxs[i].head.x, this.maticxs[i].head.y - this.maticxs[i].fontSize, this.maticxs[i].head.x, this.maticxs[i].head.y);
                    //gradient.addColorStop(0, "red");
                    //gradient.addColorStop(0.5, "blue");
                    //gradient.addColorStop(1.0, Helper.matrixColors[this.maticxs[i].colorIndex]);
                    // Fill with gradient
                    //this.context.fillStyle = gradient;

                    this.context.fillText(this.maticxs[i].nextChar, this.maticxs[i].head.x, this.maticxs[i].head.y);

                    // this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
                    // this.context.fillRect(
                    //     this.maticxs[i].head.x, this.maticxs[i].head.y , 
                    //     this.maticxs[i].head.x + this.maticxs[i].font, this.maticxs[i].head.y);

                    //this.drawCircle(this.maticxs[i].head, this.maticxs[i].fontSize / 2);
                    this.context.clearRect(this.maticxs[i].head.x, this.maticxs[i].head.y - 2* this.maticxs[i].fontSize, 
                        this.maticxs[i].fontSize, this.maticxs[i].fontSize);

                    this.context.font = "bold " + (this.maticxs[i].fontSize - 2) + "px Arial";
                    this.context.fillStyle = Helper.matrixColors[this.maticxs[i].colorIndex + 1];
                    this.context.fillText(this.maticxs[i].currentChar, this.maticxs[i].head.x, this.maticxs[i].head.y - this.maticxs[i].fontSize);
                }
            } else if (this.maticxs[i].tail.y <= Helper.maxHeight + 4 * this.maticxs[i].fontSize) {
                // Delete matricx;
                //this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
                //this.drawCircle(this.maticxs[i].tail, this.maticxs[i].fontSize);
                this.context.clearRect(this.maticxs[i].tail.x, this.maticxs[i].tail.y - 2* this.maticxs[i].fontSize, 
                    this.maticxs[i].fontSize, 2* this.maticxs[i].fontSize);
               
            } else {
                // Remove matrix and add new
                this.maticxs.splice(i, 1, new MatrixSymbol(i * MatrixRainComponent.colSize));
            }
        }
    }

    private drawCircle(position: Coordinate, radius: number): void {
        this.context.beginPath();
        this.context.arc(
            position.x + radius,
            position.y - 3 * radius,
            radius + 4,
            0,
            Math.PI * 2,
            false);

        this.context.fillStyle = 'rgba(0, 0, 0, 1.0)';
        this.context.fill();
        this.context.closePath();
    }

    private setCanvas(): void {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

        // set the width and height
        canvasEl.width = window.innerWidth; //Helper.maxWidth;
        canvasEl.height = window.innerHeight; //Helper.maxHeight;

        this.context = this.canvas.nativeElement.getContext('2d');
    }

    // #endregion

    private playBackgroundAudio(): void {
        // this.matrixAudio.nativeElement.play();
        // let audio = new Audio();
        // audio.src = "../../../assets/sound/matrix/matrix.mp3";
        // audio.load();
        // audio.play();
        
        soundLoop = setInterval(() => {
            this.matrixAudio.nativeElement.play();
            //audio.play();
        }, 1000);
    }

    public ngOnDestroy(): void {
        clearInterval(gameLoop);
        clearInterval(soundLoop);
    }
}