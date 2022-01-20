CREATE DATABASE  IF NOT EXISTS `ouchtion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ouchtion`;
-- MariaDB dump 10.19  Distrib 10.6.5-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: ouchtion
-- ------------------------------------------------------
-- Server version	10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rates`
--

DROP TABLE IF EXISTS `rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rates` (
  `rate_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `type` enum('BUYER-SELLER','SELLER-BUYER') NOT NULL,
  `rate` int(11) NOT NULL,
  `comment` varchar(300) NOT NULL,
  PRIMARY KEY (`rate_id`),
  KEY `RATE_PRODUCT_idx` (`product_id`),
  CONSTRAINT `RATE_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `rates_chk_1` CHECK (`rate` = 1 or `rate` = -1)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
INSERT INTO `rates` VALUES (1,1,'SELLER-BUYER',1,'good user'),(2,1,'BUYER-SELLER',1,'good product'),(3,2,'BUYER-SELLER',-1,'product is broken'),(4,3,'BUYER-SELLER',1,'good product'),(5,4,'BUYER-SELLER',1,'good product'),(6,5,'SELLER-BUYER',-1,'Người thắng không thanh toán'),(7,6,'BUYER-SELLER',1,'good product'),(8,7,'BUYER-SELLER',1,'good product'),(9,8,'BUYER-SELLER',1,'good product'),(10,9,'BUYER-SELLER',-1,'product is broken'),(11,10,'BUYER-SELLER',1,'good product'),(12,11,'BUYER-SELLER',1,'good product'),(13,12,'BUYER-SELLER',1,'good product'),(14,13,'SELLER-BUYER',-1,'Người thắng không thanh toán'),(15,14,'SELLER-BUYER',-1,'Người thắng không thanh toán'),(21,20,'BUYER-SELLER',1,'good product'),(22,2,'SELLER-BUYER',1,'good user'),(23,3,'SELLER-BUYER',1,'good user'),(24,4,'SELLER-BUYER',1,'good user'),(25,6,'SELLER-BUYER',1,'good user'),(26,7,'SELLER-BUYER',1,'good user'),(27,8,'SELLER-BUYER',1,'good user'),(28,9,'SELLER-BUYER',1,'good user'),(29,10,'SELLER-BUYER',1,'good user'),(30,11,'SELLER-BUYER',1,'good user'),(31,12,'SELLER-BUYER',1,'good user'),(32,20,'SELLER-BUYER',1,'good user');
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-21  6:37:33
