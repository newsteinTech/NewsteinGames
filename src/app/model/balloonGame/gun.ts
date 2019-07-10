import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";
import { Direction } from "src/app/DataTypes/direction.enum";
import { Bullet } from "./bullet";

export class Gun {
    // Properties
    public position: Coordinate;
    public width: number;
    public height: number
    public speed: number;
    public score: number;

    public bullet: Bullet;

    // Properties
    public get drawPosition(): Coordinate {
        if (this.position)
            return new Coordinate(this.position.x - this.width / 2, this.position.y - this.height / 2);

        return null;
    }

    public constructor() {
        this.width = 160;
        this.height = 100;
        this.speed = 22;
        this.score = 0;
        this.position = new Coordinate(this.width/2, Helper.maxHeight/2);
    }

    public move(direction: Direction): void {
        switch (direction) {
            case Direction.Up:
                if (this.position.y <= this.height/2)
                    return;

                this.position.y -= this.speed;
                break;

            case Direction.Down:
                if (this.position.y > Helper.maxHeight)
                    return;

                this.position.y += this.speed;
                break;
        }
    }

    public moveBullet() : void {
        if (this.bullet) {
            if (this.bullet.isHittingGround()) {
                this.bullet = null;
            } else {
                this.bullet.move();
            }
        }
    }

    public scoreUp(): void {
        this.score++;
    }

    public speedUp(): void {
        this.speed++;
    }

    public fire() : boolean {
        if (this.bullet == null) {
            this.bullet = new Bullet(this.position, this.width, this.height);
            return true;
        }

        return false;
    }

    private isBoundaryTouching(): boolean {
        if (this.position.x < 0)
            return true;

        if (this.position.x > Helper.maxWidth)
            return true

        return false;
    }
}
