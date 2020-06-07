package com.happy3w.lifecompass;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.stream.Collectors;

import javax.validation.ConstraintViolationException;

import org.jooq.Condition;
import org.jooq.impl.DSL;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.NONE, properties = "logging.level.org.jooq.tools.LoggerListener=DEBUG")
@AutoConfigureTestDatabase
@Transactional
public class TaskRepositoryIntegrationTest {

    @Autowired
    private TaskRepository repository;

    @Test
    public void shouldFindOne() {
        Task task = Task.builder().title("title").build();
        long id = repository.insert(task);
        Task foundTask = repository.findOne(com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.eq(id));
        assertThat(foundTask).isNotNull();
        assertThat(foundTask.getId()).isEqualTo(id);
        assertThat(foundTask.getTitle()).isEqualTo(task.getTitle());
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldRejectNullTitle() {
        repository.insert(Task.builder().build());
    }

    @Test(expected = ConstraintViolationException.class)
    public void shouldRejectShortTitle() {
        repository.insert(Task.builder().title("t").build());
    }

    @Test
    public void shouldDeleteOne() {
        Task task = Task.builder().title("title").build();
        long id = repository.insert(task);
        Condition condition = com.happy3w.lifecompass.generated.tables.Todo.TODO.ID.eq(id);
        assertThat(repository.deleteAll(condition)).isEqualTo(1);
        assertThat(repository.findOne(condition)).isNull();
        assertThat(repository.deleteAll(condition)).isEqualTo(0);
    }

    @Test
    public void shouldFindAll() {
        Task task1 = Task.builder().title("title1").build();
        long id1 = repository.insert(task1);
        Task task2 = Task.builder().title("title2").build();
        long id2 = repository.insert(task2);
        assertThat(repository.findAll(DSL.noCondition()).stream().map(Task::getId).collect(Collectors.toList()))
                .containsExactly(id1, id2);
    }

    @Test
    public void shouldDeleteAll() {
        repository.insert(Task.builder().title("title1").build());
        repository.insert(Task.builder().title("title2").build());
        assertThat(repository.deleteAll(DSL.noCondition())).isEqualTo(2);
        assertThat(repository.findAll(DSL.noCondition())).isEmpty();
    }

}
