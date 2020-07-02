import Vue from "vue";
import {Component} from "vue-property-decorator";
import {Button, ButtonGroup, Col, Option, Row, Select} from "../elements";

@Component({
    components: {
        [Button.name]: Button,
        [ButtonGroup.name]: ButtonGroup,
        [Col.name]: Col,
        [Row.name]: Row,
        [Option.name]: Option,
        [Select.name]: Select,
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
