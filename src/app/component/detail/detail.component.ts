import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  user!: User
  loading = true
  avatar_user_default = 'https://www.hardiagedcare.com.au/wp-content/uploads/2019/02/default-avatar-profile-icon-vector-18942381.jpg'


  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getDetailUser()
  }

  getDetailUser() {
    let id = String(this.route.snapshot.paramMap.get('id'))

    this.userService.getUser(id)
      .pipe(delay(1000))
      .subscribe(data => {
        this.user = data.user
        this.loading = false
      })
  }
  
  getUrlAvatar(url: any) {
    return this.userService.sanitizeImageUrl(url)
  }
}
