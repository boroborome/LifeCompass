import { TaskDto } from "@Generated/openapi";
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import Demo from "./demo/Demo.vue";
import { Button, ButtonGroup, Col, MessageBox, Row, TabPane, Tabs } from "./elements";
import { Suggestions } from "./state/suggestions";
import { ConflictError, TaskList } from "./state/taskList";

@Component({
    components: {
        Demo,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
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
