package com.happy3w.lifecompass;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

import java.util.List;

import com.happy3w.lifecompass.api.generated.TaskListApi;

import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/v1")
public class TodoListController implements TaskListApi {

    private final TaskListService taskListService;

    public TodoListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @Override
    public ResponseEntity<List<com.happy3w.lifecompass.api.generated.Task>> todos() {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(taskListService.getTodos());
    }

    @Override
    public ResponseEntity<Void> addTodo(Task task) {
        long id = taskListService.addTodo(task);
        return ResponseEntity.created(linkTo(methodOn(TodoListController.class)._todo(id)).toUri()).build();
    }

    @Override
    public ResponseEntity<Task> todo(Long id) {
        Task task = taskListService.getTodo(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(task);
    }

    @Override
    public ResponseEntity<Void> updateTodo(Long id, Task task) {
        if (taskListService.updateTodo(id, task)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> overwriteTodos(List<Task> tasks) {
        taskListService.overwriteTodos(tasks);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteTodo(Long id) {
        if (taskListService.deleteTodo(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<Void> deleteTodos() {
        taskListService.deleteTodos();
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<?> handleOptimisticLockingFailureException(OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).contentType(MediaType.TEXT_PLAIN).body(ex.getMessage());
    }

}
