import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private authService: AuthService) {
    this.authService.userData$.subscribe(user => {
      console.log(user);
    });
  }

  createProject() {
    
  }
}
