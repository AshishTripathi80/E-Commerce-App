import { Component } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute } from '@angular/router';
import { UserStorageService } from '../../../services/storage/user-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-product-detail',
  templateUrl: './view-product-detail.component.html',
  styleUrl: './view-product-detail.component.scss'
})
export class ViewProductDetailComponent {

  productId: number = this.activatedRoute.snapshot.params['productId'];
  product: any;
  FAQS: any[] = [];
  reviews: any[] = [];

  constructor(
    private customerService: CustomerService,
    private activatedRoute: ActivatedRoute,
    private snackbar:MatSnackBar
  ) { }

  ngOnInit() {
    this.getProductDetailById();
  }
  
  getProductDetailById() {
    this.customerService.getProductDetailById(this.productId).subscribe(res => {
      this.product = res.productDto;
      this.product.processedImg = 'data:image/png;base64,' + res.productDto.byteImg;
      this.FAQS = res.faqDtoList;

      res.reviewDtoList.forEach(element => {
        element.processedImg = 'data:image/png;base64,' + element.returnedImg;
        this.reviews.push(element);
      })
    })
  }

  addToWishlist() {
    const wishlistDto = {
      productId: this.productId,
      userId: UserStorageService.getUserId()
    }

    this.customerService.addProductToWishlist(wishlistDto).subscribe(res => {
      if (res.id != null) {
        this.snackbar.open('Product Add to Wishlist Successfully!', 'Close', {
          duration: 5000
        });
      } else {
        this.snackbar.open("Already in wishlist",'ERROR',{duration: 5000})
      };
    })
  }
}
