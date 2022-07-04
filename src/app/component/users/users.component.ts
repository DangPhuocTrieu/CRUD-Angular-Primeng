import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { concatMap, delay, from, mergeMap, Observer } from 'rxjs';
import { DataServer } from 'src/app/models/data';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { avatar_user_default } from '../../constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewChecked {
  users!: User[]
  usersTemp!: User[]
  selectedUsers!: User[]
  searchInput!: string
  
  gender!: any[]
  image!: any
  file!: any

  avt_default = avatar_user_default
  loading!: boolean
  userDialog = false
  flag = false

  observer: Observer<any> = {
    next: (data: DataServer) => {
      if(data.status === 'CREATE') {
        this.userService.displayMessage('Successfully', 'User created')
      }
      else if(data.status === 'UPDATE') {
        console.log(data);
        
        this.flag = false
        this.userService.displayMessage('Successfully', 'User updated')
      }
      else {
        this.selectedUsers = []
        this.userService.displayMessage('Successfully', 'User deleted')
      }

      this.userDialog = false
      this.searchInput = ''
      this.getUsers()
    },
    error: ({ error }: any) => {
      this.userService.displayMessage('Error', error.message ? error.message : 'Internal server error', 'error')
    }, 
    complete: () => {}
  }

  form: FormGroup = this.fb.group({
    _id: [''],
    avatar: [''], 
    fullName: ['', Validators.required],
    userName: ['', [Validators.required, Validators.minLength(5)]],
    age: ['20'],
    gender: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$')]],
  })

  constructor(private userService: UserService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
    ) {}

  ngOnInit(): void {  
    this.getUsers()

    this.gender = [
      { label: 'Male', value: 'Nam' },
      { label: 'Female', value: 'Nữ' }
    ]
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  // OPEN FORM CREATE USER
  openNew() {
    this.userDialog = true
    this.form.reset({ age: 20 })
    this.file = null
    this.image = ''
  }
 
  // OPEN FORM EDIT USER
  editUser(user: User) {
    this.userDialog = true
    this.form.patchValue(user)  
    this.image = user.avatar ? user.avatar: ''
    this.file = null
  }

  // CLOSE DIALOG
  hideDialog() {
    this.userDialog = false
  }

  // CREATE FORM DATA
  createFormData(file: File) {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', 'instagramimages')

    return form
  }

  // TRANSFORM IMAGE URL
  handleTransformUrl(url: string) {
    this.userService.sanitizeImageUrl(url)
  }

  // CHOOSE FILE IMAGE
  handleSelectImage(event: any) {
    this.file = event.files[0]
    this.flag = true

    let url = URL.createObjectURL(this.file)
    this.image = this.userService.sanitizeImageUrl(url)
  }

  // GET ALL USERS
  getUsers() {
    this.loading = true
    this.userService.getUsers().pipe(delay(1000)).subscribe(({ data }) => {
      this.loading = false
      this.users = data
      this.usersTemp = data
    }) 
  }

  // SUBMIT FORM
  saveUser(form: FormGroup) {
    form.markAllAsTouched()
    
    if(!form.valid) return

    // EDIT USER
    if(form.value._id) {
       if(this.flag) {
        const formData = this.createFormData(this.file)

        this.userService.uploadImage(formData).pipe(concatMap(file => (
          this.userService.editUser(form.value._id, {
            ...form.value,
            avatar: file.secure_url
          })
        ))).subscribe(this.observer)
       }     
       else {
        this.userService.editUser(form.value._id, form.value).subscribe(this.observer)
       }     
    }

    // CREATE USER
    else {
       if(this.file) {
        const formData = this.createFormData(this.file)
 
         this.userService.uploadImage(formData).pipe(concatMap(file => (
          this.userService.addUser({
            ...form.value,
            avatar: file.secure_url
          })
         ))).subscribe(this.observer)
       }
       else {
         this.userService.addUser(form.value).subscribe(this.observer)
       }
    }
  }

  // DELETE USER
  handleDeleteUser(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(id).subscribe(this.observer)
      }
    })
  }

  deleteSelectedUsers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        from(this.selectedUsers).pipe(mergeMap(user => (
          this.userService.deleteUser(user._id)
        ))).subscribe(this.observer)
      }
    })
  }

  handleSearchChange(event: Event) {
    let newUsers = this.usersTemp.filter(user => user.userName?.toLowerCase().includes(this.searchInput.toLowerCase()))
    this.users = newUsers
  }
}
