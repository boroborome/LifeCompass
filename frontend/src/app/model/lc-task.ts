import {EnumItem} from "../utils/enum-item";

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
  planStartTime?: number | Date; // format like 2020-08-30 23:11:55 UTC+8
  planEndTime?: number | Date;
  actualStartTime?: number | Date;
  actualEndTime?: number | Date;
  remark?: string;

  static of(block: object): LcTask {
    const task: LcTask = new LcTask();
    Object.assign(task, block);
    return task;
  }

  nativeDate(value: number | Date): Date | null {
    if (value == null || value instanceof Date) {
      // @ts-ignore
      return value
    }

    return new Date(value);
  }

  timestampDate(value: number | Date): number | null {
    if (value == null || typeof value == 'number') {
      // @ts-ignore
      return value
    }

    return value.getTime();
  }

  useNativeDate() {
    this.planStartTime = this.nativeDate(this.planStartTime);
    this.planEndTime = this.nativeDate(this.planEndTime);
    this.actualStartTime = this.nativeDate(this.actualStartTime);
    this.actualEndTime = this.nativeDate(this.actualEndTime);
  }

  useTimestampDate() {
    this.planStartTime = this.nativeDate(this.planStartTime);
    this.planEndTime = this.nativeDate(this.planEndTime);
    this.actualStartTime = this.nativeDate(this.actualStartTime);
    this.actualEndTime = this.nativeDate(this.actualEndTime);
  }
}
