import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProjectService } from 'src/app/project.service';
import { PopperService } from 'src/app/popper';
import { ModalService } from 'src/app/_modal';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.scss'],
})
export class LeftmenuComponent implements OnInit {
  isOpened = false;

  constructor(
    public projectService: ProjectService,
    public modalService: ModalService,
    public popperService: PopperService,
  ) { }

  ngOnInit(): void {
    
  }
}
