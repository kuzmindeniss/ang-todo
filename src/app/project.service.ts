import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  newProjectName: string | undefined = undefined;

  constructor(
    private authService: AuthService,
    public afs: AngularFirestore,
    private toastr: ToastrService,
  ) {
    this.authService.userData$.subscribe(user => {
      console.log(user);
    });
  }

  createProject() {
    const projectData = {
      name: this.newProjectName,
    };
    // const projectRef = this.afs.doc(`userProjects/${this.authService.userUid}/${this.afs.createId()}`);
    // const projectRefCollection = this.afs.collection(`users`);
    const projectRefDoc = this.afs.doc(`users/${this.authService.userUid}/projects/${this.afs.createId()}`);
    projectRefDoc.set(projectData).then(() => {
      this.toastr.success('Project created', projectData.name);
    });
  }
}
