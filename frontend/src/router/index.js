import Vue from 'vue'
import Router from 'vue-router'
import ProjectView from '@/components/ProjectView'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: ProjectView
        }, {
            path: '/project-view',
            name: 'Project View',
            component: ProjectView
        }, {
            path: '/date-view',
            name: 'Date View',
            component: HelloWorld
        }, {
            path: '/history-view',
            name: 'History View',
            component: HelloWorld
        }
    ]
})
