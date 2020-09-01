import {EnumItem} from "@/utils/EnumItem";

export class LcTaskStatus {

    static Normal: EnumItem = new EnumItem('normal', "Normal");
    static Block: EnumItem = new EnumItem('block', "Block");
    static Finish: EnumItem = new EnumItem('finish', "Finish");

    static AllItems: EnumItem[] = [
        LcTaskStatus.Normal,
        LcTaskStatus.Block,
        LcTaskStatus.Finish
    ]

    static findEnum(code?: string): EnumItem | null {
        return EnumItem.findEnum(LcTaskStatus.AllItems, code);
    }
}

export class LcTask {
    id?: number;
    parentId?: number;
    name?: string;
    description?: string;
    priority?: number;
    status?: string;        // normal, block, finish
    planStartTime?: number; // format like 2020-08-30 23:11:55 UTC+8
    planEndTime?: number;
    actualStartTime?: number;
    actualEndTime?: number;
    remark?: string;
}

