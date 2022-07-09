import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { ModalService } from 'src/app/_modal';

@Component({
  selector: 'app-modal-create-project',
  templateUrl: './modal-create-project.component.html',
  styleUrls: ['./modal-create-project.component.scss']
})
export class ModalCreateProjectComponent implements OnInit {

  constructor(
    public projectService: ProjectService,
    public modalService: ModalService
  ) { }

  enterPressed(): void {
    this.projectService.createProject(this.projectService.newProjectName, this.projectService.newProjectColor)
  }

  ngOnInit(): void {
  }

}
