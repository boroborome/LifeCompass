package com.happy3w.lifecompass;

import com.happy3w.auditing.Create;
import com.happy3w.auditing.Modify;
import org.jooq.Condition;
import org.jooq.DSLContext;
import org.jooq.ResultQuery;
import org.jooq.SelectForUpdateStep;
import org.jooq.impl.DSL;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.stereotype.Repository;
import org.springframework.validation.annotation.Validated;

import javax.validation.Valid;
import java.util.List;

import static com.happy3w.lifecompass.generated.Tables.TASK;

@Repository
@Validated
public class TaskRepository {

    private final DSLContext dsl;

    public TaskRepository(DSLContext dslContext) {
        this.dsl = dslContext;
    }

    public Task findOne(Condition condition) {
        return oneOf(findAll(condition));
    }

    public Task findOneForUpdate(Condition condition) {
        return oneOf(findAllForUpdate(condition));
    }

    private static Task oneOf(List<Task> tasks) {
        if (tasks.isEmpty()) {
            return null;
        }
        int size = tasks.size();
        if (size > 1) {
            throw new IncorrectResultSizeDataAccessException(1, size);
        }
        return tasks.get(0);
    }

    public List<Task> findAll(Condition condition) {
        return findAll(condition, false);
    }

    private List<Task> findAll(Condition condition, boolean update) {
        SelectForUpdateStep<?> queryStep = dsl
                .select(
                        TASK.ID,
                        TASK.VERSION,
                        TASK.CREATED,
                        TASK.CREATE_USER,
                        TASK.MODIFIED,
                        TASK.MODIFY_USER,
                        TASK.TITLE,
                        TASK.COMPLETED)
                .from(TASK)
                .where(condition)
                .orderBy(TASK.ID.asc());
        ResultQuery<?> query = update ? queryStep.forUpdate() : queryStep;
        return query.fetchInto(Task.class);
    }

    public List<Task> findAllForUpdate(Condition condition) {
        return findAll(condition, true);
    }

    @Create
    public long insert(@Valid Task task) {
        return dsl.insertInto(TASK)
                .set(TASK.CREATE_USER, task.getCreateUser())
                .set(TASK.MODIFY_USER, task.getModifyUser())
                .set(TASK.TITLE, task.getTitle())
                .set(TASK.COMPLETED, task.isCompleted())
                .returning(TASK.ID)
                .fetchOne()
                .getValue(TASK.ID);
    }

    @Modify
    public void update(@Valid Task task) {
        dsl.update(TASK)
                .set(TASK.VERSION, TASK.VERSION.add(1))
                .set(TASK.MODIFIED, DSL.currentLocalDateTime())
                .set(TASK.MODIFY_USER, task.getModifyUser())
                .set(TASK.TITLE, task.getTitle())
                .set(TASK.COMPLETED, task.isCompleted())
                .where(TASK.ID.eq(task.getId()))
                .execute();
    }

    public long deleteAll(Condition condition) {
        return dsl.delete(TASK).where(condition).execute();
    }

}
