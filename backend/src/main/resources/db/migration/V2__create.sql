DROP TABLE IF EXISTS `refresh_token`;

CREATE TABLE `refresh_token` (
     `id`			    INT UNSIGNED	PRIMARY KEY,
     `token`	        VARCHAR(200) 	DEFAULT NULL,
     `member_id`		INT UNSIGNED	NOT NULL,
     `created_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
     `modified_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
      `id`			    INT UNSIGNED	PRIMARY KEY,
      `name`			VARCHAR(30)		NULL,
      `profile`		    VARCHAR(40)		NULL,
      `email`			VARCHAR(30)		NULL,
      `created_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
      `modified_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `community`;

CREATE TABLE `community` (
     `id`			    BIGINT				PRIMARY KEY,
     `writer_id`		INT UNSIGNED		NOT NULL,
     `category_id`	    SMALLINT UNSIGNED	NOT NULL,
     `title`			VARCHAR(50)			NULL,
     `content`		    VARCHAR(1000)		NULL,
     `deadline`		    TIMESTAMP			NULL,
     `session_start`	TIMESTAMP			NULL,
     `is_invisible`	    TINYINT(1)			DEFAULT 0,
     `is_private`	    TINYINT(1)			DEFAULT 0,
     `created_at`	    TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
     `modified_at`	    TIMESTAMP			DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     `is_deleted`	    TINYINT(1)			DEFAULT 0
);

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
       `id`			    BIGINT			PRIMARY KEY,
       `content`		VARCHAR(500)	NULL,
       `sent_at`		TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
       `is_checked`	    TINYINT(1)		DEFAULT 0,
       `sender_id`		INT UNSIGNED	NOT NULL,
       `receiver_id`	INT UNSIGNED	NOT NULL
);

DROP TABLE IF EXISTS `statement_question`;

CREATE TABLE `statement_question` (
        `id`			    INT UNSIGNED	PRIMARY KEY,
        `question`		    VARCHAR(200)	NULL,
        `answer`		    VARCHAR(1500)	NULL,
        `statement_id`	    INT UNSIGNED	NOT NULL,
        `created_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
        `modified_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `statement`;

CREATE TABLE `statement` (
         `id`			INT UNSIGNED		PRIMARY KEY,
         `member_id`	INT UNSIGNED		NOT NULL,
         `created_at`	TIMESTAMP			DEFAULT CURRENT_TIMESTAMP,
         `modified_at`	TIMESTAMP			DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
         `title`        VARCHAR(20)         NULL,
         `company`		VARCHAR(20)			NULL,
         `position`		VARCHAR(30)			NULL,
         `career`		SMALLINT			DEFAULT 0
);

DROP TABLE IF EXISTS `interview_question`;

CREATE TABLE `interview_question` (
          `id`			    BIGINT			PRIMARY KEY,
          `interview_id`	BIGINT			NOT NULL,
          `question`		VARCHAR(200)	NULL,
          `answer`		    VARCHAR(2000)	NULL,
          `feedback`		VARCHAR(1000)	NULL
);

DROP TABLE IF EXISTS `announcement_info`;

CREATE TABLE `announcement_info` (
         `id`			    BIGINT			PRIMARY KEY,
         `community_id`	    BIGINT			NOT NULL,
         `url`			    VARCHAR(200)	NULL,
         `topic`			VARCHAR(30)		NULL,
         `created_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
         `modified_at`	    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `feedback`;

CREATE TABLE `feedback` (
        `id`		    BIGINT			PRIMARY KEY,
        `report_id`	    BIGINT			NOT NULL,
        `writer_id`	    INT UNSIGNED	NOT NULL,
        `reader_id`	    INT UNSIGNED	NOT NULL
);

DROP TABLE IF EXISTS `feedback_detail`;

CREATE TABLE `feedback_detail` (
       `id`			    BIGINT			PRIMARY KEY,
       `feedback_id`	BIGINT			NOT NULL,
       `question`		VARCHAR(50)		NULL,
       `score`			SMALLINT		NULL,
       `feedback`		VARCHAR(500)	NULL
);

DROP TABLE IF EXISTS `ban`;

CREATE TABLE `ban` (
        `id`				BIGINT		    PRIMARY KEY,
        `block_member_id`	INT UNSIGNED	NOT NULL,
        `blocked_member_id`	INT UNSIGNED	NOT NULL
);

DROP TABLE IF EXISTS `interview_info`;

CREATE TABLE `interview_info` (
        `id`					    BIGINT			PRIMARY KEY,
        `member_id`				    INT UNSIGNED	NOT NULL,
        `topic`					    VARCHAR(30)		NULL,
        `pronunciation_score` 	    INT				NULL,
        `face_score`			    INT				NULL,
        `face_graph`			    VARCHAR(200)	NULL,
        `start_time`			    TIMESTAMP		NULL,
        `end_time`				    TIMESTAMP		NULL,
        `report`				    VARCHAR(200)	NULL,
        `created_at`			    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
        `modified_at`			    TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS `participants`;

CREATE TABLE `participants` (
        `id`					BIGINT			PRIMARY KEY,
        `member_id`				INT UNSIGNED	NOT NULL,
        `community_id`			BIGINT			NOT NULL,
        `is_approved`			TINYINT(1)		NULL,
        `created_at`			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
        `modified_at`			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        `is_deleted`			TINYINT(1)		DEFAULT 0
);

DROP TABLE IF EXISTS `interview_preset`;

CREATE TABLE `interview_preset` (
        `id`		SMALLINT UNSIGNED	PRIMARY KEY,
        `question`	VARCHAR(200)		NOT NULL
);

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
        `id`	SMALLINT UNSIGNED	PRIMARY KEY,
        `name`	VARCHAR(15)			NOT NULL
);

DROP TABLE IF EXISTS `announcement_report`;

CREATE TABLE `announcement_report` (
        `id`					BIGINT			PRIMARY KEY,
        `presentation_id`		BIGINT			NOT NULL,
        `member_id`				INT UNSIGNED	NOT NULL,
        `pronunciation_score`	INT				NULL,
        `pronunciation_graph`	VARCHAR(200)	NULL,
        `face_score`			INT				NULL,
        `face_graph`			VARCHAR(200)	NULL,
        `start_time`			TIMESTAMP		NULL,
        `end_time`				TIMESTAMP		NULL,
        `url`					VARCHAR(200)	NULL,
        `created_at`			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP,
        `modified_at`			TIMESTAMP		DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);