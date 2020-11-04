-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 04, 2020 at 12:22 PM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jira-put`
--

-- --------------------------------------------------------

--
-- Table structure for table `epic`
--

CREATE TABLE `epic` (
  `termin_realizacji` datetime DEFAULT NULL,
  `projekt` varchar(63) NOT NULL,
  `issue_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `firma_zewnetrzna`
--

CREATE TABLE `firma_zewnetrzna` (
  `nip` int(11) NOT NULL,
  `nazwa` varchar(255) NOT NULL,
  `adres` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `issue`
--

CREATE TABLE `issue` (
  `identyfikator` int(11) NOT NULL,
  `nazwa` varchar(63) NOT NULL,
  `opis` text,
  `szacunkwoy_czas_trwania` time DEFAULT NULL,
  `rzeczywisty_czas_trwania` time DEFAULT NULL,
  `podtyp` enum('epic','story','task') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kontrakt`
--

CREATE TABLE `kontrakt` (
  `numer_umowy` varchar(31) NOT NULL,
  `kwota` float NOT NULL,
  `opis_warunkow` text,
  `firma_zew` int(11) NOT NULL,
  `projekt` varchar(63) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pracownik`
--

CREATE TABLE `pracownik` (
  `identyfikator` int(11) NOT NULL,
  `imie` varchar(31) NOT NULL,
  `nazwisko` varchar(31) NOT NULL,
  `pensja` float NOT NULL,
  `stanowisko` varchar(31) NOT NULL,
  `zespol` varchar(63) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
-- Table structure for table `projekt`
--

CREATE TABLE `projekt` (
  `nazwa` varchar(63) NOT NULL,
  `wersja` varchar(7) NOT NULL,
  `opis` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `stanowisko`
--

CREATE TABLE `stanowisko` (
  `nazwa` varchar(31) NOT NULL,
  `pensja_minimalna` int(11) NOT NULL,
  `pensja_maksymalna` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `story`
--

CREATE TABLE `story` (
  `issue_id` int(11) NOT NULL,
  `zespol` varchar(63) NOT NULL,
  `epic_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `typ` tinyint(4) NOT NULL,
  `issue_id` int(11) NOT NULL,
  `story_id` int(11) NOT NULL,
  `pracownik_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `technologia`
--

CREATE TABLE `technologia` (
  `nazwa` varchar(63) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tech_prac`
--

CREATE TABLE `tech_prac` (
  `tech_nazwa` varchar(63) NOT NULL,
  `prac_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tech_proj`
--

CREATE TABLE `tech_proj` (
  `tech_nazwa` varchar(63) NOT NULL,
  `proj_nazwa` varchar(63) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `zespol`
--

CREATE TABLE `zespol` (
  `nazwa` varchar(63) NOT NULL,
  `liczba_czlonkow` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `epic`
--
ALTER TABLE `epic`
  ADD KEY `epic_proj_fkey` (`projekt`),
  ADD KEY `epic_issue_fkey` (`issue_id`);

--
-- Indexes for table `firma_zewnetrzna`
--
ALTER TABLE `firma_zewnetrzna`
  ADD PRIMARY KEY (`nip`),
  ADD UNIQUE KEY `nazwa_firma_key` (`nazwa`);

--
-- Indexes for table `issue`
--
ALTER TABLE `issue`
  ADD PRIMARY KEY (`identyfikator`),
  ADD KEY `identyfikator` (`identyfikator`),

--
-- Indexes for table `kontrakt`
--
ALTER TABLE `kontrakt`
  ADD PRIMARY KEY (`numer_umowy`),
  ADD KEY `kontr_proj_fkey` (`projekt`),
  ADD KEY `kontr_firm_zew_fkey` (`firma_zew`);

--
-- Indexes for table `pracownik`
--
ALTER TABLE `pracownik`
  ADD PRIMARY KEY (`identyfikator`),
  ADD KEY `prac_zespol_fkey` (`zespol`),
  ADD KEY `prac_stanowisko_fkey` (`stanowisko`),
  ADD KEY `identyfikator` (`identyfikator`),
  ADD KEY `nazwisko` (`nazwisko`);

--
-- Indexes for table `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`nazwa`),
  ADD KEY `nazwa` (`nazwa`);

--
-- Indexes for table `stanowisko`
--
ALTER TABLE `stanowisko`
  ADD PRIMARY KEY (`nazwa`);

--
-- Indexes for table `story`
--
ALTER TABLE `story`
  ADD KEY `story_epic_fkey` (`epic_id`),
  ADD KEY `story_issue_fkey` (`issue_id`),
  ADD KEY `story_zespol_fkey` (`zespol`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD KEY `task_story_fkey` (`story_id`),
  ADD KEY `task_issue_fkey` (`issue_id`),
  ADD KEY `task_pracownik_fkey` (`pracownik_id`);

--
-- Indexes for table `technologia`
--
ALTER TABLE `technologia`
  ADD PRIMARY KEY (`nazwa`);

--
-- Indexes for table `tech_prac`
--
ALTER TABLE `tech_prac`
  ADD KEY `tech_prac_pracownik_fkey` (`prac_id`),
  ADD KEY `tech_prac_technologia_fkey` (`tech_nazwa`);

--
-- Indexes for table `tech_proj`
--
ALTER TABLE `tech_proj`
  ADD KEY `tech_proj_projekt_fkey` (`proj_nazwa`),
  ADD KEY `tech_proj_technologia_fkey` (`tech_nazwa`);

--
-- Indexes for table `zespol`
--
ALTER TABLE `zespol`
  ADD PRIMARY KEY (`nazwa`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `issue`
--
ALTER TABLE `issue`
  MODIFY `identyfikator` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `pracownik`
--
ALTER TABLE `pracownik`
  MODIFY `identyfikator` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `epic`
--
ALTER TABLE `epic`
  ADD CONSTRAINT `epic_issue_fkey` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`identyfikator`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `epic_proj_fkey` FOREIGN KEY (`projekt`) REFERENCES `projekt` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `kontrakt`
--
ALTER TABLE `kontrakt`
  ADD CONSTRAINT `kontr_firm_zew_fkey` FOREIGN KEY (`firma_zew`) REFERENCES `firma_zewnetrzna` (`nip`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `kontr_proj_fkey` FOREIGN KEY (`projekt`) REFERENCES `projekt` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `pracownik`
--
ALTER TABLE `pracownik`
  ADD CONSTRAINT `prac_stanowisko_fkey` FOREIGN KEY (`stanowisko`) REFERENCES `stanowisko` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `prac_zespol_fkey` FOREIGN KEY (`zespol`) REFERENCES `zespol` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `story`
--
ALTER TABLE `story`
  ADD CONSTRAINT `story_epic_fkey` FOREIGN KEY (`epic_id`) REFERENCES `epic` (`issue_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `story_issue_fkey` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`identyfikator`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `story_zespol_fkey` FOREIGN KEY (`zespol`) REFERENCES `zespol` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_issue_fkey` FOREIGN KEY (`issue_id`) REFERENCES `issue` (`identyfikator`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `task_pracownik_fkey` FOREIGN KEY (`pracownik_id`) REFERENCES `pracownik` (`identyfikator`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `task_story_fkey` FOREIGN KEY (`story_id`) REFERENCES `story` (`issue_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tech_prac`
--
ALTER TABLE `tech_prac`
  ADD CONSTRAINT `tech_prac_pracownik_fkey` FOREIGN KEY (`prac_id`) REFERENCES `pracownik` (`identyfikator`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tech_prac_technologia_fkey` FOREIGN KEY (`tech_nazwa`) REFERENCES `technologia` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `tech_proj`
--
ALTER TABLE `tech_proj`
  ADD CONSTRAINT `tech_proj_projekt_fkey` FOREIGN KEY (`proj_nazwa`) REFERENCES `projekt` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tech_proj_technologia_fkey` FOREIGN KEY (`tech_nazwa`) REFERENCES `technologia` (`nazwa`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
