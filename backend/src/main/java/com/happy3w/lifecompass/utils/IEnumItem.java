package com.happy3w.lifecompass.utils;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public interface IEnumItem {
    String getCode();
    String getName();
    String getRemark();
}
