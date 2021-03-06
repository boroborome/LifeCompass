package com.happy3w.lifecompass.entity;

import com.happy3w.lifecompass.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "LcTask")
public class LcTask {
    public static final Long ROOT_PARENT_ID = Long.valueOf(-1);

    @Id
    @Column(name="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Basic
    @Column(name = "parentId")
    private Long parentId;

    @Basic
    @Column(name = "name")
    private String name;

    @Basic
    @Column(name = "description")
    private String description;

    @Basic
    @Column(name = "status")
    private int status = TaskStatus.normal.getValue();

    @Basic
    @Column(name = "planStartTime")
    private Long planStartTime;

    @Basic
    @Column(name = "planEndTime")
    private Long planEndTime;

    @Basic
    @Column(name = "actualStartTime")
    private Long actualStartTime;

    @Basic
    @Column(name = "actualEndTime")
    private Long actualEndTime;

    @Basic
    @Column(name = "remark")
    private String remark;

    @Basic
    @Column(name = "opportunity")
    private int opportunity;

    @Basic
    @Column(name = "painLevel")
    private int painLevel;

    @Basic
    @Column(name = "yearnLevel")
    private int yearnLevel;

    @Basic
    @Column(name = "childStatus")
    private int childStatus;
}
