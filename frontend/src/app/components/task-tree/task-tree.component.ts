import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {LcTask} from "../../model/lc-task";
import {TaskService} from "../../services/task.service";

const LOAD_MORE = 'LOAD_MORE';

/** Nested node */
export class TaskNode {
  childrenChange = new BehaviorSubject<TaskNode[]>([]);

  get children(): TaskNode[] {
    return this.childrenChange.value;
  }

  constructor(public task: LcTask,
              public hasChildren = false,
              public parentId: number | null = null,
              public level = 1,
              public expandable = false) {
  }
}

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.scss'],
})
export class TaskTreeComponent implements OnInit {

  taskListChange = new BehaviorSubject<TaskNode[]>([]);
  treeControl: FlatTreeControl<TaskNode>;
  treeFlattener: MatTreeFlattener<TaskNode, TaskNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<TaskNode, TaskNode>;

  constructor(
    private taskService: TaskService,
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<TaskNode>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.taskListChange.subscribe(data => {
      this.dataSource.data = data;
    });

  }

  ngOnInit(): void {
    this.taskService.queryRootTasks().subscribe(data => {
      const taskList: TaskNode[] = data.map(task =>
        new TaskNode(task, false, task.parentId, 1, false));

      this.taskListChange.next(taskList);
    });
  }

  // -- begin for MatTreeFlattener
  getChildren = (node: TaskNode): Observable<TaskNode[]> => node.childrenChange;

  transformer = (node: TaskNode, level: number) => {
    node.level = level;
    return node;
  }

  getLevel = (node: TaskNode) => node.level;

  isExpandable = (node: TaskNode) => node.expandable;
  // -- end for MatTreeFlattener

  hasChild = (_: number, nodeData: TaskNode) => nodeData.expandable;

  // isLoadMore = (_: number, nodeData: TaskNode) => nodeData.item === LOAD_MORE;


  loadChildren(node: TaskNode) {
    this.loadMoreData(node);
  }

  // ---

  /** Expand a node whose children are not loaded */
  // tslint:disable-next-line: typedef
  loadMoreData(taskNode: TaskNode) {
    this.taskService.querySubTasks(taskNode.task.id)
      .subscribe(data => {
        const subTasks: TaskNode[] = data.map(task =>
          new TaskNode(task, false, task.parentId, 1, false));
        taskNode.childrenChange.next(subTasks);
        this.taskListChange.next(this.taskListChange.value);
      });
  }
}
