import { Component, Prop, Vue } from 'vue-property-decorator';
import TaskEditPane from './TaskEditPane.vue'

class TreeNode {
    id?: number;
    label?: string;
    parent?: TreeNode;
    children?: Array<TreeNode>;
}

@Component({
    components: {
        TaskEditPane
    },
})
export default class ProjectView extends Vue {
    @Prop() private msg!: string;
    private value = '';
    data = [
        {
            id: 1,
            label: '一级 1',
            children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                    id: 9,
                    label: '三级 1-1-1'
                }, {
                    id: 10,
                    label: '三级 1-1-2'
                }]
            }]
        }, {
            id: 2,
            label: '一级 2',
            children: [{
                id: 5,
                label: '二级 2-1'
            }, {
                id: 6,
                label: '二级 2-2'
            }]
        }, {
            id: 3,
            label: '一级 3',
            children: [{
                id: 7,
                label: '二级 3-1'
            }, {
                id: 8,
                label: '二级 3-2',
                children: [{
                    id: 11,
                    label: '三级 3-2-1'
                }, {
                    id: 12,
                    label: '三级 3-2-2'
                }, {
                    id: 13,
                    label: '三级 3-2-3'
                }]
            }]
        }
    ];
    defaultProps = {
        children: 'children',
        label: 'label'
    };

    private nextId = 0;
    append(data: TreeNode) {
        // const newChild = { id: this.nextId++, label: 'testtest', children: [] };
        // if (!data.children) {
        //   this.$set(data, 'children', []);
        // }
        // data.children.push(newChild);
    }

    remove(node: TreeNode, data: TreeNode) {
        // const parent = node.parent;
        // const children = parent.data.children || parent.data;
        // const index = children.findIndex(d => d.id === data.id);
        // children.splice(index, 1);
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
        // if (dropNode.data.label === '二级 3-1') {
        //   return type !== 'inner';
        // } else {
        //   return true;
        // }
    }
    allowDrag(draggingNode: Record<string, any>) {
        // return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    }
}
