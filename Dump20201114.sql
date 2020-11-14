-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: machdubit
-- ------------------------------------------------------
-- Server version	8.0.20

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
  `product_id` varchar(200) NOT NULL,
  `product_name` varchar(200) DEFAULT NULL,
  `category` varchar(200) DEFAULT NULL,
  `shop` varchar(200) DEFAULT NULL,
  `price` varchar(200) DEFAULT NULL,
  `brief_desc` varchar(12000) DEFAULT NULL,
  `image1` varchar(200) DEFAULT NULL,
  `image2` varchar(200) DEFAULT NULL,
  `image3` varchar(200) DEFAULT NULL,
  `keywords` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('10','tp-link TD-W8961N 300mbps wireless adsl2+ router','routers','routers','35.0',NULL,'TD-W8961N-1.jpg','TD-W8961UN3.0_02_large_1529482317337p-600x600 (1).jpg','tp-link-td-w8961n-300mbps-wireless-n-adsl2-modem-router-4317-6828921-b298d3547f57518d2b63603f7f05b3ce-catalog.jpg_720x720q80.jpg_.webp',NULL),('11','tp-link 3g-4g 300mbps wireless n router','routers','routers','90.0','TP-LINK 300Mbps 3G Wireless N Router, Compatible with UMTS,HSPA,EVDO USB Modem, 3G,WAN Failover, 2T2R, 2.4GHz, 802.11n.g.b, 2x detachable antennas (Requires a USB 3G-4G modem - no SIM card slot in device)','phpThumb.jpg','unnamed (4).jpg','tp-link-tl-mr3420-3g-4g-wireless-n-router-500x500.jpg','routers'),('12','zte mf927u 4g lte mifi router','routers','routers','55.0',NULL,'zte-mf927u-4g-lte-mobile-wi-fi-modem-router-zte-smartphone-shop-buy-online.jpg','zte-mf927u-4g-lte-mobile-wi-fi-modem-router-zte-smartphone-shop-buy-online-5.jpg','d937290af7d4f91d3a9b351d17e7caa2.jpg_720x720q80.jpg_.webp','routers'),('13','zte mf920v 4g mobile hotspot','routers','routers','51.0','mobile mifi','mf920v_white_front_side.jpg','31Wo2dpSlpL.jpg','3178TodNNZL.jpg','mobile mifi'),('15','tp-link CPE510 5 GHz Wireless-N300 Outdoor Access Point','routers','routers','260.0',NULL,'1415208076_1089828.jpg','nwtlcpe210.jpg','69a.jpg','routers'),('16','tp-link TL-WA7510N 150mbps outdoor wireless access point',NULL,NULL,'255.0','5GHz Connection Clarity - Fewer Disturbances, Higher Performance,  High Transmission Power - Breaking down the Barriers of Wi-Fi,  15dBi High-gain Antenna, Passive PoE Support for Flexible Deployment, TL-WA7510N is designed to work in harsh environments, even in the some of the world’s most hostile climactic conditions. ','tp-link-wireless-5ghz-outdoor-15dbi-access-point-n150-tl-wa7510n-white-2.jpg','TP-Link-TL-WA7510N-5GHz-150Mbps-Outdoor-Wireless-Access-Point.jpg','tplink-accesspoint-wa7510n-11_1000x.jpg','routers'),('17','Huawei AP8130DN  Dual-band Outdoor Wireless Access point','routers','routers','1250.0','AP8130DN Mainframe(11ac,General AP Outdoor,3x3 Double Frequency,External Antenna)','huawei-ap8130dn-front.jpg','huawei-ap8130dn-interface-2.jpg','huawei-ap8130dn-interface-1.jpg','routers'),('18','Huawei AP6510DN-AGN 02354195 Industrial-grade Outdoor Wireless Access Point','routers','routers','975.0','	AP6510DN-AGN Mainframe(11n,General AP Outdoor,2x2 Double Frequency)','ap6510-500x500.jpg','HTB1Kk6IKFXXXXcPXpXXq6xXFXXXr.jpg','283.jpg','routers'),('19','Huawei AP6010DN-AGN Mainframe Indoor','routers','routers','520.0','routers','AP6010DN-AGN-600x600.jpg','huawei-ap6010dn-agn-back.jpg','huawei-ap6010dn-agn-bottom-2.jpg','routers'),('3','Huawei B315 ','routers','routers','135.0','routers','huaweib315-4g-lte_03.jpg','s-l300 (1).jpg','31Zj+3-GK1L.jpg','huaweib315-4g-lte_03.jpg'),('4','Huawei B315s-608 LTE','routers','routers','155.0','routers','Huawei-B315s-608-LTE-FDD700-850-1800-2100-2600-B1-3-5-7-28-Mhz-Mobile.jpg','$_10.jpg','Huawei-B315s-608-LTE-FDD700-850-1800-2100-2600-B1-3-5-7-28-Mhz-Mobile.jpg','Huawei-B315s-608-LTE-FDD700-850-1800-2100-2600-B1-3-5-7-28-Mhz-Mobile.jpg'),('5','Huawei B535-932 CAT 7 LTE CPE Wi-Fi router','routers','routers','111','routers','Huawei-B535.jpg','huawei-b535_2-550x550.jpg','huawei-b535-4g-router-11ac-wifi-sim-slot-cat7-lte.jpg','routers'),('6','Huawaei e5330 3g Mifi','routers','routers','29.0','mobile mifi','u_10024430.jpg','Original-Huawei-E5330-3G-Mobile-Wi-Fi-Hotspot-21-6-Mbps-White-6901443012329-31122018-01-p.jpg','download (7).jpg','routers'),('7','huawei e5576 4g travel mobile wifi','routers','routers','55.0','mobile mifi','Huawei-4G-Travel-Mobile-WIFI-Hotspot-Portable-Wireless-MIFI-Router-Pocket-WIFI-Repeater-Boost-Extender-WIFI.jpg','E5576_1.jpg','197264_IMG3.jpg','routers'),('8','huawei-e5573 4g lte mobile mifi','routers','routers','60.99','mobile mifi','huawei-e5573.jpg','Huawei-E5573-E5573S-320-4G-LTE-Mobile-Hotspot6.jpg','huawei-e5573-4g-modem-500x500.jpg','routers'),('9','huawei hg531 300mbps wireless adsl2+ router','routers','routers','40.0',NULL,'hg531-v1-10.jpg','orig.jpg','110502twpixwvezhvot84e.png','routers');
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

-- Dump completed on 2020-11-14 22:06:47
