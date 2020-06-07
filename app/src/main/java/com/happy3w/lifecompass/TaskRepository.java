package com.happy3w.lifecompass;

import static com.happy3w.lifecompass.generated.tables.Todo.TODO;

import java.util.List;

import javax.validation.Valid;

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
                        TODO.VERSION,
                        TODO.CREATED,
                        TODO.CREATE_USER,
                        TODO.MODIFIED,
                        TODO.MODIFY_USER,
                        TODO.TITLE,
                        TODO.COMPLETED)
                .from(TODO)
                .where(condition)
                .orderBy(TODO.ID.asc());
        ResultQuery<?> query = update ? queryStep.forUpdate() : queryStep;
        return query.fetchInto(Task.class);
    }

    public List<Task> findAllForUpdate(Condition condition) {
        return findAll(condition, true);
    }

    @Create
    public long insert(@Valid Task task) {
        return dsl.insertInto(TODO)
                .set(TODO.CREATE_USER, task.getCreateUser())
                .set(TODO.MODIFY_USER, task.getModifyUser())
                .set(TODO.TITLE, task.getTitle())
                .set(TODO.COMPLETED, task.isCompleted())
                .returning(TODO.ID)
                .fetchOne()
                .getValue(TODO.ID);
    }

    @Modify
    public void update(@Valid Task task) {
        dsl.update(TODO)
                .set(TODO.VERSION, TODO.VERSION.add(1))
                .set(TODO.MODIFIED, DSL.currentLocalDateTime())
                .set(TODO.MODIFY_USER, task.getModifyUser())
                .set(TODO.TITLE, task.getTitle())
                .set(TODO.COMPLETED, task.isCompleted())
                .where(TODO.ID.eq(task.getId()))
                .execute();
    }

    public long deleteAll(Condition condition) {
        return dsl.delete(TODO).where(condition).execute();
    }

}
