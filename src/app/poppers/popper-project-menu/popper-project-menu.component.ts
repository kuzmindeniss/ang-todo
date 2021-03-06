import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { ModalService } from 'src/app/_modal';
import { ProjectInterface } from 'src/types';

@Component({
  selector: 'popper-project-menu',
  templateUrl: './popper-project-menu.component.html',
  styleUrls: ['./popper-project-menu.component.scss']
})
export class PopperProjectMenuComponent implements OnInit {
  @Input() id!: string;
  @Input() item!: HTMLElement;
  @Input() project!: ProjectInterface;

  constructor(
    public projectService: ProjectService,
    public modalService: ModalService,
  ) {
  }

  ngOnInit(): void {
  }

}
