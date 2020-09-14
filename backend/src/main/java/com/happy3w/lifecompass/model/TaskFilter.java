package com.happy3w.lifecompass.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TaskFilter {
    private Long parentId;
    private List<String> status;
}
