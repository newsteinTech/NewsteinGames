import { Coordinate } from "../coordinate";
import { Helper } from "../../helper/helper";
import { Direction } from "../../DataTypes/direction.enum";

export class Food {
    // Properties
    public position: Coordinate;
    public size:number;
    public speed: number;
    public direction: Direction;

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.size / 2, this.position.y - this.size / 2);

        return null;
    }

    // Constructor
    public constructor() {
        this.size = 80;
        this.speed = 0.5;
        this.generateNew();
    } 

    // #region Methods

    public generateNew() : void {
        this.position = this.randomCoordinate();
        this.direction = this.randomDirection();
    }

    public speedUp(level: number) : void {
        this.speed = level * 0.5;
    }

    public move() : void {
        switch (this.direction) {
            case Direction.Up:
                this.position.y -= this.speed;
                break; 

            case Direction.Down:
                this.position.y += this.speed;
                break; 

            case Direction.Left:
                this.position.x -= this.speed;
                break; 

            case Direction.Right:
                this.position.x += this.speed;
                break;  
        }

        this.checkBoundary();
    }

    private checkBoundary() : void {
        if (this.position.y < 0) {
            this.position.x = Helper.random(this.size/2, Helper.maxWidth - this.size/2);
            this.position.y = Helper.maxHeight;
        } else if (this.position.y > Helper.maxHeight) {
            this.position.x = Helper.random(this.size/2, Helper.maxWidth - this.size/2);
            this.position.y = 0;
        } else if (this.position.x < 0) {
            this.position.x = Helper.maxWidth;
            this.position.y = Helper.random(this.size/2, Helper.maxHeight - this.size/2);
        } else if (this.position.x > Helper.maxWidth) {
            this.position.x = 0;
            this.position.y = Helper.random(this.size/2, Helper.maxHeight - this.size/2);
        }
    }

    private randomCoordinate(): Coordinate {
        let x = Helper.random(this.size/2, Helper.maxWidth - this.size/2);
        let y = Helper.random(this.size/2, Helper.maxHeight - this.size/2);

        return new Coordinate(x, y);
    }

    private randomDirection(): Direction {
        let rand = Helper.random(1, 4);
        rand = rand - (rand % 1);
        
        return rand;
    }

    // #endregion
}
