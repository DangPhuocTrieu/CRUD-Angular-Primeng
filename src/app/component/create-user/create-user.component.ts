import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { Observer } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  file!: any
  previewURL = ''

  observer: Observer<any> = {
    next: (data: any): void => {
      this.previewURL = ''
      this.form.reset({ gender: 'Nam', age: 20 })
      this.toastService.success(data.message)
    },
    error: (data: any): void => {
      this.toastService.error(data.error.message ? data.error.message : 'I')
    },
    complete: (): void => {}
  };

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(5)]],
    age: ['20'],
    gender: ['Nam'],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$')]],
    address: ['', [Validators.required, Validators.minLength(7)]],
    avatar: [''] 
  })

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
  }

  transformUrlAvatar(url: any) {
    return this.userService.sanitizeImageUrl(url)
  }

  handleChangeFile(event: any) {
    this.file = event.target.files[0]
    this.previewURL = URL.createObjectURL(this.file)
  }

  handleRemoveImage() {
    this.previewURL = ''
    this.file = null
  }

 
  handleSubmit(form: FormGroup) {
    if(this.file) {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('upload_preset', 'instagramimages')

      this.userService.uploadImage(formData).subscribe(file => {
        this.userService.addUser({
          ...form.value,
          avatar: file.secure_url
        }).subscribe(this.observer)
      })
    }
    
    else {
      this.userService.addUser({
        ...form.value, 
        avatar: ''
      }).subscribe(this.observer)
    } 
  }
}
