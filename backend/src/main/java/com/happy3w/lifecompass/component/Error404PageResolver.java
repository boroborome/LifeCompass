package com.happy3w.lifecompass.component;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Component
public class Error404PageResolver implements ErrorViewResolver {

    @Value("${life-compass.service-path}/")
    private String servicePath;

    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request,
                                         HttpStatus status, Map<String, Object> model) {
        String requestPath = (String) model.get("path");
        if (status == HttpStatus.NOT_FOUND
            && !requestPath.startsWith(servicePath)
            && !isNormalResource(requestPath)) {
            return new ModelAndView("index.html");
        }
        return null;
    }

    private boolean isNormalResource(String contextPath) {
        int pointIndex = contextPath.lastIndexOf('.');
        if (pointIndex < 0) {
            return false;
        }

        int slashIndex = contextPath.indexOf('/', pointIndex);
        return slashIndex < 0;
    }

}
