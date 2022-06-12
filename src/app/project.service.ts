import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { Colors, ProjectInterface, TaskInterface } from 'src/types';
import { PopperService } from './popper';
import { ModalService } from './_modal';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  newProjectName: string = '';
  newProjectColor: string = 'Grey';
  colors = Colors;
  projects: ProjectInterface[] | undefined | null = undefined;
  projects$ = new BehaviorSubject<typeof this.projects>(this.projects);
  editingProject: ProjectInterface = {
    id: '',
    name: '',
    color: 'Grey',
  };
  tasksCache: { [key: string]: TaskInterface[] } = {};
  showCompletedTasks: boolean = false;

  constructor(
    private authService: AuthService,
    public afs: AngularFirestore,
    private toastr: ToastrService,
    private popperService: PopperService,
    private modalService: ModalService
  ) {
    this.authService.userData$.subscribe({
      next: this.initProjects,
      error: this.toastr.error,
    });
  }

  initProjects = (user: firebase.default.User | null) => {
    if (user && user.uid) {
      const projectsRef = this.afs.collection<ProjectInterface>(`users/${user.uid}/projects`, (ref) => ref.orderBy('createdAt'));
      projectsRef.get().subscribe({
        next: observer => {
          this.projects = observer.docs.map((projectDocument) => {
            return {
              ...projectDocument.data(),
              id: projectDocument.id,
            };
          });
          this.projects$.next(this.projects);
        },
        error: error => {
          this.toastr.error(error);
          this.projects = [];
          this.projects$.next(this.projects);
        }
      });
    } else {
      this.projects = [];
      this.projects$.next(this.projects);
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
      createdAt: new Date().getTime(),
    };
    const projectRefDoc = this.afs.doc(`users/${this.authService.userUid}/projects/${this.afs.createId()}`);
    projectRefDoc.set(projectData).then(() => {
      this.modalService.close('create-project-modal');
      this.toastr.success('Project created', projectData.name);
      this.initProjects(this.authService.userData);
      this.newProjectName = "";
    }).catch((error) => {
      this.initProjects(this.authService.userData);
      this.toastr.error(error);
    });
  }

  setEditingColor(color: string) {
    this.editingProject.color = color as keyof typeof Colors;
  }

  editProject() {
    const projectData = {
      name: this.editingProject.name,
      color: this.editingProject.color,
    }
    const projectRefDoc = this.afs.doc(`users/${this.authService.userUid}/projects/${this.editingProject.id}`);
    projectRefDoc.set(projectData, {
      merge: true
    }).then(res => {
      this.initProjects(this.authService.userData);
      this.toastr.success(`Project ${projectData.name} edited.`);
    }, err => {
      this.initProjects(this.authService.userData);
      this.toastr.error(err);
    });

  }

  setEditingProject(project: ProjectInterface) {
    this.editingProject = JSON.parse(JSON.stringify(project));
  }

  deleteProject(id: string) {
    this.popperService.close(`popper-${id}`);
    const projectRef = this.afs.doc(`users/${this.authService.userUid}/projects/${id}`);
    projectRef.delete().then(res => {
      this.initProjects(this.authService.userData);
    });
  }

  createTask(title: string, description: string, projectId: string) {
    const taskRef = this.afs.doc(`users/${this.authService.userUid}/projects/${projectId}/tasks/${this.afs.createId()}`);
    taskRef.set({
      name: title,
      description,
      createdAt: new Date().getTime(),
    }).then(() => {
      this.toastr.success("Task Created");
    });
  }

  getProjectTasks(projectId: string): Observable<TaskInterface[]> {
    if (this.authService.isUserExists && projectId) {
      const taskRef = this.afs.collection<TaskInterface>(`users/${this.authService.userUid}/projects/${projectId}/tasks`, (ref) => ref.orderBy('createdAt'));
      return new Observable(obs => {
        taskRef.get().subscribe({
          next: observer => {
            const tasks = observer.docs.map((taskDocument) => {
              return {
                ...taskDocument.data(),
                id: taskDocument.id,
              }
            })

            this.tasksCache[projectId] = tasks;
            obs.next(tasks);
            obs.complete();
          },
          error: error => {
            this.toastr.error(error);
            obs.error(error);
          }
        })
      });
    }
    return new Observable((observable) => {
      observable.next([]);
      observable.complete();
    });
  }

  completeTask(projectId: string, task: TaskInterface): Observable<TaskInterface> {
    if (this.authService.isUserExists && projectId && task.id) {
      const taskRef = this.afs.doc<TaskInterface>(`users/${this.authService.userUid}/projects/${projectId}/tasks/${task.id}`);
      return new Observable(obs => {
        taskRef.set({
          ...task,
          isCompleted: true,
        }, {merge: true}).then(res => {
          obs.next({
            ...task,
            isCompleted: true
          });
          obs.complete();
        }).catch(err => {
          obs.error(err);
          obs.complete();
        });
      });
    }
    return new Observable((observable) => {
      observable.next(task);
      observable.complete();
    });
  }

  uncompleteTask(projectId: string, task: TaskInterface): Observable<TaskInterface> {
    if (this.authService.isUserExists && projectId && task.id) {
      const taskRef = this.afs.doc<TaskInterface>(`users/${this.authService.userUid}/projects/${projectId}/tasks/${task.id}`);
      return new Observable(obs => {
        taskRef.set({
          ...task,
          isCompleted: false,
        }, {merge: true}).then(res => {
          obs.next({
            ...task,
            isCompleted: false
          });
          obs.complete();
        }).catch(err => {
          obs.error(err);
          obs.complete();
        });
      });
    }
    return new Observable((observable) => {
      observable.next(task);
      observable.complete();
    });
  }

  deleteTask(projectId: string, task: TaskInterface): Observable<boolean> {
    this.popperService.close(`popper-task-${task.id}`);

    if (this.authService.isUserExists && projectId && task.id) {
      const taskRef = this.afs.doc(`users/${this.authService.userUid}/projects/${projectId}/tasks/${task.id}`);
      return new Observable(obs => {
        taskRef.delete().then(res => {
          this.removeTaskFromCache(projectId, task);
          obs.next(true);
          obs.complete();
        }).catch(err => {
          obs.error(err);
          obs.complete();
        });
      });
    }
    return new Observable((observable) => {
      observable.next(false);
      observable.complete();
    });
  }

  removeTaskFromCache(projectId: string, task: TaskInterface) {
    this.tasksCache[projectId] = this.tasksCache[projectId].filter(el => el.id !== task.id);
  }
}
