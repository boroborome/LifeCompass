
export class LcTask {
    id?: number;
    parentId?: number;
    name?: string;
    description?: string;
    priority?: number;
    status?: string;        // normal, block, finish
    planStartTime?: string; // format like 2020-08-30 23:11:55 UTC+8
    planEndTime?: string;
    actualStartTime?: string;
    actualEndTime?: string;
}

