import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UserStorageService} from "../storage/user-storage.service";

const BASIC_URL = "http://localhost:8080/api/auth/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private userStorageService: UserStorageService) {
  }

  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "register", signupRequest);
  }


  login(email: string, password: string): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = {email, password};

    return this.http.post(BASIC_URL + 'login', body, {headers, observe: 'response'}).pipe(
      map((res) => {
          const authHeader = res.headers.get('authorization');
          if (authHeader) {
            const token = authHeader.substring(7);
            const user = res.body;
            if (token && user) {
              this.userStorageService.saveToken(token);
              this.userStorageService.saveUser(user);
              return true;
            }
          } else {
            console.error('Authorization header is missing');
          }
          return false;
        }
      )
    )
  }

  getOrderByTrackingId(trackingId: number): Observable<any>{
    return this.http.get(BASIC_URL + `order/${trackingId}`);
  }
}
