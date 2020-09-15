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

    @Query(value = "SELECT * FROM LcTask WHERE parentId = :parentId and ((status | childStatus) & :aggStatus) > 0", nativeQuery = true)
    List<LcTask> findAllByParentIdAndAggStatus(Long parentId, int aggStatus);

    @Query(value = "SELECT status | childStatus FROM LcTask WHERE parentId = :id", nativeQuery = true)
    List<Integer> queryAggStatus(Long id);

    @Transactional
    @Modifying
    @Query(value = "UPDATE LcTask SET childStatus = childStatus | :newChildStatus WHERE id = :id", nativeQuery = true)
    void appendChildStatusById(Long id, int newChildStatus);
}
