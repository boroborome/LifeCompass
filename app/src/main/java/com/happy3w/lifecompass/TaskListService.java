package com.happy3w.lifecompass;

import com.happy3w.lifecompass.api.generated.TaskDto;
import com.happy3w.lifecompass.generated.Tables;
import com.happy3w.lifecompass.validation.UniqueTask;
import org.jooq.impl.DSL;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
@Validated
public class TaskListService {

    private final TaskRepository taskRepository;

    public TaskListService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks() {
        return taskRepository.findAll(DSL.noCondition());
    }

    public long addTask(@UniqueTask TaskDto task) {
        return taskRepository.insert(fromApi(task));
    }

    public Task getTask(long id) {
        Task task = taskRepository.findOne(Tables.TASK.ID.eq(id));
        if (task == null) {
            return null;
        }
        return task;
    }

    public boolean updateTodo(long id, TaskDto task) {
        Task foundTask = taskRepository.findOneForUpdate(Tables.TASK.ID.eq(id).and(Tables.TASK.VERSION.eq(task.getVersion())));
        if (foundTask == null) {
            return false;
        }
        foundTask.setTitle(task.getTitle());
        foundTask.setCompleted(task.getCompleted());
        taskRepository.update(foundTask);
        return true;
    }

    public void overwriteTasks(List<TaskDto> tasks)
            throws OptimisticLockingFailureException {
        Map<Long, Task> allTasks = taskRepository.findAllForUpdate(DSL.noCondition())
                .stream()
                .collect(Collectors.toMap(Task::getId, Function.identity()));
        for (TaskDto task : tasks) {
            Task updatedTask = allTasks.remove(task.getId());
            if (updatedTask != null) {
                if (!updatedTask.getVersion().equals(task.getVersion())) {
                    throw new OptimisticLockingFailureException(
                            String.format("cannot update %s with stale data %s", updatedTask, task));
                }
                updatedTask.setTitle(task.getTitle());
                updatedTask.setCompleted(task.getCompleted());
                taskRepository.update(updatedTask);
            } else {
                taskRepository.insert(fromApi(task));
            }
        }
        taskRepository.deleteAll(Tables.TASK.ID.in(allTasks.keySet()));
    }

    public boolean deleteTask(long id) {
        return taskRepository.deleteAll(Tables.TASK.ID.eq(id)) > 0;
    }

    public void deleteTasks() {
        taskRepository.deleteAll(DSL.noCondition());
    }

    private static Task fromApi(TaskDto task) {
        return Task.builder()
                .id(task.getId())
                .version(task.getVersion())
                .title(task.getTitle())
                .completed(task.getCompleted())
                .build();
    }

}