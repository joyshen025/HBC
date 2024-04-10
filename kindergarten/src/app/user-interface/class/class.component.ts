import { Component } from '@angular/core';
import { BasicMenuComponent } from '../basic-menu/basic-menu.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Class {
  id?: number;
  teacher: string;
  bigClass: number;
  middleClass: number;
  smallClass: number;
  className: string;
  isEdit?: boolean;
}

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [BasicMenuComponent, RouterOutlet, CommonModule, FormsModule],
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})

export class ClassComponent {

  isEdit = false;

  class: Class[] = [];
  teacherValue: any;
  classNameValue!: string;
  bigClassValue!: number | null;
  middleClassValue!: number | null;
  smallClassValue!: number | null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Class[]>('api/Kid/class').subscribe((data: Class[]) => {
      this.class = data.sort((a, b) => a.id! - b.id!);
    });
  }

  addclass() {
    if (!this.teacherValue || !this.classNameValue) {
      alert('請填寫完整的班级名稱，負責老師');
      return;
    }

    if (!this.bigClassValue) {
      this.bigClassValue = 0;
    }
    if (!this.middleClassValue) {
      this.middleClassValue = 0;
    }
    if (!this.smallClassValue) {
      this.smallClassValue = 0;
    }

    let newClass: Class = {
      teacher: this.teacherValue,
      bigClass: this.bigClassValue,
      middleClass: this.middleClassValue,
      smallClass: this.smallClassValue,
      className: this.classNameValue,
    };

    this.http.post('api/Kid/class', newClass).subscribe(() => {
      // 刷新頁面
      window.location.reload();
    });
  }

  updateClassData(item: Class) {
    this.http.put('api/Kid/class/' + item.id, item).subscribe(() => {
      this.isEdit = false;
      console.log('更新成功');
      window.location.reload();
    }, (error) => {
      console.error('更新失败:', error);
    });
  }


  // 刪除
  deleteClass(item: Class) {
    var confirmation = window.confirm("確定要刪除嗎？");
    if(confirmation){ this.http.delete('api/Kid/class/' + item.id).subscribe(() => {
      this.class = this.class.filter(classItem => classItem.id !== item.id);
    });}

  }

  totalPeople(item: Class) {
    let sum = item.middleClass + item.bigClass + item.smallClass;
    return sum;
  }

  // 編輯按鈕
  startEditing(item: Class) {
    item.isEdit = true;
  }

  calculateTotal(item: any): number {
    const smallClass = parseInt(item.smallClass) || 0;
    const middleClass = parseInt(item.middleClass) || 0;
    const bigClass = parseInt(item.bigClass) || 0;

    return smallClass + middleClass + bigClass;
  }

}
