import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class Bubble {
    // Properties
    public position: Coordinate;
    public radius: number;
    public speed: number;
    public xSpeed: number;
    public ySpeed: number;
    public color: string;

    public constructor() {
        this.radius = Helper.random(50, 100);
        this.color = Helper.randomColor();

        this.speed = Helper.random(0.1, 1.5);
        this.xSpeed = this.speed;
        this.ySpeed = this.speed;
        this.position = new Coordinate(Helper.random(2 * this.radius, Helper.maxWidth - 2 * this.radius), Helper.random(2 * this.radius, Helper.maxHeight - 2 * this.radius));
    }

    public move(): void {
        this.checkBoundary();

        this.position.x += (this.xSpeed);
        this.position.y += (this.ySpeed);
    }

    public collission(bubble: Bubble): Bubble {
        // Store mass in var for better readability in collision equation
        let m1 = this.radius;
        let m2 = bubble.radius;
        let x1 = this.xSpeed;

        this.xSpeed = ((m1 - m2) / (m1 + m2)) * x1 + (2 * m2 / (m1 + m2)) * bubble.xSpeed;

        // this.ySpeed = ((this.radius - bubble.radius) / (this.radius + bubble.radius)) * this.ySpeed + 
        //                 ((2 * bubble.radius) / (this.radius + bubble.radius)) * bubble.ySpeed;


        bubble.xSpeed = (2 * m2 / (m1 + m2)) * x1 + ((m1 - m2) / (m1 + m2)) * bubble.xSpeed;

        // bubble.ySpeed = ((2 * this.radius) / (this.radius + bubble.radius)) * this.ySpeed + 
        //             ((this.radius + bubble.radius) / (this.radius + bubble.radius)) * bubble.ySpeed;

        return bubble;
    }

    public rotate(angle: number) : void {
        let x1 = this.xSpeed;
        let y1 = this.ySpeed;
        this.xSpeed = x1 * Math.cos(angle) - y1 * Math.sin(angle),
        this.ySpeed = x1 * Math.sin(angle) + y1 * Math.cos(angle)
    }

    private checkBoundary(): void {
        if (this.position.x < this.radius || this.position.x > (Helper.maxWidth - this.radius)) {
            this.xSpeed = -this.xSpeed;
        }

        if (this.position.y < this.radius || this.position.y > (Helper.maxHeight - this.radius)) {
            this.ySpeed = -this.ySpeed;
        }
    }
}
