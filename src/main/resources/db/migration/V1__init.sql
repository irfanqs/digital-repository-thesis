-- users and roles
create table users (
  id bigserial primary key,
  email varchar(255) unique not null,
  password_hash varchar(255) not null,
  role varchar(32) not null
);

create table student_profile (
  user_id bigint primary key references users(id),
  student_number varchar(64) unique not null,
  program varchar(128)
);

create table lecturer_profile (
  user_id bigint primary key references users(id),
  nidn varchar(64) unique not null,
  department varchar(128)
);

create table thesis (
  id bigserial primary key,
  student_user_id bigint not null references users(id),
  title text not null,
  abstract_text text,
  keywords text,
  file_path text,
  submitted_at timestamp,
  current_status varchar(64) not null
);

create table supervisor_assignment (
  lecturer_user_id bigint references users(id),
  student_user_id bigint references users(id),
  role_main boolean default true,
  primary key (lecturer_user_id, student_user_id)
);

create table approval (
  id bigserial primary key,
  thesis_id bigint not null references thesis(id),
  stage varchar(32) not null,
  status varchar(32) not null,
  notes text,
  decided_by bigint references users(id),
  decided_at timestamp
);

create table checklist_item (
  id bigserial primary key,
  key varchar(64) unique not null,
  label varchar(128) not null
);

create table thesis_checklist (
  thesis_id bigint references thesis(id),
  item_id bigint references checklist_item(id),
  checked boolean not null,
  checked_by bigint references users(id),
  checked_at timestamp,
  primary key (thesis_id, item_id)
);

-- seed librarian checklist items
insert into checklist_item(key,label) values
('watermark','Watermark present'),
('font','Correct font'),
('title','Title formatting correct'),
('signature','Supervisor signature present');
