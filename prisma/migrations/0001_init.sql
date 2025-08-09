create table if not exists "Attorney"(
  id serial primary key,
  "fullName" varchar(255) not null,
  "barNumber" varchar(64),
  jurisdiction varchar(64) not null default 'Puerto Rico',
  status varchar(64) not null default 'Good Standing',
  "statusEffectiveDate" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists idx_attorney_fullname on "Attorney"("fullName");
create index if not exists idx_attorney_status on "Attorney"(status);

create table if not exists "DisciplinaryAction"(
  id serial primary key,
  "attorneyId" int not null references "Attorney"(id) on delete cascade,
  "actionType" varchar(128) not null,
  "decisionDate" timestamptz,
  citation varchar(255),
  summary text,
  "sourceUrl" text,
  "pdfUrl" text,
  "createdAt" timestamptz not null default now()
);
create index if not exists idx_action_attorney on "DisciplinaryAction"("attorneyId");
create index if not exists idx_action_decision_date on "DisciplinaryAction"("decisionDate");