import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss']
})
export class TopPanelComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
