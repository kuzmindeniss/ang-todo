import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { ProjectService } from 'src/app/project.service';
import { ProjectInterface } from 'src/types';
import { isEqual } from "lodash";

@Component({
  selector: 'project-page',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit {
  project?: ProjectInterface = undefined;
  project$ = new BehaviorSubject<typeof this.project>(this.project);
  id: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public projectService: ProjectService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.projectService.projects$.subscribe({
      next: projects => {
        const newProject = projects?.find(el => el.id === this.id);
        if ( newProject && isEqual(newProject, this.project) ) return;

        this.project = projects?.find(el => el.id === this.id);
        console.log(this.project);
        this.project$.next(this.project);
      }
    })
  }

}
