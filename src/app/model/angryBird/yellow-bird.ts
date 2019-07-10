import { Coordinate } from "../coordinate";
import { ElementRef } from "@angular/core";
import { Helper } from "src/app/helper/helper";
import { BirdState } from "src/app/DataTypes/bird-state.enum";

var trajectoryInterval;
var birdInterval;

export class YellowBird {
    private static dx: number = 20;
    private static dy: number = 20;

    private xSpeed: number;
    private ySpeed: number;

    // Properties
    public position: Coordinate;
    public width: number;
    public height: number
    public state: BirdState;

    private gravity: number;

    public angle: number;
    public speed: number;
    public imageResourse : ElementRef

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.width / 2, this.position.y - this.height/2);

        return null;
    }

    constructor(imageRes:ElementRef ) {
        this.height = 40;
        this.width = 60;
        this.position = new Coordinate(this.width/2, Helper.maxHeight - this.height/2);
        this.imageResourse = imageRes;
        this.state = BirdState.STAND_BY;
        this.gravity = Helper.gravity;
    }

    // 1st
    public checkStandByToLaunch(mouse: Coordinate,launchCenter: Coordinate, context: CanvasRenderingContext2D) : void {
        if (this.state == BirdState.STAND_BY && this.onBird(mouse)) {
            console.log("first");
            this.drawLaunchReady(launchCenter, context);
            this.state = BirdState.IN_LAUNCH_POSITION;
        }
    }

    // 2nd
    public checkLaunchHold(mouse: Coordinate) : void {
        if (this.state == BirdState.IN_LAUNCH_POSITION && this.onBird(mouse)) {
            console.log("second");
            this.state = BirdState.HOLD_TO_LAUNCH;
        }
    }

    // 3rd
    public checkLaunchAngleSpeed(mouse: Coordinate, launchCenter: Coordinate, context: CanvasRenderingContext2D) : void {
        if (this.state == BirdState.HOLD_TO_LAUNCH || this.state == BirdState.SET_TO_LAUNCH) {
            console.log("third");

            let angle: number = this.getAngle(launchCenter, mouse)

            console.log (angle + " => " + mouse.y + " - " + launchCenter.y);
            this.state = BirdState.SET_TO_LAUNCH;
            context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            this.position.x = mouse.x;
            this.position.y = mouse.y;
            this.draw(context);

            let speed = Helper.distance(mouse, launchCenter) / 4;

            //console.log(speed);

            this.xSpeed = speed * Math.cos(angle);
            this.ySpeed = speed * Math.sin(angle);

            //console.log(speed + " " + this.xSpeed + " " + this.ySpeed);

            this.drawTrajectory(context);

            this.drawLine(launchCenter, mouse, context);
        }
    }

    // 4th
    public checkLaunchToFly(mouse: Coordinate,launchCenter: Coordinate, context: CanvasRenderingContext2D, time: number) : void {
        if (this.state == BirdState.SET_TO_LAUNCH && this.onBird(mouse)) {
            console.log("forth");
            this.state = BirdState.LAUNCHED;

            birdInterval = setInterval(() => { 
                context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);
                //console.log(this.position);
                //console.log(this.xSpeed);
                if (this.isBoundaryTouching()) {
                    clearInterval(birdInterval);
                }

                //console.log("Hello");
                this.move(time);
                this.draw(context);
            }, 10);
        }
    }

    // 5th
    public powerClick(context: CanvasRenderingContext2D, time: number): void{
        if (this.state == BirdState.LAUNCHED) {
            console.log("fifth");
            this.gravity = 0;
            this.xSpeed *= 2;
            this.ySpeed *= 2;

            this.state = BirdState.POWER_MODE;

            clearInterval(birdInterval);
            birdInterval = setInterval(() => { 
                context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);
                //console.log(this.position);
                //console.log(this.xSpeed);
                if (this.isBoundaryTouching()) {
                    clearInterval(birdInterval);
                }

                //console.log("Hello");
                this.move(time);
                this.draw(context);
            }, 10);
        }
    }

    public move(time): void {
        this.position.x += YellowBird.dx * this.xSpeed *  time;
        this.position.y -= YellowBird.dy * this.ySpeed * time;

        this.ySpeed = this.ySpeed - this.gravity * time;
    }

    public isBoundaryTouching(): boolean {
        if (this.position.x < 0)
            return true;

        if (this.position.x > Helper.maxWidth - this.width / 2) {
            this.xSpeed = 0;
            this.ySpeed = -Helper.gravity;
            return false;
        }

        // if (this.position.y < 0)
        //     return true;

        if (this.position.y > Helper.maxHeight - this.height / 2)
            return true

        return false;
    }

    public draw(context: CanvasRenderingContext2D) : void {
        context.drawImage(
            this.imageResourse.nativeElement,
            this.drawPosition.x,
            this.drawPosition.y,
            this.width,
            this.height);

            //console.log(this.position)
    }

    private onBird(mouse: Coordinate) : boolean {
        console.log("DIstance:" + Helper.distance(mouse, this.drawPosition));
        if (Helper.distance(mouse, this.position) < this.width/2) {
            return true;
        }

        return false;
    }

    private drawTrajectory(context: CanvasRenderingContext2D): void {
        let x = this.drawPosition.x;
        let y = this.drawPosition.y;
        let ySpeed = this.ySpeed

        clearInterval(trajectoryInterval);
        trajectoryInterval = setInterval(() => { 
            //context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (x > Helper.maxWidth || y > Helper.maxHeight) {
                clearInterval(trajectoryInterval);
            }

            context.beginPath();
            context.arc(x + this.width/2, y + this.height/2, 2, 0, Math.PI*2);
            context.fillStyle = "white";
            context.fill();
            context.closePath();

            x += YellowBird.dx * this.xSpeed *  .1;
            y -= YellowBird.dy * ySpeed * .1;

            ySpeed = ySpeed - this.gravity * .1;

            //console.log(x + "  " + y);
        }, 10);
    }

    private drawLaunchReady(launchCenter: Coordinate, context: CanvasRenderingContext2D): void {
        let source = new Coordinate(this.position.x, this.position.y);
        let lineSlop = this.lineSlop(source, launchCenter);
        //console.log(lineSlop);
        var x = setInterval(() => { 
            context.clearRect(0, 0, Helper.maxWidth, Helper.maxHeight);

            if (this.position.x < launchCenter.x) {
                this.position.x += 2;
                this.position.y = ( lineSlop * (this.position.x - source.x) + source.y);
                //console.log(lineSlop + " * " + this.position.x + " - " + source.x + " + " + source.y);
                //console.log(this.position);
            } else {
                clearInterval(x);
            }

            this.draw(context);
        }, 10);
    }

    private drawLine(source: Coordinate, destination: Coordinate, ctx: CanvasRenderingContext2D) : void {
        ctx.lineWidth = 10;
        ctx.strokeStyle = "Brown"
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(destination.x, destination.y);
        ctx.stroke();
    }

    private getAngle(center: Coordinate, point: Coordinate) : number{
        var deltaY = point.y - center.y;
        var deltaX = point.x - center.x;
        var theta = Math.atan2(deltaY, deltaX); // range (-PI, PI]
        theta = theta * 180 / Math.PI; // rads to degs, range (-180, 180]
        // if (theta < 0) theta = 360 + theta; // range [0, 360)
        return theta;
      }

      private lineSlop(source: Coordinate, destination: Coordinate) : number {
          return (destination.y - source.y)/(destination.x - source.x);
      }
}
