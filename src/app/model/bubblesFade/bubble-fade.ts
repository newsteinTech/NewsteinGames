import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class BubbleFade {
    private static radiusReduceFactor : number = 0.4;
    // Properties
    public position: Coordinate;
    public radius: number;
    public dx: number;
    public dy: number;
    public color: string;

    public constructor(mouse: Coordinate) {
        this.radius = Helper.random(40, 60);
        this.color = Helper.randomColor();

        this.dx = Helper.random(-1.5, 1.5);
        this.dy = Helper.random(-1.5, 1.5);
        this.position = new Coordinate(mouse.x, mouse.y);
    }

    public update(): void {
        this.radius -= BubbleFade.radiusReduceFactor;

        this.position.x += this.dx;
        this.position.y += this.dy;
    }
}
