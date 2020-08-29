<template>
    <el-container>
        <el-header>
            状态
            <el-select v-model="value" placeholder="请选择">
                <el-option key='正常' label='正常' value='正常'></el-option>
                <el-option key='阻塞' label='阻塞' value='阻塞'></el-option>
                <el-option key='完成' label='完成' value='完成'></el-option>
            </el-select>

            计划状态
            <el-select v-model="value" placeholder="请选择">
                <el-option key='有计划' label='有计划' value='有计划'></el-option>
                <el-option key='无计划' label='无计划' value='无计划'></el-option>
                <el-option key='不计划' label='不计划' value='不计划'></el-option>
            </el-select>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-tree
                      :data="data"
                      node-key="id"
                      default-expand-all
                      @node-drag-start="handleDragStart"
                      @node-drag-enter="handleDragEnter"
                      @node-drag-leave="handleDragLeave"
                      @node-drag-over="handleDragOver"
                      @node-drag-end="handleDragEnd"
                      @node-drop="handleDrop"
                      draggable
                      :allow-drop="allowDrop"
                      :allow-drag="allowDrag">
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                              <span>{{ node.label }}</span>
                              <span class="buttons">
                                <i class="el-icon-document-add" @click="() => append(data)"></i>
                                <i class="el-icon-document-delete" @click="() => remove(node, data)"></i>
                              </span>
                           </span>
                </el-tree>
            </el-aside>
            <el-main>
                <task-edit-pane></task-edit-pane>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import TaskEditPane from './TaskEditPane'
export default {
    name: 'ProjectView',
    components: {TaskEditPane},
    data() {
      return {
        value: '',
        data: [{
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
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    methods: {
        append(data) {
                const newChild = { id: id++, label: 'testtest', children: [] };
                if (!data.children) {
                  this.$set(data, 'children', []);
                }
                data.children.push(newChild);
              },

              remove(node, data) {
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
              },
      handleDragStart(node, ev) {
        console.log('drag start', node);
      },
      handleDragEnter(draggingNode, dropNode, ev) {
        console.log('tree drag enter: ', dropNode.label);
      },
      handleDragLeave(draggingNode, dropNode, ev) {
        console.log('tree drag leave: ', dropNode.label);
      },
      handleDragOver(draggingNode, dropNode, ev) {
        console.log('tree drag over: ', dropNode.label);
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        console.log('tree drop: ', dropNode.label, dropType);
      },
      allowDrop(draggingNode, dropNode, type) {
        if (dropNode.data.label === '二级 3-1') {
          return type !== 'inner';
        } else {
          return true;
        }
      },
      allowDrag(draggingNode) {
        return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
}
.el-col {
    border-radius: 4px;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

.buttons {
    visibility:hidden;
}

.custom-tree-node:hover .buttons {
    visibility:visible;
}
</style>
