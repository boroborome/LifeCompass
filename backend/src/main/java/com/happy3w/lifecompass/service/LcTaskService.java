package com.happy3w.lifecompass.service;

import com.happy3w.lifecompass.entity.LcTask;
import com.happy3w.lifecompass.repository.LcTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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
}
