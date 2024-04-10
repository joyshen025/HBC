import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';


interface Product {
  vendorName: string;
  productCategory: string;
  productName: string;
  productModel: string;
  productUnit: string;
  productRemarks?: string;
}

@Component({
  selector: 'app-add-new-material',
  standalone: true,
  imports: [RouterOutlet,FormsModule],
  templateUrl: './add-new-material.component.html',
  styleUrl: './add-new-material.component.css'
})
export class AddNewMaterialComponent {



  product: Product = {
    vendorName: '',
    productCategory: '',
    productName: '',
    productModel: '',
    productUnit: ''
  };


  constructor(private http: HttpClient, private router: Router) { }




  addProduct() {

    if (!this.product.vendorName.trim()) {
      alert('請填寫廠商名稱');
      return;
    }
    if (!this.product.productName.trim()) {
      alert('請填寫商品名稱');
      return;
    }

    this.http.post('api/Kid/product', this.product).subscribe(
      () => {
        console.log('product added successfully!');
        this.router.navigate(['/Interface/Material']);
      },
      (error) => {
        console.error('Failed to add supplier:', error);
        alert('資料新增失敗');
      }
    );
  }
}
