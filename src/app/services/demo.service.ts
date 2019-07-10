import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from '../model/user/login-model';
import { SearchResponse } from '../model/demo/search-response';

@Injectable({
    providedIn: 'root'
})
export class DemoService {

    public constructor(private http: HttpClient) { }

    public demoGetRequest(): Observable<any> {
        let url: string = "http://api.stg.msupply.in/api/dashboard";

        let headers = new HttpHeaders({
            "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCAyIiwiZW1haWxJZCI6InRlc3RAZ21haWwuY29tIiwidXNlcklkIjoiNWI0ZDA3NTI3MTJlYTYwY2Y2MTAxOWY3IiwicGVybWlzc2lvbnMiOlsiMTAxIiwiMTAyIiwiMjAxIiwiMjAyIiwiMzAwIiwiNDAwIiwiNTAwIiwiNjAxIiwiNjAyIiwiNjAzIl0sImlhdCI6MTUzNjMxODkwNSwiZXhwIjoxNTY3ODU0OTA1fQ.pWja_OtH5g5oXVug597Cxg5aIuW7zRZPZGI7JF184Oc"
        });

        return this.http.get<any>(url, { headers: headers });
    }

    public demoPostRequest(model: LoginModel): Observable<any> {
        let url: string = "http://api.stg.msupply.in/buyerLogin";

        let headers = new HttpHeaders({
            "Content-Type":"application/json"
        });

        return this.http.post<any>(url, model, { headers: headers });
    }

    public demoLocalGet() : Observable<SearchResponse>{
        let url: string = "api/demo/search.json";
        
        return this.http.get<SearchResponse>(url);
    }
}
