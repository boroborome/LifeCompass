package com.happy3w.lifecompass;

import com.happy3w.lifecompass.api.generated.TaskDto;
import com.happy3w.lifecompass.api.generated.TaskListApi;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@Controller
@RequestMapping("/api/v1")
public class TaskListController implements TaskListApi {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @Override
    public ResponseEntity<List<TaskDto>> tasks() {
        List<TaskDto> tasks = taskListService.getTasks()
                .stream()
                .map(TaskListController::toApi)
                .collect(Collectors.toList());
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(tasks);
    }

    public ResponseEntity<Void> addTask(TaskDto task) {
        long id = taskListService.addTask(task);
        return ResponseEntity.created(
                linkTo(methodOn(TaskListController.class)._task(id))
                        .toUri())
                .build();
    }

    @Override
    public ResponseEntity<TaskDto> task(Long id) {
        Task task = taskListService.getTask(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(toApi(task));
    }

    public ResponseEntity<Void> updateTask(Long id, TaskDto task) {
        if (taskListService.updateTodo(id, task)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> overwriteTasks(List<TaskDto> tasks) {
        taskListService.overwriteTasks(tasks);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteTask(Long id) {
        if (taskListService.deleteTask(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> deleteTasks() {
        taskListService.deleteTasks();
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<?> handleOptimisticLockingFailureException(OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .contentType(MediaType.TEXT_PLAIN)
                .body(ex.getMessage());
    }

    private static TaskDto toApi(Task task) {
        return new TaskDto().id(task.getId())
                .version(task.getVersion())
                .title(task.getTitle())
                .completed(task.isCompleted());
    }
}
