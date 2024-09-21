import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/storage/user-storage.service';

const BASIC_URL = 'http://localhost:8080/api/customer/';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<any> {
    return this.http.get(BASIC_URL + 'products', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProductsByName(name: any): Observable<any> {
    return this.http.get(BASIC_URL + `search/${name}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  addToCart(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };

    return this.http.post(BASIC_URL + 'cart', cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  increaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };

    return this.http.post(BASIC_URL + 'addition', cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  decreaseProductQuantity(productId: any): Observable<any> {
    const cartDto = {
      productId: productId,
      userId: UserStorageService.getUserId(),
    };

    return this.http.post(BASIC_URL + 'deduction', cartDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCartByUserId(): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `cart/${userId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  applyCoupon(code: any): Observable<any> {
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `coupon/${userId}/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  placeOrder(orderDto:any): Observable<any> {
    orderDto.userId = UserStorageService.getUserId();
    return this.http.post(BASIC_URL + 'placeOrder', orderDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOrderByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `myOrders/${userId}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  getOrderedProducts(orderId: number): Observable<any>{
    return this.http.get(BASIC_URL + `ordered-products/${orderId}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  private createAuthorizationHeader(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      'Bearer ' + UserStorageService.getToken()
    );
  }
}
