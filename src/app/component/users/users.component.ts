import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { avatar_user_default } from '../../constants'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users!: User[]
  gender!: any[]
  image!: string

  avt_default = avatar_user_default
  loading = true
  userDialog = false

  form: FormGroup = this.fb.group({
    avatar: [''], 
    fullName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(5)]],
    age: ['20'],
    gender: [''],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$')]],
    address: ['', [Validators.required, Validators.minLength(7)]],
  })

  constructor(private userService: UserService, private fb: FormBuilder) { }

  ngOnInit(): void {  
    this.getUsers()

    this.gender = [
      { label: 'Male', value: 'Nam' },
      { label: 'Female', value: 'Nữ' }
    ]
  }

  openNew() {
    this.userDialog = true
    this.form.reset({age: 20})
    this.image = ''
  }
 
  editUser(user: User) {
    this.userDialog = true
    this.form.patchValue(user)  
    this.image = user.avatar ? user.avatar: ''
  }

  hideDialog() {
    this.userDialog = false
  }

  saveUser() {
    this.form.markAllAsTouched()
  }

  getUsers() {
    this.userService.getUsers().pipe(delay(500)).subscribe(data => {
      this.users = data.users
      this.loading = false
    }) 
  }

  handleDeleteUser(id: string) {
    
  }
}
