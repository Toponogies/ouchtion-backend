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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidding_approval_requests`
--

LOCK TABLES `bidding_approval_requests` WRITE;
/*!40000 ALTER TABLE `bidding_approval_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `bidding_approval_requests` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bidding_permissions`
--

LOCK TABLES `bidding_permissions` WRITE;
/*!40000 ALTER TABLE `bidding_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `bidding_permissions` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`bidding_id`),
  KEY `BINDDING_USER_idx` (`user_id`),
  KEY `BINDDING_PRODUCT_idx` (`product_id`),
  CONSTRAINT `BINDDING_PRODUCT` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `BINDDING_USER` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `biddings`
--

LOCK TABLES `biddings` WRITE;
/*!40000 ALTER TABLE `biddings` DISABLE KEYS */;
INSERT INTO `biddings` VALUES (1,1,1,5000,NULL,'2021-12-05 07:15:18',1),(2,5,1,5500,NULL,'2021-12-05 07:16:03',1),(3,1,1,5600,NULL,'2021-12-05 07:18:16',1),(4,5,1,5600,NULL,'2021-12-05 07:18:16',1),(5,6,1,10000,NULL,'2021-12-05 07:18:16',1),(6,1,2,5500,NULL,'2021-12-05 07:18:16',1),(7,5,2,5800,NULL,'2021-12-05 07:18:16',1),(8,1,2,6600,NULL,'2021-12-05 07:18:16',1),(9,5,2,7000,NULL,'2021-12-05 07:18:16',1),(10,1,2,11000,NULL,'2021-12-05 07:18:16',1),(11,7,3,3000,NULL,'2021-12-05 07:18:16',1),(12,5,3,3500,NULL,'2021-12-05 07:18:16',1),(13,1,3,5600,NULL,'2021-12-05 07:18:16',1),(14,5,3,6600,NULL,'2021-12-05 07:18:16',1),(15,7,3,14000,NULL,'2021-12-05 07:18:16',1),(16,1,4,10000,NULL,'2021-12-05 07:18:16',1),(17,5,4,15500,NULL,'2021-12-05 07:18:16',1),(18,1,4,15600,NULL,'2021-12-05 07:18:16',1),(19,5,4,15600,NULL,'2021-12-05 07:18:16',1),(20,6,4,18000,NULL,'2021-12-05 07:18:16',1),(21,1,5,15000,NULL,'2021-12-05 07:18:16',1),(22,5,5,15500,NULL,'2021-12-05 07:18:16',1),(23,1,5,15600,NULL,'2021-12-05 07:18:16',1),(24,5,5,16000,NULL,'2021-12-05 07:18:16',1),(25,8,5,17000,NULL,'2021-12-05 07:18:16',1),(26,5,6,5000,NULL,'2021-12-05 07:18:16',1),(27,6,6,5500,NULL,'2021-12-05 07:18:16',1),(28,7,6,5600,NULL,'2021-12-05 07:18:16',1),(29,8,6,5700,NULL,'2021-12-05 07:18:16',1),(30,5,6,6000,NULL,'2021-12-05 07:18:16',1),(31,1,7,500,NULL,'2021-12-05 07:18:16',1),(32,5,7,600,NULL,'2021-12-05 07:18:16',1),(33,6,7,700,NULL,'2021-12-05 07:18:16',1),(34,8,7,750,NULL,'2021-12-05 07:18:16',1),(35,7,7,800,NULL,'2021-12-05 07:18:16',1),(36,1,8,400,NULL,'2021-12-05 07:18:16',1),(37,5,8,500,NULL,'2021-12-05 07:18:16',1),(38,1,8,800,NULL,'2021-12-05 07:18:16',1),(39,5,8,3000,NULL,'2021-12-05 07:18:16',1),(40,6,8,4000,NULL,'2021-12-05 07:18:16',1),(41,7,9,5000,NULL,'2021-12-05 07:18:16',1),(42,8,9,5500,NULL,'2021-12-05 07:18:16',1),(43,5,9,5600,NULL,'2021-12-05 07:18:16',1),(44,1,9,5600,NULL,'2021-12-05 07:18:16',1),(45,8,9,6000,NULL,'2021-12-05 07:18:16',1),(46,1,10,5000,NULL,'2021-12-05 07:18:16',1),(47,5,10,5500,NULL,'2021-12-05 07:18:16',1),(48,7,10,5600,NULL,'2021-12-05 07:18:16',1),(49,6,10,5700,NULL,'2021-12-05 07:18:16',1),(50,7,10,100,NULL,'2021-12-05 07:18:16',1),(51,1,11,200,NULL,'2021-12-05 07:18:16',1),(52,5,11,300,NULL,'2021-12-05 07:18:16',1),(53,1,11,1000,NULL,'2021-12-05 07:18:16',1),(54,5,11,1200,NULL,'2021-12-05 07:18:16',1),(55,6,11,2000,NULL,'2021-12-05 07:18:16',1),(56,5,12,13,NULL,'2021-12-05 07:18:16',1),(57,6,12,16,NULL,'2021-12-05 07:18:16',1),(58,7,12,20,NULL,'2021-12-05 07:18:16',1),(59,8,12,60,NULL,'2021-12-05 07:18:16',1),(60,1,12,80,NULL,'2021-12-05 07:18:16',1),(61,1,13,5000,NULL,'2021-12-05 07:18:16',1),(62,5,13,5500,NULL,'2021-12-05 07:18:16',1),(63,6,13,5600,NULL,'2021-12-05 07:18:16',1),(64,7,13,5700,NULL,'2021-12-05 07:18:16',1),(65,8,13,8000,NULL,'2021-12-05 07:18:16',1),(66,1,14,11,NULL,'2021-12-05 07:18:16',1),(67,5,14,14,NULL,'2021-12-05 07:18:16',1),(68,1,14,17,NULL,'2021-12-05 07:18:16',1),(69,5,14,18,NULL,'2021-12-05 07:18:16',1),(70,8,14,22,NULL,'2021-12-05 07:18:16',1),(71,1,15,60,NULL,'2021-12-05 07:18:16',1),(72,5,15,70,NULL,'2021-12-05 07:18:16',1),(73,1,15,80,NULL,'2021-12-05 07:18:16',1),(74,5,15,90,NULL,'2021-12-05 07:18:16',1),(75,1,15,120,NULL,'2021-12-05 07:18:16',1),(76,6,16,5000,NULL,'2021-12-05 07:18:16',1),(77,5,16,5500,NULL,'2021-12-05 07:18:16',1),(78,7,16,5600,NULL,'2021-12-05 07:18:16',1),(79,1,16,5600,NULL,'2021-12-05 07:18:16',1),(80,8,16,7000,NULL,'2021-12-05 07:18:16',1),(81,1,17,20,NULL,'2021-12-05 07:18:16',1),(82,5,17,25,NULL,'2021-12-05 07:18:16',1),(83,1,17,60,NULL,'2021-12-05 07:18:16',1),(84,7,17,65,NULL,'2021-12-05 07:18:16',1),(85,5,17,80,NULL,'2021-12-05 07:18:16',1),(86,1,18,250,NULL,'2021-12-05 07:18:16',1),(87,5,18,255,NULL,'2021-12-05 07:18:16',1),(88,1,18,260,NULL,'2021-12-05 07:18:16',1),(89,5,18,300,NULL,'2021-12-05 07:18:16',1),(90,7,18,320,NULL,'2021-12-05 07:18:16',1),(91,1,19,5000,NULL,'2021-12-05 07:18:16',1),(92,5,19,6000,NULL,'2021-12-05 07:18:16',1),(93,1,19,6500,NULL,'2021-12-05 07:18:16',1),(94,5,19,7000,NULL,'2021-12-05 07:18:16',1),(95,8,19,9000,NULL,'2021-12-05 07:18:16',1),(96,1,20,5000,NULL,'2021-12-05 07:18:16',1),(97,5,20,5500,NULL,'2021-12-05 07:18:16',1),(98,1,20,5600,NULL,'2021-12-05 07:18:16',1),(99,6,20,5600,NULL,'2021-12-05 07:18:16',1),(100,1,20,7000,NULL,'2021-12-05 07:18:16',1);
/*!40000 ALTER TABLE `biddings` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,NULL,'Điện tử'),(2,1,'Điện thoại di động'),(3,1,'Laptop'),(4,1,'Tivi'),(5,NULL,'Sức khỏe'),(6,5,'Thực phẩm chức năng'),(7,5,'Y tế'),(8,5,'Thuốc'),(9,NULL,'Đồng hồ'),(10,9,'Đồng hồ nam'),(11,9,'Đồng hồ nữ'),(12,NULL,'Xe'),(13,12,'Xe đạp'),(14,NULL,'Máy ảnh & phụ kiện máy ảnh'),(15,14,'Máy ảnh'),(16,14,'Ống kính');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_descriptions`
--

DROP TABLE IF EXISTS `product_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_descriptions` (
  `product_description_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `description` varchar(1000) NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_init` tinyint DEFAULT '1',
  PRIMARY KEY (`product_description_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_descriptions`
--

LOCK TABLES `product_descriptions` WRITE;
/*!40000 ALTER TABLE `product_descriptions` DISABLE KEYS */;
INSERT INTO `product_descriptions` VALUES (1,20,'Ống kính MF Meike 35mm F1.4 chụp chân dung cho Sony - FujiFilm','2008-12-04 14:25:41',1),(2,20,'THông số kỹ thuật:','2021-12-04 14:26:32',1),(3,19,'✅Thành Phần:','2021-12-04 14:18:42',1),(4,19,'✅CÔNG DỤNG:','2021-12-04 14:28:42',1),(5,18,'Rule One Protein không tiếc chi phí khi xây dựng công thức của R1 Protein ™, chỉ tìm nguồn cung ứng tốt nhất, nguyên liệu tinh khiết nhất để dần trở thành một loại đạm whey tốt nhất. Tất cả các protein của chúng tôi đang thực sự instantized (đầy đủ kết tụ) để đảm bảo dễ dàng trộn, ngay cả trong điều kiện giá lạnh nhất của chất lỏng. Plus, hương vị của chúng tôi là phun khô, có hương sâu sắc hơn, hương vị phong phú hơn sẽ không tiêu tan, ngay cả với thời hạn sử dụng kéo dài.','2021-12-04 14:28:42',1),(6,17,'Quy cách đóng gói: 1 bộ / gói.','2021-12-04 14:30:58',1),(7,16,'------------------------------------','2021-12-04 14:32:41',1),(8,15,'sản phẩm là 1 hộp 50 kim chích máu sinocare, dùng cho hầu hết các loại bút của máy thu tiểu đường trên thị trường','2021-12-04 14:34:03',1),(9,14,'Xuất xứ: Nga','2021-12-04 14:34:59',1),(10,13,'GIẢM CÂN KHỬ MỠ ĐÔNG Y THÁI LAN 150 VIÊN','2021-12-04 14:35:57',1),(11,12,'❤️ Khẩu Trang Y Tế 4 lớp ❤️','2021-12-04 14:36:45',1),(12,11,'– Cách sử dụng','2021-12-04 14:37:55',1),(13,11,'– Đối tượng sử dụng','2021-12-04 14:38:25',1),(14,10,'Thông tin chi tiết: ','2021-12-04 14:39:34',1),(15,9,'Bộ xử lý hình ảnh X-Processor 4','2021-12-04 14:41:29',1),(16,8,'Bộ xử lý hình ảnh X-Processor 4','2021-12-04 14:41:29',1),(17,7,'Xe đạp địa hình trẻ em size 20-22-24 inch','2021-12-04 14:42:40',1),(18,6,'Brand: WWOOR/ Zhanai ','2021-12-04 14:43:57',1),(19,5,'Thông tin nổi bật:','2021-12-04 14:43:56',1),(20,5,'Thông tin nổi bật:','2021-12-04 14:44:56',1),(21,4,'• Hệ Điều Hành Android 9.0.','2021-12-04 14:46:24',1),(22,3,'ĐIỆN THOẠI OPPO A37m Ram 2G Bộ Nhớ 16G Màn Hình 5inch Nhỏ Gọn Chơi Game Xem Youtube Thoải Mái Sắc Nét','2021-12-04 14:49:28',1),(23,2,'•	LG V40 ThinQ mới Chính Hãng cấu hình cao, Chiến Game nặng PUBG-LIÊN QUÂN mượt','2021-12-04 14:50:13',1),(24,1,'Thông số kỹ thuật SONY XPERIA XZ1 Chính Hãng','2021-12-04 14:51:01',1);
/*!40000 ALTER TABLE `product_descriptions` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'product_image/1/0c2f185d43016329c8ba91ab0af99ae1.jpeg',1),(2,1,'product_image/1/5422ca82bf2afd29ac3f809547a2b6a6.jpeg',0),(3,1,'product_image/1/ee3d0bf927dad517132ceb26c7b5724d.jpeg',0),(4,2,'product_image/2/75eae694cab4303c8f36ae74581b3727.jpeg',1),(5,2,'product_image/2/923fb53647b59e19b19d94aacb665c28.jpeg',0),(6,2,'product_image/2/79496e363f66445788a6ee44102b73f3.jpeg',0),(7,2,'product_image/2/2997581e087897bfe582c98e6bce9b29.jpeg',0),(8,2,'product_image/2/a3ecc2012141d264167c8d707947a034.jpeg',0),(9,2,'product_image/2/a76a8e4ce557498d51788cf17d1b0d88.jpeg',0),(10,3,'product_image/3/1cc9aa50c3e176b40f929e269ed82e12.jpeg',1),(11,3,'product_image/3/2e2a42175d8a41072f08323553687112.jpeg',0),(12,3,'product_image/3/7a29b8bc3bc0ec3b6acc15ed508e2c70.jpeg',0),(13,3,'product_image/3/c83f26def30028a271bdcd36a3a93976.jpeg',0),(14,4,'product_image/4/92b93d516b2b37cc0fe9b37f1510547a.jpeg',1),(15,4,'product_image/4/997ab3a95a431a0f11b7eb40edd133c7.jpeg',0),(17,4,'product_image/4/c2f6d262c33017fd9c6d54a76dd41d21.jpeg',0),(18,5,'product_image/5/3a7ec697e4a325fb7310368dc4f5c15b.jpeg',1),(19,5,'product_image/5/9739712c5e146b9dccf5ccc175493cdd.jpeg',0),(20,5,'product_image/5/c68969ef4f6eab75c5336f0e8324e84f.jpeg',0),(21,5,'product_image/5/d7afa8aa778f882127177e71c2de7be1.jpeg',0),(22,1,'product_image/1/f1f347eff9330ec81996217b8e072aa7.jpeg',0),(23,1,'product_image/1/f6d72f38c450f4a6d23234aa966f718b.jpeg',0),(24,6,'product_image/6/1e2ae86530ca26655c0010738a9bc47f.jpeg',1),(25,6,'product_image/6/7e2b4be288f03d12b99cbb41f386690f.jpeg',0),(26,6,'product_image/6/9fb9ebc2dce9412c6df5c56245188c50.jpeg',0),(27,6,'product_image/6/31eae8c6813a4fa2a95afe56377a8da6.jpeg',0),(28,7,'product_image/7/8c0f9b2020e9018e1c4f1bad377348e3.jpeg',1),(29,7,'product_image/7/86ac88eda9bdd3fedb7cadf941f83e3f.jpeg',0),(30,7,'product_image/7/4446624704e0109f7780347ccbd1dc48.jpeg',0),(31,7,'product_image/7/b5f488f1315c12eb3ace3b1268b677da.jpeg',0),(32,8,'product_image/8/0cdd152fff3405cc630e0afc6a60e455.jpeg',1),(33,8,'product_image/8/24b26688398a0069f4c05ea44f93a244.jpeg',0),(34,8,'product_image/8/89a9abf07d2ce531f6b673ee3930901c.jpeg',0),(35,8,'product_image/8/6634d35dbe4e33a9e5d027c82e33c88a.jpeg',0),(36,9,'product_image/9/1ea7b2df9a4ba4b49a724f6aebda035e.jpeg',1),(37,9,'product_image/9/0830c56627d11f35be0ee14acd8faec7.jpeg',0),(38,9,'product_image/9/d770b146a612eb9945d4cf410e35cab1.jpeg',0),(39,9,'product_image/9/fb49c066208e7961690a42befaae1ec3.jpeg',0),(40,10,'product_image/10/56c26037942c10e088a4785cf45d623a.jpeg',1),(41,10,'product_image/10/142f8ba040695e46339f27633e4d24ef.jpeg',0),(42,10,'product_image/10/154ddd94afbe1d6f70be8da7ec15e560.jpeg',0),(43,10,'product_image/10/bfe9e64cd839999666bf7e4c93304968.jpeg',0),(44,11,'product_image/11/56d4e8a185f92a1d40b6c44e6c0284bd.jpeg',1),(45,11,'product_image/11/074a20f395803b154f243b389516af90.jpeg',0),(46,11,'product_image/11/eb290fa3d7cedf048ef0c1b6c119d9c5.jpeg',0),(47,11,'product_image/11/fc00d2653b9178213ddc4bd51f63464d.jpeg',0),(48,12,'product_image/12/0ac53bc54ccd4ea161e61f5454f524df.jpeg',1),(49,12,'product_image/12/7b379b84e785584888d936506d8dc83f.jpeg',0),(50,12,'product_image/12/914b00c1ca487f87d5eb5a57bdb44e51.jpeg',0),(51,13,'product_image/13/07d9eea9b1d5812291bf6ba168ba04ba.jpeg',1),(52,13,'product_image/13/19aa3b407b1bdaff2f54b52b1187d909.jpeg',0),(53,13,'product_image/13/79ba0b6394a46610a5c7363bb776d5f3.jpeg',0),(54,14,'product_image/14/6ed4660cdd2e750c801d45696deca755.jpeg',1),(55,14,'product_image/14/13a341b2347ea069fa12f74f47b1cda5.jpeg',0),(56,15,'product_image/15/5c0f401fdb39e7f9f808becf438cbae2.jpeg',1),(57,16,'product_image/16/06ffc8231bd610fe6caa653227e7ffd7.jpeg',1),(58,16,'product_image/16/6dac3634890ceaa96b7502d560bfbfe3.jpeg',0),(59,16,'product_image/16/87bf64477938bf48a9aca0a3abe2f96d.jpeg',0),(60,17,'product_image/17/349f09743a8db7c9b23880b675c3c6aa.jpeg',1),(61,17,'product_image/17/0d7efe8b63adf434995695271d577fd4.jpeg',0),(62,18,'product_image/18/5192c7dd413c828df5255cfee83e8b7d.jpeg',1),(63,19,'product_image/19/233bb97a920e459fb94560e03e4ffe1c.jpeg',1),(64,19,'product_image/19/a1a78bdb3bb08f05b565e70af906bbc5.jpeg',0),(65,20,'product_image/20/28fed8e995bd2293ffdeb06a33d85a37.jpeg',1),(66,20,'product_image/20/d8f3de0b610013493792e65d07c316cb.jpeg',0),(67,20,'product_image/20/dad1be0fb1afbb0dab3549404107e617.jpeg',0);
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

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
  `is_sold` tinyint NOT NULL,
  `buy_price` bigint DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,2,2,'điện thoại Sony Xperia XZ1(4GB)','product_avatar/1.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',3000,0,6,1,NULL),(2,2,2,'điện thoại lg v40 thin q 128G ram 6G chính hãng chơi game pubg free fire mượt','product_avatar/2.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,200,1,1,NULL),(3,2,3,'điện thoại oppo a37 neo 9 chinh hang 2 sim mới ram 3 g bộ nhớ 32 g học online chất','product_avatar/3.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,100,7,1,NULL),(4,4,3,'smart tv hd coocaa 32 inch wifi model 32 s 3 u miễn phi lắp đặt','product_avatar/4.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',8000,0,6,1,NULL),(5,4,3,'tivi tcl full hd android 9 0 32 inch 32 l 52 hàng chính hãng miễn phi lắp dặt','product_avatar/5.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,0,8,1,NULL),(6,11,3,'đồng hồ nữ đeo tay wwoor cao cấp siêu xinh chống nước','product_avatar/6.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,1000,5,1,NULL),(7,13,4,'xe đạp địa hình trẻ em 20x22 inch có giỏ gác baga','product_avatar/7.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',100,50,7,1,NULL),(8,15,2,'máy ảnh medium format fujifilm gfx 50s chính hãng fujifilm việt nam','product_avatar/8.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',100,0,6,1,NULL),(9,15,4,'máy ảnh fujifilm xs10 chính hãng fujifilm việt nam','product_avatar/9.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,0,8,1,NULL),(10,15,4,'camera hành trình xe máy giá rẻ sj4000 camera ngoài trời chống nước quay phim độ nét cao','product_avatar/10.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',1000,0,7,1,NULL),(11,6,2,'tpcn phong tê thấp cốt thống thuỷ an phát','product_avatar/11.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',70,0,6,1,NULL),(12,7,2,'khẩu trang y tế 4 lớp khẩu trang kháng khuẩn cửu long hộp 50 cai kt y tế','product_avatar/12.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',10,0,1,1,NULL),(13,6,3,'? giảm cân đông y thái lan 150 viên ?','product_avatar/13.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',100,0,8,1,NULL),(14,6,2,'vitamin e 1 vỉ 270 mg','product_avatar/14.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',10,0,8,1,NULL),(15,7,2,'hộp 50 kim chích máu sinocare','product_avatar/15.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',100,0,1,1,NULL),(16,7,3,'máy đo huyết áp điện tử bắp tay well med 53 sản xuất tại thụy sĩ bảo hành 5 năm','product_avatar/16.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',4000,0,8,1,NULL),(17,7,2,'nhiều size áo bảo hộ phòng covid','product_avatar/17.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',19,0,5,1,NULL),(18,6,4,'protein sữa tăng cơ hộp 5 lbs 76 lần dùng','product_avatar/18.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',100,0,7,1,NULL),(19,6,3,'viên uống collagen sakure của nhật 120 viên làm đẹp da chống lão hóa','product_avatar/19.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',2000,0,8,1,NULL),(20,16,4,'Ống kính MF Meike 35mm F1.4 - 35mm F1.7 chụp chân dung cho Sony - FujiFilm','product_avatar/20.jpeg','2019-12-31 17:00:01','2020-01-14 17:00:01',3000,0,1,1,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rates`
--

LOCK TABLES `rates` WRITE;
/*!40000 ALTER TABLE `rates` DISABLE KEYS */;
/*!40000 ALTER TABLE `rates` ENABLE KEYS */;
UNLOCK TABLES;

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
  `role` enum('bidder','seller','admin') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'nvchi@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Văn Chí','Số 20 Cộng Hòa,TPHCM','1986-11-23 00:00:00',1,'bidder'),(2,'nthai@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Thị Hai','Nhà Thuốc Eco, 413 Hai Bà Trưng, Phường 8, Quận 3, TPHCM','1990-10-24 00:00:00',1,'seller'),(3,'nttram@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Thị Trâm','Số 123 Ba Đình Hà Nội','1990-01-13 00:00:00',1,'seller'),(4,'dqphong@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Đoàn Quý Phong','Số 234 Cầu Giấy Hà Nội','1980-04-13 00:00:00',1,'seller'),(5,'ntbchau@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Thị Bảo Châu','Số 1 Hoàn Kiếm Hà Nội','1983-05-13 00:00:00',1,'bidder'),(6,'ngbao@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Ngô Gia Bảo','Số 12 Nhà Bè TPHCM','1988-04-13 00:00:00',1,'bidder'),(7,'nmhao@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Minh Hào','Số 18 Nguyễn Cư Trinh Quận 1  TPHCM','2000-08-01 00:00:00',1,'bidder'),(8,'ntchi@gmail.com','$2y$10$/hwsO/pQ0U6BK4aWfXDM/eItQBLzlHfrLpcU5We5K.iuCWjmbrPtK','Nguyễn Thị Chi','Số 334 Nguyễn Trãi Quận 1 TPHCM','1996-03-30 00:00:00',1,'bidder'),(9,'admin@gmail.com','$2y$10$VWgqbfrfXsFaaeE6.1JlV.r1F5JiGocNfGjZ1eUtZEQGfhrJD95AC','admin','secret','2000-02-20 00:00:00',1,'admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watchlists`
--

LOCK TABLES `watchlists` WRITE;
/*!40000 ALTER TABLE `watchlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `watchlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ouchtion'
--

--
-- Dumping routines for database 'ouchtion'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-12-05 15:06:16
