package com.happy3w.lifecompass.utils;

import lombok.Getter;
import org.junit.Assert;
import org.junit.Test;

import java.util.List;

public class EnumItemTest {

    @Test
    public void from() {
        List<IEnumItem> items = EnumItem.from(TestEnum.class);
        Assert.assertEquals(3, items.size());
    }

    @Getter
    public static enum TestEnum implements IEnumItem {
        normal("normal", "Normal"),
        block("block", "Block"),
        finish("finish", "Finish");

        private final String code;
        private final String name;

        TestEnum(String code, String name) {
            this.code = code;
            this.name = name;
        }

        @Override
        public String getRemark() {
            return null;
        }
    }
}
