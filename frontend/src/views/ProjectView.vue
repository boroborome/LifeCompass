<template>
  <el-container>
    <el-header height="auto">
      <div>
        状态
        <el-select v-model="value" placeholder="请选择">
          <el-option key="正常" label="正常" value="正常"></el-option>
          <el-option key="阻塞" label="阻塞" value="阻塞"></el-option>
          <el-option key="完成" label="完成" value="完成"></el-option>
        </el-select>计划状态
        <el-select v-model="value" placeholder="请选择">
          <el-option key="有计划" label="有计划" value="有计划"></el-option>
          <el-option key="无计划" label="无计划" value="无计划"></el-option>
          <el-option key="不计划" label="不计划" value="不计划"></el-option>
        </el-select>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-tree
          :data="tasks"
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
          :allow-drag="allowDrag"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ data.name }}</span>
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

<script lang="ts">
export { default } from "./ProjectView";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-header {
  padding-top: 20px;
  padding-bottom: 20px;
}

.el-header > div:first-child {
  float: left;
}
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
  visibility: hidden;
}

.custom-tree-node:hover .buttons {
  visibility: visible;
}
</style>
