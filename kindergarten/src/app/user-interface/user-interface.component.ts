import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasicMenuComponent } from './basic-menu/basic-menu.component';
import { ClassComponent } from './class/class.component';

import { CommonModule } from '@angular/common';






@Component({
  selector: 'app-user-interface',
  standalone: true,
  imports: [RouterOutlet,BasicMenuComponent,ClassComponent,CommonModule],
  templateUrl: './user-interface.component.html',
  styleUrl: './user-interface.component.css'
})






export class UserInterfaceComponent  {

}
