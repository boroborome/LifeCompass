<template>
    <div>
        <el-row>
            <el-col :span="24">
                状态:<el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in searchCriteria.statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
                计划状态:<el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in searchCriteria.planOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                任务树
            </el-col>
            <el-col :span="12">
                任务详情
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default from "./ProjectView";
</script>

<style scoped>
@import url("//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css");
</style>
