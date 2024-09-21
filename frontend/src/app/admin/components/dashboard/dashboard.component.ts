import { Component } from '@angular/core';
import {AdminService} from "../../service/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
  }

  getAllProducts = () => {
    this.products = [];
    this.adminService.getAllProducts().subscribe((res) => {
      res.forEach((element: { processedImg: string; byteImg: string }) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  };

  submitForm() {
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getAllProductsByName(title).subscribe((res) => {
      res.forEach((element: { processedImg: string; byteImg: string }) => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
    });
  }

  deleteProduct(productId: any) {
    this.adminService.deleteProduct(productId).subscribe(res => {
      if (res == null) {
        this.snackBar.open('Product delete successfully!', 'Close', { duration: 5000 });
        this.getAllProducts();
      } else {
        this.snackBar.open(res.massege, 'Close', { duration: 5000, panelClass: 'error-snackbar' });
        
      }
    })
  }

  
}
