import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

interface Supplier {
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  taxId?: string;
  supplierRemarks?: string;
  supplierType:string;
}

@Component({
  selector: 'app-add-new-supplier',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './add-new-supplier.component.html',
  styleUrl: './add-new-supplier.component.css'
})

export class AddNewSupplierComponent {

  supplier: Supplier = {
    supplierName: '',
    supplierAddress: '',
    supplierPhone: '',
    supplierType: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  addSupplier() {
    if (!this.supplier.supplierName.trim()) {
      alert('請填寫廠商名稱');
      return;
    }
    if (!this.supplier.supplierType.trim()) {
      alert('請選擇廠商類型');
      return;
    }
    if (!this.supplier.supplierAddress.trim()) {
      alert('請填寫廠商地址');
      return;
    }
    if (!this.supplier.supplierPhone.trim()) {
      alert('請填寫廠商電話');
      return;
    }


    if (!this.supplier.taxId) {
      this.supplier.taxId = '無';
    }

    this.http.post('api/Kid/Supplier', this.supplier).subscribe(
      () => {
        console.log('Supplier added successfully!');
        this.router.navigate(['/Interface/Supplier']);
      },
      (error) => {
        console.error('Failed to add supplier:', error);
        alert('資料新增失敗');
      }
    );
  }
}
