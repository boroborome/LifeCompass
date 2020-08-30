import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TaskEditPane extends Vue {
    form = {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
    };
    onSubmit() {
        console.log('submit!');
    }
}
