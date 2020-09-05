package com.happy3w.lifecompass.controller;

import com.happy3w.lifecompass.model.PlanStatus;
import com.happy3w.lifecompass.model.TaskStatus;
import com.happy3w.lifecompass.utils.EnumItem;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/master")
public class MasterController {
    @ResponseBody
    @RequestMapping(value = "task-status", method = RequestMethod.GET)
    public List<EnumItem> queryAllTaskStatus() {
        return EnumItem.from(TaskStatus.class);
    }

    @ResponseBody
    @RequestMapping(value = "plan-status", method = RequestMethod.GET)
    public List<EnumItem> queryAllPlanStatus() {
        return EnumItem.from(PlanStatus.class);
    }
}
