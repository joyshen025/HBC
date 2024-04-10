import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import 'datatables.net-dt/css/dataTables.dataTables.css';

declare var $: any;

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  taxId?: string;
  supplierRemarks?: string;
  supplierType: string;
}

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class SupplierComponent implements AfterViewInit {

  supplier: Supplier[] = [];

  constructor(private http: HttpClient) { }

  ngAfterViewInit(): void {
    this.loadData();
  }


  //DataTable
  loadData() {
    this.http.get('api/Kid/Supplier').subscribe((data: any) => {
      $(document).ready(() => {
        let table = $('#example').DataTable({
          data: data,
          columns: [
            { title: '廠商名稱', data: 'supplierName', width: '10%' },
            {
              title: '', width: '10%',
              render: function (data: any, type: any, row: any) {
                return '<div style="padding:3px;">廠商類型</div>' +
                  '<div style="padding:3px;">廠商地址</div>' +
                  '<div style="padding:3px;">聯絡電話</div>' +
                  '<div style="padding:3px;">統編</div>' +
                  '<div style="padding:3px;">備註</div>';
              }
            },
            {
              title: '',
              render: (data: any, type: any, row: any) => {
                let remarks = row.supplierRemarks ? row.supplierRemarks : '無';
                let selectedOption = row.supplierType === '電商' ? ' selected' : '';
                return `<div style="padding: 3px;">
                           <select style="display: none; width: 450px;" id="select_type${row.supplierId}">
                             <option value="實體店家"}>實體店家</option>
                             <option value="電商"${selectedOption}>電商</option>
                           </select>
                           <span>${row.supplierType}</span>
                        </div>` +

                       '<div style="padding: 3px;">' +
                           '<input style="display: none; width: 450px;" type="text" id="input_address_' + row.supplierId + '" value="' + row.supplierAddress + '"></input>' +
                           '<span>' + row.supplierAddress + '</span>' +
                       '</div>' +

                       '<div style="padding: 3px;">' +
                           '<input style="display: none; width: 450px;" type="text" id="input_phone_' + row.supplierId + '" value="' + row.supplierPhone + '"></input>' +
                           '<span>' + row.supplierPhone + '</span>' +
                       '</div>' +

                       '<div style="padding: 3px;">' +
                           '<input style="display: none; width: 450px;" type="text" id="input_taxId_' + row.supplierId + '" value="' + row.taxId + '"></input>' +
                           '<span>' + row.taxId + '</span>' +
                       '</div>' +

                       '<div style="padding: 3px;">' +
                           '<input style="display: none; width: 450px;" type="text" id="input_remarks_' + row.supplierId + '" value="' + remarks + '"></input>' +
                           '<span>' + remarks + '</span>' +
                       '</div>';
            }

            },
            {
              title: '', width: '10%',
              render: function (data: any, type: any, row: any) {
                return '<button class="edit-button">編輯</button>' +
                  '<button class="save-button" style="display:none;">保存</button>' +
                  `<button class="delete-button" data-id="${row.supplierId}">刪除</button>`;
              }
            }
          ]
        });


        // 更新的按鈕
        $('#example').on('click', '.edit-button', (event: { target: any; }) => {
          let $row = $(event.target).closest('tr');
          let supplierId = $row.find('.delete-button').data('id');

          $row.find('.save-button').show();
          $row.find('.edit-button').hide();


          $('#select_type' + supplierId).show();
          $('#select_type' + supplierId).next('span').hide();

          $('#input_address_' + supplierId).show();
          $('#input_address_' + supplierId).next('span').hide();

          $('#input_phone_' + supplierId).show();
          $('#input_phone_' + supplierId).next('span').hide();

          $('#input_taxId_' + supplierId).show();
          $('#input_taxId_' + supplierId).next('span').hide();

          $('#input_remarks_' + supplierId).show();
          $('#input_remarks_' + supplierId).next('span').hide();
        });



        // 保存的按鈕
        $('#example').on('click', '.save-button', (event: { target: any; }) => {
          let $row = $(event.target).closest('tr');
          let supplierId = $row.find('.delete-button').data('id');
          let newValueType = $('#select_type' + supplierId).val();
          let newValueAddress = $('#input_address_' + supplierId).val();
          let newValuePhone = $('#input_phone_' + supplierId).val();
          let newValueTaxId = $('#input_taxId_' + supplierId).val();
          let newValueRemarks = $('#input_remarks_' + supplierId).val();

          let supplierName = $row.find('td:eq(0)').text();


          if (!newValueAddress) {
            alert('必須填寫廠商地址');
            return;
          }

          if (!newValuePhone) {
            alert('必須填寫聯絡電話');
            return;
          }

          if (!newValueTaxId || newValueTaxId.trim() === '') {
            newValueTaxId = '無';
          }

          if (!newValueRemarks || newValueRemarks.trim() === '') {
            newValueRemarks = '無';
          }

          let updatedSupplier: Supplier = {
            supplierId: supplierId,
            supplierType: newValueType,
            supplierName: supplierName,
            supplierAddress: newValueAddress,
            supplierPhone: newValuePhone,
            taxId: newValueTaxId,
            supplierRemarks: newValueRemarks,
          };

          //加入更新的邏輯
          this.updateSupplierData(updatedSupplier);

          $row.find('.save-button').hide();
          $row.find('.edit-button').show();


          $('#select_type' + supplierId).hide().next('span').text(newValueType).show();
          $('#input_address_' + supplierId).hide().next('span').text(newValueAddress).show();
          $('#input_phone_' + supplierId).hide().next('span').text(newValuePhone).show();
          $('#input_taxId_' + supplierId).hide().next('span').text(newValueTaxId).show();
          $('#input_remarks_' + supplierId).hide().next('span').text(newValueRemarks).show();
        });




        // 刪除按鈕
        $('#example').on('click', '.delete-button', (event: { target: any; }) => {
          let supplierId = $(event.target).data('id');
          this.deleteSupplier(supplierId);
        });
      });
    });
  }


  //刪除的邏輯
  deleteSupplier(supplierID: number) {
    let confirmDelete = confirm('確定要刪除這個供應商嗎？');
    if (confirmDelete) {
      this.http.delete(`api/Kid/Supplier/${supplierID}`).subscribe(() => {
        this.supplier = this.supplier.filter(p => p.supplierId !== supplierID);
        $('#example').DataTable().destroy();
        this.loadData();
      });
    }
  }


  //更新的邏輯
  updateSupplierData(item: Supplier) {
    this.http.put('api/Kid/Supplier/' + item.supplierId, item).subscribe(() => {
      console.log('更新成功');
    }, (error) => {
      console.error('更新失败:', error);
    });
  }
}
