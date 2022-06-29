import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { ToastService } from 'angular-toastify';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateUserComponent } from './component/create-user/create-user.component';
import { DetailComponent } from './component/detail/detail.component';
import { EditUserComponent } from './component/edit-user/edit-user.component';
import { HeaderComponent } from './component/header/header.component';
import { MenuComponent } from './component/menu/menu.component';
import { UserComponent } from './component/user/user.component';
import { UsersComponent } from './component/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    UsersComponent,
    UserComponent,
    DetailComponent,
    CreateUserComponent,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    FileUploadModule,
    TableModule,
    InputTextModule,
    StyleClassModule,
    CheckboxModule,
    DialogModule,
    FormsModule,
    BrowserAnimationsModule,
    InputNumberModule,
    DropdownModule
  ],
  providers: [ToastService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
