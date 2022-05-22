import { Component } from '@angular/core';
import { Colors } from "src/types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ang-todo';
  str = Colors;

  ngOnInit() {
  }
}
