import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';



interface Staff {
  staffid: number;
  staffname: string;
  permissions: string;
  contactnumber: string;
  account: string;
  email: string;
  isEdit: boolean;
  image: string;
  imageUrl: string | ArrayBuffer | null;
}


@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {

  selectedFile: File | null = null; // 使用 File | null 來表示選擇的文件，初始值為 null
  imageUrl: string | ArrayBuffer | null = null;  // 用於存儲圖片預覽的 URL
  staff: Staff[] = [];
  isEdit = false;


  constructor(private http: HttpClient) { }

  onFileSelected(event: any, item: Staff): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        item.imageUrl = e.target.result; // 保留  數據以供預覽
        this.selectedFile = selectedFile;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      item.imageUrl = null;
      this.selectedFile = null;
    }
  }

  onSubmit(item: Staff): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, 'avatar.jpg'); // 使用选定的文件

      this.uploadToCloudinary(formData, item);
    }
  }





  uploadToCloudinary(formData: FormData, item: Staff): void {
    const uploadPreset = 'clczyoan'; // 替換為你的 unsigned upload preset
    const cloudName = 'dntokf0em'; // 替換為你的 Cloudinary cloud name
    const folder = 'test'; // 替換為你想要存儲文件的新資料夾名稱

    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder); // 將資料夾參數添加到 formData 中

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

    this.http.post<any>(url, formData).subscribe(
      (response) => {
        debugger
        const imageUrl = response.secure_url;
        alert("圖片上傳成功");
        item.image = imageUrl; // 将图片 URL 存储到 Staff 对象中
        this.updateStaffData(item); // 上传图片成功后调用更新方法
      },
      (error) => {
        console.error('Upload error:', error);
        alert("上傳失敗");
      }
    );
  }

  ngOnInit(): void {

    this.http.get<Staff[]>('api/Kid/Staff').subscribe(data => {
      this.staff = data;
    });
  }

  startEditing(item: Staff) {
    item.isEdit = true;
  }

  updateStaffData(item: Staff) {
    this.http.put('api/Kid/Staff/' + item.staffid, item).subscribe(
      () => {
        this.isEdit = false;
        console.log('更新成功');
        window.location.reload();
      },
      (error) => {
        console.error('更新失败:', error);
        alert("更新失败");
      }
    );
  }


  cancelUpdate(item: Staff){
    item.isEdit = false;
  }

  }


