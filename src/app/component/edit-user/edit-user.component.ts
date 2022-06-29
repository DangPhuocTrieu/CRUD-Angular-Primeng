import { ToastService } from 'angular-toastify';
import { Observer } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  id!: string
  user!: User
  flag = false

  file!: any
  previewURL = ''

  observer: Observer<any> = {
    next: (data: any): void => {
      this.toastService.success(data.message)
      this.flag = false
    },
    error: (data: any): void => {
      this.toastService.error(data.error.message ? data.error.message : 'Internal server error')
      this.flag = false
    },
    complete: (): void => {}
  };

  form: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(5)]],
    age: [''],
    gender: ['Nam'],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$')]],
    address: ['', [Validators.required, Validators.minLength(7)]],
    avatar: [''] 
  })

  constructor(
    private userService: UserService, 
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {   
    this.getUser()
  }

  getUser() {
    this.id = String(this.route.snapshot.paramMap.get('id'))
    this.userService.getUser(this.id).subscribe(({ user }) => {     
      if(user.avatar) {
        this.previewURL = user.avatar
      }
      this.form.patchValue({ ...user, avatar: '' })
    })
  }

  transformUrlAvatar(url: string) { 
    return this.userService.sanitizeImageUrl(url)
  }

  handleChangeFile(event: any) {
    this.file = event.target.files[0]
    this.previewURL = URL.createObjectURL(this.file)
    this.flag = true
  }

  handleRemoveImage() {
    this.previewURL = ''
    this.flag = false
  }

  handleSubmit(form: FormGroup) {
    if(this.flag) {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('upload_preset', 'instagramimages')

      this.userService.uploadImage(formData).subscribe(file => {
        this.previewURL = file.secure_url
        
        this.userService.editUser(this.id, { 
          ...form.value, 
          avatar: file.secure_url 
        }).subscribe(this.observer)
      })
    }

    else {
      this.userService.editUser(this.id, {
        ...form.value,
        avatar: this.previewURL
      }).subscribe(this.observer)
    }
  }
}
