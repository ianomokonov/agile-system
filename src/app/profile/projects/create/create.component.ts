import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserShortView } from 'back/src/models/responses/check-user.response copy';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Tag } from 'src/app/shared/tags-input/tags-input.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class CreateComponent implements OnInit {
  public formGroup: FormGroup;
  public search$: Subject<string> = new Subject();
  public users: (UserShortView & Tag)[] = [];

  constructor(private fb: FormBuilder, private usersService: UserService) {
    this.formGroup = fb.group({
      name: [null, Validators.required],
      repository: null,
      description: [null, Validators.required],
      users: null,
    });
    this.search$.pipe(debounceTime(200)).subscribe((value) => {
      this.onUsersSearch(value);
    });
  }

  public ngOnInit() {
    this.search$.next('');
  }

  public onUsersSearch(searchString: string) {
    this.usersService.getUsers(searchString).subscribe((users) => {
      this.users = users.map((user) => {
        return {
          ...user,
          key: user.email,
        };
      });
    });
  }
}
