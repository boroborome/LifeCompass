package com.happy3w.lifecompass.service;

import com.happy3w.lifecompass.entity.LcTask;
import com.happy3w.lifecompass.model.TaskFilter;
import com.happy3w.lifecompass.repository.LcTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;

import java.text.MessageFormat;
import java.util.List;
import java.util.Optional;
import java.util.Stack;

@Service
public class LcTaskService {
    @Autowired
    private LcTaskRepository lcTaskRepository;

    public LcTask deleteTask(Long id) {
        LcTask task = lcTaskRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }

        deepDeleteTask(task);
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
        Long parentId = taskId;

        while (parentId != null && parentId != LcTask.ROOT_PARENT_ID) {
            Optional<LcTask> taskOpt = lcTaskRepository.findById(parentId);
            if (!taskOpt.isPresent()) {
                return;
            }

            LcTask task = taskOpt.get();
            if ((task.getStatus() & status) == status) {
                return;
            }

            parentId = task.getParentId();
            lcTaskRepository.appendChildStatusById(task.getId(), status);
        }
    }

    public List<LcTask> querySubTasks(TaskFilter filter) {
        return null;
    }
}
