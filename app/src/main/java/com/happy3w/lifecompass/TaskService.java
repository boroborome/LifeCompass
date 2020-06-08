package com.happy3w.lifecompass;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.happy3w.lifecompass.generated.Tables;
import com.happy3w.lifecompass.validation.UniqueTask;
import org.jooq.impl.DSL;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Service
@Transactional
@Validated
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll(DSL.noCondition());
    }

    public long addTask(@UniqueTask Task task) {
        return taskRepository.insert(task);
    }

    public Task getTask(long id) {
        Task task = taskRepository.findOne(Tables.TASK.ID.eq(id));
        if (task == null) {
            return null;
        }
        return task;
    }

    public boolean updateTodo(long id, Task task) {
        Task foundTask = taskRepository.findOneForUpdate(Tables.TASK.ID.eq(id).and(Tables.TASK.VERSION.eq(task.getVersion())));
        if (foundTask == null) {
            return false;
        }
        foundTask.setTitle(task.getTitle());
        foundTask.setCompleted(task.isCompleted());
        taskRepository.update(foundTask);
        return true;
    }

    public void overwriteTasks(Stream<Task> tasks) throws OptimisticLockingFailureException {
        Map<Long, Task> allTasks = taskRepository.findAllForUpdate(DSL.noCondition())
                .stream()
                .collect(Collectors.toMap(Task::getId, Function.identity()));
        tasks.forEach(task -> {
            Task updatedTask = allTasks.remove(task.getId());
            if (updatedTask != null) {
                if (!updatedTask.getVersion().equals(task.getVersion())) {
                    throw new OptimisticLockingFailureException(
                            String.format("cannot update %s with stale data %s", updatedTask, task));
                }
                updatedTask.setTitle(task.getTitle());
                updatedTask.setCompleted(task.isCompleted());
                taskRepository.update(updatedTask);
            } else {
                taskRepository.insert(task);
            }
        });
        taskRepository.deleteAll(Tables.TASK.ID.in(allTasks.keySet()));
    }

    public boolean deleteTask(long id) {
        return taskRepository.deleteAll(Tables.TASK.ID.eq(id)) > 0;
    }

    public void deleteTasks() {
        taskRepository.deleteAll(DSL.noCondition());
    }
}
