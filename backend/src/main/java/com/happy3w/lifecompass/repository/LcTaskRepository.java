package com.happy3w.lifecompass.repository;

import com.happy3w.lifecompass.entity.LcTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface LcTaskRepository extends JpaRepository<LcTask,Long> {
    List<LcTask> findAllByParentId(Long parentId);

    @Query(value = "SELECT status FROM LcTask WHERE id = :id", nativeQuery = true)
    List<Integer> queryChildrenStatus(Long id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE LcTask SET childStatus = childStatus | :newChildStatus WHERE id = :id", nativeQuery = true)
    void appendChildStatusById(Long id, int newChildStatus);
}
