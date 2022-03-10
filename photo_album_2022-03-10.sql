# ************************************************************
# Sequel Ace SQL dump
# Version 20029
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: eu-cdbr-west-02.cleardb.net (MySQL 5.6.50-log)
# Database: heroku_c72586bab1435b8
# Generation Time: 2022-03-10 12:17:36 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table albums
# ------------------------------------------------------------

DROP TABLE IF EXISTS `albums`;

CREATE TABLE `albums` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `albums` WRITE;
/*!40000 ALTER TABLE `albums` DISABLE KEYS */;

INSERT INTO `albums` (`id`, `title`, `user_id`)
VALUES
	(1,'Confetti Album',1),
	(2,'Happy Album',1),
	(3,'Confetti\'R\'Us',1),
	(4,'My new album',2),
	(5,'Mitt nya album',2),
	(6,'Another awesome album',2),
	(11,'Heroku album',2),
	(21,'My heroku user album',11);

/*!40000 ALTER TABLE `albums` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table albums_photos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `albums_photos`;

CREATE TABLE `albums_photos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `photo_id` int(10) unsigned DEFAULT NULL,
  `album_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `albums_photos` WRITE;
/*!40000 ALTER TABLE `albums_photos` DISABLE KEYS */;

INSERT INTO `albums_photos` (`id`, `photo_id`, `album_id`)
VALUES
	(1,1,4),
	(2,2,4),
	(3,3,4),
	(11,11,21);

/*!40000 ALTER TABLE `albums_photos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table photos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;

INSERT INTO `photos` (`id`, `title`, `url`, `comment`, `user_id`)
VALUES
	(1,'Confetti Photo #1','https://images.unsplash.com/photo-1492684223066-81342ee5ff30','Confetti',2),
	(2,'Confetti Photo #2','https://images.unsplash.com/photo-1481162854517-d9e353af153d','Confetti #2',2),
	(3,'Confetti Photo #3','https://images.unsplash.com/photo-1514525253161-7a46d19cd819','Confetti #3',2),
	(4,'My first photo','https://images.unsplash.com/photo-563635443435-81342ee5ff30','Best photo ever',2),
	(11,'A beautiful day','https://images.unsplash.com/photo-7263762371-81342ee5ff30','Heroku rules',11),
	(31,'Photo #1','https://images.unsplash.com/photo-7263762371-81342ee5ff30','This is my number 1 photo',11),
	(41,'Photo #2','https://images.unsplash.com/photo-7263762371-81342ee5ff30','This is my number 2 photo',11);

/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `email`, `password`, `first_name`, `last_name`)
VALUES
	(1,'user@email.com','password','user1','user1'),
	(2,'email@email.com','$2b$10$3oC4z5T.lbc6Ef/DObpKzukdJC9At4EjonEHYTGBqEX6VRGcKKFXy','Julia','Jespersdotter'),
	(3,'unknown@email.com','$2b$10$w0W33eeToCfPcIHBqQL/ruqMTRg3BydtnA0VOtK3/bx3eTKc7m10C','notJulia','notJespersdotter'),
	(11,'heroku@email.com','$2b$10$ApJPAQlUUtPBUIJM75lpMunpFaq3hVMx2jOcFatGfpd5.L7pRMbK6','Gilbert','Hund');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
