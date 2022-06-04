import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Colors, ProjectInterface } from 'src/types';
import { PopperService } from './popper';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  newProjectName: string = '';
  newProjectColor: string = 'Grey';
  colors = Colors;
  projects: ProjectInterface[] | undefined;

  constructor(
    private authService: AuthService,
    public afs: AngularFirestore,
    private toastr: ToastrService,
    private popperService: PopperService,
  ) {
    this.authService.userData$.subscribe({
      next: this.initProjects,
      error: this.showErrorToastr,
    });
  }

  initProjects = (user: firebase.default.User | null) => {
    if (user && user.uid) {
      const projectsRef = this.authService.afs.collection<ProjectInterface>(`users/${user.uid}/projects`);
      projectsRef.get().subscribe({
        next: observer => {
          this.projects = observer.docs.map((projectDocument) => {
            return {
              ...projectDocument.data(),
              id: projectDocument.id
            };
          });
        },
        error: error => {
          this.showErrorToastr(error);
          this.projects = [];
        }
      });
    } else {
      this.projects = [];
    }
  }

  createProject(name: string, color: string) {
    if (!name) {
      this.toastr.warning('Project must have name');
      return;
    }

    const projectData = {
      name,
      color,
    };
    const projectRefDoc = this.afs.doc(`users/${this.authService.userUid}/projects/${this.afs.createId()}`);
    projectRefDoc.set(projectData).then(() => {
      this.toastr.success('Project created', projectData.name);
      this.initProjects(this.authService.userData);
      this.newProjectName = "";
    }).catch((error) => {
      this.initProjects(this.authService.userData);
      this.toastr.error(error);
    });
  }

  deleteProject(id: string) {
    this.popperService.close(`popper-${id}`);
    const projectRef = this.afs.doc(`users/${this.authService.userUid}/projects/${id}`);
    projectRef.delete().then(res => {
      console.log(res);
      this.initProjects(this.authService.userData);
    });
  }

  showErrorToastr = (error: any) => {
    this.toastr.error(error);
  }
}
