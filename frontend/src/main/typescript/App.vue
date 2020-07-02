<template>
    <div>
        <el-tabs type="border-card">
            <el-tab-pane>
                <span slot="label"><i class="el-icon-ship"></i> 项目视图</span>
                <project-view></project-view>
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-date"></i> 日历视图</span>
                日历视图
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-coin"></i> 历史视图</span>
                历史视图
            </el-tab-pane>
            <el-tab-pane>
                <span slot="label"><i class="el-icon-baseball"></i> Demo视图</span>
                <demo></demo>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts">
export { default } from "./App";
</script>
<style lang="scss" module>
@import url("//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css");
</style>
