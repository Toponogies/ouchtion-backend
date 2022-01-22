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
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_image_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `path` varchar(200) NOT NULL,
  PRIMARY KEY (`product_image_id`),
  KEY `PRODUCTIMAGE_PRODUCT_idx` (`product_id`),
  CONSTRAINT `PRODUCTIMAGE_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'product_image/1/0c2f185d43016329c8ba91ab0af99ae1.jpeg'),(2,1,'product_image/1/5422ca82bf2afd29ac3f809547a2b6a6.jpeg'),(3,1,'product_image/1/ee3d0bf927dad517132ceb26c7b5724d.jpeg'),(4,2,'product_image/2/75eae694cab4303c8f36ae74581b3727.jpeg'),(5,2,'product_image/2/923fb53647b59e19b19d94aacb665c28.jpeg'),(6,2,'product_image/2/79496e363f66445788a6ee44102b73f3.jpeg'),(7,2,'product_image/2/2997581e087897bfe582c98e6bce9b29.jpeg'),(8,2,'product_image/2/a3ecc2012141d264167c8d707947a034.jpeg'),(9,2,'product_image/2/a76a8e4ce557498d51788cf17d1b0d88.jpeg'),(10,3,'product_image/3/1cc9aa50c3e176b40f929e269ed82e12.jpeg'),(11,3,'product_image/3/2e2a42175d8a41072f08323553687112.jpeg'),(12,3,'product_image/3/7a29b8bc3bc0ec3b6acc15ed508e2c70.jpeg'),(13,3,'product_image/3/c83f26def30028a271bdcd36a3a93976.jpeg'),(14,4,'product_image/4/92b93d516b2b37cc0fe9b37f1510547a.jpeg'),(15,4,'product_image/4/997ab3a95a431a0f11b7eb40edd133c7.jpeg'),(17,4,'product_image/4/c2f6d262c33017fd9c6d54a76dd41d21.jpeg'),(18,5,'product_image/5/3a7ec697e4a325fb7310368dc4f5c15b.jpeg'),(19,5,'product_image/5/9739712c5e146b9dccf5ccc175493cdd.jpeg'),(20,5,'product_image/5/c68969ef4f6eab75c5336f0e8324e84f.jpeg'),(21,5,'product_image/5/d7afa8aa778f882127177e71c2de7be1.jpeg'),(22,1,'product_image/1/f1f347eff9330ec81996217b8e072aa7.jpeg'),(23,1,'product_image/1/f6d72f38c450f4a6d23234aa966f718b.jpeg'),(24,6,'product_image/6/1e2ae86530ca26655c0010738a9bc47f.jpeg'),(25,6,'product_image/6/7e2b4be288f03d12b99cbb41f386690f.jpeg'),(26,6,'product_image/6/9fb9ebc2dce9412c6df5c56245188c50.jpeg'),(27,6,'product_image/6/31eae8c6813a4fa2a95afe56377a8da6.jpeg'),(28,7,'product_image/7/8c0f9b2020e9018e1c4f1bad377348e3.jpeg'),(29,7,'product_image/7/86ac88eda9bdd3fedb7cadf941f83e3f.jpeg'),(30,7,'product_image/7/4446624704e0109f7780347ccbd1dc48.jpeg'),(31,7,'product_image/7/b5f488f1315c12eb3ace3b1268b677da.jpeg'),(32,8,'product_image/8/0cdd152fff3405cc630e0afc6a60e455.jpeg'),(33,8,'product_image/8/24b26688398a0069f4c05ea44f93a244.jpeg'),(34,8,'product_image/8/89a9abf07d2ce531f6b673ee3930901c.jpeg'),(35,8,'product_image/8/6634d35dbe4e33a9e5d027c82e33c88a.jpeg'),(36,9,'product_image/9/1ea7b2df9a4ba4b49a724f6aebda035e.jpeg'),(37,9,'product_image/9/0830c56627d11f35be0ee14acd8faec7.jpeg'),(38,9,'product_image/9/d770b146a612eb9945d4cf410e35cab1.jpeg'),(39,9,'product_image/9/fb49c066208e7961690a42befaae1ec3.jpeg'),(40,10,'product_image/10/56c26037942c10e088a4785cf45d623a.jpeg'),(41,10,'product_image/10/142f8ba040695e46339f27633e4d24ef.jpeg'),(42,10,'product_image/10/154ddd94afbe1d6f70be8da7ec15e560.jpeg'),(43,10,'product_image/10/bfe9e64cd839999666bf7e4c93304968.jpeg'),(44,11,'product_image/11/56d4e8a185f92a1d40b6c44e6c0284bd.jpeg'),(45,11,'product_image/11/074a20f395803b154f243b389516af90.jpeg'),(46,11,'product_image/11/eb290fa3d7cedf048ef0c1b6c119d9c5.jpeg'),(47,11,'product_image/11/fc00d2653b9178213ddc4bd51f63464d.jpeg'),(48,12,'product_image/12/0ac53bc54ccd4ea161e61f5454f524df.jpeg'),(49,12,'product_image/12/7b379b84e785584888d936506d8dc83f.jpeg'),(50,12,'product_image/12/914b00c1ca487f87d5eb5a57bdb44e51.jpeg'),(51,13,'product_image/13/07d9eea9b1d5812291bf6ba168ba04ba.jpeg'),(52,13,'product_image/13/19aa3b407b1bdaff2f54b52b1187d909.jpeg'),(53,13,'product_image/13/79ba0b6394a46610a5c7363bb776d5f3.jpeg'),(54,14,'product_image/14/6ed4660cdd2e750c801d45696deca755.jpeg'),(55,14,'product_image/14/13a341b2347ea069fa12f74f47b1cda5.jpeg'),(56,15,'product_image/15/5c0f401fdb39e7f9f808becf438cbae2.jpeg'),(57,16,'product_image/16/06ffc8231bd610fe6caa653227e7ffd7.jpeg'),(58,16,'product_image/16/6dac3634890ceaa96b7502d560bfbfe3.jpeg'),(59,16,'product_image/16/87bf64477938bf48a9aca0a3abe2f96d.jpeg'),(60,17,'product_image/17/349f09743a8db7c9b23880b675c3c6aa.jpeg'),(61,17,'product_image/17/0d7efe8b63adf434995695271d577fd4.jpeg'),(62,18,'product_image/18/5192c7dd413c828df5255cfee83e8b7d.jpeg'),(63,19,'product_image/19/233bb97a920e459fb94560e03e4ffe1c.jpeg'),(64,19,'product_image/19/a1a78bdb3bb08f05b565e70af906bbc5.jpeg'),(65,20,'product_image/20/28fed8e995bd2293ffdeb06a33d85a37.jpeg'),(66,20,'product_image/20/d8f3de0b610013493792e65d07c316cb.jpeg'),(67,20,'product_image/20/dad1be0fb1afbb0dab3549404107e617.jpeg');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
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
