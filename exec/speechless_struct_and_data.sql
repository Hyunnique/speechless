-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: i10a806.p.ssafy.io    Database: speechless
-- ------------------------------------------------------
-- Server version	8.0.36-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement_info`
--

DROP TABLE IF EXISTS `announcement_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `community_id` bigint NOT NULL,
  `announcement_id` varchar(200) DEFAULT NULL,
  `topic` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `community_id` (`community_id`),
  CONSTRAINT `announcement_info_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_info`
--

LOCK TABLES `announcement_info` WRITE;
/*!40000 ALTER TABLE `announcement_info` DISABLE KEYS */;
INSERT INTO `announcement_info` VALUES (3,4,'ses_UyCx8UfbvS','마무리 발표 같이 연습해요~','2024-02-15 06:04:38','2024-02-15 06:04:38');
/*!40000 ALTER TABLE `announcement_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `community`
--

DROP TABLE IF EXISTS `community`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `community` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `writer_id` int unsigned NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `deadline` timestamp NULL DEFAULT NULL,
  `session_start` timestamp NULL DEFAULT NULL,
  `is_invisible` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT b'0',
  `hit` bigint DEFAULT '0',
  `max_participants` int DEFAULT '5',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `writer_id` (`writer_id`),
  CONSTRAINT `community_ibfk_1` FOREIGN KEY (`writer_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `community`
--

LOCK TABLES `community` WRITE;
/*!40000 ALTER TABLE `community` DISABLE KEYS */;
INSERT INTO `community` VALUES (4,1,'자유주제','마무리 발표 같이 연습해요~','<p>마무리 발표 같이 연습해요~</p>','2024-02-15 01:10:55','2024-02-15 01:10:55',_binary '\0',_binary '\0',55,2,'2024-02-15 01:11:04','2024-02-16 00:14:36'),(11,13,'IT','저와 함께 SSAFY 12기 지원 할분','<p>SSAFY 12기 면접스터디 모집합니다~~</p>','2024-02-15 05:53:47','2024-02-23 05:53:00',_binary '\0',_binary '\0',41,2,'2024-02-15 05:54:42','2024-02-15 06:41:54'),(13,1,'IT','특화 프로젝트 발표 미리 준비해봐요','<p>특화 프로젝트 발표 미리 준비할 사람 구해요</p>','2024-02-23 06:08:00','2024-02-25 06:08:00',_binary '\0',_binary '\0',25,4,'2024-02-15 06:09:30','2024-02-15 08:06:51'),(14,21,'자기소개','이거 어케씀?','<p>어떻게 쓰는건지 알려주실분</p>','2024-02-16 06:10:00','2024-02-17 06:10:00',_binary '\0',_binary '\0',13,8,'2024-02-15 06:10:37','2024-02-15 06:36:48'),(15,1,'자유주제','입사 발표 연습 해봐요','<p>회사 서류 합격 후 PT 면접 연습해봐요.</p>\n<p>사실 PT 주제도 없구요.</p>\n<p>회사 서류 합격도 없습니다.</p>\n<p>그냥 17층에서 커피 마시고 있습니다</p>','2024-03-09 06:09:00','2024-03-23 09:10:00',_binary '\0',_binary '\0',18,4,'2024-02-15 06:11:43','2024-02-15 08:56:48'),(16,1,'의예','오늘 내일 스터디 구합니다','<p>오늘 내일 스터디 구합니다.</p>\n<p>제가 오늘 내일 해서 오늘 내일 스터디구요</p>\n<p>세션도 오늘 내일합니다.</p>','2024-02-16 06:13:00','2024-02-16 06:13:00',_binary '\0',_binary '\0',15,7,'2024-02-15 06:14:46','2024-02-15 06:41:47'),(17,21,'인문','@@ 독후감 스피치 하실분 @@','<p>각자 추천하고 싶은 책에 대해서</p>\n<p>10분정도 독후감 혹은 소개 발표 진행하실 분들 구해봅니다~</p>','2024-02-18 06:13:00','2024-02-19 06:13:00',_binary '\0',_binary '\0',15,6,'2024-02-15 06:15:30','2024-02-15 06:23:07'),(18,13,'언어','영어 발표 트레이닝 같이 해요~','<p>영어 발표 스킬 향상을 위해 같이 연습할 파트너를 찾습니다.</p>','2024-02-21 06:16:00','2024-02-28 06:16:00',_binary '\0',_binary '\0',20,8,'2024-02-15 06:16:57','2024-02-15 06:49:59'),(19,13,'자기소개','함께 취업 발표 준비합시다!','<p>취업 발표 연습을 위해 함께 연습할 동료를 찾고 있습니다.</p>','2024-02-17 06:17:00','2024-02-24 06:17:00',_binary '\0',_binary '\0',1,4,'2024-02-15 06:17:19','2024-02-15 06:17:20'),(20,15,'IT','구글 컨퍼런스 발표 피드백 해주실분 구합니다.','<p>안녕하세요!</p>\n<p>제가 곧 구글 컨퍼런스에서 DB관련으로 발표를 할 예정입니다.</p>\n<p>혹시 제 발표 들어보시고 피드백 해주실분 구합니다!!</p>\n<p>감사합니다!!</p>','2024-02-18 09:15:00','2024-02-19 06:15:00',_binary '\0',_binary '\0',133,4,'2024-02-15 06:17:44','2024-02-15 08:05:15'),(21,14,'자유주제','안녕하세요 싸피초등학교 3학년 박병춘입니다. ','<p>안녕하세요 싸피초 3학년 박병춘입니다. 다음 주에 국제 정세와 관련한 토론이 예정 되어있어서 시급하게 연습할 인원을 찾습니다.</p>','2024-02-17 06:17:00','2024-02-16 06:17:00',_binary '\0',_binary '\0',67,2,'2024-02-15 06:17:57','2024-02-16 00:01:11'),(22,1,'자유주제','스터디 할 사람~! 스터디장부터 구합니다.','<p>스터디 진행하는데, 스터디장 가능하신 분 우대합니다.</p>','2024-02-29 12:22:00','2024-03-02 09:18:00',_binary '\0',_binary '\0',3,4,'2024-02-15 06:18:07','2024-02-15 07:01:08'),(23,15,'자유주제','서로 발표 피드백 하며 연습하실 분 구합니다!!','<p>주제는 자유주제입니다.</p>\n<p>각자 PPT 만들어서 발표 5~10분 정도하시고 서로 피드백하면서 연습하실분 구합니다</p>\n<p>3~4명 정도 생각하고 있습니다.</p>\n<p>자유롭게 신청해주세요!!!!</p>\n<p>&nbsp;</p>','2024-02-17 06:19:00','2024-02-18 12:00:00',_binary '\0',_binary '\0',24,4,'2024-02-15 06:22:09','2024-02-15 06:22:36'),(24,14,'자유주제','\'자유의지\'란 무엇인지 심도 깊은 토론을 하실 분?','<p>운명과 자유의지에 대하여 심도 깊고 깊은 이야기를 나누실 분 모집합니다.&nbsp;</p>','2024-02-18 06:38:00','2024-02-17 06:38:00',_binary '\0',_binary '\0',36,2,'2024-02-15 06:39:54','2024-02-15 06:48:25'),(26,26,'IT','SSAFY 12기 준비하실 분들 오세요!!','<p>싸피에 들어가려면 무시무시한 면접과 더불어 프레젠테이션 준비를 해야 한다는 소문이 있습니다.</p>\n<p>너무 무서운데 같이 준비하실 분들 구해봐요!!</p>','2024-02-16 12:00:00','2024-02-16 13:00:00',_binary '\0',_binary '\0',10,8,'2024-02-15 06:47:24','2024-02-15 08:36:00'),(27,14,'자유주제','\"함께 성장하는 발표 연습 그룹 모집합니다!\"','<p>안녕하세요! 발표 능력을 향상시키고 싶은 분들을 위한 연습 그룹을 모집하고자 합니다. 발표는 혼자 연습해도 좋지만, 다양한 피드백과 격려를 통해 더 빠르게 성장할 수 있습니다. 저희 그룹은 각자 준비한 발표를 공유하고, 서로 건설적인 피드백을 주고받으며 함께 성장하는 것을 목표로 합니다.</p>\n<p>발표 주제는 자유롭게 선택할 수 있으며, 모두가 관심 있는 주제에 대해 발표하는 것을 권장합니다. 이는 다양한 분야에 대한 지식을 넓히고, 발표에 필요한 다양한 스킬을 연습할 수 있는 좋은 기회가 될 것입니다. 함께 성장하며 발표 실력을 한 단계 업그레이드해보아요!</p>','2024-02-19 06:46:00','2024-02-18 06:46:00',_binary '\0',_binary '\0',5,5,'2024-02-15 06:47:37','2024-02-15 07:54:14'),(28,26,'인문','제 37회 정기 독서토론회입니다.','<p>회원님들 들어와주세요.</p>','2024-02-13 06:50:00','2024-02-14 09:00:00',_binary '\0',_binary '\0',9,6,'2024-02-15 06:51:08','2024-02-15 07:26:08'),(30,26,'사회','페이커 vs 손흥민','<p>누가 더 월클인가</p>','2024-02-01 06:57:00','2024-02-05 06:57:00',_binary '\0',_binary '\0',12,4,'2024-02-15 06:59:07','2024-02-15 08:00:31'),(32,14,'자기소개','Seeking Partners~','<p>To join, please share a short introduction about yourself and the topics you are passionate about presenting. Our goal is to create a dynamic and positive learning environment where every participant feels valued and motivated to improve. Let\'s embark on this journey of mutual growth and elevate our presentation skills together!</p>','2024-02-20 07:00:00','2024-02-19 07:00:00',_binary '\0',_binary '\0',26,2,'2024-02-15 07:01:05','2024-02-15 14:21:43'),(33,1,'언어','저와 같이 심도 있는 토의할 분 구합니다~','<p>집에서 집에 가고 싶다고 말하는 것은 무슨 의미인지 의문이 생겼습니다.</p>\n<p>저와 진지한 토의하실 분 구합니다.</p>','2024-02-29 07:01:00','2024-03-12 07:01:00',_binary '\0',_binary '\0',27,4,'2024-02-15 07:02:33','2024-02-15 14:21:30'),(35,23,'자기소개','함께 취업 발표 준비합시다!','<p>취업 발표 연습을 위해 함께 연습할 동료를 찾고 있습니다.</p>','2024-02-19 14:18:00','2024-02-26 04:00:00',_binary '\0',_binary '\0',5,4,'2024-02-15 14:19:36','2024-02-15 19:56:41'),(36,26,'자유주제','리썰 컴퍼니 같이 할 분 구해요','<p>제가 친구가 없어서 여기다 글을 올려봅니다. 리썰컴퍼니란 게임 같이 하실분 구해요..</p>','2024-02-28 23:59:00','2024-03-28 23:59:00',_binary '\0',_binary '\0',4,4,'2024-02-16 00:00:22','2024-02-16 00:01:07'),(37,28,'자유주제','PT 면접 대비 하실분 구합니다','<p>PT면접 보시는분들 누구든 상관없이 지원해주세요</p>\n<p>각자 준비해오시고 서로 발표 듣고 피드백 하는 방향으로 진행하겠습니다!</p>','2024-02-18 00:05:00','2024-02-19 01:00:00',_binary '\0',_binary '\0',2,4,'2024-02-16 00:06:29','2024-02-16 00:19:01'),(38,29,'자유주제','CS 면접 스터디 하실 분 구합니다.','<p>실전과 같은 진지함으로 기술 면접 대비하실 면접 스터디원 구합니다.</p>\n<p>매주 수요일마다 진행할 예정입니다.</p>\n<p>관심있는 분 연락주세요.</p>\n<p>TEL: 010-XXXX-XXXX</p>','2024-02-19 00:04:00','2024-03-20 00:04:00',_binary '\0',_binary '\0',5,8,'2024-02-16 00:06:34','2024-02-16 00:12:23'),(39,24,'교육','교생 실습 수업 들어봐 주실 분!','<p>다음주에 수업 하는데 중학생의 자세로 교생 수업 들어주실 분 구합니다!</p>\n<p>본인이 중학생이라고 생각하고 질문 많이 해주시면 도움이 많이 될 것 같아요</p>','2024-02-17 00:06:00','2024-02-18 06:00:00',_binary '\0',_binary '\0',22,8,'2024-02-16 00:09:19','2024-02-16 00:25:29'),(40,2,'IT','Speechless 최종 마무리 발표 연습','<p>Speechless 서비스 최종 발표 연습 방입니다!!</p>','2024-02-16 09:00:00','2024-02-16 12:00:00',_binary '\0',_binary '\0',94,5,'2024-02-16 00:16:35','2024-02-16 00:27:02');
/*!40000 ALTER TABLE `community` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_info`
--

DROP TABLE IF EXISTS `interview_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` int unsigned NOT NULL,
  `topic` varchar(30) DEFAULT NULL,
  `pronunciation_score` int DEFAULT NULL,
  `pronunciation_graph` varchar(2000) DEFAULT NULL,
  `face_score` int DEFAULT NULL,
  `face_graph` varchar(2000) DEFAULT NULL,
  `is_completion` bit(1) DEFAULT b'0',
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `interview_info_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_info`
--

LOCK TABLES `interview_info` WRITE;
/*!40000 ALTER TABLE `interview_info` DISABLE KEYS */;
INSERT INTO `interview_info` VALUES (1,13,'테스트 자소서1',50,'[50]',50,'[[48,49,50,51,52]]',_binary '','2024-02-15 05:18:52','2024-02-15 05:19:21','2024-02-15 05:18:52','2024-02-15 05:19:21'),(2,21,'네이버 Senior 웹개발자 면접',83,'[82,67,100]',36,'[[45,27],[0,0,0],[99,99,54,45,74]]',_binary '','2024-02-15 06:33:30','2024-02-15 06:34:24','2024-02-15 06:33:30','2024-02-15 06:34:24'),(3,26,'신한은행 1차 면접 준비',NULL,NULL,NULL,NULL,_binary '\0','2024-02-15 07:20:27',NULL,'2024-02-06 04:20:27','2024-02-15 07:20:27'),(4,26,'신한은행 1차 면접 준비',99,'[99]',4,'[[1,1,1,13,1,12]]',_binary '','2024-02-06 07:21:49','2024-02-06 07:22:19','2024-02-15 07:21:49','2024-02-15 07:22:19'),(5,26,'신한은행 1차 면접 준비 2',97,'[97]',30,'[[34,48,49,14,3,33]]',_binary '','2024-02-09 07:23:12','2024-02-09 07:23:33','2024-02-15 07:23:12','2024-02-15 07:23:33'),(6,26,'신한은행 1차 면접 준비 3',84,'[84]',55,'[[0,52,52,17,83,83,65,55,84,65]]',_binary '','2024-02-11 07:24:05','2024-02-11 07:24:25','2024-02-15 07:24:05','2024-02-15 07:24:25'),(7,26,'LIG 넥스원 기술 면접 준비',95,'[96,97,93]',26,'[[40,45,22,44,27,11,34,41,48,11,30,15,23,50,19,12,45,40,46,37,32,8,42,46,19,48,10,24,13,40,28,48],[25,22,9,24,22,20,1,6,48,48,12,2,40,48,22,30,2,18,48,5,2,7,2,8,15,43,3,47,4,2,16,3,6,13,15,93,23,17,36,44,43,17,31,4],[85,1,38,9,48,3,7,52,2,10,19,5,45,12,5,1,2,9,6,17,26,43,2,32,36,14,26,11,44,4,2,50,13,23,47,27,41,46,51,43,23,97,99,97]]',_binary '','2024-02-12 07:27:23','2024-02-12 07:31:12','2024-02-15 07:27:23','2024-02-15 07:31:12'),(8,26,'현대 오토에버 SSAFY 잡페어 지원',91,'[76,100,98]',83,'[[0,51,50,55,55,50,51,99,99,69,69,90,96,84,98,98,98,63,99,99,99,99,99,89,96,99,97,96,97,99,100,100,100,99,99,99,99,99,99,58,76,31,76,47,21,93,76,72,71,60,51,99,99,99,99,77,99,99,68,60],[99,99,49,51],[98,99,99,99,85]]',_binary '','2024-02-14 07:55:43','2024-02-14 07:58:03','2024-02-15 07:55:43','2024-02-15 07:58:03'),(9,26,'LIG 넥스원 지원 자소서',75,'[52,99]',47,'[[94,94,94],[0,0,0,0,0,0,0]]',_binary '','2024-02-15 08:03:20','2024-02-15 08:03:48','2024-02-15 08:03:20','2024-02-15 08:03:48'),(10,1,'현대 오토에버',NULL,NULL,NULL,NULL,_binary '\0','2024-02-15 19:53:31',NULL,'2024-02-15 19:53:31','2024-02-15 19:53:31');
/*!40000 ALTER TABLE `interview_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interview_question`
--

DROP TABLE IF EXISTS `interview_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interview_question` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `interview_id` bigint NOT NULL,
  `question` varchar(200) DEFAULT NULL,
  `answer` varchar(2000) DEFAULT NULL,
  `feedback` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `interview_id` (`interview_id`),
  CONSTRAINT `interview_question_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interview_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interview_question`
--

LOCK TABLES `interview_question` WRITE;
/*!40000 ALTER TABLE `interview_question` DISABLE KEYS */;
INSERT INTO `interview_question` VALUES (1,2,'동료, 친구들이 나를 어떤 사람으로 생각할까요?','소리 테스트를 따로 해볼 수 있는.','이 질문에 대한 답변은 매우 부적절합니다. 질문은 당신이 어떤 사람인지, 특히 동료나 친구들이 당신을 어떻게 인식하는지에 대한 것입니다. 그러나 당신의 답변은 이에 대한 정보를 전혀 제공하지 않습니다. 이런 질문에 대한 적절한 답변은 당신의 성격, 가치관, 능력, 협업 스타일 등에 대한 정보를 제공해야 합니다. 당신의 답변은 이런 정보를 전혀 포함하고 있지 않습니다. 다음에는 질문의 의도를 더 잘 이해하고, 그에 따른 적절한 답변을 준비해야 합니다.'),(2,2,'본인이 가장 잘한 프로젝트에 대해 설명해주세요.','내일 혼자 있을까 너 내일 출마.','이 답변은 적합하지 않습니다. 질문에 대한 답변이 아니며, 본인의 경험, 역량, 능력을 보여주는 내용이 전혀 포함되어 있지 않습니다. 면접에서는 질문에 직접적으로 답변하고, 자신의 경험과 능력을 보여주는 것이 중요합니다. 이 답변은 그러한 요소를 전혀 충족시키지 못하고 있습니다.'),(3,2,'50년의 경력을 가진 당신이라면, 이전에 겪었던 가장 어려운 기술적 문제는 무엇이었고, 그 문제를 어떻게 해결했는지 설명해주실 수 있나요?','','제가 가장 어려웠던 기술적 문제는 이전 회사에서 대규모 데이터를 처리하던 중 발생했습니다. 우리 시스템은 매일 수백만 건의 데이터를 처리해야 했는데, 이 과정에서 성능 저하 문제가 발생했습니다. 이 문제를 해결하기 위해, 우선 시스템의 성능 저하를 일으키는 원인을 찾기 위해 로그 분석과 시스템 모니터링을 통해 문제를 파악했습니다. 그 결과, 데이터 처리 과정에서 발생하는 병목 현상이 주요 원인임을 알게 되었습니다. 이를 해결하기 위해, 데이터 처리 과정을 병렬화하고, 불필요한 데이터 처리를 최소화하는 등의 방법을 사용했습니다. 또한, 시스템의 성능을 지속적으로 모니터링하여 성능 저하를 미리 감지하고 대응할 수 있도록 했습니다. 이러한 노력 덕분에, 우리 시스템은 이제 매일 수백만 건의 데이터를 원활하게 처리할 수 있게 되었습니다.'),(4,3,'본인이 가장 자신있는 기술에 대해 설명해주세요.','','제가 가장 자신있는 기술은 웹 개발입니다. 특히, 프론트엔드와 백엔드 모두에 대한 깊은 이해를 바탕으로, 사용자 친화적인 웹사이트를 만드는 데 특화되어 있습니다. 프론트엔드에서는 React와 Vue.js를 주로 사용하며, 백엔드에서는 Node.js와 Express를 사용해 서버를 구축합니다. 또한, MongoDB와 MySQL 같은 데이터베이스를 다루는 데도 능숙합니다. 이러한 기술들을 활용하여 여러 프로젝트를 수행하면서 실력을 키워왔습니다.'),(5,4,'본인이 가장 잘한 프로젝트에 대해 설명해주세요.','하나 둘 셋.','이 답변은 매우 부적절합니다. 면접에서는 본인의 역량과 경험을 보여주는 기회입니다. \'하나 둘 셋\'이라는 답변은 본인이 가장 잘한 프로젝트에 대해 전혀 설명하지 않았습니다. 이런 답변은 면접관에게 본인의 역량을 전혀 보여주지 못하며, 심지어 진지하게 면접을 대하지 않는 것으로 보일 수 있습니다. 다음에는 본인이 참여한 프로젝트 중 가장 성공적이었던 것에 대해 구체적으로 언급하고, 그 프로젝트에서 본인이 어떤 역할을 했는지, 어떤 결과를 얻었는지 등을 설명해야 합니다.'),(6,5,'1분 자기소개 해주세요.','1분 자기소개 1분 자기소개 1분 자기소개.','이런 답변은 전혀 적합하지 않습니다. 자기소개에서는 자신의 경험, 역량, 성취 등을 구체적으로 언급해야 합니다. 단순히 \'1분 자기소개\'를 반복하는 것은 자신을 제대로 표현하지 못한 것이며, 면접관에게 본인의 역량을 제대로 보여주지 못하는 것입니다. 다음에는 자신의 경력, 학력, 특기 등을 포함한 자기소개를 준비해보세요.'),(7,6,'본인의 장단점에 대해 설명해주세요.','마이크 테스트 하나 둘 셋 씻어서 먹.','이 답변은 전혀 적절하지 않습니다. 질문에 대한 실질적인 답변이 아니며, 전문적이지 않은 태도를 보여줍니다. 면접자는 자신의 장단점에 대해 진지하게 생각하고, 이를 어떻게 개선하거나 활용할 수 있는지에 대한 계획을 제시해야 합니다. 이런 답변은 면접관에게 부정적인 인상을 남길 수 있습니다.'),(8,7,'인생에서 가장 힘들었던 경험이 무엇인가요?','제 인생에서 가장 힘들었던 경험은 사피 프로젝트를 2학기 때 진행을 하면서 매우 많은 일정을 소화하는 과정이 매우 힘들었습니다. 하지만 단순히 제 의지도 충분히 강했지만 다른 팀원들과의 협력을 통해서 불가능할 것 같은 난관을 극복하고 다 함께 목표를 달성하는 과정을 겪어 제 성장에 큰 밑거름이 되었다고 생각합니다.','이 답변은 매우 긍정적인 면을 보여줍니다. 당신이 어려운 상황을 극복하는 능력을 가지고 있음을 보여주며, 팀원들과 협력하여 목표를 달성할 수 있는 능력을 갖추고 있다는 것을 입증합니다. 또한, 이 경험이 당신의 성장에 큰 도움이 되었다고 말함으로써, 어려움을 통해 배우고 성장하는 태도를 보여줍니다. 이는 당신이 어떤 도전이든 받아들일 준비가 되어 있음을 보여주는 좋은 예입니다. 그러나, 사피 프로젝트에 대한 구체적인 내용이나 어떻게 난관을 극복했는지에 대한 세부 사항을 더 추가하면 당신의 답변이 더욱 강력해질 것입니다.'),(9,7,'분대장으로서 팀원들의 반발에도 불구하고 방차통을 번갈아가며 메는 제안을 실행에 옮긴 경험에 대해 설명해주실 수 있나요? 그 과정에서 어떤 어려움이 있었고, 그것을 어떻게 극복하였는지도 함께 설명해주세요.','이제 이것은 제가 군대에 있을 때 부조리를 없앴던 경험을 적어놨던 것입니다. 제가 맨 처음 신병이었을 때는 방사통을 신병이 매는 부조리가 있었지만 저는 그때는 받아들이고 실행했었습니다. 하지만 이게 감정적인 문제가 아니라 전체적인 군대의 업무 능력을 상당히 저해시킨다고 생각을 했습니다. 왜냐하면 신병이 그것뿐만 아니라 다른 업무도 해야 하는 상황이 많기 때문에 체력적으로 부담이 많이 된다고 생각했기 때문입니다. 그래서 저는 그 악습을 없애고자.','답변자는 문제를 인식하고 이를 해결하기 위한 적극적인 태도를 보여주었습니다. 그는 불공평한 상황을 인지하고 이를 개선하려는 의지를 보였습니다. 그러나, 그의 답변은 어떻게 그의 제안을 실행에 옮겼는지, 팀원들의 반발을 어떻게 극복했는지에 대한 구체적인 설명이 부족합니다. 이러한 중요한 부분들에 대해 더 자세히 설명하면, 그의 리더십과 문제 해결 능력을 더 잘 보여줄 수 있을 것입니다.'),(10,7,'입사 후 직무 전문가로서의 성장 비전이 무엇인지, 그리고 그 비전을 이루기 위해 어떤 노력을 계획하고 있는지 구체적으로 말씀해주실 수 있나요?','저는 전문가로서 성장을 하기 위해선 단순히 입사가 목표가 되면 안 된다고 생각합니다. 기업 입사 LIG 넥스원에 입사를 한 이후에도 스스로 자격증 공부, 그리고 만약 필요하다면 회사와 상사, 동료들과 합의를 통해 대학원 진학 등을 목표로 하여서 기존에 하는 업무와 병행하여 추가적인 공부를 진행을 해 현재 격동적으로 발전하는 AI 기술에서 뒤처지지 않고 전문적인 역량을 발휘할 수 있도록 항상 노력을 해야 한다고 생각합니다. 약간 이런 느낌 이건 뭔가.','이 답변은 전반적으로 잘 구성되어 있습니다. 답변자는 자신의 성장 비전을 명확하게 표현하고, 그 비전을 이루기 위한 구체적인 계획을 제시하였습니다. 특히, 자격증 공부와 대학원 진학 등의 계획을 통해 지속적인 학습 의지를 보여주었고, 이는 직무 전문가로서의 성장을 위해 필요한 태도입니다. 그러나, 답변의 마지막 부분에서 \'약간 이런 느낌 이건 뭔가\'라는 표현은 부적절하다고 생각됩니다. 이 부분은 자신감을 표현하는 데 방해가 될 수 있으므로, 더욱 확신에 찬 표현으로 바꾸는 것이 좋을 것 같습니다.'),(11,8,'본인이 가장 잘한 프로젝트에 대해 설명해주세요.','하고 싶어도 할 줄 모르는데 몰라. 생각보다 이렇게 높게 안 돼 진짜 웃어야 돼. 그냥 이렇게 약간 살짝 웃는 상으로 하면 나 잘 나오네. 원래 웃는 그런 표정 해보세요. 그래서 이게 근데 개인차가 있어요. 저는 그냥 약간 평범한 저 해봐요. 평범하게 형님 그래도 완전 높은데 일상이시네. 저는 진짜 아무리 웃어도 점수가 높게 안 나와요. 그러 그런 게 있어요. 해보세요. 저 소리 없는 게 꽤 웃기네. 소리 없는 게 너무 웃긴데 아닌가 대리님이 약간 표정이 좀 많이 정 표정이어지고 그런 것 같아. 근데 이게 실제 면접에서 영향을 미치는 떨어진 거 보면 이게 좀 사람이 차가워 보이니까 떨어진 공연이라 100점 안 나와요.','이 답변은 질문에 대한 적절한 반응이 아닙니다. 질문은 본인이 가장 잘한 프로젝트에 대한 설명을 요구하는 것인데, 답변은 그와 관련이 없는 내용을 포함하고 있습니다. 프로젝트에 대한 어떠한 정보도 제공되지 않았으며, 대신 개인적인 이야기와 무관한 주제에 대해 이야기하고 있습니다. 이러한 답변은 면접관이 당신의 역량과 경험을 평가하는 데 도움이 되지 않습니다. 다음 번에는 질문에 직접적으로 답하고, 자신의 경험과 역량을 보여주는 구체적인 예를 제공하는 것이 좋습니다.'),(12,8,'경력이 없는 상태에서 백엔드 개발자로서 어떤 준비를 하셨나요? 그리고 이를 통해 어떤 경험을 얻으셨나요?','','저는 백엔드 개발자로서의 준비를 위해 여러 가지 방법을 사용했습니다. 먼저, 백엔드 개발에 필요한 프로그래밍 언어인 Python과 Java를 깊게 이해하려고 노력했습니다. 또한, 데이터베이스 관리 시스템에 대한 이해를 높이기 위해 MySQL과 MongoDB에 대해 공부했습니다.\n\n또한, 실제 프로젝트에 참여하기 위해 오픈 소스 프로젝트에 기여하는 것을 시작했습니다. 이를 통해 실제 개발 환경에서의 작업 흐름을 이해하고, 다른 개발자들과 협업하는 방법을 배울 수 있었습니다. 이러한 경험은 저에게 실제 작업 환경에서의 문제 해결 능력을 키우는 데 매우 도움이 되었습니다.\n\n마지막으로, 백엔드 개발자로서의 역량을 향상시키기 위해 다양한 온라인 코스와 튜토리얼을 이용했습니다. 이를 통해 최신 기술 트렌드를 따라잡고, 새로운 도구와 기술을 배울 수 있었습니다. 이러한 준비 과정을 통해 저는 백엔드 개발자로서의 기본적인 역량을 갖추게 되었고, 이를 바탕으로 계속해서 성장해 나가고자 합니다.'),(13,8,'현대 오토에버의 어떤 점이 가장 마음에 드시나요? 그리고 그 이유는 무엇인가요?','근데 내일 진짜로 이거 기반으로 답을 할 거예요.','이 답변은 적합하지 않습니다. 면접관이 질문한 내용에 대한 구체적인 답변이 없습니다. 현대 오토에버에 대한 이해도나, 회사에 대한 관심을 보여주는 내용이 없습니다. 또한, \"근데 내일 진짜로 이거 기반으로 답을 할 거예요.\"라는 표현은 진지하게 면접에 임하고 있지 않다는 인상을 줄 수 있습니다. 이러한 답변은 면접관에게 부정적인 이미지를 남길 수 있습니다. 다시 답변을 준비하시되, 회사에 대한 이해와 관심을 보여주는 내용을 포함하시는 것이 좋겠습니다.'),(14,9,'본인이 가장 자신있는 기술에 대해 설명해주세요.','별로 그래요.','이 답변은 매우 부적절합니다. 면접에서는 자신의 능력과 경험을 최대한 잘 표현해야 합니다. \"별로 그래요\"라는 답변은 자신의 기술에 대한 자신감이 없음을 보여주며, 이는 면접관에게 부정적인 인상을 줄 수 있습니다. 자신이 가장 자신있는 기술에 대해 구체적이고 자세하게 설명하려는 노력을 보여주는 것이 중요합니다.'),(15,9,'본인이 AI 개발자로서 가장 중요하게 생각하는 역량은 무엇이며, 이를 어떻게 개발하고 있는지 설명해주세요.','솔직히 잘 모르겠습니다.','이 답변은 매우 부적절합니다. 면접에서는 자신의 역량과 경험을 보여주는 것이 중요하며, 특히 AI 개발자로서의 역량에 대한 이해와 그것을 어떻게 개발하고 있는지에 대한 명확한 계획이 필요합니다. \"잘 모르겠습니다\"라는 답변은 준비가 부족하거나 해당 분야에 대한 이해도가 낮음을 보여줍니다. 다음 면접에서는 이 질문에 대해 더 깊이 생각하고, 자신의 역량과 그것을 어떻게 개발하고 있는지에 대한 구체적인 예를 제시하는 것이 좋겠습니다.');
/*!40000 ALTER TABLE `interview_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `profile` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `member_type` enum('kakao','naver','google') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'곰','https://ssl.pstatic.net/static/pwe/address/img_profile.png','cloud_365@naver.com','naver','2024-02-15 00:33:50','2024-02-15 00:33:50'),(2,'Hyunnique',NULL,'seol3964@naver.com','naver','2024-02-15 00:36:53','2024-02-15 00:36:53'),(13,'한태희','https://ssl.pstatic.net/static/pwe/address/img_profile.png','xotpqnd@naver.com','naver','2024-02-15 01:17:13','2024-02-15 01:17:13'),(14,'ygj****',NULL,'ygj9605@naver.com','naver','2024-02-15 04:24:15','2024-02-15 04:24:15'),(15,'정훈','http://k.kakaocdn.net/dn/bY0rcb/btszj7xYcJP/lCKaRyBfXpVSXN62dcvFH0/img_110x110.jpg','bjh4395@nate.com','kakao','2024-02-15 04:56:50','2024-02-15 04:56:50'),(21,'김대현',NULL,'ja2462@naver.com','kakao','2024-02-15 06:06:07','2024-02-15 06:06:07'),(22,'윤길재','https://lh3.googleusercontent.com/a/ACg8ocLEuHwn_Jlm2ZZQjZ3L7d-2L243ZHLtjH32ua9ACWN3a0w=s96-c','ygj960518@gmail.com','google','2024-02-15 06:12:49','2024-02-15 06:12:49'),(23,'한태희','https://lh3.googleusercontent.com/a/ACg8ocLk8NDAxhS6xP4NwdBv2XoBuWlMHx9PhvmFjEIMTEsl=s96-c','xotpqnd@ajou.ac.kr','google','2024-02-15 06:23:17','2024-02-15 06:23:17'),(24,'soyi myeong','https://lh3.googleusercontent.com/a/ACg8ocKg9Oy7InoaNhVLOeU4BYh4-lBsKYrHCxsWLgCuWPAA=s96-c','myeongsoyi@gmail.com','google','2024-02-15 06:27:56','2024-02-15 06:27:56'),(25,'맨해튼','https://ssl.pstatic.net/static/pwe/address/img_profile.png','aktlwjd999@naver.com','naver','2024-02-15 06:39:48','2024-02-15 06:39:48'),(26,'한태희',NULL,'xotpqnd@naver.com','kakao','2024-02-15 06:40:35','2024-02-15 06:40:35'),(27,'황인규','https://lh3.googleusercontent.com/a/ACg8ocJYu7EMiap1MbN3sRaBndMwYHmUQ55jT-Br4wuYqqVJIUI=s96-c','rlawldbs42@gmail.com','google','2024-02-15 08:05:13','2024-02-15 08:05:13'),(28,'hoon','https://lh3.googleusercontent.com/a/ACg8ocLwlXX1wMcTFAZ0TjTPAw_EUrkhj1PIow6aX-A-Rms3fw=s96-c','qowjdgns4395@gmail.com','google','2024-02-15 23:50:55','2024-02-15 23:50:55'),(29,'ᄉᄋᄆᄆ','https://lh3.googleusercontent.com/a/ACg8ocIbgnyQt9Q9BZC3PH1NHKWdjUIIRuKwP3iTWqpDK-3cT1Q=s96-c','xotpqnd@gmail.com','google','2024-02-16 00:04:11','2024-02-16 00:04:11');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participant`
--

DROP TABLE IF EXISTS `participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participant` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` int unsigned NOT NULL,
  `community_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  KEY `community_id` (`community_id`),
  CONSTRAINT `participant_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`),
  CONSTRAINT `participant_ibfk_2` FOREIGN KEY (`community_id`) REFERENCES `community` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participant`
--

LOCK TABLES `participant` WRITE;
/*!40000 ALTER TABLE `participant` DISABLE KEYS */;
INSERT INTO `participant` VALUES (2,2,4,'2024-02-15 01:18:53','2024-02-15 01:18:53'),(8,13,4,'2024-02-15 05:00:09','2024-02-15 05:00:09'),(9,13,11,'2024-02-15 05:54:45','2024-02-15 05:54:45'),(13,1,13,'2024-02-15 06:09:30','2024-02-15 06:09:30'),(14,21,14,'2024-02-15 06:10:37','2024-02-15 06:10:37'),(15,1,15,'2024-02-15 06:11:43','2024-02-15 06:11:43'),(16,1,16,'2024-02-15 06:14:46','2024-02-15 06:14:46'),(17,21,17,'2024-02-15 06:15:30','2024-02-15 06:15:30'),(18,13,18,'2024-02-15 06:16:57','2024-02-15 06:16:57'),(19,13,19,'2024-02-15 06:17:19','2024-02-15 06:17:19'),(20,15,20,'2024-02-15 06:17:44','2024-02-15 06:17:44'),(21,14,21,'2024-02-15 06:17:57','2024-02-15 06:17:57'),(22,1,22,'2024-02-15 06:18:07','2024-02-15 06:18:07'),(23,15,23,'2024-02-15 06:22:09','2024-02-15 06:22:09'),(24,14,24,'2024-02-15 06:39:54','2024-02-15 06:39:54'),(25,24,13,'2024-02-15 06:42:34','2024-02-15 06:42:34'),(27,26,26,'2024-02-15 06:47:24','2024-02-15 06:47:24'),(28,14,27,'2024-02-15 06:47:37','2024-02-15 06:47:37'),(29,15,24,'2024-02-15 06:48:24','2024-02-15 06:48:24'),(30,26,27,'2024-02-15 06:49:40','2024-02-15 06:49:40'),(31,26,21,'2024-02-15 06:49:48','2024-02-15 06:49:48'),(32,26,15,'2024-02-15 06:49:54','2024-02-15 06:49:54'),(33,26,18,'2024-02-15 06:49:58','2024-02-15 06:49:58'),(34,26,13,'2024-02-15 06:50:03','2024-02-15 06:50:03'),(35,26,28,'2024-02-15 06:51:08','2024-02-15 06:51:08'),(38,26,30,'2024-02-15 06:59:07','2024-02-15 06:59:07'),(40,14,32,'2024-02-15 07:01:05','2024-02-15 07:01:05'),(41,1,33,'2024-02-15 07:02:33','2024-02-15 07:02:33'),(43,24,33,'2024-02-15 07:05:55','2024-02-15 07:05:55'),(44,24,20,'2024-02-15 07:38:31','2024-02-15 07:38:31'),(45,23,35,'2024-02-15 14:19:36','2024-02-15 14:19:36'),(46,23,32,'2024-02-15 14:21:36','2024-02-15 14:21:36'),(47,1,35,'2024-02-15 19:56:40','2024-02-15 19:56:40'),(48,26,36,'2024-02-16 00:00:22','2024-02-16 00:00:22'),(49,28,37,'2024-02-16 00:06:29','2024-02-16 00:06:29'),(50,29,38,'2024-02-16 00:06:34','2024-02-16 00:06:34'),(51,24,39,'2024-02-16 00:09:19','2024-02-16 00:09:19'),(52,2,40,'2024-02-16 00:16:35','2024-02-16 00:16:35'),(55,24,40,'2024-02-16 00:26:44','2024-02-16 00:26:44'),(56,28,40,'2024-02-16 00:26:44','2024-02-16 00:26:44');
/*!40000 ALTER TABLE `participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `member_id` int unsigned NOT NULL,
  `token` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `refresh_token_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES (15,15,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiOGJlZTk5MS1kZDNiLTQ2NTEtOWZmYy04YjU2ZDVhYjY1NTAiLCJpYXQiOjE3MDc5NzY4NDcsImV4cCI6MTcwOTE4NjQ0N30.Ga_wBQR2PAmoenfEU1CiFq1O1busjKP1R9mveaRfMcM','2024-02-15 06:00:47','2024-02-15 06:00:47'),(17,21,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMTY0ZjI4NC1kOGMzLTRiZTAtYmM1Ni1hMTI0Yjg1M2VlNjciLCJpYXQiOjE3MDc5NzcxNjcsImV4cCI6MTcwOTE4Njc2N30.wKVkTSY2IenPKLtJIRCoya11_MElgJWGuGSXnbp4Mjc','2024-02-15 06:06:07','2024-02-15 06:06:07'),(27,25,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiNGY1NTM0NC04MjVjLTQyYzctOTE4ZC1iNzY4YTk0ODRhZjEiLCJpYXQiOjE3MDc5NzkxODcsImV4cCI6MTcwOTE4ODc4N30.Z04FEmosGZHKDDvW9zB5iwOS38zrKJSES4tMU9zXnRc','2024-02-15 06:39:48','2024-02-15 06:39:48'),(29,22,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1OWUwYTNiYy1lNGNkLTQ1NjktYjVlYy1lYzUyNDQ2MjNmNzEiLCJpYXQiOjE3MDc5ODAzNDcsImV4cCI6MTcwOTE4OTk0N30.PChN7AyF5meNAEVxy4RMM-xcs4V-C7BKOiAB9X5o4KI','2024-02-15 06:59:08','2024-02-15 06:59:08'),(36,27,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwZWI5MGVhMy0xYTk4LTQ1YzUtOGUyMS1kNThiMzYyMzczMWEiLCJpYXQiOjE3MDc5ODQzMTIsImV4cCI6MTcwOTE5MzkxMn0.JMQ1qjzAzV8fC5SrbyHe4zGElnt1t0GYEHotcSFg5CU','2024-02-15 08:05:13','2024-02-15 08:05:13'),(37,13,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzODE5N2ExMy0yNTFlLTQ2NTUtODNhNS05ZDI3M2Q5ZDEyNGYiLCJpYXQiOjE3MDc5ODUzODcsImV4cCI6MTcwOTE5NDk4N30.npj2_vNCV4apgb3jjBEhU8jhKkEex4m0LWJ_2A-iqo0','2024-02-15 08:23:07','2024-02-15 08:23:07'),(42,28,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MmRkMDQxNy00M2ViLTQzYjItYmM1YS00OWI5OWFiYzdkOTkiLCJpYXQiOjE3MDgwNDEwNTQsImV4cCI6MTcwOTI1MDY1NH0.pOgEYc4-DQ0NoowHZ5IH2HGo3JsWeavuljxvusGuM_8','2024-02-15 23:50:55','2024-02-15 23:50:55'),(43,2,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmOTQ1ZGQwNS1kNTA4LTQ0ZWYtOGFjZC01NzE2ZmI0Y2UzYTIiLCJpYXQiOjE3MDgwNDE1ODcsImV4cCI6MTcwOTI1MTE4N30.vrLJMznBuI5f_WvsuRNkQq3zK8Lc14SoPrin1hLKBag','2024-02-15 23:59:48','2024-02-15 23:59:48'),(44,24,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhOTYwZWFkNi01Y2ZjLTQ3N2MtODkzNy1iYzlmOWI4ZGU4Y2YiLCJpYXQiOjE3MDgwNDE2MDcsImV4cCI6MTcwOTI1MTIwN30.KGn9GHLfwhISc090pGBf7bJR_vIxnfKelBtmaQLC-hg','2024-02-16 00:00:07','2024-02-16 00:00:07'),(45,14,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTliZjZlZC02NTI2LTQzYjQtOWYzOC1hZGQ5YjdhOWRmOGMiLCJpYXQiOjE3MDgwNDE2NDYsImV4cCI6MTcwOTI1MTI0Nn0.8bKrS_dkPyGNUZccRfUF9_ojgeZi1VhrrATk-QYk0Ss','2024-02-16 00:00:46','2024-02-16 00:00:46'),(46,23,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5ZDc1Nzg1NS0xNTFmLTQ3NTEtYjg0NS01Nzk4Nzg3ZTI3NmEiLCJpYXQiOjE3MDgwNDE2NjIsImV4cCI6MTcwOTI1MTI2Mn0.ELAqBj3b4Akx42dyDULd_LwT-xEs29dCjWd9YLgMbOI','2024-02-16 00:01:03','2024-02-16 00:01:03'),(47,29,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlMjYxZTRhOC1kM2NhLTRmZmYtYThjYi0xODljMzlkZTZiMjciLCJpYXQiOjE3MDgwNDE4NTEsImV4cCI6MTcwOTI1MTQ1MX0.7Pw7T84o15mgAe3Hvebh6sdWn7EjADeqwGk_FBBlKIQ','2024-02-16 00:04:11','2024-02-16 00:04:11'),(49,1,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMzE2OWFiZi04YmYzLTRkY2ItYmI5Yy0yZWRiMWYxMmZkZjQiLCJpYXQiOjE3MDgwNDI1MDMsImV4cCI6MTcwOTI1MjEwM30.Hi1utCLsxndPs638VqlTi3DwThr0GOYF9TVS9xPVqvQ','2024-02-16 00:15:03','2024-02-16 00:15:03'),(50,26,'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyZDNmOGVhNi1kOTY1LTRhMjYtODc2Ny0wYzFhOTY3ODA2YmIiLCJpYXQiOjE3MDgwNDMxODgsImV4cCI6MTcwOTI1Mjc4OH0._x0SnTds17wSY1092LmbV-oRoyNNCIBALU3ixG7d6do','2024-02-16 00:26:28','2024-02-16 00:26:28');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statement`
--

DROP TABLE IF EXISTS `statement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statement` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `member_id` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(20) DEFAULT NULL,
  `company` varchar(20) DEFAULT NULL,
  `position` varchar(30) DEFAULT NULL,
  `career` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `statement_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statement`
--

LOCK TABLES `statement` WRITE;
/*!40000 ALTER TABLE `statement` DISABLE KEYS */;
INSERT INTO `statement` VALUES (14,13,'2024-02-15 05:18:37','2024-02-15 05:18:37','테스트 자소서1','1','1',0),(21,21,'2024-02-15 06:33:25','2024-02-15 06:33:25','네이버 Senior 웹개발자 면접','네이버','개발자',50),(22,26,'2024-02-15 07:17:44','2024-02-15 07:17:44','LIG 넥스원 지원 자소서','LIG 넥스원','AI 개발자',0),(23,26,'2024-02-15 07:19:14','2024-02-15 07:19:14','2023 신한은행 지원 자소서','신한은행','풀스택 개발자',0),(24,26,'2024-02-15 07:19:44','2024-02-15 07:19:44','현대 오토에버 SSAFY 잡페어 지원','현대 오토에버','백엔드 개발자',0),(25,1,'2024-02-15 19:53:12','2024-02-15 19:53:12','현대 오토에버','현대 오토에버','DBA',0);
/*!40000 ALTER TABLE `statement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statement_question`
--

DROP TABLE IF EXISTS `statement_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `statement_question` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `statement_id` int unsigned NOT NULL,
  `question` varchar(200) DEFAULT NULL,
  `answer` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `statement_id` (`statement_id`),
  CONSTRAINT `statement_question_ibfk_1` FOREIGN KEY (`statement_id`) REFERENCES `statement` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statement_question`
--

LOCK TABLES `statement_question` WRITE;
/*!40000 ALTER TABLE `statement_question` DISABLE KEYS */;
INSERT INTO `statement_question` VALUES (28,14,'.','<p>.</p>','2024-02-15 05:18:37','2024-02-15 05:18:37'),(42,21,'왜 이 회사에 지원했나요?','<p>돈을... 많이..... 줘서요.....</p>','2024-02-15 06:33:25','2024-02-15 06:33:25'),(43,22,'새로운 시각이나 끊임없는 혁신의 실행으로 문제를 포기하지 않고 해결했던 경험을 서술해주세요.','<p dir=\"ltr\">[2개의 센서라는 고정관념을 깨다]</p>\n<p dir=\"ltr\">IT 집중교육이라는 강의에서 4인 팀 프로젝트로 기반 레고 마인드스톰을 이용해 nxtOSEK c++ 프로그래밍을 했던 적이 있습니다. 이 프로젝트를 하면서, 초음파 센서를 사용해 앞 차량에 붙어있는 골판지 상자를 따라가는 동작을 프로그래밍하는 과제가 있었습니다.</p>\n<p dir=\"ltr\">과제를 하면서 저희에게 주어진 초음파 센서는 2개였습니다. 처음엔 두 센서의 측정치 차이를 삼각함수로 계산해서 앞 차량의 거리와 각도를 구하는 방식으로 제작했습니다. 하지만, 초음파 센서의 부정확성과 서로 간의 간섭 현상으로 인해 정상적인 작동을 하지 않았습니다. 다른 팀원 한 명이 초음파 센서 간의 거리를 최대한 멀리 떨어트려서 간섭을 줄이고 해상도를 높이는 방법을 제안해 적용해 봤지만 한정된 레고 부품으로는 초음파 센서를 높고 멀게 지지하기 힘들고, 전방 차량의 약한 동력으로 커다란 골판지를 끌고 움직이기 힘들다는 문제가 발생했습니다.</p>\n<p dir=\"ltr\">이 상황에서 과제 안내서를 다시 보던 제 머릿속에 아이디어가 하나 스쳤습니다. 과제 안내엔 필요시 부품을 추가 요청 가능하다는 내용이 적혀 있었는데, 초음파 센서 2개가 문제라면 더 많은 센서가 있다면 정확한 동작이 가능하지 않을까 하는 생각이 들었습니다. 강의 조교에게 문의해서 초음파 센서를 하나 더 받아올 수 있었고, 좌, 전방, 우측을 45도 회전 각도로 커버하는 센서를 장착하고, 이 3개의 센서 정보를 기반으로 작동하는 새로운 방식의 알고리즘을 설계했습니다. 이렇게 개조한 결과, 상당히 높은 정확도로 전방의 차량을 따라가는 차량을 만들 수 있었습니다.</p>','2024-02-15 07:17:44','2024-02-15 07:17:44'),(44,22,'타인의 협력을 이끌어 내거나 타인을 주도적으로 도와서 공동의 목표를 달성했던 경험을 서술해주세요.','<p dir=\"ltr\">[분대장으로서 악습을 없애고 분대의 효율을 높히다]</p>\n<p dir=\"ltr\">훈련에서 가설 분대장으로서 분대와 함께 지휘소부터 초소까지의 통신선 연결 임무를 받은 적이 있었습니다. 제가 분대장이 되기 전까진 분대에서 제일 낮은 계급이 방차통을 메는 악습이 있었습니다. 하지만 저는 분대장이 되기 이전부터 신병 혼자서 무거운 방차통을 메는 행위가 그 신병의 감정을 상하게 하는 부조리일 뿐만 아니라, 신병의 페이스에 묶여 분대의 등산 능력을 저해하는 행위라고 생각했습니다. 방차통을 번갈아가면서 메자고 말 했을때, 분대의 일병 상병들은 부정적인 반응을 보였습니다. 저는 말을 꺼낸 사람이 솔선수범을 보여야 한다고 생각했고, 제가 방차통을 처음으로 메고 감으로서 다른 분대원들도 번갈아서 방차통을 메도록 독려했습니다. 결과적으로, 이전보다 3배는 빠르게 통신선 설치를 완료할 수 있어 그 사이에 분대가 쉬는 시간을 만들 수 있었고, 간부들도 좋은 평가를 해주었습니다.</p>\n<p><strong>&nbsp;</strong></p>\n<p dir=\"ltr\">제가 분대장이 된 계기는 리더십보다는 주특기에 대한 지식의 영향이 커서 이전엔 사람을 이끄는데 자신감이 크지 않았습니다. 하지만, 이 행동을 계기로 분대장으로서 다른 사람들과 함께 일하는데 자신감을 얻을 수 있었습니다. 타인을 설득하면서 사소한 일이라도 서로 의견을 공유하는게 중요하다는 것을 깨달았고,&nbsp; 방차통을 처음으로 메고 출발함으로서 타인을 움직이기 위해선 자신이 솔선하여 움직여야 한다는 경험을 얻을 수 있었습니다.</p>\n<p>&nbsp;</p>','2024-02-15 07:17:44','2024-02-15 07:17:44'),(45,22,'지원 분야 관련 본인의 직무 역량 또는 전문성에 대해 기술하고, 입사 후 직무 전문가로서의 성장 Vision을 서술해주세요.','<p dir=\"ltr\">저의 직무역량이나 전문성은 컴퓨터 시스템 연구실에서 근무한 경험이 있는 컴퓨터공학과 졸업생으로서 C++, Java, Python 등 다양한 프로그래밍 언어에 대한 탄탄한 기반을 다져왔습니다. 또한 Linux 및 PyTorch로 작업한 경험을 통해 데이터 분석 및 기계 학습 기술을 개발할 수 있었습니다.</p>\n<p dir=\"ltr\">기술적인 능력 외에도 강력한 분석 능력과 문제 해결 능력을 개발했으며, 이는 LIG Nexwin 내 모든 역할에서 귀중한 자산이 될 것이라고 믿습니다. 저는 교육을 계속하고 최신 업계 동향 및 개발에 대한 최신 정보를 유지하기 위해 최선을 다하고 있으며 회사의 성공에 의미 있는 기여를 할 수 있다고 확신합니다.</p>\n<p dir=\"ltr\">입사 후 직무전문가로서의 성장 비전을 말씀드리자면, 무인방산소재 분야에서 지속적으로 역량과 전문성을 키우는 것이 목표입니다. 저는 업계에 대해 가능한 한 많이 배우고 최신 기술 발전에 대한 최신 정보를 유지하기 위해 최선을 다하고 있습니다.</p>\n<p dir=\"ltr\">단기적으로 저의 목표는 회사의 제품 및 솔루션을 직접 사용해 보고 동료 및 멘토와 강력한 관계를 구축하는 것입니다. 장기적으로는 무인방산소재 분야에서 인정받는 전문가가 되어 회사의 성장과 성공에 의미 있는 기여를 하고자 합니다.</p>\n<p dir=\"ltr\">저는 LIG넥스윈이 제 경력 목표를 달성하는 데 도움이 되는 이상적인 회사라고 믿으며, 혁신과 우수성에 대한 저의 열정을 공유하는 재능 있는 전문가 팀과 함께 일할 수 있는 기회를 갖게 되어 기쁩니다.</p>','2024-02-15 07:17:44','2024-02-15 07:17:44'),(46,23,'.','<p>.</p>','2024-02-15 07:19:14','2024-02-15 07:19:14'),(47,24,'.','<p>.</p>','2024-02-15 07:19:44','2024-02-15 07:19:44'),(48,25,'현대오토에버의 해당 직무에 지원한 이유와 앞으로 현대오토에버에서 키워 나갈 커리어 계획을 작성해주시기 바랍니다. (최소 500자 ~ 최대 1000자)','<p>[데이터베이스 모델링: 프로젝트 정책 반영의 경험]</p>\n<p>사이드 프로젝트들을 진행하면서 데이터베이스 모델링 능력을 키웠습니다. 그 과정에서 특히 데이터베이스를 설계함에 있어 프로젝트 혹은 팀 내의 정책을 반영할 수 있는 설계가 중요하다고 느꼈습니다. 매 프로젝트의 데이터 모델링을 하면서 이전 프로젝트에서 고민했던 정책을 데이터베이스에 추가할 수 있도록 고민했습니다. 예를 들어, 프로젝트를 진행하면서 회원가입 이력이나 신규 회원의 통계 데이터가 필요한 경험이 있었습니다. 데이터가 단순히 삭제되었다고 데이터베이스 내에서 물리적으로 삭제하는 것이 아니라 이력으로 관리해야 했습니다. 그래서 다음 프로젝트를 진행하면서 이력을 위해 Soft Delete를 구현하고자 했습니다. 이를 위해 삭제 여부 컬럼을 추가하여 데이터를 실제로 삭제하지 않는 식으로 설계했고, 통계 이외에도 과거 이력이나 디버깅 과정에서 데이터를 활용할 수 있었습니다. 이후 Soft Delete 구현에 따라 한 테이블에 많은 데이터가 쌓이게 되었고, 이에 데이터를 검색하는 과정이 오래 걸렸습니다. 그래서 조회 기능을 향상시키자 생각했습니다. 데이터베이스의 인덱스를 사용할 수 있도록 검색의 기준을 기본 키를 사용했습니다. 그리고 조회 요청의 페이지네이션을 LIMIT를 사용하지 않고, 기본 키 혹은 생성한 값을 바탕으로 커서 기반으로 페이지네이션을 진행하여 조회 요청에 대해 성능을 향상시켰습니다.<br>사이드 프로젝트들을 경험하면서 데이터베이스가 데이터 저장과 데이터가 가져야 하는 무결성을 함께 보장해야 한다는 것을 느꼈습니다. 그래서 대용량 데이터를 다루는 기술에 대해 공부하고 이를 실무에 적용해보고 싶습니다. 프로젝트와 정책에 최적화된 데이터를 통해 더 나은 결과를 이끌어 내고 싶습니다.</p>','2024-02-15 19:53:12','2024-02-15 19:53:12');
/*!40000 ALTER TABLE `statement_question` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-16  9:27:04
