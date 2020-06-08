import { TaskDto } from "@Generated/openapi";
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import AutoComplete from "./AutoComplete.vue";
import { Button, ButtonGroup, Col, MessageBox, Row } from "./elements";
import { Suggestions } from "./state/suggestions";
import { ConflictError, TaskList } from "./state/taskList";

@Component({
    components: {
        AutoComplete,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        [Col.name]: Col,
        [Row.name]: Row,
    },
})
export default class App extends Vue {
    newTask = "";

    @Inject(TaskList.name)
    private taskList!: TaskList;

    @Inject(Suggestions.name)
    private suggestions!: Suggestions;

    get openTasks() {
        return this.taskList.tasks.filter((t) => !t.completed);
    }

    get doneTasks() {
        return this.taskList.tasks.filter((t) => t.completed);
    }

    get valid() {
        return this.newTask.length > 3;
    }

    get openSuggestions() {
        return this.suggestions.openSuggestions;
    }

    get changed() {
        return this.taskList.changed;
    }

    close(task: TaskDto) {
        task.completed = true;
    }

    open(task: TaskDto) {
        task.completed = false;
    }

    remove(task: TaskDto) {
        this.taskList.remove(task);
    }

    closeAll() {
        this.taskList.tasks.forEach((task) => {
            task.completed = true;
        });
    }

    addNewTask() {
        if (this.valid) {
            this.taskList.add(this.newTask);
            this.newTask = "";
        }
    }

    reset() {
        this.taskList.reset();
    }

    async save() {
        try {
            await this.taskList.save();
        } catch (error) {
            if (error instanceof ConflictError) {
                try {
                    await MessageBox.confirm(this.$t("concurrentModification.message").toString(),
                        this.$t("concurrentModification.title").toString(), { type: "error" });
                    await this.taskList.refresh();
                } catch (result) {
                }
            } else {
                throw error;
            }
        }
    }
}
