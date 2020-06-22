import Vue from "vue";
import {Component} from "vue-property-decorator";
import AutoComplete from "../demo/AutoComplete";
import {Button, ButtonGroup, Col, Row} from "../elements";

@Component({
    components: {
        AutoComplete,
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        [Col.name]: Col,
        [Row.name]: Row,
    },
})
export default class ProjectView extends Vue {
    searchCriteria = {
        planOptions: [{
            label: "有计划",
            value: "planned",
        }, {
            label: "无计划",
            value: "noPlan",
        }, {
            label: "不计划",
            value: "neverPlan",
        }],
        statusOptions: [{
            label: "正常",
            value: "normal",
        }, {
            label: "阻塞",
            value: "block",
        }, {
            label: "完成",
            value: "finish",
        }],
    };
}
