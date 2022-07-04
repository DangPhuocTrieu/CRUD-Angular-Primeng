import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { DataServer } from 'src/app/models/data';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { UsersComponent } from './users.component';



fdescribe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersComponent ],
      imports: [
        HttpClientModule,
        BrowserModule,
        ReactiveFormsModule
      ],
      providers: [
        MessageService,
        ConfirmationService,
        UserService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call func openNew', () => {
    component.form = new FormGroup({
      age: new FormControl(23)
    })
    component.userDialog = false
    component.file = 'file-1'
    component.image = 'image-1'

    component.openNew()

    expect(component.userDialog).toBeTruthy()
    expect(component.file).toBeNull()
    expect(component.image).toEqual('')
    expect(component.form.get('age')?.value).toEqual(20)
  });  

  it('call func editUser', () => {
    const user: User = {
        avatar: 'avatar-1'
    }
    component.userDialog = false
    component.image = 'image-1'
    component.file = 'file-1'

    component.editUser(user)
    expect(component.userDialog).toBeTruthy()
    expect(component.file).toBeNull()
    expect(component.image).toEqual(user.avatar)

    user.avatar = undefined
    component.editUser(user)
    expect(component.image).toEqual('')
  })

  it('call func hideDialog', () => {
    component.userDialog = true
    component.hideDialog()

    expect(component.userDialog).toBeFalsy()
  })

  it('call func getUsers', () => {
    const data: DataServer = {
      success: true,
      message: 'Get all users successfully',
      data:  [
        { _id: '1', fullName: 'Phuoc Trieu', },
        { _id: '2', fullName: 'Thu Hong' }
      ] 
    }

    const userService = fixture.debugElement.injector.get(UserService);
    let spy = spyOn(userService, 'getUsers').and.returnValue(of(data))
    component.getUsers()
    setTimeout( () => {
      expect(component.loading).toBeTruthy();
      expect(component.users).toEqual(data.data);
      expect(component.usersTemp).toEqual(data.data);
    }, 1000);
  })
});
