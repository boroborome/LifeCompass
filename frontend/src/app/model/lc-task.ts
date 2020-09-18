export class LcTask {
  id?: number;
  parentId?: number;
  name?: string;
  description?: string;
  status?: number;
  planStartTime?: number;
  planEndTime?: number;
  actualStartTime?: number;
  actualEndTime?: number;
  remark?: string;
  opportunity?: number;
  painLevel?: number;
  yearnLevel?: number;
  childStatus?: number;

  static compare(a: LcTask, b: LcTask): number {
    return LcTask.calculateTaskScore(a) - LcTask.calculateTaskScore(b);
  }

  static calculateTaskScore(task: LcTask) {
    if (task == null) {
      return 0;
    }
    let score: number = 0;
    score += LcTask.safeValue(task.opportunity);
    score += LcTask.safeValue(task.painLevel);
    score += LcTask.safeValue(task.yearnLevel);
    return score;
  }

  static safeValue(n?: number): number {
    return n == null ? 0 : n;
  }
}
