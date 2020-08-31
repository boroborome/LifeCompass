export class EnumItem {
    public code: string;
    public name: string;
    public remark?: string;

    constructor(code: string, name: string, remark?: string) {
        this.code = code;
        this.name = name;
        this.remark = remark;
    }

    static findEnum(items: EnumItem[], code?: string): EnumItem | null {
        for (let index = items.length - 1; index >= 0; index--) {
            const item: EnumItem = items[index];
            if (item.code == code) {
                return item;
            }
        }
        return null;
    }
}
