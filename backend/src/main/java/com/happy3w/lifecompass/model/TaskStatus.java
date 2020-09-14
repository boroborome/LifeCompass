package com.happy3w.lifecompass.model;

import com.happy3w.lifecompass.utils.IEnumItem;
import lombok.Getter;

@Getter
public enum TaskStatus implements IEnumItem {
    normal( "Normal", 1),
    block("Block", 2),
    finish("Finish", 4);

    private final String code;
    private final String name;
    private final int value;

    TaskStatus(String name, int value) {
        this.code = String.valueOf(value);
        this.name = name;
        this.value = value;
    }

    @Override
    public String getRemark() {
        return name;
    }
}
