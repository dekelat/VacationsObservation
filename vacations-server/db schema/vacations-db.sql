-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: vacations
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `followed_vacations`
--

DROP TABLE IF EXISTS `followed_vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followed_vacations` (
  `user_id` bigint NOT NULL,
  `vacation_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`vacation_id`),
  KEY `FK_vacations_followed_vacations_idx` (`vacation_id`),
  CONSTRAINT `FK_users_followed_vacations` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_vacations_followed_vacations` FOREIGN KEY (`vacation_id`) REFERENCES `vacations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followed_vacations`
--

LOCK TABLES `followed_vacations` WRITE;
/*!40000 ALTER TABLE `followed_vacations` DISABLE KEYS */;
INSERT INTO `followed_vacations` VALUES (2,1),(3,2),(4,2),(2,3),(2,4),(2,6),(3,6),(4,6),(3,7);
/*!40000 ALTER TABLE `followed_vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_name` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `user_type` varchar(45) NOT NULL DEFAULT 'CUSTOMER',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'dekelat','62f40c675a55b4b401cffd0c452b7038','Dekel','Atzami','ADMIN'),(2,'shifra3','3af5a36df0d5e63e3e7a859a4a01ba38','Liron','Bilya','CUSTOMER'),(3,'dude','3af5a36df0d5e63e3e7a859a4a01ba38','Dolev','Atzami','CUSTOMER'),(4,'lilly','3af5a36df0d5e63e3e7a859a4a01ba38','Lilach','Krasner','CUSTOMER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `destination` varchar(120) NOT NULL,
  `description` varchar(800) NOT NULL,
  `image_url` varchar(250) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Austria','Silvretta Arena Ski Resort.\nJoin us for a day of backcountry trekking. We will explore snow-covered trails and make some winter memories, all while strapped snuggly into a pair of skis.','http://skiexpert.com/lib/img/resort/31/view_700.jpg','2021-02-09','2021-02-13',1850),(2,'Oregon, US','Whether you\'re testing the water for the first time or are ready to hang ten from the get go, join us for a week of frolicking on the Oregon Coast. Dive into a day of surf, salt, and seriously rad people.','https://oregonisforadventure.com/wp-content/uploads/2019/10/oregon-coast-road-trip-itinerary.jpg','2021-07-26','2021-08-02',1500),(3,'Japan','Japan Express: Osaka to Tokyo \nFrom the Buddhist monks of Kōyasan to the high rollers of Tokyo, see the many faces of Japan on this condensed tour beginning in Osaka. Savour the region’s culinary delicacies and the beautiful views at Mt Fuji. You\'ll stay in a traditional ryokan and really soak up local culture in onsen hot springs. A great combination of the traditional and the contemporary, this adventure provides a taste of the rich culture of Japan.','https://cdn.bcdtravel.com/move-global/wp-content/uploads/sites/142/Move_MarketMonitor_Japan_slider_May2019.jpg','2021-04-10','2021-04-19',2059),(4,'France','Paris and Nice by Train\nAn excellent combination of cities in France! Visit Paris (The city of lights with impressive monuments, museums, culture and gastronomy), then continue to Nice (capital and gateway to the Riviera, with its brilliant sunshine and relaxed living). Travel between them with the TGV train. ','https://www.fodors.com/wp-content/uploads/2018/10/HERO_UltimateParis_Heroshutterstock_112137761.jpg','2021-04-10','2021-04-18',1039),(5,'France','Visit Bordeaux (hub of the famed wine-growing region, is a port city on the Garonne River in southwestern France), Toulouse, Carcassonne (a hilltop town in southern Franceâ€™s Languedoc area, is famous for its medieval citadel), Avignon and Nice (capital on the Riviera; glamorous with rocky beaches, famous cafes and brilliant sunshine) with a rent a car. ','https://d1vp8nomjxwyf1.cloudfront.net/wp-content/uploads/sites/66/2016/12/07172835/Bordeaux-bourse.jpg','2021-05-02','2021-05-11',1209),(6,'England','London Getaway\nAn undeniably unique adventure in the fantastic England with a pleasant stay in London. Iconic landmarks, centuries of history, world-class shopping and achingly cool fashion, arts and food scenes, museums and art galleries. A walk along the South Bank will take you past Big Ben and the Houses of Parliament, the London Eye, Tate Modern, Shakespeare`s Globe, St Paul`s Cathedral and Tower Bridge. The evenings offer from high-end nightclubs of Chelsea and Mayfair to cool clubs in Soho and Camden.','https://pictures.tripmasters.com/images/apkg/972/london_-_london_bridge-985427-500.jpg','2021-05-08','2021-05-23',2600),(7,'Japan','Travel to the capital of Japan and one of the largest cities in the world , Tokyo . Experience the elegant luxurious dining side of Tokyo from presentation to atmosphere. Do not miss the Museums and Temples in this city like Sensoji Temple that will show you about the history and tradition of this city.','https://www.gotokyo.org/en/plan/tokyo-outline/images/main.jpg','2021-07-03','2021-07-09',1200),(8,'France','A perfect combination of charming cities and breathtaking views across France with this unique opportunity to explore on your own with a rental car; Begin in Paris (the romantic City of Lights; shopping, dining, museums), Tours, then Lyon, before heading to Nimes; next Aix-en-Provence and last Nice (capital on the Riviera; glamorous with rocky beaches, famous cafes and brilliant sunshine).','https://pictures.tripmasters.com/images/sightseeing/france/lyon-beaujolaisvineyardsdayview-500.jpg','2021-07-20','2021-07-27',999),(9,'Italy','Rome Getaway\nAn in depth vacation to one of the most enduring cities in Europe! Rome is the heart of Italy; once the center of the world`s greatest empire, the Eternal City has some of the finest art and architecture to survive from the last 2,000 years. Its rich and full history is not only represented by its breathtaking architecture but by its typical, narrow streets and alleyways, tradition and culture. Rome has a vibrant nightlife and is also regarded as one of the fashion capitals of the world.','https://cdn.contexttravel.com/image/upload/c_fill,q_60,w_2600/v1549318570/production/city/hero_image_2_1549318566.jpg','2021-03-13','2021-03-18',1100),(14,'Australia','Melbourne - Cairns - Sydney by Air\nAussie Highligths!!!... Flight into Melbourne, Australia\'s sporting and cultural capital, which is dynamic, stylish and cosmopolitan. Then visit Cairns, gateway to the Great Barrier Reef, enjoy its clear, tropical water and explosion of colors. Up next is Sydney with its spectacular harbor, the world-famous Opera House, fabulous shopping, cosmopolitan cuisine, and lively nightlife. Definitely a trip not to be missed.','https://cdn1.matadornetwork.com/blogs/1/2011/05/Sydney-Australia-cityscape-destination-1200x900.jpg','2021-02-17','2021-02-25',2239),(15,'Spain','Madrid and Barcelona by Train\nSpain is recognized throughout Europe for its distinctive style and contribution to art; and these two cities highlight that commitment. Visit Madrid (lively, energetic and vibrant - with a well earned reputation for its nightlife and cultural contributions with its diverse Spanish museums) and Barcelona (with dramatic buildings by famed artists Gaudi, the stunning Gothic Quarter and always on the biting edge of fashion, food, style and music while retaining and celebrating its own unique heritage). Catch a train between these cities. ','https://i1.wp.com/www.traveloffpath.com/wp-content/uploads/2020/08/Spain-COVID-19-Entry-Requirements-Travelers-Need-To-Know.jpg?resize=759%2C500&ssl=1','2021-05-02','2021-05-06',1020),(19,'Switzerland','Grand Tour of Switzerland\nArrive in beautiful Geneva (set on the banks of a lake, filled with parks and promenades, the city becomes a virtual garden in summer). Drive to Montreux, continue to Interlaken. Then on to Lucerne (On the north end of the Lake Lucerne within sight of Mount Pilatus and Rigi, with narrow cobblestone streets, covered bridges, frescoed houses, and fountains) - continue to Bern(One of the oldest and loveliest cities in Europe, with origins going back to the 12th century. It is on the UNESCO list of World Cultural Heritage) and finally, Zurich (stunningly beautiful with a charming old town where cobbled streets of the 12th-century Old Town are pristine and the blue trams run reliably).','https://cdn.britannica.com/65/162465-050-9CDA9BC9/Alps-Switzerland.jpg','2021-06-14','2021-06-18',1059),(20,'Costa Rica','Arenal Volcano - Monteverde - Guanacaste Beaches\nThe classic route to see Costa Rica\'s most popular highlights: Arenal\'s active Volcano and its hot springs, unique fauna and adrenaline filled activities in the Monteverde Cloud Forest and relaxation surrounded by vegetation at the Guanacaste Beaches.','https://cdn.kimkim.com/files/a/content_articles/featured_photos/92705cf3185366d4659f32198f2f8f68991408a8/big-74a0644b9b02346d4019fb6f16d57615.jpg','2021-07-18','2021-07-22',1000),(21,'Hawaii','Maui and Kauai \nHawaiian Paradise! Visit the energetic and exotic island of Maui, home of crystal clear beaches, famous volcanoes, and the most exciting outdoor activities. Then fly to Kauai, named\'The Garden Isle\' and pamper all of your senses in this alluring island. Either exploring the Waimea Canyon Park or catching a glimpse of their extraordinary spouting horn this is a place not to be missed!!!','https://mauiinn.com/wp-content/uploads/2020/02/maui-in-may-pailoa-beach.jpg','2021-06-17','2021-06-20',960),(22,'Fiji','Diving Adventure in Fiji (Nadi)\nThe Fijian Islands are encircled by a huge reef. Within its protected waters are thousands of scuba dive sites and one of them is the Aqua Trek Bega in Pacific Harbour. This area is home to the world`s most diverse shark feed in the world, Aqua Trek`s Ultimate Shark Encounter. Inmerse yourself in this adventure and discover a wonderful marine life.','https://cdn.budgetyourtrip.com/images/photos/headerphotos/large/fiji_nandi.jpg','2021-06-22','2021-06-26',1100);
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-02 19:16:43
