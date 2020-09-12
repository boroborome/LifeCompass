
export class LcTask {
  id?: number;
  parentId?: number;
  name?: string;
  description?: string;
  priority?: number;
  status?: string;        // normal, block, finish
  planStartTime?: number;
  planEndTime?: number;
  actualStartTime?: number;
  actualEndTime?: number;
  remark?: string;
}
