import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'
import { UserInfoService } from 'src/app/services/user-info.service';
import auth from 'firebase/app'
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  loading: Boolean = false;


  loginfrm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]]
  })

  forgotpassfrm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
  })

  registerfrm = this.fb.group({
    fname: ['', [Validators.required, Validators.minLength(1)]],
    sname: ['', [Validators.required, Validators.minLength(1)]],
    email: ['', [Validators.email, Validators.required]],
    mobile: ['', [Validators.required, Validators.minLength(11)]],
    gender: ['', [Validators.required]],
    birthdate: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: this.checkPasswords })

  constructor(private fb: FormBuilder, private usrInfo: UserInfoService, private route: Router) { }

  ngOnInit(): void {
    let usr = JSON.parse(localStorage.getItem('userdata')!)
    if (usr && !(usr.blocked!)) {
      this.route.navigate(['/users/home'])
    } else if (usr.blocked) {
      alert(`you are blocked`)
    }
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true }
  }

  async forgetpassword() {
    this.loading = true;
    await this.usrInfo.forgotPassword(this.forgotpassfrm.value.email).then(() => {
      this.loading = false;
    }).catch((err) => {
      this.loading = false;
      alert(err)
    })
  }


  async login() {
    this.loading = true;
    await this.usrInfo.login(this.loginfrm.value.email, this.loginfrm.value.password).then(() => {
      this.loading = false;
      let usr = JSON.parse(localStorage.getItem('userdata')!);
      if (localStorage.getItem('userauth') !== null) {
        if (!usr.blocked) {
          this.route.navigate(['/users/home'])
        } else if (usr.blocked) {
          alert(`You are blocked from our social media.`)
        }
      } else {
        alert(`Error occured please relogin`)
      }
    }).catch((err) => {
      this.loading = false;
      alert(err)
    })
  }

  async register() {
    this.loading = true;
    await this.usrInfo.signUp(
      this.registerfrm.value.email,
      this.registerfrm.value.password,
      this.registerfrm.value.fname,
      this.registerfrm.value.sname,
      this.registerfrm.value.mobile,
      this.registerfrm.value.gender,
      this.registerfrm.value.confirmPassword,
      this.registerfrm.value.birthdate
    ).then(() => {
      this.loading = false;
      let usr = JSON.parse(localStorage.getItem('userdata')!);
      if (localStorage.getItem('userauth') && !usr.blocked) {
        this.route.navigate(['/users/home'])
      } else if (usr.blocked) {
        alert(`You are blocked from our social media.`)
      }
    }).catch((err) => {
      this.loading = false;
      alert(err)
    })
  }


}
