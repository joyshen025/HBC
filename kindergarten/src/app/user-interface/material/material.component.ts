import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { Router } from 'express';
import { RouterModule } from '@angular/router';

declare var $: any;
interface Product {
  productId?: number;
  vendorName: string;
  productCategory: string;
  productName: string;
  productModel: string;
  productUnit: string;
  productRemarks?: string;
}

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css'],
  standalone: true,
  imports: [RouterModule]
})

export class MaterialComponent implements AfterViewInit {
  products: Product[] = [];

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.loadData();
  }




  //DataTable
  loadData() {
    this.http.get<Product[]>('api/Kid/Product').subscribe(data => {
      this.products = data;
      $(document).ready(() => {
        $('#example').DataTable({
          data: this.products,
          columns: [
            { title: '廠商名稱', data: 'vendorName', width: '10%' },
            {
              title: '種類', width: '10%',
              render: function (data: any, type: any, row: any) {
                return '<div><input type="text" id="input_productCategory_' + row.productId + '" value="' + row.productCategory + '" style="display:none;"></input> <span>' +
                  row.productCategory + '</span></div>'
              }
            },
            {
              title: '商品名稱', width: '15%',
              render: function (data: any, type: any, row: any) {
                return '<div><input type="text" id="input_productName_' + row.productId + '" value="' + row.productName + '" style="display:none;"></input> <span>' +
                  row.productName + '</span></div>'
              }
            },
            {
              title: '編號', width: '15%',
              render: function (data: any, type: any, row: any) {
                return '<div><input type="text" id="input_productModel_' + row.productId + '" value="' + row.productModel + '" style="display:none;"></input> <span>' +
                  row.productModel + '</span></div>'
              }
            },
            {
              title: '單位', width: '5%',
              render: function (data: any, type: any, row: any) {
                return '<div><input type="text" id="input_productUnit_' + row.productId + '" value="' + row.productUnit + '" style="display:none;"></input> <span>' +
                  row.productUnit + '</span></div>'
              }
            },
            {
              title: '備註',
              render: function (data: any, type: any, row: any) {
                let remarks = row.productRemarks ? row.productRemarks : '';
                return '<div><input style="display:none; width: 100%;" type="text" id="input_remarks_' + row.productId + '" value="' + remarks + '" style="display:none;"></input> <span>' +
                  remarks + '</span></div>'
              }
            },
            {
              title: '', width: '10%',

              render: function (data: any, type: any, row: any) {
                return '<button class="edit-button">編輯</button>' +
                  '<button class="save-button" style="display:none;">保存</button>' +
                  `<button class="delete-button" data-id="${row.productId}">刪除</button>`;
              }
            }
          ],
          columnDefs: [
            { targets: [6], orderable: false }
          ]
        });


        // 更新的按鈕
        $('#example').on('click', '.edit-button', (event: { target: any; }) => {
          let $row = $(event.target).closest('tr');
          let supplierId = $row.find('.delete-button').data('id');

          $row.find('.save-button').show();
          $row.find('.edit-button').hide();

          $('#input_productCategory_' + supplierId).show();
          $('#input_productCategory_' + supplierId).next('span').hide();

          $('#input_productName_' + supplierId).show();
          $('#input_productName_' + supplierId).next('span').hide();

          $('#input_productModel_' + supplierId).show();
          $('#input_productModel_' + supplierId).next('span').hide();

          $('#input_productUnit_' + supplierId).show();
          $('#input_productUnit_' + supplierId).next('span').hide();

          $('#input_remarks_' + supplierId).show();
          $('#input_remarks_' + supplierId).next('span').hide();
        });


        // 保存的按鈕
        $('#example').on('click', '.save-button', (event: { target: any; }) => {
          let $row = $(event.target).closest('tr');
          let productId = $row.find('.delete-button').data('id');
          let newValueProductCategory = $('#input_productCategory_' + productId).val();
          let newValueProductName = $('#input_productName_' + productId).val();
          let newValueProductModel = $('#input_productModel_' + productId).val();
          let newValueProductUnit = $('#input_productUnit_' + productId).val();
          let newValueRemarks = $('#input_remarks_' + productId).val();

          let supplierName = $row.find('td:eq(0)').text();



          if (!newValueProductName) {
            alert('必須填寫商品名稱');
            return;
          }

          if (!newValueProductCategory || newValueProductCategory.trim() === '') {
            newValueProductCategory = '無';
          }

          if (!newValueProductModel || newValueProductModel.trim() === '') {
            newValueProductModel = '無';
          }


          if (!newValueProductUnit || newValueProductUnit.trim() === '') {
            newValueProductUnit = '無';
          }

          if (!newValueRemarks || newValueRemarks.trim() === '') {
            newValueRemarks = '無';
          }



          let updatedSupplier: Product = {
            productId: productId,
            vendorName: supplierName,
            productCategory: newValueProductCategory,
            productName: newValueProductName,
            productModel: newValueProductModel,
            productUnit: newValueProductUnit,
            productRemarks: newValueRemarks,
          };

          //加入更新的邏輯
          this.updateProductData(updatedSupplier);

          $row.find('.save-button').hide();
          $row.find('.edit-button').show();

          $('#input_productCategory_' + productId).hide().next('span').text(newValueProductCategory).show();
          $('#input_productName_' + productId).hide().next('span').text(newValueProductName).show();
          $('#input_productModel_' + productId).hide().next('span').text(newValueProductModel).show();
          $('#input_productUnit_' + productId).hide().next('span').text(newValueProductUnit).show();
          $('#input_remarks_' + productId).hide().next('span').text(newValueRemarks).show();
        });



        // 刪除按鈕
        $('#example').on('click', '.delete-button', (event: { target: any; }) => {
          let productId = $(event.target).data('id');
          this.deleteProduct(productId);
        });
      });
    });
  }


  //刪除的邏輯
  deleteProduct(productId: number) {
    let confirmDelete = confirm('確定要刪除這個產品嗎？');
    if (confirmDelete) {
      this.http.delete(`api/Kid/Product/${productId}`).subscribe(() => {
        this.products = this.products.filter(p => p.productId !== productId);
        $('#example').DataTable().destroy();
        this.loadData();
      });
    }
  }


  //更新的邏輯
  updateProductData(item: Product) {
    this.http.put('api/Kid/Product/' + item.productId, item).subscribe(() => {
      console.log('更新成功');
    }, (error) => {
      console.error('更新失败:', error);
    });
  }


}
