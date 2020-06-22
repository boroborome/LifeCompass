import {TaskDto} from "@Generated/openapi";
import {config, mount} from "@vue/test-utils";
import {createRenderer} from "vue-server-renderer";
import {MessageBox} from "../elements";
import {reactive} from "../reactive";
import {Suggestions} from "../state/suggestions";
import {ConflictError, TaskList} from "../state/taskList";
import Demo from "./Demo.vue";

config.logModifiedComponents = false;

const renderer = createRenderer();

const mockConfirm = MessageBox.confirm = jest.fn();
const mockAdd = jest.fn();
const mockRemove = jest.fn();
const mockRefresh = jest.fn();
const mockReset = jest.fn();
const mockSave = jest.fn();

@reactive
class TaskListFake {
    constructor(public tasks: TaskDto[] = [], public changed = false) {
    }

    add(...args: any[]) {
        mockAdd(...args);
    }

    remove(...args: any[]) {
        mockRemove(...args);
    }

    async refresh() {
        await mockRefresh();
    }

    reset() {
        mockReset();
    }

    async save() {
        await mockSave();
    }
}

const taskListFake = new TaskListFake();

afterEach(() => {
    mockConfirm.mockReset();
    mockAdd.mockReset();
    mockRemove.mockReset();
    mockRefresh.mockReset();
    mockReset.mockReset();
    mockSave.mockReset();
    taskListFake.tasks = [];
    taskListFake.changed = false;
});

function demo() {
    return mount(Demo, {
        mocks: {
            $t: (key: string) => key,
            $tc: (key: string) => key,
        },
        provide: {
            [Suggestions.name]: {
                openSuggestions: [],
            },
            [TaskList.name]: taskListFake,
        },
    }).vm;
}

describe("tasklist app", () => {
    it("is initially invalid", () => {
        expect(demo().valid).toBe(false);
    });

    it("becomes valid for sufficient long task name", () => {
        const vm = demo();
        vm.newTask = "1234";
        expect(vm.valid).toBe(true);
    });

    it("adds valid new task", () => {
        const vm = demo();
        vm.newTask = "1234";
        vm.addNewTask();
        expect(mockAdd).toBeCalledWith("1234");
        expect(vm.newTask).toBe("");
    });

    it("ignores invalid new task", () => {
        const vm = demo();
        vm.newTask = "123";
        vm.addNewTask();
        expect(mockAdd).not.toBeCalled();
        expect(vm.newTask).toBe("123");
    });

    it("closes task", async () => {
        const vm = demo();
        taskListFake.tasks.push({title: "XXX", completed: false});
        vm.close(taskListFake.tasks[0]);
        expect(await renderer.renderToString(vm)).toMatchSnapshot();
    });

    it("opens task", async () => {
        const vm = demo();
        taskListFake.tasks.push({title: "XXX", completed: true});
        vm.open(taskListFake.tasks[0]);
        expect(await renderer.renderToString(vm)).toMatchSnapshot();
    });

    it("closes all tasks", async () => {
        const vm = demo();
        taskListFake.tasks.push({title: "XXX", completed: false});
        vm.closeAll();
        expect(await renderer.renderToString(vm)).toMatchSnapshot();
    });

    it("resets task list", () => {
        demo().reset();
        expect(mockReset).toBeCalled();
    });

    it("removes task", () => {
        const task = {title: "task", completed: true};
        demo().remove(task);
        expect(mockRemove).toBeCalledWith(task);
    });

    it("removes error class on valid input", async () => {
        const vm = demo();
        expect(await renderer.renderToString(vm)).toMatchSnapshot();
        vm.newTask = "1234";
        expect(await renderer.renderToString(vm)).toMatchSnapshot();
    });

    it("saves task list", async () => {
        await demo().save();
        expect(mockSave).toBeCalled();
    });

    it("handles unknow error on save", async () => {
        const error = {};
        mockSave.mockRejectedValue(error);
        await expect(demo().save()).rejects.toBe(error);
    });

    it("refreshes on conflict error", async () => {
        mockSave.mockRejectedValue(new ConflictError());
        await demo().save();
        expect(mockRefresh).toBeCalled();
    });

    it("does not refresh on conflict error", async () => {
        mockSave.mockRejectedValue(new ConflictError());
        mockConfirm.mockRejectedValue({});
        await demo().save();
        expect(mockRefresh).not.toBeCalled();
    });
});
