package com.happy3w.lifecompass.controller;

import com.happy3w.lifecompass.api.generated.TaskDto;
import com.happy3w.lifecompass.api.generated.TaskListApi;
import com.happy3w.lifecompass.model.Task;
import com.happy3w.lifecompass.service.TaskService;
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
public class TaskController implements TaskListApi {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Override
    public ResponseEntity<List<TaskDto>> tasks() {
        List<TaskDto> tasks = taskService.getTasks()
                .stream()
                .map(TaskController::toApi)
                .collect(Collectors.toList());
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(tasks);
    }

    public ResponseEntity<Void> addTask(TaskDto task) {
        long id = taskService.addTask(fromApi(task));
        return ResponseEntity.created(linkTo(methodOn(TaskController.class)._task(id)).toUri()).build();
    }

    @Override
    public ResponseEntity<TaskDto> task(Long id) {
        Task task = taskService.getTask(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(toApi(task));
    }

    public ResponseEntity<Void> updateTask(Long id, TaskDto task) {
        if (taskService.updateTask(id, fromApi(task))) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public ResponseEntity<Void> overwriteTasks(List<TaskDto> tasks) {
        taskService.overwriteTasks(tasks.stream().map(TaskController::fromApi));
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteTask(Long id) {
        if (taskService.deleteTask(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> deleteTasks() {
        taskService.deleteTasks();
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<?> handleOptimisticLockingFailureException(OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .contentType(MediaType.TEXT_PLAIN)
                .body(ex.getMessage());
    }

    private static TaskDto toApi(Task task) {
        return new TaskDto()
                .id(task.getId())
                .version(task.getVersion())
                .parentId(task.getParentId())

                .title(task.getTitle())
                .detail(task.getDetail())
                .status(task.getStatus())
                .progress(task.getProgress())

                .priority(task.getPriority())
                .estimatedTime(task.getEstimatedTime())

                .planStartTime(task.getPlanStartTime())
                .planEndTime(task.getPlanEndTime())
                .actualStartTime(task.getActualStartTime())
                .actualEndTime(task.getActualEndTime())
                .completed(task.isCompleted());
    }

    private static Task fromApi(TaskDto dto) {
        return Task.builder()
                .id(dto.getId())
                .version(dto.getVersion())
                .parentId(dto.getParentId())

                .title(dto.getTitle())
                .detail(dto.getDetail())
                .status(dto.getStatus())
                .progress(dto.getProgress())

                .priority(dto.getPriority())
                .estimatedTime(dto.getEstimatedTime())

                .planStartTime(dto.getPlanStartTime())
                .planEndTime(dto.getPlanEndTime())
                .actualStartTime(dto.getActualStartTime())
                .actualEndTime(dto.getActualEndTime())
                .completed(dto.getCompleted())
                .build();
    }
}
