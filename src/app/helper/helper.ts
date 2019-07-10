import { Coordinate } from "../model/coordinate";

export class Helper {
    public static get maxWidth(): number {
        return window.innerWidth;
    }

    public static get gravity(): number {
        return 9.8;
    }

    private static symbols = ["诶", "比", "西", "迪",
    "伊",
    "艾", "弗",
    "吉",
    "艾", "尺",
    "艾",
    "杰",
    "开",
    "艾", "勒",
    "马",
    "娜",
    "哦",
    "屁",
    "吉", "吾",
    "儿",
    "丝",
    "提",
    "伊", "吾",
    "维",
    "贝",
    "斯",
    "吾", "艾",
    "贼", "德"]

    public static randomChar(): string {
        let randomChar: any;
        let charType = Helper.randomInt(0, 5);
        if (charType > 1) {
            // set it to Katakana
            randomChar = String.fromCharCode(0x30A0 + Helper.randomInt(0, 96)
            );
        } else {
            // set it to numeric
            randomChar = Helper.randomInt(0, 9);
        }

        return randomChar;
    }
    
    private static colors: string[] = [
        "#92a8d1", "#034f84", "#f7cac9", "#f7786b",
        "#d5f4e6", "#80ced6", "#fefbd8", "#618685",
        "#618685", "#36486b", "#4040a1"
    ];


    public static matrixColors: string[] = ["#7FFF00", "#76EE00", "#66CD00", "#458B00", "#458B00"]; //, "#7CFC00"

    public static randomColor(): string {
        let rand: number = Helper.random(0, Helper.colors.length -7);
        return Helper.colors[rand - (rand % 1)];
    }

    public static get maxHeight(): number {
        return window.innerHeight;
    }

    public static random(min: number, max: number): number {
        return min + ((Math.random() * 4583) % (max - min));
    }

    public static randomInt(min: number, max: number): number {
        let doudle = Helper.random(min, max);

        return (doudle - (doudle % 1));
    }

    public static randomSymbol(): string {
        let index = Helper.randomInt(0, Helper.symbols.length - 1);

        return Helper.symbols[index];
    }

    public static abs(num: number) {
        return num < 0 ? -num : num;
    }

    public static distance(source: Coordinate, destination: Coordinate): number {
        let xSq = Math.pow((source.x - destination.x), 2);
        let ySq = Math.pow((source.y - destination.y), 2);

        return Math.pow(xSq + ySq, .5);
    }

    public static doubleToInt(n: number): number {
        return n - n%1;
    }
}
