import { Direction } from "../../DataTypes/direction.enum";
import { Coordinate } from "../coordinate";
import { Helper } from "../../helper/helper";
import { Food } from "./food";

export class Snake {
    // Fields
    public direction: Direction;
    public position: Coordinate;
    private tail: Coordinate; // Will not use for now. Head = Tail
    public size: number; // Will keep fixed size 1 for now.
    public speed: number;
    public score: number;

    public static levelUpScore = 2;
    
    // Properties
    public get drawPosition() : Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.size / 2, this.position.y - this.size / 2);

        return null;
    }
    
    // Constructor
    public constructor() {
        this.size = 100;
        this.speed = 1;
        this.score = 0;
        this.direction = Direction.Left;
        this.position = new Coordinate(Helper.maxWidth/2, Helper.maxHeight/2);
    }

    // #region Methods
    public speedUp(): void {
        this.speed++;
    }

    public updateScore(): void {
        this.score++;

        if (this.score % Snake.levelUpScore == 0) {
            this.speedUp();
        }
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
    }

    public changeDirection(direction: Direction) {
        this.direction = direction;
    }

    public checkCollision(): boolean {
        if (this.position.x < 0 || 
            this.position.x > Helper.maxWidth ||
            this.position.y < 0 || 
            this.position.y > Helper.maxHeight) {
            return true;
        }

        return false;
    }

    public canEat(food: Food): boolean {
        if (
            Math.abs(this.position.x - food.position.x) < this.size/2 &&
            Math.abs(this.position.y - food.position.y) < this.size/2) {
            return true;
        }

        return false;
    }

    // #endregion
}
