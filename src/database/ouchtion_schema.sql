CREATE DATABASE  IF NOT EXISTS `ouchtion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
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
-- Table structure for table `bidding_approval_requests`
--

DROP TABLE IF EXISTS `bidding_approval_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bidding_approval_requests` (
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `is_processed` tinyint DEFAULT '1',
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `BIDDINGAPPROVALREQ_PRODUCT_idx` (`product_id`),
  CONSTRAINT `BIDDINGAPPROVALREQ_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `BIDDINGAPPROVALREQ_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bidding_permissions`
--

DROP TABLE IF EXISTS `bidding_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bidding_permissions` (
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `type` enum('APPROVE','DENY') NOT NULL,
  `reason` varchar(200) NOT NULL,
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `BINDDINGPERMISS_PRODUCT_idx` (`product_id`),
  CONSTRAINT `BINDDINGPERMISS_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `BINDDINGPERMISS_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `biddings`
--

DROP TABLE IF EXISTS `biddings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `biddings` (
  `bidding_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `bid_price` bigint NOT NULL,
  `max_price` bigint DEFAULT NULL,
  `time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_valid` tinyint DEFAULT '1',
  `is_auto_process` tinyint DEFAULT '0',
  PRIMARY KEY (`bidding_id`),
  KEY `BINDDING_USER_idx` (`user_id`),
  KEY `BINDDING_PRODUCT_idx` (`product_id`),
  CONSTRAINT `BINDDING_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `BINDDING_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `parent_category_id` int DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`category_id`),
  KEY `SUBCATEGORY_CATEGORY_idx` (`parent_category_id`),
  CONSTRAINT `SUBCATEGORY_CATEGORY` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_descriptions`
--

DROP TABLE IF EXISTS `product_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_descriptions` (
  `product_description_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `description` varchar(10000) NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_description_id`),
  KEY `PRODUCT_DESCRIPTION_idx` (`product_id`),
  CONSTRAINT `PRODUCT_DESCRIPTION` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `path` varchar(200) NOT NULL,
  `is_primary` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_image_id`),
  KEY `PRODUCTIMAGE_PRODUCT_idx` (`product_id`),
  CONSTRAINT `PRODUCTIMAGE_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `name` varchar(200) NOT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `start_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_at` timestamp NOT NULL,
  `init_price` bigint unsigned NOT NULL,
  `step_price` bigint unsigned NOT NULL DEFAULT '0',
  `buyer_id` int DEFAULT NULL,
  `is_sold` tinyint NOT NULL DEFAULT '0',
  `buy_price` bigint DEFAULT NULL,
  `current_price` bigint NOT NULL DEFAULT '0',
  PRIMARY KEY (`product_id`),
  KEY `PRODUCT_CATEGORY_idx` (`category_id`),
  KEY `PRODUCT_SELLER_idx` (`seller_id`),
  KEY `PRODUCT_BUYER_idx` (`buyer_id`),
  FULLTEXT KEY `FULLTEXTSEARCH` (`name`),
  CONSTRAINT `PRODUCT_BUYER` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `PRODUCT_CATEGORY` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `PRODUCT_SELLER` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rates` (
  `rate_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `type` enum('BUYER-SELLER','SELLER-BUYER') NOT NULL,
  `rate` int NOT NULL,
  `comment` varchar(300) NOT NULL,
  PRIMARY KEY (`rate_id`),
  KEY `RATE_PRODUCT_idx` (`product_id`),
  CONSTRAINT `RATE_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `rates_chk_1` CHECK (((`rate` = 1) or (`rate` = -(1))))
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `upgrage_seller_request`
--

DROP TABLE IF EXISTS `upgrage_seller_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upgrage_seller_request` (
  `user_id` int NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reason` varchar(300) NOT NULL,
  PRIMARY KEY (`time`),
  KEY `UPDATE_SELLER_USER_idx` (`user_id`),
  CONSTRAINT `UPDATE_SELLER_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `watchlists`
--

DROP TABLE IF EXISTS `watchlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watchlists` (
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`product_id`),
  KEY `WATCHLIST_PRODUCT_idx` (`product_id`),
  CONSTRAINT `WATCHLIST_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `WATCHLIST_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-03 22:11:17
