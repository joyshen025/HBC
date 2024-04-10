import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


interface Staff {
  staffid: number;
  staffname: string;
  permissions: string;
  contactnumber: string;
  account: string;
  email: string;
  isEdit: boolean;
  image: string;
}


@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})

export class PermissionsComponent implements OnInit {

  isLoggedIn: boolean = false;

  staff: Staff[] = [];
  newAccount: any;
  newPassword: any;
  confirmPassword: any;
  userName: any;
  userPhone: any;
  userPermission: any;
  selectedStaff: Staff | undefined;
  selectedStaffId!: number;


  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  ngOnInit(): void {
    this.http.get<Staff[]>('api/Kid/Staff').subscribe(data => {
      this.staff = data;
    });
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    const isLoggedIn = this.cookieService.get('isLoggedIn');
    this.isLoggedIn = isLoggedIn === 'true';
  }



  //創新帳號
  addNewAccount() {
    if (!this.newAccount || !this.newPassword || !this.confirmPassword || !this.userName || !this.userPhone || !this.userPermission) {
      alert('請完整填寫');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('請檢查密碼');
      return;
    }

    this.http.get<boolean>('api/Kid/Account/' + this.newAccount).subscribe({
      next: (accountExists) => {
        if (accountExists) {
          alert('帳號已存在');
        } else {
          let accountData = {
            accountid: 0,
            account1: this.newAccount,
            password: this.confirmPassword,
            permission: this.userPermission
          };

          this.http.post('api/Kid/Account', accountData).subscribe({
            next: () => {
              let staffData = {
                staffid: 0,
                staffname: this.userName,
                permissions: this.userPermission,
                contactnumber: this.userPhone,
                account: this.newAccount,
                image: "https://res.cloudinary.com/dntokf0em/image/upload/v1711612097/test/ys1on7zrxmroha8qn2co.png"
              };

              this.http.post('api/Kid/Staff', staffData).subscribe({
                next: () => {
                  alert('創建成功');
                  this.newAccount = '';
                  this.newPassword = '';
                  this.confirmPassword = '';
                  this.userName = '';
                  this.userPhone = '';
                  this.userPermission = '';
                  window.location.reload();
                },
                error: (err) => alert('創建員工失敗 ' + err.message)
              });

            },
            error: (err) => alert('創建帳號失敗: ' + err.message)
          });
        }
      },
    });
  }

  //交換權限選單
  updatePermissions(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedStaff = this.staff.find(item => item.staffid === +target.value);
  }



  //儲存權限
  storePermission() {
    if (!this.selectedStaff) {
      console.error('No staff selected');
      return;
    }

    const staffId = this.selectedStaff.staffid;
    // 檢查是否為 admin，假設 staffid 為 1 的是 admin
    if (staffId == 1) {
      alert('admin 無法調整權限');
      return;
    }
    let permissions = [];


    //檢查哪個被勾選
    if ((document.getElementById('permission1') as HTMLInputElement).checked) {
      permissions.push('1');
      this.cookieService.set('permissions', 'true');
    }

    if ((document.getElementById('permission2') as HTMLInputElement).checked) {
      permissions.push('2');
      this.cookieService.set('permissions', 'false');
    }


    const newPermissions = permissions.join(',');


    this.http.put(`api/Kid/UpdatePermissions/${staffId}`, `"${newPermissions}"`, { headers: { 'Content-Type': 'application/json' } }).subscribe({
      next: (response) => {
        alert('更新成功')
        location.reload()
      }
    });
  }


  //交換權限勾選
  updatePermission(permission: string) {
    if (!this.selectedStaff) {
      // 如果沒有選擇任何員工，則直接返回
      return;
    }

    // 根據傳入的權限參數來更新權限
    if (permission === '1') {
      if (this.selectedStaff.permissions.includes('1')) {
        // 如果當前已經擁有權限1，則移除權限1並賦予權限2
        this.selectedStaff.permissions = '2';
      } else {
        // 如果當前沒有權限1，則賦予權限1
        this.selectedStaff.permissions = '1';
      }
    } else if (permission === '2') {
      if (this.selectedStaff.permissions.includes('2')) {
        // 如果當前已經擁有權限2，則移除權限2並賦予權限1
        this.selectedStaff.permissions = '1';
      } else {
        // 如果當前沒有權限2，則賦予權限2
        this.selectedStaff.permissions = '2';
      }
    }
  }



  deleteAccount(staffId: number) {
    if(staffId == 1) {
      alert("admin無法被刪除");
      return;
    }

    this.http.get<boolean>('api/Kid/AccountExists/' + staffId).subscribe({
      next: (account) => {
        if (!account) {
          alert("找不到帳號");
          return;
        }

        // 跳出確認警告
        const confirmation = window.confirm("確定要刪除嗎？");

        if (confirmation) {
          this.http.delete('api/Kid/staff/' + staffId).subscribe(() => {
            console.log("成功刪除職員");
            this.http.delete('api/Kid/account/' + staffId).subscribe(() => {
              console.log("成功刪除帳號");
              location.reload();
            });
          });
        } else {
          console.log("取消刪除");
        }
      },
      error: (err) => {
        console.error("查找帳號時出現錯誤:", err);
        alert("查找帳號時出現錯誤");
      }
    });
  }


}
