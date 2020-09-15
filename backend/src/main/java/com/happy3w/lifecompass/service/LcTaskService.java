package com.happy3w.lifecompass.service;

import com.happy3w.lifecompass.entity.LcTask;
import com.happy3w.lifecompass.model.TaskFilter;
import com.happy3w.lifecompass.repository.LcTaskRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.text.MessageFormat;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Stack;
import java.util.function.Predicate;

@Service
public class LcTaskService {
    @Autowired
    private LcTaskRepository lcTaskRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public LcTask deleteTask(Long id) {
        LcTask task = lcTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }

        deepDeleteTask(task);
        refreshStatus(task.getParentId());
        return task;
    }

    private void deepDeleteTask(LcTask taskToDelete) {
        Stack<LcTask> taskStack = new Stack<>();
        taskStack.push(taskToDelete);
        while (!taskStack.empty()) {
            LcTask task = taskStack.peek();
            List<LcTask> subTasks = lcTaskRepository.findAllByParentId(task.getId());
            if (subTasks.isEmpty()) {
                lcTaskRepository.delete(task);
                taskStack.pop();
            } else {
                taskStack.addAll(subTasks);
            }
        }
    }

    public LcTask createTask(LcTask newTask) {
        if (newTask.getParentId() == null || newTask.getParentId() == LcTask.ROOT_PARENT_ID) {
            newTask.setParentId(LcTask.ROOT_PARENT_ID);
        } else if (!lcTaskRepository.existsById(newTask.getParentId())) {
            throw new HttpClientErrorException(HttpStatus.NOT_FOUND,
                    MessageFormat.format("No task with id:{0}", newTask.getParentId()));
        }

        LcTask dbTask = lcTaskRepository.save(newTask);
        appendStatus(dbTask.getParentId(), dbTask.getStatus());

        return dbTask;
    }

    private void appendStatus(Long taskId, int status) {
        traverseToRoot(taskId, task -> {
            if ((task.getStatus() & status) == status) {
                return false;
            }
            lcTaskRepository.appendChildStatusById(task.getId(), status);
            return true;
        });
    }

    private void refreshStatus(Long taskId) {
        traverseToRoot(taskId, task -> {
            int aggStatus = 0;
            for (int status : lcTaskRepository.queryAggStatus(task.getId())) {
                aggStatus |= status;
            }
            if (task.getChildStatus() == aggStatus) {
                return false;
            }

            task.setChildStatus(aggStatus);
            lcTaskRepository.save(task);
            return true;
        });
    }

    private void traverseToRoot(Long startTaskId, Predicate<LcTask> action) {
        Long parentId = startTaskId;

        while (parentId != null && parentId != LcTask.ROOT_PARENT_ID) {
            Optional<LcTask> taskOpt = lcTaskRepository.findById(parentId);
            if (!taskOpt.isPresent()) {
                break;
            }

            LcTask task = taskOpt.get();

            boolean shouldContinue = action.test(task);
            if (!shouldContinue) {
                break;
            }

            parentId = task.getParentId();
        }
    }

    public List<LcTask> querySubTasks(TaskFilter filter) {
        return lcTaskRepository.findAllByParentIdAndAggStatus(filter.getParentId(), filter.getAggStatus());
    }

    public LcTask updateTask(LcTask newTask) {
        LcTask originTask = lcTaskRepository.findById(newTask.getId())
                .orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND,
                        MessageFormat.format("No task with id:{0}", newTask.getId())));
        boolean statusChange = originTask.getStatus() != newTask.getStatus();
        Long originParent = originTask.getParentId();
        Long newParent = newTask.getParentId();
        int childStatus = originTask.getChildStatus();

        BeanUtils.copyProperties(newTask, originTask);
        originTask.setChildStatus(childStatus);
        lcTaskRepository.save(originTask);

        boolean parentChange = !Objects.equals(originParent, newParent);
        if (statusChange || parentChange) {
            refreshStatus(originParent);
        }
        if (parentChange) {
            refreshStatus(newParent);
        }

        return originTask;
    }
}
