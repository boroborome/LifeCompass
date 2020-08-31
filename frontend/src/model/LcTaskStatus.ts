import {EnumItem} from "@/utils/EnumItem";

export class LcTaskStatus {

    static Normal: EnumItem = new EnumItem('normal', "Normal");
    static Block: EnumItem = new EnumItem('block', "Block");
    static Finish: EnumItem = new EnumItem('finish', "Finish");

    static AllItems:EnumItem[] = [
        LcTaskStatus.Normal,
        LcTaskStatus.Block,
        LcTaskStatus.Finish
    ]

    static findEnum(code?: string) : EnumItem | null {
        return EnumItem.findEnum(LcTaskStatus.AllItems, code);
    }
}
