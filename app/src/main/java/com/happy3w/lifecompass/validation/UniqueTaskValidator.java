package com.happy3w.lifecompass.validation;

import static com.happy3w.lifecompass.generated.Tables.TASK;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.happy3w.lifecompass.api.generated.TaskDto;
import com.happy3w.lifecompass.repository.TaskRepository;

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
