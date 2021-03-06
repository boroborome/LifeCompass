import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AsyncSubject, BehaviorSubject, Observable} from "rxjs";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {LcTask} from "../../model/lc-task";
import {TaskService} from "../../services/task.service";
import {TaskFilter} from "../../model/task-filter";

/** Nested node */
export class TaskNode {
  childrenChange = new BehaviorSubject<TaskNode[]>([]);

  get children(): TaskNode[] {
    return this.childrenChange.value;
  }

  constructor(public task: LcTask,
              public parent: TaskNode,
              public hasChildren = false,
              public level = 1,
              public expandable = true) {
  }
}

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.scss'],
})
export class TaskTreeComponent implements OnInit {
  @Input() filter: TaskFilter;
  @Output() selectChanged = new EventEmitter<LcTask>();
  selectedTaskNode = new BehaviorSubject<TaskNode>(null);
  rootTaskNode: TaskNode = new TaskNode({id: -1, name: 'root holder node'}, null);

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

    this.rootTaskNode.childrenChange.subscribe(data => {
      this.dataSource.data = data;
    });
    this.selectedTaskNode.subscribe(selectedTask => this.selectChanged.emit(selectedTask?.task));
  }

  ngOnInit(): void {
    this.reloadRoot();
  }

  reloadRoot() {
    this.loadChildren(this.rootTaskNode);
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

  loadChildren(taskNode: TaskNode): Observable<TaskNode[]> {
    const loadTaskNodes = new AsyncSubject<TaskNode[]>();
    const filter = new TaskFilter();
    Object.assign(filter, this.filter);
    filter.parentId = taskNode.task.id;

    this.taskService.querySubTasks(filter)
      .subscribe(data => {
        const subTasks: TaskNode[] =
          data.sort((a, b) => -LcTask.compare(a, b))
          .map(task =>
            new TaskNode(task, taskNode));
        taskNode.childrenChange.next(subTasks);
        this.refreshTaskTree();
        loadTaskNodes.next(subTasks);
        loadTaskNodes.complete();
      });
    return loadTaskNodes;
  }

  // ---

  refreshTaskTree() {
    const rootNode = this.rootTaskNode.childrenChange.value;
    this.rootTaskNode.childrenChange.next(rootNode);
  }

  createRootTask() {
    this.createSubTask(this.rootTaskNode);
  }

  deleteTask(taskNode: TaskNode) {
    if (!confirm(`Are you sure to delete Task:${taskNode.task.name}?`)) {
      return;
    }
    this.taskService.deleteTask(taskNode.task)
      .subscribe(task => {
        const parent = taskNode.parent;
        const newChildren = parent.children.filter(item => item != taskNode);
        parent.childrenChange.next(newChildren);
        if (taskNode == this.selectedTaskNode.value) {
          this.selectedTaskNode.next(null);
        }
        this.refreshTaskTree();
      });
  }

  createSubTask(parentTaskNode: TaskNode) {
    if (!this.treeControl.isExpanded(parentTaskNode)) {
      this.loadChildren(parentTaskNode)
        .subscribe(loadTaskNodes => {
          this.treeControl.expand(parentTaskNode);
          this.createSubTaskImpl(parentTaskNode);
        })
    } else {
      this.createSubTaskImpl(parentTaskNode);
    }
  }

  createSubTaskImpl(parentTaskNode: TaskNode) {
    const newTask: LcTask = {parentId: parentTaskNode.task.id, name: 'New Task'};
    this.taskService.createTask(newTask)
      .subscribe(task => {
        const newTaskNode: TaskNode = new TaskNode(task, parentTaskNode);
        parentTaskNode.children.push(newTaskNode);
        this.refreshTaskTree();
        this.selectedTaskNode.next(newTaskNode)
      });
  }

  selectNode(node: TaskNode) {
    this.selectedTaskNode.next(node);
  }
}
