package com.happy3w.lifecompass.controller;

import com.happy3w.lifecompass.entity.LcTask;
import com.happy3w.lifecompass.model.TaskFilter;
import com.happy3w.lifecompass.model.TaskStatus;
import com.happy3w.lifecompass.repository.LcTaskRepository;
import com.happy3w.lifecompass.service.LcTaskService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("${life-compass.service-path}/task")
public class LcTaskController {
    @Autowired
    private LcTaskRepository lcTaskRepository;

    @Autowired
    private LcTaskService lcTaskService;

    @ResponseBody
    @GetMapping()
    public List<LcTask> queryAllRootTasks() {
        return lcTaskRepository.findAllByParentId(LcTask.ROOT_PARENT_ID);
    }

    @ResponseBody
    @PostMapping(headers = "cmd=query-sub-tasks")
    public List<LcTask> querySubTasks(@RequestBody TaskFilterDto filter) {
        return lcTaskService.querySubTasks(filter.toFilter());
    }

    @Getter
    @Setter
    public static class TaskFilterDto {
        private Long parentId;
        private List<String> status;

        public TaskFilter toFilter() {
            return TaskFilter.builder()
                    .parentId(parentId)
                    .aggStatus(calculateAggStatus(status))
                    .build();
        }

        private int calculateAggStatus(List<String> status) {
            if (CollectionUtils.isEmpty(status)) {
                status = Arrays.asList(TaskStatus.values())
                        .stream()
                        .map(v -> v.getCode())
                        .collect(Collectors.toList());
            }

            int aggStatus = 0;
            for (String value : status) {
                aggStatus |= Integer.parseInt(value);
            }
            return aggStatus;
        }
    }

    @ResponseBody
    @PostMapping
    public LcTask createTask(@RequestBody LcTask newTask) {
        return lcTaskService.createTask(newTask);
    }

    @ResponseBody
    @GetMapping(path = "/{id}")
    public LcTask queryTaskDetail(@PathVariable Long id) {
        return lcTaskRepository.findById(id).orElseThrow(
                () -> new HttpClientErrorException(HttpStatus.NOT_FOUND,
                        MessageFormat.format("No task with id:{0}", id))
        );
    }

    @ResponseBody
    @GetMapping(path = "/{id}/sub-task")
    public List<LcTask> querySubTasks(@PathVariable Long id) {
        return lcTaskRepository.findAllByParentId(id);
    }

    @ResponseBody
    @PutMapping(path = "/{id}")
    public LcTask updateTask(@RequestBody LcTask newTask, @PathVariable Long id) {
        newTask.setId(id);
        return lcTaskService.updateTask(newTask);
    }

    @ResponseBody
    @DeleteMapping(path = "/{id}")
    public LcTask deleteTask(@PathVariable Long id) {
        return lcTaskService.deleteTask(id);
    }
}
