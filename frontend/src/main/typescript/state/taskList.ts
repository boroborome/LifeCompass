import { TaskDto, TaskListApiInterface } from "@Generated/openapi";
import { reactive } from "../reactive";

export class ConflictError {
}

@reactive
export class TaskList {
    private localTasks: TaskDto[] = [];
    private savedTasks!: TaskDto[];

    constructor(private taskListApi: TaskListApiInterface) {
    }

    get tasks() {
        return this.localTasks;
    }

    get changed() {
        return JSON.stringify(this.localTasks) !== JSON.stringify(this.savedTasks);
    }

    remove(task: TaskDto) {
        const i = this.localTasks.indexOf(task);
        if (i >= 0) {
            this.localTasks.splice(i, 1);
        }
    }

    add(task: string) {
        this.localTasks.push({
            completed: false,
            title: task,
        });
    }

    reset() {
        this.localTasks = JSON.parse(JSON.stringify(this.savedTasks));
    }

    async save() {
        try {
            await this.taskListApi.overwriteTasks(this.localTasks);
        } catch (error) {
            if (error instanceof Response) {
                const { status } = error;
                if (status === 409) {
                    throw new ConflictError();
                }
            }
            throw error;
        }
        await this.refresh();
    }

    async refresh() {
        this.savedTasks = await this.taskListApi.tasks();
        this.reset();
    }
}
