import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user';

@Component({
  selector: '[user-item]',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() user!: User
  @Output() deleteUser = new EventEmitter<string>()
  avatar_user_default = 'https://www.hardiagedcare.com.au/wp-content/uploads/2019/02/default-avatar-profile-icon-vector-18942381.jpg'

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  transformUrlAvatar(url: any) {
    return this.userService.sanitizeImageUrl(url)
  }

  handleDeleteUser() {
    this.deleteUser.emit(this.user._id)
  }

}
