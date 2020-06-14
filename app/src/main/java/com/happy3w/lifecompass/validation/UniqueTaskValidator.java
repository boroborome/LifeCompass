package com.happy3w.lifecompass.validation;

import com.happy3w.lifecompass.model.Task;
import com.happy3w.lifecompass.repository.TaskRepository;

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
