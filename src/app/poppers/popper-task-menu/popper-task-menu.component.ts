import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { TaskInterface } from 'src/types';

@Component({
  selector: 'popper-task-menu',
  templateUrl: './popper-task-menu.component.html',
  styleUrls: ['./popper-task-menu.component.scss']
})
export class PopperTaskMenuComponent implements OnInit {
  @Input() projectId!: string;
  @Input() id!: string;
  @Input() item!: HTMLElement;
  @Input() task!: TaskInterface;
  @Output() deleteTaskEvent = new EventEmitter<TaskInterface>();
  @Output() closeTaskEditingEvent = new EventEmitter<boolean>();

  constructor(
    public projectService: ProjectService
  ) { }

  ngOnInit(): void {
  }

  deleteTask(task: TaskInterface) {
    this.deleteTaskEvent.emit(task);
  }

  closeTaskEditing(res: boolean) {
    this.closeTaskEditingEvent.emit(res);
  }

}