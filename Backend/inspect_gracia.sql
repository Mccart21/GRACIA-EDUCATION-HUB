-- connect to gracia education hub
connect GRACIA_USER@//localhost:1521/gracia_education_hub;

-- display current database user
show user;

-- display existing tables
select table_name
from user_tables
order by table_name;

-- inspect important table columns
select table_name,
       column_name,
       data_type,
       data_length,
       nullable
from user_tab_columns
where table_name in (
    'users',
    'teachers',
    'tutors',
    'courses',
    'subjects',
    'enrollments'
)
order by table_name, column_id;

-- inspect primary keys, foreign keys and unique constraints
select c.table_name,
       c.constraint_name,
       c.constraint_type,
       cc.column_name,
       c.status
from user_constraints c
left join user_cons_columns cc
    on c.constraint_name = cc.constraint_name
   and c.table_name = cc.table_name
where c.table_name in (
    'users',
    'teachers',
    'tutors',
    'courses',
    'subjects',
    'enrollments'
)
order by c.table_name, c.constraint_name, cc.position;

-- inspect teacher profiles
select id, fullname, email, level, status
from "teachers"
order by id;

-- inspect tutor profiles
select id, fullname, email, level, status
from "tutors"
order by id;

-- inspect user accounts without exposing passwords
select id,
       username,
       email,
       role,
       accountstatus,
       emailverified
from "users"
order by id;

exit;
