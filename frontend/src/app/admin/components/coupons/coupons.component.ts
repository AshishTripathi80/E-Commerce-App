import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent {
  coupons: any;

  constructor(private adminService: AdminService) { }
  
  ngOnInit() {
    this.getCoupons();
  }

  getCoupons() {
    this.adminService.getCoupon().subscribe(res => {
      this.coupons = res;
    })
  }

}
