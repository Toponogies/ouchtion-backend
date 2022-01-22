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
  `end_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `init_price` bigint unsigned NOT NULL,
  `step_price` bigint unsigned NOT NULL DEFAULT '0',
  `buyer_id` int DEFAULT NULL,
  `is_sold` tinyint NOT NULL DEFAULT '0',
  `buy_price` bigint DEFAULT NULL,
  `current_price` bigint NOT NULL DEFAULT '0',
  `is_extendable` enum('0','1') NOT NULL,
  PRIMARY KEY (`product_id`),
  KEY `PRODUCT_CATEGORY_idx` (`category_id`),
  KEY `PRODUCT_SELLER_idx` (`seller_id`),
  KEY `PRODUCT_BUYER_idx` (`buyer_id`),
  FULLTEXT KEY `FULLTEXTSEARCH` (`name`),
  CONSTRAINT `PRODUCT_BUYER` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `PRODUCT_CATEGORY` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`),
  CONSTRAINT `PRODUCT_SELLER` FOREIGN KEY (`seller_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,2,2,'điện thoại Sony Xperia XZ1(4GB)','product_avatar/1483000808.jpeg','2019-12-31 17:00:01','2020-06-14 17:00:01',3000,0,6,1,NULL,10000,'1'),(2,2,2,'điện thoại lg v40 thin q 128G ram 6G chính hãng chơi game pubg free fire mượt','product_avatar/1966231942.jpeg','2019-12-31 17:00:01','2020-06-15 17:00:01',1000,200,1,1,NULL,11000,'1'),(3,2,3,'điện thoại oppo a37 neo 9 chinh hang 2 sim mới ram 3 g bộ nhớ 32 g học online chất','product_avatar/6452013178.jpeg','2019-12-31 17:00:01','2020-06-16 17:00:01',1000,100,7,1,NULL,14000,'0'),(4,4,3,'smart tv hd coocaa 32 inch wifi model 32 s 3 u miễn phi lắp đặt','product_avatar/4190206305.jpeg','2019-12-31 17:00:01','2020-06-17 17:00:01',8000,0,6,1,NULL,18000,'0'),(5,4,3,'tivi tcl full hd android 9 0 32 inch 32 l 52 hàng chính hãng miễn phi lắp dặt','product_avatar/6988850351.jpeg','2019-12-31 17:00:01','2020-06-18 17:00:01',1000,0,8,1,NULL,17000,'1'),(6,11,3,'đồng hồ nữ đeo tay wwoor cao cấp siêu xinh chống nước','product_avatar/4952732341.jpeg','2019-12-31 17:00:01','2020-06-19 17:00:01',1000,1000,5,1,NULL,6000,'0'),(7,13,4,'xe đạp địa hình trẻ em 20x22 inch có giỏ gác baga','product_avatar/6442403444.jpeg','2019-12-31 17:00:01','2020-06-20 17:00:01',100,50,7,1,NULL,800,'0'),(8,15,2,'máy ảnh medium format fujifilm gfx 50s chính hãng fujifilm việt nam','product_avatar/6881360794.jpeg','2019-12-31 17:00:01','2020-06-22 17:00:01',100,0,6,1,NULL,4000,'0'),(9,15,4,'máy ảnh fujifilm xs10 chính hãng fujifilm việt nam','product_avatar/9182094103.jpeg','2019-12-31 17:00:01','2020-07-14 17:00:01',1000,0,8,1,NULL,6000,'0'),(10,15,4,'camera hành trình xe máy giá rẻ sj4000 camera ngoài trời chống nước quay phim độ nét cao','product_avatar/9970320515.jpeg','2019-12-31 17:00:01','2020-07-14 17:00:01',1000,0,7,1,NULL,100,'1'),(11,6,2,'tpcn phong tê thấp cốt thống thuỷ an phát','product_avatar/1821765835.jpeg','2019-12-31 17:00:01','2020-08-14 17:00:01',70,0,6,1,NULL,2000,'1'),(12,7,2,'khẩu trang y tế 4 lớp khẩu trang kháng khuẩn cửu long hộp 50 cai kt y tế','product_avatar/6826457692.jpeg','2019-12-31 17:00:01','2020-09-14 17:00:01',10,0,1,1,NULL,80,'1'),(13,6,3,'? giảm cân đông y thái lan 150 viên ?','product_avatar/7919044720.jpeg','2019-12-31 17:00:01','2020-01-16 17:00:01',100,0,8,1,NULL,8000,'1'),(14,6,2,'vitamin e 1 vỉ 270 mg','product_avatar/2857895501.jpeg','2019-12-31 17:00:01','2020-09-14 17:00:01',10,0,8,1,NULL,22,'0'),(15,7,2,'hộp 50 kim chích máu sinocare','product_avatar/3737786087.jpeg','2019-12-31 17:00:01','2022-02-04 17:00:01',100,0,1,0,NULL,120,'0'),(16,7,3,'máy đo huyết áp điện tử bắp tay well med 53 sản xuất tại thụy sĩ bảo hành 5 năm','product_avatar/7678958217.jpeg','2019-12-31 17:00:01','2022-08-14 17:00:01',4000,0,8,0,NULL,7000,'0'),(17,7,2,'nhiều size áo bảo hộ phòng covid','product_avatar/2492798912.jpeg','2019-12-31 17:00:01','2022-09-14 17:00:01',19,0,5,0,NULL,80,'1'),(18,6,4,'protein sữa tăng cơ hộp 5 lbs 76 lần dùng','product_avatar/4239736680.jpeg','2019-12-31 17:00:01','2022-10-07 17:00:01',100,0,7,0,NULL,320,'1'),(19,6,3,'viên uống collagen sakure của nhật 120 viên làm đẹp da chống lão hóa','product_avatar/0290164181.jpeg','2019-12-31 17:00:01','2022-10-24 17:00:01',2000,0,8,0,NULL,9000,'1'),(20,16,4,'Ống kính MF Meike 35mm F1.4 - 35mm F1.7 chụp chân dung cho Sony - FujiFilm','product_avatar/1506250125.jpeg','2019-12-31 17:00:01','2020-09-23 17:00:01',3000,0,1,1,NULL,7000,'1');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-22 15:35:51
