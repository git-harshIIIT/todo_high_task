import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireauth:AngularFireAuth,private router: Router) {}

  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        localStorage.setItem('token', 'true');
        localStorage.setItem('user', JSON.stringify({ email: user.email, uid: user.uid }));
        this.router.navigate(['todo']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/login']);
    });
  }
  
  register(email: string, password: string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      const user = userCredential.user;
      if (user) {
        alert('Registration Successful');
        localStorage.setItem('user', JSON.stringify({ email: user.email, uid: user.uid }));
        this.router.navigate(['/login']);
      }
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }
  
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    });
  }
  
}
