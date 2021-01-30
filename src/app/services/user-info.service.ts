import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'
import { User } from '../models/user.model';
import auth from 'firebase/app'
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  //Constants


  //Variables
  public loggedin: boolean = false;
  public user: User = new User();
  subscribtion: Subscription[] = [];
  constructor(private fireAuth: AngularFireAuth, private firestore: AngularFirestore) {
  }

  //Methods
  async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password).then(res => {
      this.loggedin = true;
      if (res.user) {
        localStorage.setItem('userauth', JSON.stringify(res.user))
        this.subscribtion.push(this.firestore.collection(`users`).doc(res.user.uid).valueChanges().subscribe((data: any) => {
          this.user = new User(data.id, data.firstName, data.secondName, data.gender, data.mobile, data.picURL, data.coverPicURL, data.birthDate, data.privateAcc, data.favColor, data.favMode, data.notifications, data.bookmarks, data.followers, data.following, data.dateCreated, data.dateUpdated);
        }))
      } else {
        throw `User not found`
      }
    }).catch((err) => { console.log(err) })
  }

  async signUp(email: string, password: string, fname: string, sname: string, mobile: string, gender: string, confirmPass: string, birthdate: Date) {
    let gen = ""
    if (password === confirmPass) {
      await this.fireAuth.createUserWithEmailAndPassword(email, password).then(res => {
        if (res.user) {
          console.log(res)
          this.loggedin = true;
          localStorage.setItem('userauth', JSON.stringify(res.user))
          //TODO: Save the user data
          if (gender === "Male") {
            gen = "./../../../../assets/avatar.png"
          } else {
            gen = "./../../../../assets/avatar2.png"
          }
          this.user = new User(res.user.uid, fname, sname, gender, mobile, gen, "", birthdate, false, "grey", "light", [], [], [], []);
          this.firestore.collection(`Users`).doc(res.user.uid).set({
            id: res.user.uid,
            firstName: fname,
            secondName: sname,
            gender: gender,
            mobile: mobile,
            picURL: gen,
            coverPicURL: "",
            birthDate: birthdate,
            dateCreated: new Date().toISOString(),
            dateUpdated: new Date().toISOString(),
            privateAcc: false,
            favColor: "grey",
            favMode: "light",
            blocked: false,
            notifications: [],
            bookmarks: [],
            followers: [],
            following: [],
          })
        }

      }).catch((err) => { throw err.message; })
    }
    else {
      throw `Password should be same as confirm password.`;
    }
  }

  async signOut() {
    await this.fireAuth.signOut().then(
      res => {
        console.log(res)
        this.loggedin = false;
        localStorage.removeItem('userauth');
        this.user = new User();
      }
    ).catch((err) => { console.log(err) });
  }

  async forgotPassword(email: string) {
    await this.fireAuth.sendPasswordResetEmail(email).then(res => {
    }).catch((err) => { console.log(err) })
  }


  async editProfile(user: User) {
    //TODO: add method to edit profile using User only
    this.firestore.collection(`users`).doc(this.user.id).update({
      id: this.user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      gender: user.gender,
      mobile: user.mobile,
      picURL: user.picURL,
      coverPicURL: user.coverPicURL,
      birthDate: user.birthDate,
      dateUpdated: new Date().toISOString(),
      privateAcc: user.privateAcc,
      favColor: user.favColor,
      favMode: user.favMode,
      blocked: false,
      notifications: user.notifications,
      bookmarks: user.bookmarks,
      followers: user.followers,
      following: user.following,
    }).catch(err => { console.log(err) });
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscribtion.forEach(element => {
      element.unsubscribe();
    });
  }


}
