# todo_2024_05
DROP DATABASE IF EXISTS todo_2024_05;
CREATE DATABASE todo_2024_05;
USE todo_2024_05;

# todo 테이블 생성
CREATE TABLE todo (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    regDate DATETIME NOT NULL,
    modifyDate DATETIME NOT NULL,
    user_code CHAR(50) NOT NULL,
    preformDate DATETIME NOT NULL,
    content VARCHAR(200) NOT NULL,
    is_completed TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `no` INT UNSIGNED NOT NULL
);

# user_code와 no 조합에 대해서 unique 설정
ALTER TABLE todo ADD UNIQUE INDEX(`user_code`, `no`);

# 테스트용 데이터 생성
INSERT INTO todo
SET regDate = NOW(),
modifyDate = NOW(),
user_code = 'localhost',
`no` = 1,
preformDate = NOW(),
content = '공부';

INSERT INTO todo
SET regDate = NOW(),
modifyDate = NOW(),
user_code = 'localhost',
`no` = 2,
preformDate = NOW(),
content = '코딩';

INSERT INTO todo
SET regDate = NOW(),
modifyDate = NOW(),
user_code = 'localhost',
`no` = 3,
preformDate = NOW(),
content = '독서';

SELECT * FROM todo;