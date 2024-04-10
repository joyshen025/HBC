import { Component } from '@angular/core';
import { ClassComponent } from '../class/class.component';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-basic-menu',
  standalone: true,
  imports: [ClassComponent, RouterOutlet,RouterModule ,CommonModule ],
  templateUrl: './basic-menu.component.html',
  styleUrl: './basic-menu.component.css'
})
export class BasicMenuComponent {




  constructor(private http: HttpClient, private router: Router, public cookieService: CookieService) { }

  setActiveClass(url: string): boolean {
    return this.router.url === url;
  }


  logout() {
    // 發送登出請求，這可能需要與後端溝通
    this.http.delete<any>('/api/Login')
      .subscribe(
        response => {
          // 登出成功，清除 isLoggedIn cookie
          this.cookieService.delete('isLoggedIn');
          this.cookieService.delete('permissions');
          // 跳到登入
          this.router.navigate(['/Login']);
        },
        error => {
          console.error('登出時發生錯誤：', error);
        }
      );
  }
}
