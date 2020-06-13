package com.happy3w.lifecompass.model;

import java.time.LocalDateTime;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class Task {

    private Long id;
    private Long version;
    private Long parentId;
    private boolean isParent;

    @NotNull
    @Size(min = 4)
    private String title;
    private String detail;
    private String status;
    private float progress;

    private Long priority;
    private Long estimatedTime;

    private Date planStartTime;
    private Date planEndTime;

    private Date actualStartTime;
    private Date actualEndTime;

    private LocalDateTime created;

    @CreatedBy
    private String createUser;

    private LocalDateTime modified;

    @LastModifiedBy
    private String modifyUser;

    private boolean completed;

    public static class Status {
        public static final String NORMAL = "normal";
        public static final String DELAY = "delay";
        public static final String BLOCK = "block";

    }
}
