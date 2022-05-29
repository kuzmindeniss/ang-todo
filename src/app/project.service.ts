import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  newProjectName: string  = '';

  constructor(
    private authService: AuthService,
    public afs: AngularFirestore,
    private toastr: ToastrService,
  ) {
    this.authService.userData$.subscribe(user => {
      console.log(user);
    });
  }

  // newProjectNameChange(name: string) {
  //   this.newProjectName = name.trim();
  //   console.log(this.newProjectName);
  //   return this.newProjectName;
  // }

  createProject(name: string) {
    if (!name) {
      this.toastr.warning('Project must have name');
      return;
    }

    const projectData = {
      name,
    };
    const projectRefDoc = this.afs.doc(`users/${this.authService.userUid}/projects/${this.afs.createId()}`);
    projectRefDoc.set(projectData).then(() => {
      this.toastr.success('Project created', projectData.name);
    }).catch((error) => {
      this.toastr.error(error);
    });
  }
}
