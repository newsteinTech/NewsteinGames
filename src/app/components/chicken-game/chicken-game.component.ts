import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Chicken } from 'src/app/model/chickenGame/chicken';
import { KeyCode } from 'src/app/DataTypes/key-code.enum';
import { Helper } from 'src/app/helper/helper';
import { Direction } from 'src/app/DataTypes/direction.enum';
import { Basket } from 'src/app/model/chickenGame/basket';
import { Router } from '@angular/router';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-chicken-game',
    templateUrl: './chicken-game.component.html',
    styleUrls: ['./chicken-game.component.css']
})
export class ChickenGameComponent implements AfterViewInit, OnDestroy {
    private static interval: number = 100;
    private static counter: number = 0;
    public gameOver: boolean;
    public level: number = 1;

    public chicken: Chicken;
    public basket: Basket;

    // #region Images and Sound element
    @ViewChild('myCanvas') public canvas: ElementRef;
    @ViewChild('chickenLeftImg') public chickenLeftImg: ElementRef;
    @ViewChild('chickenRightImg') public chickenRightImg: ElementRef;
    @ViewChild('basketImg') public basketImg: ElementRef;
    @ViewChild('eggImg') public eggImg: ElementRef;
    @ViewChild('eggCrashImg') public eggCrashImg: ElementRef;

    // @ViewChild('snakeRight') public snakeRightImg: ElementRef;
    // @ViewChild('bug') public foodImg: ElementRef;

    @ViewChild('chickenSwingAudio') public chickenSwingAudio: ElementRef;
    @ViewChild('layEggAudio') public layEggAudio: ElementRef;
    @ViewChild('cricketAudio') public cricketAudio: ElementRef;
    @ViewChild('eggCrackAudio') public eggCrackAudio: ElementRef;
    @ViewChild('eggCatchAudio') public eggCatchAudio: ElementRef;
    @ViewChild('bounceAudio') public bounceAudio: ElementRef;
    @ViewChild('gameOverAudio') gameOverAudio: ElementRef;
    
    // #endregion 

    private context: CanvasRenderingContext2D;
    private resume: boolean = true;
    private levelUpThreshold: number;

    private directionChangeInterval: number;
    private directionChangeCounter: number;

    public eggMissed: number;

    public constructor(private router: Router) {
        this.levelUpThreshold = 10;
        this.eggMissed = 0;

        this.directionChangeInterval = 50;
        this.directionChangeCounter = 0;


        this.chicken = new Chicken();
        this.basket = new Basket();
    }

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (this.gameOver) {
            return;
        }

        switch (event.keyCode) {
            case KeyCode.RIGHT_ARROW:
                this.basket.move(Direction.Right)
                break;

            case KeyCode.LEFT_ARROW:
                this.basket.move(Direction.Left)
                break;
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
            this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (!this.gameOver) {
                this.checkAndEndGame();
                this.checkAndLayEgg();
                this.checkAndChangeDirection();
                this.chicken.move();
                this.catchOrMoveEgg();
            }

            this.draw();
        }, 10);
    }

    private catchOrMoveEgg() {
        for (let i = this.chicken.eggs.length - 1; i >= 0; i--) {
            if (this.basket.catchEgg(this.chicken.eggs[i].position)) {
                this.basket.scoreUp();
                this.chicken.eggs.pop();
                this.playEggCatchAudio();

                this.checkAndLevelUp();
            }
            else if (this.chicken.eggs[i].isHittingGround()) {  
                if (this.resume) {
                    this.playEggCrackAudio();

                    setTimeout(() => {
                        this.draw();
                        this.resume = true;
                        this.chicken.eggs.pop();
                        this.eggMissed++;
                    }, 400)

                    this.resume = false;
                }
            } else {
                this.chicken.eggs[i].move();
            }
        }
    }

    private checkAndLevelUp() : void {
        if (this.basket.score % this.levelUpThreshold == 0) {
            this.level++;
            this.chicken.speedUp();
        }
    }

    private checkAndLayEgg() {
        if ((ChickenGameComponent.counter * this.level) > ChickenGameComponent.interval) {
            this.playLayEggAudio();
            this.chicken.layEgg();
            ChickenGameComponent.counter = 0;
            ChickenGameComponent.interval = Helper.random(100, 1000);
        }
        
        ChickenGameComponent.counter++;
    }

    private checkAndChangeDirection() {
        if ((this.directionChangeCounter * this.level) > this.directionChangeInterval) {
            this.playChickenSwingAudio();
            this.chicken.changeDirection();
            this.directionChangeCounter = 0;
            this.directionChangeInterval = Helper.random(100, 3000);
        }

        if (this.chicken.checkBoundary()) {
            this.playBounceAudio();
        }

        this.directionChangeCounter++;
    }

    private checkAndEndGame() : void {
        if(this.eggMissed >= 10) {
            // Stop game.
            this.playGameOverAudio();
            this.gameOver = true;

            setTimeout(() => {
                clearInterval(gameLoop);
                clearInterval(soundLoop);
                this.router.navigate([""]);
            }, 1600)
        }
    }

    // #endregion 

    // #region Play Sound
    private playBackgroundAudio(): void {
        soundLoop = setInterval(() => {
            this.cricketAudio.nativeElement.play();
        }, 10);
    }

    private playEggCrackAudio(): void {
        this.eggCrackAudio.nativeElement.play();
    }

    private playEggCatchAudio(): void {
        this.eggCatchAudio.nativeElement.play();
    }
    
    private playBounceAudio(): void {
        this.bounceAudio.nativeElement.play();
    }
    
    private playLayEggAudio(): void {
        this.layEggAudio.nativeElement.play();
    }

    private playChickenSwingAudio(): void {
        this.chickenSwingAudio.nativeElement.play();
    }

    private playGameOverAudio(): void {
        this.gameOverAudio.nativeElement.play();
    }
    // #endregion

    // #region Draw logic

    private draw(): void {
        this.context.drawImage(
            this.chicken.direction == Direction.Left ? this.chickenLeftImg.nativeElement : this.chickenRightImg.nativeElement,
            this.chicken.drawPosition.x,
            this.chicken.drawPosition.y,
            this.chicken.size,
            this.chicken.size);

        for (let i = 0; i < this.chicken.eggs.length; i++) {
            this.context.drawImage(
                this.chicken.eggs[i].isHittingGround() ? this.eggCrashImg.nativeElement : this.eggImg.nativeElement,
                this.chicken.eggs[i].drawPosition.x,
                this.chicken.eggs[i].drawPosition.y,
                this.chicken.eggs[i].size,
                this.chicken.eggs[i].size);
        }

        this.context.drawImage(
            this.basketImg.nativeElement,
            this.basket.drawPosition.x,
            this.basket.drawPosition.y,
            this.basket.size,
            this.basket.size);

    }


    /*
    private drawCollision(): void {
        this.context.drawImage(
            this.boomImg.nativeElement, 
            this.snake.position.x - 100, 
            this.snake.position.y - 100, 
            200, 
            200);
    }
  
    private drawTasty(): void {
        this.context.drawImage(
            this.tastyImg.nativeElement, 
            this.food.position.x - 100, 
            this.food.position.y - 100, 
            200, 
            200);
    }
    */

    private setCanvas(): void {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

        // set the width and height
        canvasEl.width = Helper.maxWidth;
        canvasEl.height = Helper.maxHeight;

        this.context = this.canvas.nativeElement.getContext('2d');

        // this.snakeImageRef = this.snakeImg;
    }
    // #endregion

    public ngOnDestroy() : void {
        clearInterval(gameLoop);
        clearInterval(soundLoop);
    }
}
