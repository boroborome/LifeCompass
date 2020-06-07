import { reactive } from "../reactive";
import { TaskList } from "./taskList";

function normalize(s: string) {
    return s.trim().toLowerCase().split(/\s+/).join(" ");
}

@reactive
export class Suggestions {
    constructor(private suggestions: string[], private taskList: TaskList) {
    }

    get openSuggestions() {
        return this.suggestions.filter((s) => !this.taskList.tasks.some((t) => normalize(t.title) === normalize(s)));
    }
}
