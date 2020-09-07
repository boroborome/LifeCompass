package com.happy3w.lifecompass.repository;

import com.happy3w.lifecompass.entity.LcTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LcTaskRepository extends JpaRepository<LcTask,Long> {
    List<LcTask> findAllByParentId(Long parentId);
}
