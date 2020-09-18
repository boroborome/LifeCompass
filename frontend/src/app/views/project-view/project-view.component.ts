import {Component, OnInit} from '@angular/core';
import {TaskFilter} from "../../model/task-filter";

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  defaultFilter: TaskFilter = {status: ["1", "2"]}
  constructor() {
  }
  ngOnInit(): void {
  }

  refreshTaskList() {

  }
}
