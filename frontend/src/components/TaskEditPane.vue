<template>
    <el-form ref="taskForm" :model="task" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="task.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="task.description"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="task.status">
          <el-option label="正常" value="normal"></el-option>
          <el-option label="阻塞" value="block"></el-option>
          <el-option label="完成" value="finish"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计划时间">
        <el-col :span="11" class="time-block">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="task.planStartTime"
            value-format="timestamp"
            style="width: 100%;">
          </el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11" class="time-block">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="task.planEndTime"
                value-format="timestamp"
                style="width: 100%;">
             </el-date-picker>
        </el-col>
      </el-form-item>
            <el-form-item label="优先级">
              <el-radio-group v-model="task.priority">
                <el-radio label="高"></el-radio>
                <el-radio label="中"></el-radio>
                <el-radio label="低"></el-radio>
              </el-radio-group>
            </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="task.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">应用</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
</template>

<script lang="ts">
export { default } from "./TaskEditPane";
</script>

<style scoped>
.el-radio-group {
    float: left;
}
.el-select {
    float: left;
}
.time-block {
    display: flex;
}
</style>
