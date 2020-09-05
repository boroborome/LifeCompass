package com.happy3w.lifecompass.utils;

import com.happy3w.lifecompass.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnumItem {
    private String code;
    private String name;
    private String remark;

    public static List<IEnumItem> from(Class<? extends Enum> enumType) {
        try {
            List<IEnumItem> values = new ArrayList<>();

            Object valueArray = enumType.getDeclaredMethod("values").invoke(null);
            for (int i = 0, size = Array.getLength(valueArray); i < size; i++) {
                Object value = Array.get(valueArray, i);
                values.add((IEnumItem) value);
            }
            return values;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get values from enum:" + enumType, e);
        }
    }
}
