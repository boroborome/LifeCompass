<template>
    <div id="app">
        <el-menu class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1"><router-link to="/project-view"><i class="el-icon-ship"></i> 项目视图</router-link></el-menu-item>
            <el-menu-item index="1"><router-link to="/date-view"><i class="el-icon-date"></i> 日历视图</router-link></el-menu-item>
            <el-menu-item index="1"><router-link to="/history-view"><i class="el-icon-coin"></i> 历史视图</router-link></el-menu-item>
        </el-menu>
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
