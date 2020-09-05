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
public class EnumItem implements IEnumItem {
    private String code;
    private String name;
    private String remark;

    public EnumItem(IEnumItem enumItem) {
        this.code = enumItem.getCode();
        this.name = enumItem.getName();
        this.remark = enumItem.getRemark();
    }

    public static List<EnumItem> from(Class<? extends Enum> enumType) {
        try {
            List<EnumItem> values = new ArrayList<>();

            Object valueArray = enumType.getDeclaredMethod("values").invoke(null);
            for (int i = 0, size = Array.getLength(valueArray); i < size; i++) {
                Object value = Array.get(valueArray, i);
                EnumItem enumItem = new EnumItem((IEnumItem) value);
                values.add(enumItem);
            }
            return values;
        } catch (Exception e) {
            throw new RuntimeException("Failed to get values from enum:" + enumType, e);
        }
    }
}
