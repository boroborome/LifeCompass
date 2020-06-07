import { reactive } from "../reactive";
import { Suggestions } from "./suggestions";

@reactive
class TaskListFake {
    constructor(public tasks: any[] = []) {
    }
}

describe("suggestions", () => {
    it("are filtered by tasks", () => {
        const taskList = new TaskListFake();
        const suggestions = new Suggestions(["some text", "more text"], taskList as any);
        expect(suggestions.openSuggestions).toHaveLength(2);
        expect(suggestions.openSuggestions).toContain("some text");
        expect(suggestions.openSuggestions).toContain("more text");
        taskList.tasks.push({ title: " More  Text" });
        expect(suggestions.openSuggestions).toHaveLength(1);
        expect(suggestions.openSuggestions).toContain("some text");
    });
});
