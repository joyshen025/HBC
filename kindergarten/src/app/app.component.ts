import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
    // 在應用程序啟動時檢查Cookie狀態
    let isLoggedIn = this.cookieService.get('isLoggedIn');
    if (isLoggedIn === 'true') {
      // 如果已登入，執行相應的操作，例如導航到已登入的頁面
    } else {
      // 如果未登入，執行相應的操作，例如導航到登入頁面
    }
  }
}
