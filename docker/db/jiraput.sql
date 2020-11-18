-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 24, 2020 at 10:31 AM
-- Server version: 5.7.29-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET time_zone = "+2:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `projectdb`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`admin`@`%` PROCEDURE `zmien_nazwe_zespolu` (IN `stary` VARCHAR(63), IN `nowy` VARCHAR(63))  BEGIN
	INSERT INTO `zespol`(`zespol`.`nazwa`, `zespol`.`liczba_czlonkow`) VALUES (nowy, 0);
    UPDATE `pracownik`SET `pracownik`.`zespol`=nowy WHERE `pracownik`.`zespol`=stary;
    DELETE FROM `zespol` WHERE `zespol`.`nazwa`=stary;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `example`
--

CREATE TABLE `example` (
	`id` int NOT NULL,
	`active` tinyint(1) NOT NULL,
	`description` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


INSERT INTO `example` (`id`, `active`, `description`) VALUES
(1, 1, 'Example'),
(2, 0, 'Test');


CREATE TABLE `pracownik` (
  `login` varchar(31) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `token` varchar(255),
  `imie` varchar(31) NOT NULL,
  `nazwisko` varchar(31) NOT NULL,
  `pensja` float NOT NULL,
  `stanowisko` varchar(31) NOT NULL,
  `zespol` varchar(63)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `pracownik`
--
DELIMITER $$
CREATE TRIGGER `after_delete_pracownik` AFTER DELETE ON `pracownik` FOR EACH ROW UPDATE zespol SET liczba_czlonkow=liczba_czlonkow-1 WHERE nazwa=OLD.zespol
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_insert_pracownik` AFTER INSERT ON `pracownik` FOR EACH ROW UPDATE zespol SET liczba_czlonkow=liczba_czlonkow+1 WHERE nazwa=NEW.zespol
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_update_pracownik` AFTER UPDATE ON `pracownik` FOR EACH ROW BEGIN
    UPDATE zespol SET liczba_czlonkow=liczba_czlonkow+1 WHERE nazwa=NEW.zespol;
    UPDATE zespol SET liczba_czlonkow=liczba_czlonkow-1 WHERE nazwa=OLD.zespol;
  END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `stanowisko`
--

CREATE TABLE `stanowisko` (
  `nazwa` varchar(31) NOT NULL,
  `pensja_minimalna` int(11) NOT NULL,
  `pensja_maksymalna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO `stanowisko` (`nazwa`, `pensja_minimalna`, `pensja_maksymalna`) VALUES
('CEO', 22000, 25000),
('Head_of_Department', 19000, 22000),
('Team_Leader', 15000, 17000),
('System_Architect', 16000, 20000),
('Senior_Developer', 9000, 14000),
('Mid_Developer', 6000, 8500),
('Junior_Developer', 4000, 5500),
('Intern', 3000, 3500),
('None', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `zespol`
--

CREATE TABLE `zespol` (
  `nazwa` varchar(63) NOT NULL,
  `liczba_czlonkow` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `example`
--
ALTER TABLE `example`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `pracownik`
  ADD PRIMARY KEY `login` (`login`),  
  ADD KEY `prac_zespol_fkey` (`zespol`),
  ADD KEY `prac_stanowisko_fkey` (`stanowisko`),
  ADD KEY `nazwisko` (`nazwisko`);
  
--
-- Indexes for table `stanowisko`
--
ALTER TABLE `stanowisko`
  ADD PRIMARY KEY (`nazwa`);
  
--
-- Indexes for table `zespol`
--
ALTER TABLE `zespol`
  ADD PRIMARY KEY (`nazwa`);  
  
-- ------------------------------------------------------

--
-- Constraints for dumped tables
--  

 --
-- Constraints for table `pracownik`
--
ALTER TABLE `pracownik`  
  ADD CONSTRAINT `prac_stanowisko_fkey` FOREIGN KEY (`stanowisko`) REFERENCES `stanowisko` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `prac_zespol_fkey` FOREIGN KEY (`zespol`) REFERENCES `zespol` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

  

CREATE USER 'admin'@'%' IDENTIFIED BY 'mysecretpassword';
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;  
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
