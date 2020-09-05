package com.happy3w.lifecompass.model;

import com.happy3w.lifecompass.utils.IEnumItem;
import lombok.Getter;

@Getter
public enum PlanStatus implements IEnumItem {
    noPlan("no-plan", "No Plan"),
    planed("planed", "Planed");

    private final String code;
    private final String name;

    PlanStatus(String code, String name) {
        this.code = code;
        this.name = name;
    }

    @Override
    public String getRemark() {
        return null;
    }
}
