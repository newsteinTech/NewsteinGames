import { Coordinate } from "../coordinate";
import { Direction } from "../../DataTypes/direction.enum";
import { Helper } from "../../helper/helper";

export class Basket {
    // Properties
    public position: Coordinate;
    public size:number;
    public speed: number;
    public score: number;

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.size / 2, this.position.y - this.size / 2);

        return null;
    }
        
    public constructor() {
        this.size = 100;
        this.speed = 22;
        this.score = 0;
        this.position = new Coordinate(Helper.maxWidth/2, Helper.maxHeight - 2 * this.size / 5);
    }

    public move(direction: Direction) : void {
        switch (direction) {
            case Direction.Left:
                if (this.position.x < 0) 
                    return;

                this.position.x -= this.speed;
                break; 

            case Direction.Right:
                if (this.position.x > Helper.maxWidth)
                    return;

                this.position.x += this.speed;
                break;  
        }
    }

    public scoreUp() : void {
        this.score++;
    }

    public speedUp() : void {
        this.speed++;
    }

    public catchEgg(position: Coordinate): boolean {
        if (Helper.abs(this.position.x - position.x) < this.size/2 &&
            this.position.y - position.y < 10) {
            return true;
        } 

        return false;
    }

    private isBoundaryTouching() : boolean {
        if (this.position.x < 0) 
            return true;
        
        if (this.position.x > Helper.maxWidth)
            return true
        
        return false;
    }
}
