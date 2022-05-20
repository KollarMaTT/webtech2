import { Component, NgZone, OnInit } from '@angular/core';
import { User } from '../model/user';
import { Lakee } from '../model/Lakee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  user = new User();
  username: string;
  racers: Lakee[];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    public appService: AppService
  ) {
    this.mainForm();
    this.getUser();
  }

  get myForm() {
    return this.createForm.controls;
  }

  submitted = false;
  createForm: FormGroup;

  async ngOnInit() {
    this.racers = await this.appService.getAllElements();
  }

  mainForm() {
    this.createForm = this.formBuilder.group({
      lakeName: [
        '',
        [Validators.required, Validators.pattern('.*\\S.*[a-zA-z]')],
      ],
      lakeCode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[-+]?[0-9]+$'),
          Validators.min(1),
        ],
      ],
      fish: ['', [Validators.required, Validators.pattern('.*\\S.*[a-zA-z]')]],
      weight: [
        '',
        [
          Validators.required,
          Validators.pattern('^[-+]?[0-9]+$'),
          Validators.min(1),
        ],
      ],
    });
  }

  onSubmit() {
    this.submitted = true;

    var racer = this.createForm.value;
    var exists = false;

    console.log(this.racers);

    this.racers.forEach((s) => {
      if (s.lakeName === racer.lakeName) {
        exists = true;
      }
      console.log(exists);
    });

    if (!this.createForm.valid) {
      alert('Nem megfelelőek az adatok!');
      return false;
    } else if (!exists) {
      this.appService.createLakee(this.createForm.value).subscribe(
        (res) => {
          alert('Hozzáadva.');
          this.ngZone.run(() => this.router.navigateByUrl('/list'));
        },
        (error) => {
          alert('Hiba' + error);
        }
      );
    } else {
      alert('Már szerepel ez a pilóta a listában.');
      return false;
    }
  }

  getUser() {
    if (this.appService.getLoggedInUser().uname == null) {
      this.router.navigate(['/login']);
    }

    this.user = this.appService.getLoggedInUser();
    this.username = JSON.stringify(this.user.uname);
  }

  logout() {
    this.user = new User();
    this.appService.setLoggedInUser(this.user);
    this.router.navigate(['/login']);
  }
}
