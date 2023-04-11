ALTER USER "root"@"%" IDENTIFIED WITH mysql_native_password BY "Folk_password1311";

CREATE DATABASE  IF NOT EXISTS `numer_project_veryfun` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `numer_project_veryfun`;


CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `admin` VALUES (1,'folkSipp'),(2,'folkChai'),(3,'fernNit');

CREATE TABLE `bisection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equation` varchar(45) NOT NULL,
  `variable` varchar(2) NOT NULL,
  `xl` float NOT NULL,
  `xr` float NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `bisection` VALUES (1,'x^4-13','x',1.5,2,'2023-04-05 12:59:01'),(2,'x^2-3','x',1,2,'2023-04-06 09:22:02'),(3,'x^2-2x-8','x',1,4,'2023-04-06 09:32:16'),(4,'x^2+3x-9','x',-1,7,'2023-04-06 09:41:29'),(5,'4x^2+3x-3','x',0,1,'2023-04-08 13:20:20');

CREATE TABLE `cramer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matrix` varchar(5000) NOT NULL,
  `size` int NOT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `cramer` VALUES (1,'{\"ArrayA\":[[7,8],[9,10]],\"ArrayB\":[0,-2]}',2,'2023-04-07 00:15:43'),(2,'{\"ArrayA\":[[1,3,2],[-3,-1,-3],[2,3,1]],\"ArrayB\":[0,-2,-3]}',3,'2023-04-06 09:22:02'),(3,'{\"ArrayA\":[[1,3,0],[-3,-1,-3],[2,3,1]],\"ArrayB\":[0,-2,-3]}',3,'2023-04-06 09:32:16'),(4,'{\"ArrayA\":[[2,-3,1],[2,0,-1],[1,4,5]],\"ArrayB\":[0,1,-3]}',3,'2023-04-06 09:41:29'),(5,'{\"ArrayA\":[[1,-2,3],[2,0,3],[1,5,4]],\"ArrayB\":[0,1,-3]}',3,'2023-04-06 10:32:08'),(6,'{\"ArrayA\":[[3,4],[5,6]],\"ArrayB\":[0,1]}',2,'2023-04-08 12:59:01'),(7,'{\"ArrayA\":[[3,4],[5,6]],\"ArrayB\":[0,1]}',2,'2023-04-08 12:59:01'),(8,'{\"ArrayA\":[[1,2],[3,4]],\"ArrayB\":[-1,-2]}',2,'2023-04-06 09:32:16'),(9,'{\"ArrayA\":[[-3,2],[2,-1]],\"ArrayB\":[0,1]}',2,'2023-04-06 09:41:29'),(10,'{\"ArrayA\":[[2,-5],[7,3]],\"ArrayB\":[1,2]}',2,'2023-04-06 10:32:08');

CREATE TABLE `falseposition` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equation` varchar(45) NOT NULL,
  `variable` varchar(2) NOT NULL,
  `xl` float NOT NULL,
  `xr` float NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `falseposition` VALUES (1,'x^4-13','x',1.5,2,'2023-04-05 12:59:01'),(2,'y^4-13','y',0,10,'2023-04-06 09:22:02'),(3,'x^2-2x-8','x',1,4,'2023-04-06 09:32:16'),(4,'x^3-x-1','x',1,2,'2023-04-06 09:41:29'),(5,'x^2-3','x',1,2,'2023-04-06 10:32:08');

CREATE TABLE `onepoint` (
  `id` int NOT NULL AUTO_INCREMENT,
  `equation` varchar(45) NOT NULL,
  `variable` varchar(2) NOT NULL,
  `valueX` float NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`)
);