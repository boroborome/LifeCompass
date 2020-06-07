package com.happy3w.lifecompass;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import com.happy3w.lifecompass.validation.UniqueTodo;

import org.jooq.impl.DSL;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Transactional
@Validated
public class TaskListService {

    private final TaskRepository taskRepository;

    public TaskListService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<com.happy3w.lifecompass.api.generated.Task> getTodos() {
        return taskRepository.findAll(DSL.noCondition()).stream().map(TaskListService::toApi).collect(Collectors.toList());
    }

    public long addTodo(@UniqueTodo com.happy3w.lifecompass.api.generated.Todo todo) {
        return taskRepository.insert(fromApi(todo));
    }

    public com.happy3w.lifecompass.api.generated.Todo getTodo(long id) {
        Task task = taskRepository.findOne(com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.eq(id));
        if (task == null) {
            return null;
        }
        return toApi(task);
    }

    public boolean updateTodo(long id, com.happy3w.lifecompass.api.generated.Todo todo) {
        Task foundTask = taskRepository.findOneForUpdate(com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.eq(id).and(com.happy3w.lifecompass.generated.tables.Todo.TODO.VERSION.eq(todo.getVersion())));
        if (foundTask == null) {
            return false;
        }
        foundTask.setTitle(todo.getTitle());
        foundTask.setCompleted(todo.getCompleted());
        taskRepository.update(foundTask);
        return true;
    }

    public void overwriteTodos(List<com.happy3w.lifecompass.api.generated.Todo> todos)
            throws OptimisticLockingFailureException {
        Map<Long, Task> allTodos = taskRepository.findAllForUpdate(DSL.noCondition())
                .stream()
                .collect(Collectors.toMap(Task::getId, Function.identity()));
        for (com.happy3w.lifecompass.api.generated.Todo todo : todos) {
            Task updatedTask = allTodos.remove(todo.getId());
            if (updatedTask != null) {
                if (!updatedTask.getVersion().equals(todo.getVersion())) {
                    throw new OptimisticLockingFailureException(
                            String.format("cannot update %s with stale data %s", updatedTask, todo));
                }
                updatedTask.setTitle(todo.getTitle());
                updatedTask.setCompleted(todo.getCompleted());
                taskRepository.update(updatedTask);
            } else {
                taskRepository.insert(fromApi(todo));
            }
        }
        taskRepository.deleteAll(com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.in(allTodos.keySet()));
    }

    public boolean deleteTodo(long id) {
        return taskRepository.deleteAll(com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.eq(id)) > 0;
    }

    public void deleteTodos() {
        taskRepository.deleteAll(DSL.noCondition());
    }

    private static Task fromApi(com.happy3w.lifecompass.api.generated.Todo todo) {
        return Task.builder()
                .id(todo.getId())
                .version(todo.getVersion())
                .title(todo.getTitle())
                .completed(todo.getCompleted())
                .build();
    }

    private static com.happy3w.lifecompass.api.generated.Todo toApi(Task task) {
        return new com.happy3w.lifecompass.api.generated.Todo().id(task.getId())
                .version(task.getVersion())
                .title(task.getTitle())
                .completed(task.isCompleted());
    }

}
