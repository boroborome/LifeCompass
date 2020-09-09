import {Component, OnInit} from '@angular/core';
import {MasterService} from 'src/app/services/master.service';
import {EnumItem} from 'src/app/utils/enum-item';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss']
})
export class ProjectViewComponent implements OnInit {
  taskStatusRange: EnumItem[] = [];
  constructor(
    private masterService: MasterService,
  ) {
  }
  ngOnInit(): void {
    this.masterService.getTaskStatus()
      .subscribe((data: EnumItem[]) => this.taskStatusRange = data);
  }

  refreshTaskList() {

  }
}
