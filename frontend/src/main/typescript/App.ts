import { TaskDto } from "@Generated/openapi";
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import Demo from "./demo/Demo.vue";
import { Button, ButtonGroup, Col, MessageBox, Option, Row, TabPane, Tabs } from "./elements";
import ProjectView from "./project-view/ProjectView.vue";
import { Suggestions } from "./state/suggestions";
import { ConflictError, TaskList } from "./state/taskList";

@Component({
    components: {
        Demo,
        ProjectView,
        [Col.name]: Col,
        [Row.name]: Row,
        [TabPane.name]: TabPane,
        [Tabs.name]: Tabs,
    },
})
export default class App extends Vue {
    newTask = "";

    @Inject(TaskList.name)
    private taskList!: TaskList;

    @Inject(Suggestions.name)
    private suggestions!: Suggestions;

}
