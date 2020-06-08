package com.happy3w.lifecompass.validation;

import com.happy3w.lifecompass.TaskRepository;
import com.happy3w.lifecompass.api.generated.TaskDto;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import static com.happy3w.lifecompass.generated.Tables.TASK;

class UniqueTaskValidator implements ConstraintValidator<UniqueTask, TaskDto> {

    private final TaskRepository taskRepository;

    public UniqueTaskValidator(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public boolean isValid(TaskDto value, ConstraintValidatorContext context) {
        return taskRepository.findAll(TASK.TITLE.equalIgnoreCase(value.getTitle())).isEmpty();
    }

}
