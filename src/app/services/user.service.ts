import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private BASE_URL = 'http://localhost:8000/api/user'
  
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl)
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>('https://api.cloudinary.com/v1_1/ddwurilrw/image/upload', formData)
  }

  getUsers(): Observable<any> {
    return this.http.get<User[]>(this.BASE_URL)
  }
  
  getUser(id: string): Observable<any> {
    return this.http.get<User>(this.BASE_URL + '/'+ id)
  }

  addUser(data: User): Observable<any> {
    return this.http.post<User>(this.BASE_URL + '/create', data)
  }

  editUser(id: string, data: User): Observable<any> {
    return this.http.put<User>(this.BASE_URL + '/edit/' + id, data)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(this.BASE_URL + '/delete/' + id)
  }
}
