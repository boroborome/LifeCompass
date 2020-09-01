import { Component, Prop, Vue } from 'vue-property-decorator';
import {LcTask} from "@/model/LcTask";

@Component
export default class TaskEditPane extends Vue {
    task: LcTask = {};

    onSubmit() {
        console.log(this.task);
    }
}
