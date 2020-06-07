package com.happy3w.lifecompass.validation;

import static com.happy3w.lifecompass.generated.tables.Todo.TODO;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.happy3w.lifecompass.TaskRepository;
import com.happy3w.lifecompass.api.generated.Todo;

class UniqueTodoValidator implements ConstraintValidator<UniqueTodo, Todo> {

    private final TaskRepository taskRepository;

    public UniqueTodoValidator(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public boolean isValid(Todo value, ConstraintValidatorContext context) {
        return taskRepository.findAll(TODO.TITLE.equalIgnoreCase(value.getTitle())).isEmpty();
    }

}
