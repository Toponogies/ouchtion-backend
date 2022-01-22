CREATE DATABASE  IF NOT EXISTS `ouchtion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ouchtion`;
-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: ouchtion
-- ------------------------------------------------------
-- Server version	8.0.26

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `address` varchar(100) DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `is_active` tinyint NOT NULL DEFAULT '0',
  `role` enum('bidder','seller','admin') NOT NULL DEFAULT 'bidder',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nvchi@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Văn Chí','Số 20 Cộng Hòa,TPHCM','1986-11-23 00:00:00',1,'bidder'),(2,'nthai@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Thị Hai','Nhà Thuốc Eco, 413 Hai Bà Trưng, Phường 8, Quận 3, TPHCM','1990-10-24 00:00:00',1,'seller'),(3,'nttram@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Thị Trâm','Số 123 Ba Đình Hà Nội','1990-01-13 00:00:00',1,'seller'),(4,'dqphong@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Đoàn Quý Phong','Số 234 Cầu Giấy Hà Nội','1980-04-13 00:00:00',1,'seller'),(5,'ntbchau@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Thị Bảo Châu','Số 1 Hoàn Kiếm Hà Nội','1983-05-13 00:00:00',1,'bidder'),(6,'ngbao@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Ngô Gia Bảo','Số 12 Nhà Bè TPHCM','1988-04-13 00:00:00',1,'bidder'),(7,'nmhao@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Minh Hào','Số 18 Nguyễn Cư Trinh Quận 1  TPHCM','2000-08-01 00:00:00',1,'bidder'),(8,'ntchi@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','Nguyễn Thị Chi','Số 334 Nguyễn Trãi Quận 1 TPHCM','1996-03-30 00:00:00',1,'bidder'),(9,'admin@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','admin','secret','2000-02-20 00:00:00',1,'admin'),(43,'hathehien12a2@gmail.com','$2b$10$R81S2GrOminRPbVQX7u0..sQXI0xiTNnxoij8c0UT6WuSF2gb7s7y','abc','string',NULL,1,'bidder');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-22 21:54:40
