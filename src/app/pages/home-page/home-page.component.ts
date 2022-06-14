import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { ModalService } from 'src/app/_modal';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(
    public projectService: ProjectService,
    public modalService: ModalService,
  ) { }

  ngOnInit(): void {
  }

}
