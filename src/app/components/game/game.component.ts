import { Component, ViewChild, ElementRef, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { Snake } from '../../model/snakeGame/snake';
import { Food } from '../../model/snakeGame/food';
import { Direction } from '../../DataTypes/direction.enum';
import { Helper } from 'src/app/helper/helper';
import { KeyCode } from 'src/app/DataTypes/key-code.enum';
import { Router } from '@angular/router';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {
    public snake: Snake;
    public food: Food;

    // #region Images and Sound element
    @ViewChild('myCanvas') public canvas: ElementRef;
    @ViewChild('tidda') public snakeImg: ElementRef;
    @ViewChild('snakeRight') public snakeRightImg: ElementRef;
    @ViewChild('bug') public foodImg: ElementRef;
    @ViewChild('boom') public boomImg: ElementRef;
    @ViewChild('tasty') public tastyImg: ElementRef;

    @ViewChild('cricketAudio') snakeAudio: ElementRef;
    @ViewChild('explosionAudio') explosionAudio: ElementRef;
    @ViewChild('yummyAudio') yummyAudio: ElementRef;
    @ViewChild('diceRollAudio') diceRollAudio: ElementRef;
    // #endregion 

    private context: CanvasRenderingContext2D;
    private snakeImageRef: ElementRef;
    private resume: boolean = true;

    public constructor(private router: Router) {
        this.snake = new Snake();
        this.food = new Food();
    }

    @HostListener('window:keyup', ['$event'])
    keyUpEvent(event: KeyboardEvent) {
        switch(event.keyCode) {
            case KeyCode.DOWN_ARROW:
                this.snake.changeDirection(Direction.Down);
                break;
                
            case KeyCode.UP_ARROW:
                this.snake.changeDirection(Direction.Up);
                break;
                
            case KeyCode.RIGHT_ARROW:
                this.snake.changeDirection(Direction.Right);
                this.snakeImageRef = this.snakeRightImg;
                break;
                
            case KeyCode.LEFT_ARROW:
                this.snake.changeDirection(Direction.Left);
                this.snakeImageRef = this.snakeImg;
                break;
        }
    }

    @HostListener('window:keydown', ['$event'])
    keyDownEvent(event: KeyboardEvent) {
        switch(event.keyCode) {
            case KeyCode.DOWN_ARROW:
                this.snake.changeDirection(Direction.Down);
                break;
                
            case KeyCode.UP_ARROW:
                this.snake.changeDirection(Direction.Up);
                break;
                
            case KeyCode.RIGHT_ARROW:
                this.snake.changeDirection(Direction.Right);
                this.snakeImageRef = this.snakeRightImg;
                break;
                
            case KeyCode.LEFT_ARROW:
                this.snake.changeDirection(Direction.Left);
                this.snakeImageRef = this.snakeImg;
                break;
        }
    }
  
    public ngAfterViewInit(): void {
        this.setCanvas();

        this.runGame();
        this.playBackgroundAudio();
    }

    // #region Game rules
    private runGame(): void {
        gameLoop = setInterval(() => {
            this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (this.snake.checkCollision()) {
                this.drawCollision();
                this.playExplosionAudio();
    
                // Stop game.
                setTimeout(() => {
                    clearInterval(gameLoop);
                    clearInterval(soundLoop);
                    this.router.navigate([""]);
                }, 800)
            } else if (this.snake.canEat(this.food)) {
                if (this.resume) {
                    this.snake.updateScore();
                    this.food.speedUp(this.snake.speed);
                    this.playYummyAudio();
                    this.drawTasty();
                    this.playDiceRollAudio();

                    setTimeout(() => {
                        this.food.generateNew();
                        this.draw();
                        this.resume = true
                    }, 400)

                    this.resume = false;
                } else {
                    this.drawTasty();
                }
            } else {
                this.snake.move();
                this.food.move();
                this.draw();
            }
        }, 10);
    }

    // #endregion 

    // #region Play Sound
    private playBackgroundAudio(): void {
        soundLoop = setInterval(() => {
            this.snakeAudio.nativeElement.play();
        }, 10);
    }

    private playExplosionAudio(): void {
        this.explosionAudio.nativeElement.play();
    }

    private playYummyAudio(): void {
        this.yummyAudio.nativeElement.play();
    }

    private playDiceRollAudio(): void {
        this.diceRollAudio.nativeElement.play();
    }
    
    // #endregion

    // #region Draw logic

    private draw(): void {
            this.context.drawImage(
                this.snakeImageRef.nativeElement, 
                this.snake.drawPosition.x,
                this.snake.drawPosition.y,
                this.snake.size, 
                this.snake.size);

        this.context.drawImage(
            this.foodImg.nativeElement, 
            this.food.drawPosition.x,
            this.food.drawPosition.y,
            this.food.size, 
            this.food.size);
    }

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

    private setCanvas(): void {
        const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    
        // set the width and height
        canvasEl.width = Helper.maxWidth;
        canvasEl.height = Helper.maxHeight;

        this.context = this.canvas.nativeElement.getContext('2d');

        this.snakeImageRef = this.snakeImg;
    }
    // #endregion

    public ngOnDestroy(): void {
        clearInterval(gameLoop);
        clearInterval(soundLoop);
    }
}
