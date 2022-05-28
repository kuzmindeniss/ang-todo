import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: firebase.default.User | null = JSON.parse(localStorage.getItem('user')!);
  userData$ = new BehaviorSubject<typeof this.userData>(this.userData);

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
      }
      
      this.updateUserData$(user);
    });
  }

  updateUserData$(newUser: typeof this.userData) {
    if (newUser == this.userData) return;
    if (newUser && this.userData && newUser.uid == this.userData.uid) return;
    this.userData = newUser;
    this.userData$.next(newUser);
  }

  googleAuth() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider)
      .then((result) => {
        this.setUserData(result.user);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = auth.GoogleAuthProvider.credentialFromError(error);
        window.alert(errorMessage);
      });
  }

  setUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get isUserExists(): boolean {
    return (this.userData && this.userData.uid) ? true : false;
  }

  get userUid(): string | null {
    return this.isUserExists ? this.userData!.uid : null;
  }
  
  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
    });
  }
}
