import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Router, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, FormsModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  username: string = '';
  password: string = '';
  showErrorMessage!: boolean;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) { }

  login() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('/api/Login', { username: this.username, password: this.password }, { headers: headers, observe: 'response', responseType: 'json' })
      .subscribe(
        (response: any) => {
          console.log('登入回應：', response.body);
          if (response.body.message  === '登入成功') {
            if( response.body.permissions  === '1' ){
              this.cookieService.set('permissions', 'true');
            }else{
              this.cookieService.set('permissions', 'false');
            }
            this.cookieService.set('isLoggedIn', 'true');
            this.router.navigate(['/Interface']);
          } else {
            this.showErrorMessage = true;
          }
        },
        error => {
          console.error('發生錯誤', error);
          console.log('響應主體:', error.error);
        }
      );
  }

}
