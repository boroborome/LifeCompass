<template>
  <div id="app">
    <el-tabs type="border-card">
        <el-tab-pane>
            <span slot="label"><i class="el-icon-ship"></i> 项目视图</span>
            项目视图
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
        </el-tab-pane>
    </el-tabs>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
