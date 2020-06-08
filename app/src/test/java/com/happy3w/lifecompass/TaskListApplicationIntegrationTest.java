package com.happy3w.lifecompass;

import static org.assertj.core.api.Assertions.assertThat;

import java.net.URI;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.happy3w.lifecompass.api.generated.BadRequestDetails;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT, properties = "logging.level.org.jooq.tools.LoggerListener=DEBUG")
@AutoConfigureTestDatabase
public class TaskListApplicationIntegrationTest {

    private static final String API_BASE = "/api/v1";

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void shouldAddAndChangeAndRemoveTodo() {
        Task task = Task.builder().title("todo1").build();

        URI uri = restTemplate.postForLocation(API_BASE + "/", task);
        Task foundTask = restTemplate.getForObject(uri, Task.class);
        assertThat(foundTask.getTitle()).isEqualTo(task.getTitle());
        assertThat(foundTask.isCompleted()).isFalse();

        task.setTitle("todo2");
        task.setCompleted(true);
        task.setVersion(foundTask.getVersion());
        restTemplate.put(uri, task);
        foundTask = restTemplate.getForObject(uri, Task.class);
        assertThat(foundTask.getTitle()).isEqualTo(task.getTitle());
        assertThat(foundTask.isCompleted()).isTrue();

        restTemplate.delete(uri);

        assertThat(restTemplate.getForEntity(uri, Void.class).getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void shouldOverwriteAndRemoveAllTodos() {
        Task task1 = Task.builder().title("todo1").build();
        task1 = restTemplate.getForObject(restTemplate.postForLocation(API_BASE + "/", task1), Task.class);
        Task task2 = Task.builder().title("todo2").build();
        restTemplate.postForLocation(API_BASE + "/", task2);
        List<?> todos = restTemplate.getForObject(API_BASE + "/", List.class);
        assertThat(todos).hasSize(2);

        Task task1A = Task.builder().id(task1.getId()).version(task1.getVersion()).title("todo1a").build();
        Task task3 = Task.builder().title("todo3").completed(true).build();
        restTemplate.put(API_BASE + "/", Arrays.asList(task3, task1A));
        todos = restTemplate.getForObject(API_BASE + "/", List.class);
        assertThat(todos).hasSize(2);
        @SuppressWarnings("unchecked")
        Map<String, Object> foundTodo1 = (Map<String, Object>) todos.get(0);
        assertThat(foundTodo1).containsEntry("title", "todo1a");
        assertThat(foundTodo1).containsEntry("completed", false);
        @SuppressWarnings("unchecked")
        Map<String, Object> foundTodo2 = (Map<String, Object>) todos.get(1);
        assertThat(foundTodo2).containsEntry("title", "todo3");
        assertThat(foundTodo2).containsEntry("completed", true);

        restTemplate.delete(API_BASE + "/");
        todos = restTemplate.getForObject(API_BASE + "/", List.class);
        assertThat(todos).isEmpty();
    }

    @Test
    public void shouldReturnBadRequestDetailsForInvalidPost() {
        shouldReturnBadRequestDetails(HttpMethod.POST, Task.builder().build(), "todo.title");
    }

    @Test
    public void shouldReturnBadRequestDetailsForInvalidPut() {
        shouldReturnBadRequestDetails(
                HttpMethod.PUT,
                Arrays.asList(
                        Collections.emptyMap(),
                        Task.builder().title("123").build(),
                        Collections.singletonMap("title", "1234")),
                "todo[0].title",
                "todo[0].completed",
                "todo[1].title",
                "todo[2].completed");
    }

    private void shouldReturnBadRequestDetails(HttpMethod method, Object payload, String... path) {
        ResponseEntity<List<BadRequestDetails>> response = restTemplate.exchange(
                API_BASE + "/",
                method,
                new HttpEntity<>(payload),
                new ParameterizedTypeReference<List<BadRequestDetails>>() {
                });
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        List<BadRequestDetails> details = response.getBody();
        assertThat(details).hasSize(path.length);
        assertThat(details.stream().map(d -> d.getPath())).containsExactlyInAnyOrder(path);
    }

    @Test
    public void shouldReturn409OnOptimisticLockingFailure() {
        Task task = Task.builder().title("todo").build();
        task = restTemplate.getForObject(restTemplate.postForLocation(API_BASE + "/", task), Task.class);
        task.setVersion(task.getVersion() + 1);
        ResponseEntity<String> response = restTemplate
                .exchange(API_BASE + "/", HttpMethod.PUT, new HttpEntity<>(Collections.singletonList(task)), String.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isNotEmpty();
    }

    @Test
    public void shouldReturnBadRequestDetailsForDuplicatedTitle() {
        URI uri = restTemplate.postForLocation(API_BASE + "/", Task.builder().title("unique").build());
        shouldReturnBadRequestDetails(HttpMethod.POST, Task.builder().title("Unique").build(), "todo");
        restTemplate.delete(uri);
    }

}
