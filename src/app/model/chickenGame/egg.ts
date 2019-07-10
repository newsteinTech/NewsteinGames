import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class Egg {
    // Properties
    public position: Coordinate;
    public size:number;
    public speed: number;

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.size / 2, this.position.y - this.size / 2);

        return null;
    }

    public constructor(chickenPostion: Coordinate, speed: number) {
        this.size = 50;
        this.speed = 2 * speed;
        this.position = new Coordinate(chickenPostion.x, chickenPostion.y);
    }

    public move() : void{
        this.position.y += this.speed; 
    }

    public isHittingGround() : boolean {
        let isHitting: boolean = this.position.y >= Helper.maxHeight - this.size / 2;

        if (isHitting) {
            this.size = 100;
        }

        return isHitting;
    }
}
