import { Task } from "@Generated/openapi";
import { ConflictError, TaskList } from "./taskList";

const mockGetTasks = jest.fn();
const mockOverwriteTasks = jest.fn();

afterEach(() => {
    mockGetTasks.mockReset();
    mockOverwriteTasks.mockReset();
});

async function createTaskList(tasks: Task[]) {
    mockGetTasks.mockResolvedValue(tasks);
    const taskList = new TaskList({
        overwriteTasks: mockOverwriteTasks,
        tasks: mockGetTasks,
    } as any);
    await taskList.refresh();
    return taskList;
}

describe("tasklist", () => {
    it("is correctly initialized", async () => {
        const tasks = [{ title: "task", completed: false }];
        const taskList = await createTaskList(tasks);
        expect(taskList.tasks).toEqual(tasks);
        expect(taskList.changed).toBe(false);
    });

    it("adds a task", async () => {
        const taskList = await createTaskList([]);
        expect(taskList.changed).toBe(false);
        taskList.add("task");
        expect(taskList.tasks).toContainEqual({ title: "task", completed: false });
        expect(taskList.changed).toBe(true);
    });

    it("removes a task", async () => {
        const task: Task = { title: "task", completed: false };
        const taskList = await createTaskList([task]);
        taskList.remove(task);
        expect(taskList.changed).toBe(false);
        taskList.remove(taskList.tasks[0]);
        expect(taskList.tasks).toHaveLength(0);
        expect(taskList.changed).toBe(true);
    });

    it("detects a changed task", async () => {
        const taskList = await createTaskList([{ title: "task", completed: false }]);
        expect(taskList.changed).toBe(false);
        const task = taskList.tasks[0];
        task.completed = true;
        expect(taskList.changed).toBe(true);
        task.completed = false;
        expect(taskList.changed).toBe(false);
    });

    it("saves tasks", async () => {
        const taskList = await createTaskList([]);
        taskList.add("task");
        expect(taskList.changed).toBe(true);
        await taskList.save();
        expect(mockOverwriteTasks).toBeCalledWith([{ title: "task", completed: false }]);
        expect(taskList.tasks).toHaveLength(0);
        expect(taskList.changed).toBe(false);
    });

    it("handles unknown error during save", async () => {
        const taskList = await createTaskList([]);
        taskList.add("task");
        expect(taskList.changed).toBe(true);
        const error = {};
        mockOverwriteTasks.mockRejectedValueOnce(error);
        await expect(taskList.save()).rejects.toBe(error);
        expect(taskList.changed).toBe(true);
    });

    it("handles invalid response during save", async () => {
        const taskList = await createTaskList([]);
        taskList.add("task");
        expect(taskList.changed).toBe(true);
        const response = new Response();
        mockOverwriteTasks.mockRejectedValueOnce(response);
        await expect(taskList.save()).rejects.toBe(response);
        expect(taskList.changed).toBe(true);
    });

    it("handles 409 response during save", async () => {
        const taskList = await createTaskList([]);
        taskList.add("task");
        expect(taskList.changed).toBe(true);
        mockOverwriteTasks.mockRejectedValueOnce(new Response("error", { status: 409 }));
        await expect(taskList.save()).rejects.toBeInstanceOf(ConflictError);
        expect(taskList.changed).toBe(true);
    });
});
