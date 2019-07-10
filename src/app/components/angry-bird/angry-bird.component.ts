import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Helper } from 'src/app/helper/helper';
import { YellowBird } from 'src/app/model/angryBird/yellow-bird';
import { Coordinate } from 'src/app/model/coordinate';

var gameLoop;
var soundLoop;

@Component({
	selector: 'app-angry-bird',
	templateUrl: './angry-bird.component.html',
	styleUrls: ['./angry-bird.component.css']
})
export class AngryBirdComponent implements OnInit, AfterViewInit, OnDestroy {
	private static time: number = 10;

	// #region Images and Sound element
	@ViewChild('myCanvas') public canvas: ElementRef;
	@ViewChild('yellowBirdImg') public yellowBirdImg: ElementRef;


	private launchCenter: Coordinate;
	private bird: YellowBird;
	private mouse: Coordinate;

	private context: CanvasRenderingContext2D;
	constructor() {
		this.launchCenter = new Coordinate(200, Helper.maxHeight - 150);
		this.mouse = new Coordinate(0, 0);
	}

	ngOnInit() {
	}

	@HostListener('mousedown', ['$event'])
	onMouseDown(event: MouseEvent) {
		this.updateMouse(event);

		console.log("Mouse down: " + event);

		this.bird.checkLaunchHold(this.mouse);
	}

	@HostListener('mousemove', ['$event'])
	onMouseMove(event: MouseEvent) {
		this.updateMouse(event);
		//console.log("Mouse move: " + event);

		this.bird.checkLaunchAngleSpeed(this.mouse, this.launchCenter, this.context);
	}

	@HostListener('mouseup', ['$event'])
	onMouseUP(event: MouseEvent) {
		this.updateMouse(event);

		//console.log("Mouse Up: " + event);
		//this.bird.luanchedClick();

		this.bird.powerClick(this.context, AngryBirdComponent.time / 1000);
		this.bird.checkStandByToLaunch(this.mouse, this.launchCenter, this.context);
		this.bird.checkLaunchToFly(this.mouse, this.launchCenter, this.context, AngryBirdComponent.time / 1000);
		//this.bird.checkClickToLaunch(this.mouse, this.launchCenter, this.context);

	}

	public ngAfterViewInit(): void {
		this.setCanvas();

		this.bird = new YellowBird(this.yellowBirdImg);
		//this.bird.draw(this.context);

		setTimeout(() => {
			this.bird.draw(this.context);
			this.drawLaunchCenter();
		}, 1000)

		//this.bird.getReadyToLaunch(this.launchCenter, this.context);
		//this.bird.launch(30 * Math.PI / 180, 40, this.context);

		//this.runGame();
	}


	// #region Game rules
	private runGame(): void {
		gameLoop = setInterval(() => {
			this.context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

			if (!this.bird.isBoundaryTouching()) {
				this.bird.move(AngryBirdComponent.time / 1000);
				this.bird.draw(this.context);

			}

		}, AngryBirdComponent.time);
	}

	private setCanvas(): void {
		const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;

		// set the width and height
		canvasEl.width = Helper.maxWidth;
		canvasEl.height = Helper.maxHeight;

		this.context = this.canvas.nativeElement.getContext('2d');
	}

	public ngOnDestroy(): void {
		clearInterval(gameLoop);
		clearInterval(soundLoop);
	}

	private updateMouse(event: MouseEvent): void {
		this.mouse.x = event.x;
		this.mouse.y = event.y;

		//this.drawLaunchCenter();
	}

	private drawLaunchCenter(): void {
		this.context.beginPath();
		this.context.arc(this.launchCenter.x, this.launchCenter.y, 10, 0, Math.PI*2);
		this.context.fillStyle = "brown";
		this.context.fill();
		this.context.closePath();
	}
}
