CREATE TABLE LcTask (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actualEndTime BIGINT,
    actualStartTime BIGINT,
    childStatus INTEGER,
    description VARCHAR,
    name VARCHAR,
    parentId BIGINT,
    planEndTime BIGINT,
    planStartTime BIGINT,
    priority INTEGER,
    remark VARCHAR,
    opportunity INTEGER default 0,
    painLevel INTEGER default 0,
    yearnLevel INTEGER default 0,
    status INTEGER);
create index indexParentId on LcTask(parentId);
create index indexActualStartTime on LcTask(actualStartTime);
create index indexPlanStartTime on LcTask(planStartTime);
create index indexStatus on LcTask(status);
create index indexChildStatus on LcTask(childStatus);
