import {Component, Vue} from 'vue-property-decorator';
import TaskEditPane from '../components/TaskEditPane.vue'
import {LcTask, LcTaskStatus} from "@/model/LcTask";

class TreeNode extends LcTask {
    task?: LcTask;
    children?: Array<TreeNode>;
}

@Component({
    components: {
        TaskEditPane
    },
})
export default class ProjectView extends Vue {
    private value = "";
    tasks: TreeNode[] = [
        {
            task: {
                id: 1,
                parentId: 0,
                name: '学习',
                description: '好好学习天天向上',
                priority: 10,
                status: LcTaskStatus.Normal.code,
            },
            children: [{
                task: {
                    id: 2,
                    parentId: 1,
                    name: '学习语文',
                    description: '好好学习天天向上',
                    priority: 10,
                    status: LcTaskStatus.Normal.code,
                }
            }, {
                task: {
                    id: 3,
                    parentId: 1,
                    name: '学习数学',
                    description: '好好学习天天向上',
                    priority: 10,
                    status: LcTaskStatus.Normal.code,
                }
            }]
        }, {
            task: {
                id: 10,
                parentId: 0,
                name: '游戏',
                description: '放松一下',
                priority: 0,
                status: LcTaskStatus.Normal.code,
            },
            children: [{
                task: {
                    id: 12,
                    parentId: 10,
                    name: '扫雷',
                    priority: 10,
                    status: LcTaskStatus.Normal.code,
                }
            }, {
                task: {
                    id: 13,
                    parentId: 10,
                    name: '贪吃蛇',
                    priority: 10,
                    status: LcTaskStatus.Normal.code,
                }
            }]
        }
    ];

    private nextId = 0;

    append(data: TreeNode) {
        const newChild: TreeNode = {task: {id: this.nextId++, name: 'testtest'}, children: []};
        if (!data.children) {
            this.$set(data, 'children', []);
        }

        if (data.children) {
            data.children.push(newChild);
            const taskTree: any = this.$refs.taskTree;
            this.$nextTick(function () {
                taskTree.setCurrentKey(newChild.id);
            });
        }
    }

    taskChanged(data: TreeNode, node: Record<string, any>) {
        const taskDetailPane: any = this.$refs.taskDetailPane;
        taskDetailPane.task = data.task;
    }

    remove(node: Record<string, any>, data: TreeNode) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d: TreeNode) => d.id === data.id);
        children.splice(index, 1);
    }

    handleDragStart(node: Record<string, any>, ev: Record<string, any>) {
        console.log('drag start', node);
    }

    handleDragEnter(draggingNode: Record<string, any>, dropNode: Record<string, any>, ev: Record<string, any>) {
        // console.log('tree drag enter: ', dropNode.label);
    }

    handleDragLeave(draggingNode: Record<string, any>, dropNode: Record<string, any>, ev: Record<string, any>) {
        // console.log('tree drag leave: ', dropNode.label);
    }

    handleDragOver(draggingNode: Record<string, any>, dropNode: Record<string, any>, ev: Record<string, any>) {
        // console.log('tree drag over: ', dropNode.label);
    }

    handleDragEnd(draggingNode: Record<string, any>, dropNode: Record<string, any>, dropType: Record<string, any>, ev: Record<string, any>) {
        // console.log('tree drag end: ', dropNode && dropNode.label, dropType);
    }

    handleDrop(draggingNode: Record<string, any>, dropNode: Record<string, any>, dropType: Record<string, any>, ev: Record<string, any>) {
        // console.log('tree drop: ', dropNode.label, dropType);
    }

    allowDrop(draggingNode: Record<string, any>, dropNode: Record<string, any>, type: Record<string, any>) {
        return true;
    }

    allowDrag(draggingNode: Record<string, any>) {
        return true;
    }
}
