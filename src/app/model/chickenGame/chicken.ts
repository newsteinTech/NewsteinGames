import { Coordinate } from "../coordinate";
import { Direction } from "../../DataTypes/direction.enum";
import { Egg } from "./egg";
import { Helper } from "../../helper/helper";

export class Chicken {
    // Properties
    public position: Coordinate;
    public size:number;
    private speed: number;
    public direction: Direction;

    public eggs: Egg[];

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.size / 2, this.position.y - this.size / 2);

        return null;
    }

    public constructor() {
        this.size = 100;
        this.speed = 1;
        this.direction = Direction.Left;
        this.position = new Coordinate(
            Helper.random(this.size/2, Helper.maxWidth - this.size/2), 
            this.size/2 + 12);

        this.eggs = [];
    }

    public move() {
        switch (this.direction) {
            case Direction.Left:
                this.position.x -= this.speed;
                break; 

            case Direction.Right:
                this.position.x += this.speed;
                break;  
        }

        if(this.checkBoundary()) {
            this.changeDirection();
        }
    }

    public speedUp() {
        this.speed++;
    }

    public changeDirection() : void {
        if (this.direction == Direction.Left) {
            this.direction = Direction.Right;
        } else {
            this.direction = Direction.Left;
        }
    }

    public layEgg(): void {
        let egg = new Egg(this.position, 1 /* this.speed */);
        this.eggs.splice(0, 0, egg); // Add egg at start;
    }

    public checkBoundary() : boolean {
        if (this.position.x < 0) {
            return true;
        } else if (this.position.x > Helper.maxWidth) {
            return true;
        }

        return false;
    }
}
