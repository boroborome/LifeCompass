import {Component, Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {FlatTreeControl} from "@angular/cdk/tree";
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {MasterService} from "../../services/master.service";
import {LcTask} from "../../model/lc-task";

const LOAD_MORE = 'LOAD_MORE';

/** Nested node */
export class LoadmoreNode {
  childrenChange = new BehaviorSubject<LoadmoreNode[]>([]);

  task: LcTask;
  get children(): LoadmoreNode[] {
    return this.childrenChange.value;
  }

  constructor(public item: string,
              public hasChildren = false,
              public loadMoreParentItem: string | null = null) { }
}

/** Flat node with expandable and level information */
export class TaskNode {
  constructor(public item: string,
              public level = 1,
              public expandable = false,
              public loadMoreParentItem: string | null = null) { }
}

@Injectable()
export class LoadmoreDatabase {

  dataChange = new BehaviorSubject<LoadmoreNode[]>([]);
  nodeMap = new Map<string, LoadmoreNode>();

  /** The data */
  rootLevelNodes: string[] = ['Vegetables', 'Fruits'];
  dataMap = new Map<string, string[]>([
    ['Fruits', ['Apple', 'Orange', 'Banana']],
    ['Vegetables', ['Tomato', 'Potato', 'Onion']],
    ['Apple', ['Fuji', 'Macintosh']],
    ['Onion', ['Yellow', 'White', 'Purple', 'Green', 'Shallot', 'Sweet', 'Red', 'Leek']],
  ]);

  // tslint:disable-next-line: typedef
  initialize() {
    const data = this.rootLevelNodes.map(name => this._generateNode(name));
    this.dataChange.next(data);
  }

  /** Expand a node whose children are not loaded */
  // tslint:disable-next-line: typedef
  loadMore(item: string, onlyFirstTime = false) {
    if (!this.nodeMap.has(item) || !this.dataMap.has(item)) {
      return;
    }
    // tslint:disable-next-line: no-non-null-assertion
    const parent = this.nodeMap.get(item)!;
    const children = this.dataMap.get(item)!;
    if (onlyFirstTime && parent.children!.length > 0) {
      return;
    }
    const nodes = children.map(name => this._generateNode(name));

    parent.childrenChange.next(nodes);
    this.dataChange.next(this.dataChange.value);
  }

  private _generateNode(item: string): LoadmoreNode {
    console.log("new node:" + item);
    if (this.nodeMap.has(item)) {
      return this.nodeMap.get(item)!;
    }
    const result = new LoadmoreNode(item, this.dataMap.has(item));
    result.task = {name: item, description: `ID:${item}`};
    this.nodeMap.set(item, result);
    return result;
  }
}

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.scss'],
  providers: [LoadmoreDatabase]
})
export class TaskTreeComponent implements OnInit {

  nodeMap = new Map<string, TaskNode>();
  treeControl: FlatTreeControl<TaskNode>;
  treeFlattener: MatTreeFlattener<LoadmoreNode, TaskNode>;
  // Flat tree data source
  dataSource: MatTreeFlatDataSource<LoadmoreNode, TaskNode>;

  constructor(
    private taskDatabase: LoadmoreDatabase,
    private masterService: MasterService,
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);

    this.treeControl = new FlatTreeControl<TaskNode>(this.getLevel, this.isExpandable);

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    taskDatabase.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });

    taskDatabase.initialize();
  }
  ngOnInit(): void {

  }

  getChildren = (node: LoadmoreNode): Observable<LoadmoreNode[]> => node.childrenChange;

  transformer = (node: LoadmoreNode, level: number) => {
    const existingNode = this.nodeMap.get(node.item);

    if (existingNode) {
      return existingNode;
    }

    const newNode =
      new TaskNode(node.item, level, node.hasChildren, node.loadMoreParentItem);
    this.nodeMap.set(node.item, newNode);
    return newNode;
  }

  getLevel = (node: TaskNode) => node.level;

  isExpandable = (node: TaskNode) => node.expandable;

  hasChild = (_: number, nodeData: TaskNode) => nodeData.expandable;

  // isLoadMore = (_: number, nodeData: TaskNode) => nodeData.item === LOAD_MORE;

  /** Load more nodes from data source */
  loadMore(item: string) {
    this.taskDatabase.loadMore(item);
  }

  loadChildren(node: TaskNode) {
    this.taskDatabase.loadMore(node.item, true);
  }

}
