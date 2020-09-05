package com.happy3w.lifecompass.model;

import com.happy3w.lifecompass.utils.IEnumItem;
import lombok.Getter;

@Getter
public enum TaskStatus implements IEnumItem {
    normal("normal", "Normal"),
    block("block", "Block"),
    finish("finish", "Finish");

    private final String code;
    private final String name;

    TaskStatus(String code, String name) {
        this.code = code;
        this.name = name;
    }

    @Override
    public String getRemark() {
        return null;
    }
}
