import { Component, OnInit } from '@angular/core';
import { DemoService } from 'src/app/services/demo.service';
import { Observable } from 'rxjs';
import { LoginModel } from 'src/app/model/user/login-model';
import { Company } from 'src/app/model/demo/company';

@Component({
    selector: 'app-game-setup',
    templateUrl: './game-setup.component.html',
    styleUrls: ['./game-setup.component.css']
})
export class GameSetupComponent implements OnInit {

    public title: string;
    public loginModel: LoginModel;
    public companies: Company[];

    constructor(private demoService: DemoService) {
        this.title = 'Newstein Games';
        this.loginModel = new LoginModel();
    }

    public ngOnInit(): void {
    }

    public ngOnInit2(): void {
        this.demoService.demoLocalGet().subscribe(
            reposnse => {
                console.log("API request succeeded!");
                console.log(reposnse);

                if (reposnse.isValid == true) {
                    this.companies = reposnse.data;
                }
            },
            error => {
                console.log("API request failed");
                console.log(error);
            }
        )
    }

    public onEncript(tag: string): void {
        let shift = 24;
        var letter =['a','b','c','d','e','f','g','h','i','j', 'k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        
        let result = "";

        for (var i = 0; i < tag.length; i++){
            let x = tag.charAt(i);
            let charIndex = letter.indexOf(x);
            let numberIndex = numbers.indexOf(x);

            let y;
            if (charIndex >= 0) {
                y = letter[(charIndex + shift) % 26];
            } else if (numberIndex >= 0) {
                y = numbers[(numberIndex + shift) % 10]
            } else {
                y = x;
            }

            result += y;
        }

        this.loginModel.password = result;
    }

    public onSubmit(): void {
        console.log(this.loginModel);

        this.demoService.demoPostRequest(this.loginModel).subscribe(
            data => {
                console.log(data);
                this.title = data;
            },
            error => {
                console.log("API request failed");
                console.log(error);
            }
        )
    }
}
