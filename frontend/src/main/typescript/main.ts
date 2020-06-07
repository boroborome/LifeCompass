import "../css/global.scss";

import { TaskListApi } from "@Generated/openapi";
import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import { configureLocale } from "./elements";
import { Suggestions } from "./state/suggestions";
import { TaskList } from "./state/taskList";

Vue.use(VueI18n);

export default (
    suggestions: string[],
    basePath: string,
    el: string,
    locale: string,
    messages: VueI18n.LocaleMessageObject) => {

    configureLocale(locale);

    const taskList = new TaskList(new TaskListApi({ basePath }));
    taskList.refresh();

    return new Vue({
        el,
        i18n: new VueI18n({ locale, messages: { [locale]: messages } }),
        provide: {
            [Suggestions.name]: new Suggestions(suggestions, taskList),
            [TaskList.name]: taskList,
        },
        render: (h) => h(App),
    });
};
