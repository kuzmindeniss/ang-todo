import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ProjectService } from 'src/app/project.service';
import { ProjectInterface, TaskInterface } from 'src/types';
import { isEqual } from "lodash";
import { ToastrService } from 'ngx-toastr';
import { PopperService } from 'src/app/popper';

@Component({
  selector: 'project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {
  areTasksLoaded = false;
  project?: ProjectInterface = undefined;
  project$ = new BehaviorSubject<typeof this.project>(this.project);
  id: string;
  isAddingNewTask: boolean = false;
  newTaskTitle: string = "";
  tasks: TaskInterface[] = [];
  activeTaskId: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public toastr: ToastrService,
    public popperService: PopperService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.initProject();
    this.initProjectTasks();
    setTimeout(() => {
      this.projectService.activeProjectId = this.id;
    }, 0)
  }

  ngOnDestroy(): void {
    this.projectService.activeProjectId = "";
  }

  initProject() {
    this.projectService.projects$.subscribe({
      next: projects => {
        const newProject = projects?.find(el => el.id === this.id);
        if (!newProject) {
          this.router.navigate(['/']);
        }
        if ( newProject && isEqual(newProject, this.project) ) return;

        this.project = projects?.find(el => el.id === this.id);
        this.project$.next(this.project);
      }
    });
  }

  initProjectTasks() {
    if (this.projectService.tasksCache[this.id]) {
      this.tasks = this.projectService.tasksCache[this.id];
      this.areTasksLoaded = true;
    }

    this.projectService.getProjectTasks(this.id).subscribe({
      next: observer => {
        this.tasks = observer;
        this.areTasksLoaded = true;
      },
      error: err => {
        this.toastr.error(err);
        this.tasks = [];
        this.areTasksLoaded = true;
      }
    });
  }

  completeTask(task: TaskInterface) {
    if (!task.isCompleted) {
      task.isCompleted = true;
      this.projectService.completeTask(this.id, task).subscribe({
        next: obs => {
          task.isCompleted = true;
        },
        error: err => {
          this.toastr.error(err);
        }
      });
    } else {
      task.isCompleted = false;
      this.projectService.uncompleteTask(this.id, task).subscribe({
        next: obs => {
          task.isCompleted = false;
        },
        error: err => {
          this.toastr.error(err);
        }
      })
    }
  }

  onChangeTaskTitle(event: Event) {
    this.newTaskTitle = (event.target as HTMLElement).textContent ? (event.target as HTMLElement).textContent! : "";
  }

  onAddTask(title: string, description: string) {
    if (!this.isNewTaskTitleValid) return;
    this.projectService.createTask(title, description, this.id);
    this.isAddingNewTask = false;
    this.newTaskTitle = "";
    this.initProjectTasks();
  }

  get isNewTaskTitleValid(): boolean {
    return !!this.newTaskTitle.trim().length;
  }

  doShowTask(task: TaskInterface) {
    if (task.isCompleted && !this.projectService.showCompletedTasks) return false;
    return true;
  }

  deleteTask(task: TaskInterface) {
    const _tasks = [...this.tasks];
    this.tasks = this.tasks.filter(el => el.id !== task.id);

    this.projectService.deleteTask(this.id, task).subscribe({
      next: obs => {
        if (obs !== true) {
          this.tasks = _tasks;
        }
      },
      error: err => {
        this.tasks = _tasks;
      }
    });
  }

}
