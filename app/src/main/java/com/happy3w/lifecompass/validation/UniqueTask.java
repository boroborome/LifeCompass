package com.happy3w.lifecompass.validation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import javax.validation.Constraint;
import javax.validation.Payload;

@Constraint(validatedBy = UniqueTaskValidator.class)
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueTask {

    String message() default "{com.happy3w.lifecompass.UniqueTask.message}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
