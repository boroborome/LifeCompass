package com.happy3w.lifecompass.validation;

import com.happy3w.lifecompass.TaskRepository;
import com.happy3w.lifecompass.api.generated.Task;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import static com.happy3w.lifecompass.generated.Tables.TASK;

class UniqueTaskValidator implements ConstraintValidator<UniqueTask, Task> {

    private final TaskRepository taskRepository;

    public UniqueTaskValidator(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public boolean isValid(Task value, ConstraintValidatorContext context) {
        return taskRepository.findAll(TASK.TITLE.equalIgnoreCase(value.getTitle())).isEmpty();
    }

}
