package com.happy3w.auditing;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.aopalliance.intercept.MethodInterceptor;
import org.springframework.aop.Pointcut;
import org.springframework.aop.support.AbstractPointcutAdvisor;
import org.springframework.aop.support.StaticMethodMatcherPointcut;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.data.auditing.AuditingHandler;

import java.lang.reflect.Method;

@SuppressWarnings("serial")
class AuditingAdvisor extends AbstractPointcutAdvisor {

    @SuppressFBWarnings("SE_BAD_FIELD")
    private final AuditingHandler auditingHandler;
    private final boolean create;

    AuditingAdvisor(AuditingHandler auditingHandler, boolean create) {
        this.auditingHandler = auditingHandler;
        this.create = create;
    }

    @Override
    public Pointcut getPointcut() {
        return new StaticMethodMatcherPointcut() {

            @Override
            public boolean matches(Method method, Class<?> targetClass) {
                return create && AnnotationUtils.findAnnotation(method, Create.class) != null
                        || !create && AnnotationUtils.findAnnotation(method, Modify.class) != null;
            }
        };
    }

    @Override
    public MethodInterceptor getAdvice() {
        return invocation -> {
            for (Object arg : invocation.getArguments()) {
                if (create) {
                    auditingHandler.markCreated(arg);
                } else {
                    auditingHandler.markModified(arg);
                }
            }
            return invocation.proceed();
        };
    }

}
