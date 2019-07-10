import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class Ball {
    private static overlapFactor: number = 80;
    private static resizeFactor: number = 1;
    private static maxRadius: number = 50;

    // Properties
    public position: Coordinate;
    public radius: number;
    public lastRadius: number;
    public speed: number;
    public dx: number;
    public dy: number;
    public color: string;

    public constructor() {
        this.radius = Helper.random(2, 10);
        this.lastRadius = this.radius;
        this.color = Helper.randomColor();

        this.dx = 1;
        this.dy = 1;
        this.speed = Helper.random(0.1, 1.5);
        this.position = new Coordinate(Helper.random(this.radius, Helper.maxWidth), Helper.random(this.radius, Helper.maxHeight));
    }

    public move(mouse: Coordinate): void {
        this.checkBoundary();

        this.position.x += (this.dx * this.speed);
        this.position.y += (this.dy * this.speed);

        if (this.mouseOverlap(mouse) && this.radius < Ball.maxRadius) {
            this.radius += Ball.resizeFactor;
        } else {
            this.radius = this.radius > this.lastRadius? this.radius - Ball.resizeFactor : this.lastRadius;
        }
    }

    private checkBoundary(): void {
        if (this.position.x < this.radius || this.position.x > (Helper.maxWidth - this.radius)) {
            this.dx = -this.dx;
        }

        if (this.position.y < this.radius || this.position.y > (Helper.maxHeight - this.radius)) {
            this.dy = -this.dy;
        }
    }

    private mouseOverlap(mouse: Coordinate): boolean {
        let distance = Helper.distance(this.position, mouse);

        return distance < Ball.overlapFactor;
    }
}
