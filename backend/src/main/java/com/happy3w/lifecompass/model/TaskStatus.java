package com.happy3w.lifecompass.model;

import com.happy3w.lifecompass.utils.IEnumItem;
import lombok.Getter;

@Getter
public enum TaskStatus implements IEnumItem {
    normal("normal", "Normal", 1),
    block("block", "Block", 2),
    finish("finish", "Finish", 4);

    private final String code;
    private final String name;
    private final int value;

    TaskStatus(String code, String name, int value) {
        this.code = code;
        this.name = name;
        this.value = value;
    }

    @Override
    public String getRemark() {
        return name;
    }
}
