import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { KeyCode } from 'src/app/DataTypes/key-code.enum';
import { Direction } from 'src/app/DataTypes/direction.enum';
import { Helper } from 'src/app/helper/helper';
import { Gun } from 'src/app/model/balloonGame/gun';
import { Balloon } from 'src/app/model/balloonGame/balloon';
import { Router } from '@angular/router';

var gameLoop;
var soundLoop;

@Component({
    selector: 'app-balloon-game',
    templateUrl: './balloon-game.component.html',
    styleUrls: ['./balloon-game.component.css']
})
export class BalloonGameComponent implements OnInit, AfterViewInit, OnDestroy {

    // #region Images and Sound element
    @ViewChild('myCanvas') public canvas: ElementRef;
    @ViewChild('gunImg') public gunImg: ElementRef;
    @ViewChild('bulletImg') public bulletImg: ElementRef;

    @ViewChild('darkRedBalloonImg') public darkRedBalloonImg: ElementRef;
    @ViewChild('redBalloonImg') public redBalloonImg: ElementRef;
    @ViewChild('pinkBalloonImg') public pinkBalloonImg: ElementRef;
    @ViewChild('blueBalloonImg') public blueBalloonImg: ElementRef;
    @ViewChild('darkGreenBalloonImg') public darkGreenBalloonImg: ElementRef;
    @ViewChild('greenBalloonImg') public greenBalloonImg: ElementRef;
    @ViewChild('lightGreenBalloonImg') public lightGreenBalloonImg: ElementRef;
    @ViewChild('goldenBalloonImg') public goldenBalloonImg: ElementRef;
    @ViewChild('heartBalloonImg') public heartBalloonImg: ElementRef;

    @ViewChild('bulletAudio') public bulletAudio: ElementRef;
    @ViewChild('eggCatchAudio') public eggCatchAudio: ElementRef;
    @ViewChild('balloonPopAudio') public balloonPopAudio: ElementRef;
    @ViewChild('balloonInflateAudio') public balloonInflateAudio: ElementRef;
    @ViewChild('gameOverAudio') gameOverAudio: ElementRef;

    // #endregion

    private context: CanvasRenderingContext2D;
    private static interval: number = 100;
    private static counter: number = 0;
    public level: number = 1;
    public balloonMissed: number = 0;
    public gameOver: boolean;
    

    public gun: Gun;
    public balloons: Balloon[];

    public constructor(private router: Router) {
        this.gun = new Gun();
        this.balloons = [];
    }

    public ngOnInit(): void {
    }

    @HostListener('window:keydown', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (this.gameOver) {
            return;
        }

        switch (event.keyCode) {
            case KeyCode.UP_ARROW:
                this.gun.move(Direction.Up)
                break;

            case KeyCode.DOWN_ARROW:
                this.gun.move(Direction.Down)
                break;

            case KeyCode.F_KEY:
                if (this.gun.fire()) {
                    this.playBulletAudio();
                } else {
                    this.playEggCatchAudio();
                }

                break;
        }
    }

    public ngAfterViewInit(): void {
        this.setCanvas();

        this.balloons.push(new Balloon(this.darkRedBalloonImg));
        this.runGame();
        //this.playBackgroundAudio();
    }

    // #region Game rules
    private runGame(): void {
        gameLoop = setInterval(() => {
            this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (!this.gameOver) {
                this.moveAndPop();
                this.checkAndAddBalloon();
                this.checkAndMoveBalloon();
                this.checkAndEndGame();
            }

            this.draw();
        }, 10);
    }

    private moveAndPop() {
        if (this.gun.bullet) {
            this.checkAndPopBalloon();
            this.gun.moveBullet();
        }
    }

    private checkAndAddBalloon() {
        if ((BalloonGameComponent.counter * this.level) > BalloonGameComponent.interval) {
            this.playBalloonInflateAudio();
            this.balloons.push(new Balloon(this.randomBalloon()));
            BalloonGameComponent.counter = 0;
            BalloonGameComponent.interval = Helper.random(100, 1000);
        }

        BalloonGameComponent.counter++;
    }

    private checkAndPopBalloon() {
        for (let i = this.balloons.length- 1; i >=0; i--) {
            if (this.gun.bullet.hitBalloon(this.balloons[i])) {
                this.balloons.splice(i, 1);
                this.playBalloonPopAudio();
                this.gun.scoreUp();

                if (this.gun.score % 10 == 0) {
                    this.level++;
                }
            }
        }

        BalloonGameComponent.counter++;
    }

    private checkAndMoveBalloon() {
        for (let i = this.balloons.length - 1; i >=0 ; i--) {
            if (this.balloons[i].isHittingTop()) {
                this.balloons.splice(i, 1);
                this.balloonMissed++;
            } else {
                this.balloons[i].move();
            }
        }
    }

    private checkAndEndGame() : void {
        if(this.balloonMissed >= 10) {
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
    private playBulletAudio(): void {
        this.bulletAudio.nativeElement.play();
    }

    private playEggCatchAudio(): void {
        this.eggCatchAudio.nativeElement.play();
    }

    private playBalloonPopAudio(): void {
        this.balloonPopAudio.nativeElement.play();
    }

    private playBalloonInflateAudio(): void {
        this.balloonInflateAudio.nativeElement.play();
    }

    private playGameOverAudio(): void {
        this.gameOverAudio.nativeElement.play();
    }
    // #endregion 

    // #region Draw logic

    private draw(): void {
        this.context.drawImage(
            this.gunImg.nativeElement,
            this.gun.drawPosition.x,
            this.gun.drawPosition.y,
            this.gun.width,
            this.gun.height);

        if (this.gun.bullet) {
            this.context.drawImage(
                this.bulletImg.nativeElement,
                this.gun.bullet.drawPosition.x,
                this.gun.bullet.drawPosition.y,
                this.gun.bullet.width,
                this.gun.bullet.heigth);
        }

        for (let i = 0; i < this.balloons.length; i++) {
            this.context.drawImage(
                this.balloons[i].drawImg.nativeElement,
                this.balloons[i].drawPosition.x,
                this.balloons[i].drawPosition.y,
                this.balloons[i].width,
                this.balloons[i].height);
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

    private randomBalloon() : ElementRef {
        let rand: number = Helper.randomInt(0, 9);

        switch(rand) {
            case 0:
                return this.darkRedBalloonImg;
            case 1:
                return this.redBalloonImg;
            case 2:
                return this.pinkBalloonImg;
            case 3:
                return this.blueBalloonImg;
            case 4:
                return this.darkGreenBalloonImg;
            case 5:
                return this.greenBalloonImg;
            case 6:
                return this.lightGreenBalloonImg;
            case 7:
                return this.goldenBalloonImg;
            case 8:
                return this.heartBalloonImg;
        }
    }
}
