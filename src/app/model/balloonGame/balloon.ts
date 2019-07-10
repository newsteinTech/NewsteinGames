import { ElementRef } from "@angular/core";
import { Coordinate } from "../coordinate";
import { Helper } from "src/app/helper/helper";

export class Balloon {
    public drawImg: ElementRef;
        // Properties
        public position: Coordinate;
        public width: number;
        public height: number
        public speed: number;
    
        // Properties
        public get drawPosition(): Coordinate {
            if (this.position)
                return new Coordinate(this.position.x - this.width / 2, this.position.y - this.height / 2);
    
            return null;
        }
    
        public constructor(drawImg: ElementRef) {
            this.width = 100;
            this.height = 200;
            this.speed = 1;
            this.position = new Coordinate(Helper.random(300, Helper.maxWidth - this.width), Helper.maxHeight + this.height/2);

            this.drawImg = drawImg;
        }
    
        public move() : void{
            this.position.y -= this.speed; 
        }
    
        public isHittingTop() : boolean {
            return this.position.y <= 0;
        }
}
