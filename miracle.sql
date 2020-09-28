-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.5.5-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table miracle.post
CREATE TABLE IF NOT EXISTS `post` (
  `userName` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `post` varchar(50) DEFAULT NULL,
  `postedOn` varchar(50) DEFAULT NULL,
  `status` int(10) NOT NULL DEFAULT 0,
  `ID` int(11) DEFAULT NULL,
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  KEY `FK_post_registrationdata` (`ID`),
  KEY `pid` (`pid`),
  CONSTRAINT `FK_post_registrationdata` FOREIGN KEY (`ID`) REFERENCES `registrationdata` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- Dumping data for table miracle.post: ~8 rows (approximately)
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` (`userName`, `role`, `post`, `postedOn`, `status`, `ID`, `pid`) VALUES
	('mv', 'jvavd', 'dyusvdaj', '12-23-11', 2, 10, 1),
	('vmanigandla', 'backend developer', 'Nice to work with organisation', '12-23-19', 1, 5, 2),
	('vmanigandla', 'backend developer', 'Nice to work with organisation', '12-23-19', 1, 6, 3),
	('vmanigandla', 'backend developer', 'Nice to work with organisation', '12-23-19', 2, 5, 4),
	('guiwegiu', 'wefe', 'ergdrfdsgr', '12-23-11', 1, 5, 5),
	('esgdddg', 'sgdh', 'fdghre', '12-23-11', 1, 5, 6),
	('vmanigandla', 'backend developer', 'Nice to work with organisation', '12-23-19', 0, NULL, 7),
	('errh', 'dev', 'hioewhhier ', '12-23-21 ', 0, 9, 10);
/*!40000 ALTER TABLE `post` ENABLE KEYS */;

-- Dumping structure for table miracle.registrationdata
CREATE TABLE IF NOT EXISTS `registrationdata` (
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Gender` varchar(50) DEFAULT NULL,
  `UserName` varchar(50) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `ConformPassword` varchar(50) DEFAULT NULL,
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `phoneno` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

-- Dumping data for table miracle.registrationdata: ~15 rows (approximately)
/*!40000 ALTER TABLE `registrationdata` DISABLE KEYS */;
INSERT INTO `registrationdata` (`FirstName`, `LastName`, `Gender`, `UserName`, `Password`, `ConformPassword`, `ID`, `phoneno`) VALUES
	('Manigandla', 'Venkatesh', 'Male', 'Miracle1', 'Miracle@123', 'Miracle@123', 5, 985647588),
	('Mahesh', 'pina', 'Male', 'Miracle1', 'Miracle@123', 'Miracle@123', 6, 8795689),
	('surya', 'vinna', 'Male', 'Miracle1', 'Miracle@123', 'Miracle@123', 7, 789456254),
	('kalyan', 'nima', 'Male', 'Miracle1', 'Miracle@123', 'Miracle@123', 8, NULL),
	('Anil', 'pamaa', 'Male', 'Miracle1', 'Miracle@123', 'Miracle@123', 9, NULL),
	('kiran', 'mbbew', 'male', 'Miracle', 'Miracle@123', 'Miracle@123', 10, NULL),
	('pawan', 'mbbew', 'male', 'Miracle', 'Miracle@123', 'Miracle@123', 11, 478521369),
	('venkatesh', 'Mani', 'male', 'Miracle', 'Miracle@123', 'Miracle@123', 12, 987147655),
	('venky', 'venkatesh', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 13, 123423453),
	('ki', 'mankjnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 14, 123423453),
	('ki', 'mankjnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 15, 123423453),
	('sdge', 'egregrnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 16, 123423453),
	('sdge', 'egregrnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 17, 123423453),
	('sdge', 'egregrnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 18, 123423453),
	('sdge', 'egregrnk', 'Male', 'Miracle', 'Miracle@123', 'Miracle@123', 19, 123423453);
/*!40000 ALTER TABLE `registrationdata` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
