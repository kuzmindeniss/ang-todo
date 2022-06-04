import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { ModalService } from 'src/app/_modal';
import { ProjectInterface } from 'src/types';

@Component({
  selector: 'app-modal-edit-project',
  templateUrl: './modal-edit-project.component.html',
  styleUrls: ['./modal-edit-project.component.scss']
})
export class ModalEditProjectComponent implements OnInit {

  constructor(
    public projectService: ProjectService,
    public modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

}
