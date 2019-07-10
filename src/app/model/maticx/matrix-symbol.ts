import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class MatrixSymbol {
    public head: Coordinate;
    public tail: Coordinate;

    public currentChar: string;
    public nextChar: string;
    public speed: number;
    public speedCounter: number;
    public colorIndex: number;
    public fontSize: number;

    public constructor(x: number) {
        this.head = new Coordinate(x, Helper.random(10, 100));
        this.tail = new Coordinate(x, this.head.y);
        this.fontSize = Helper.randomInt(10, 21)
        this.colorIndex = 3 - Helper.doubleToInt((this.fontSize - 10)/4);
        this.speed = Helper.randomInt(1, 30);
        this.speedCounter = this.speed;

        this.nextChar = Helper.randomChar();
        this.currentChar = this.nextChar;
    }

    public update(): void {
        if (this.head.y <= Helper.maxHeight + this.fontSize) {

            if (this.speedCounter < 0) {
                this.head.y += this.fontSize;

                this.currentChar = this.nextChar;
                this.nextChar = Helper.randomChar();
                this.speedCounter = this.speed;
            } else {
                this.speedCounter--;
            }
        } else {
            if (this.speedCounter < 0) {
                this.tail.y += (2 * this.fontSize);
                this.speedCounter = this.speed;
            } else {
                this.speedCounter--;
            }
        }
    }
}
