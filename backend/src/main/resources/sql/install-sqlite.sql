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
    status VARCHAR);
create index indexParentId on LcTask(parentId);
create index indexActualStartTime on LcTask(actualStartTime);
create index indexPlanStartTime on LcTask(planStartTime);
create index indexStatus on LcTask(status);
create index indexChildStatus on LcTask(childStatus);
