// import only used components to reduce code size
export { default as Button } from "element-ui/lib/button";
export { default as ButtonGroup } from "element-ui/lib/button-group";
export { default as Col } from "element-ui/lib/col";
export { default as MessageBox } from "element-ui/lib/message-box";
export { default as Option } from "element-ui/lib/option";
export { default as Row } from "element-ui/lib/row";
export { default as Select } from "element-ui/lib/select";
export { default as TabPane } from "element-ui/lib/tab-pane";
export { default as Tabs } from "element-ui/lib/tabs";

import locale from "element-ui/lib/locale";
import de from "element-ui/lib/locale/lang/de";
import en from "element-ui/lib/locale/lang/en";

export function configureLocale(lcl) {
    locale.use(/^de($|-)/.test(lcl) ? de : en);
}
