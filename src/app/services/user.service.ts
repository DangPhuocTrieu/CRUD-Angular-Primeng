import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { DataServer } from '../models/data';

@Injectable({
  providedIn: 'root'
}) 
export class UserService {
  private BASE_URL = 'http://localhost:8000/api/user'
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private messageService: MessageService) { }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl)
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>('https://api.cloudinary.com/v1_1/ddwurilrw/image/upload', formData)
  }

  getUsers(): Observable<DataServer> {
    return this.http.get<DataServer>(this.BASE_URL);
  }
  
  getUser(id: string): Observable<DataServer> {
    return this.http.get<DataServer>(this.BASE_URL + '/'+ id)
  }

  addUser(data: User): Observable<DataServer> {
    return this.http.post<DataServer>(this.BASE_URL + '/create', data)
  }

  editUser(id: string, data: User): Observable<DataServer> {
    return this.http.put<DataServer>(this.BASE_URL + '/edit/' + id, data)
  }

  deleteUser(id: string | undefined): Observable<DataServer> {
    return this.http.delete<DataServer>(this.BASE_URL + '/delete/' + id)
  }

  displayMessage(summary: string, detail: string, severity: string = 'success') {
    this.messageService.add({ severity, summary, detail })
  }
}

