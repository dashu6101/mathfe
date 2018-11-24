import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ag-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() user: User;
  status: string;
  message: string;
  id: any;
  params: any;
  @Output() editingmode = new EventEmitter<boolean>();

  constructor(private userService: UserService) { }
  fileToUplaod: File = null;
  savedImageUrl = "";
  ngOnInit() {
    this.params = this.user['id'];
    this.savedImageUrl = this.user['image'];
  }

  ngOnDestroy() {
   // this.params.unsubscribe();
  }
  handelFileInput(file: FileList) {
    this.fileToUplaod = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.savedImageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUplaod)
  }
  updateUser(user) {
    debugger;
    const fData: FormData = new FormData();
    for (let key in user) {
      if (key != "image")
        fData.append(key, user[key]);
    }
    if (this.fileToUplaod != null) {
      fData.append("image", this.fileToUplaod, this.fileToUplaod.name);
    } else {
      fData.append("image", user.image);
    }
    this.userService.updateUser(fData, user.id)
      .subscribe(
        (user: any) => {

          this.user = user.user;
          this.status = 'success';
          this.message = user['message'];
          setTimeout(() => {    //<<<---    using ()=> syntax
            this.editingmode.emit(false);
          }, 3000);
        },
        error => {
          console.log(<any>error);
          this.status = 'error';
          this.message = error['message'] || 'No allow';
        }
      );
  }
}
