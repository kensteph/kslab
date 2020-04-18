-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 17, 2020 at 09:46 PM
-- Server version: 5.7.11
-- PHP Version: 5.6.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kslab`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_evolution_stock`
--

CREATE TABLE `tb_evolution_stock` (
  `id` int(11) NOT NULL,
  `lot` varchar(150) NOT NULL,
  `materiau` int(11) NOT NULL,
  `qte` int(11) NOT NULL,
  `transaction` varchar(11) DEFAULT NULL,
  `test` int(11) DEFAULT NULL,
  `commentaire` text,
  `date_manuel` date DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `acteur` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tb_examens`
--

CREATE TABLE `tb_examens` (
  `id` int(11) NOT NULL,
  `nom_examen` varchar(250) NOT NULL,
  `description` text,
  `prix_labo` double DEFAULT NULL,
  `prix_client` double DEFAULT NULL,
  `categorie` int(11) DEFAULT NULL,
  `type_examen` int(11) DEFAULT NULL,
  `type_resultat` int(11) NOT NULL,
  `is_bilan` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_examens`
--

INSERT INTO `tb_examens` (`id`, `nom_examen`, `description`, `prix_labo`, `prix_client`, `categorie`, `type_examen`, `type_resultat`, `is_bilan`) VALUES
(1, 'Hémogramme Complet', NULL, NULL, NULL, NULL, NULL, 1, 1),
(6, 'Globules Rouges', NULL, NULL, NULL, NULL, NULL, 1, 0),
(7, 'Globules Blancs', NULL, NULL, NULL, NULL, NULL, 1, 0),
(8, 'Hématocrite', NULL, NULL, NULL, NULL, NULL, 1, 0),
(9, 'MCV', NULL, NULL, NULL, NULL, NULL, 1, 0),
(10, 'MCH', NULL, NULL, NULL, NULL, NULL, 1, 0),
(11, 'MCHC', NULL, NULL, NULL, NULL, NULL, 1, 0),
(12, 'Bilan hépatique', NULL, NULL, NULL, NULL, NULL, 1, 1),
(13, 'Bilirubine directe', NULL, NULL, NULL, NULL, NULL, 1, 0),
(14, 'Bilirubine totale', NULL, NULL, NULL, NULL, NULL, 1, 0),
(15, 'GAMMA-GT', NULL, NULL, NULL, NULL, NULL, 1, 0),
(16, 'Phosphatase alcaline', NULL, NULL, NULL, NULL, NULL, 1, 0),
(17, 'GRAVINDEX', NULL, NULL, NULL, NULL, NULL, 2, 0),
(18, 'Test de grossesse (HCG)', NULL, NULL, NULL, NULL, NULL, 1, 1),
(19, 'ßHCG Urine', NULL, NULL, NULL, NULL, NULL, 1, 0),
(20, 'BHCG Plasmatique', NULL, NULL, NULL, NULL, NULL, 1, 0),
(21, 'Selles', NULL, NULL, NULL, NULL, NULL, 1, 1),
(22, 'Apparence', NULL, NULL, NULL, NULL, NULL, 3, 0),
(23, 'Consistance', NULL, NULL, NULL, NULL, NULL, 3, 0),
(24, 'Leucocytes', NULL, NULL, NULL, NULL, NULL, 3, 0),
(25, 'Bactéries', NULL, NULL, NULL, NULL, NULL, 3, 0),
(26, 'coloration gram', NULL, NULL, NULL, NULL, NULL, 3, 0),
(27, 'OEufs et Parasites', NULL, NULL, NULL, NULL, NULL, 3, 0),
(28, 'Sang Occulte', NULL, NULL, NULL, NULL, NULL, 3, 0),
(29, 'Levures', NULL, NULL, NULL, NULL, NULL, 3, 0),
(30, 'HIV', NULL, NULL, NULL, NULL, NULL, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_link_materiau_test`
--

CREATE TABLE `tb_link_materiau_test` (
  `test_id` int(11) NOT NULL,
  `materiau` int(11) NOT NULL,
  `qte` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tb_materiaux`
--

CREATE TABLE `tb_materiaux` (
  `id` int(11) NOT NULL,
  `nom_materiau` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_materiaux`
--

INSERT INTO `tb_materiaux` (`id`, `nom_materiau`) VALUES
(1, 'ASO'),
(7, 'CHLAMYDIA FROTTIS'),
(4, 'CRP'),
(18, 'DENGUE'),
(3, 'FACTEUR RHUMATOIDE'),
(14, 'GRAVINDEX'),
(17, 'H. PYLORI'),
(8, 'HEPATITE A'),
(11, 'HEPATITE A & B'),
(9, 'HEPATITE B'),
(10, 'HEPATITE C'),
(13, 'HERPES'),
(2, 'HIV'),
(6, 'MALARIA'),
(24, 'POTS STERILES/ SELLES'),
(23, 'POTS STERILES/ URINE'),
(20, 'PSA'),
(5, 'RPR'),
(19, 'STRIP / GLYCOMETRE'),
(12, 'TORCH'),
(21, 'TUBE MAUVE'),
(22, 'TUBE ROUGE'),
(15, 'URINE TEST'),
(16, 'ß-HCG PLASMA');

-- --------------------------------------------------------

--
-- Table structure for table `tb_parametres_examens`
--

CREATE TABLE `tb_parametres_examens` (
  `id_examen` int(11) NOT NULL,
  `id_param_exam` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_parametres_examens`
--

INSERT INTO `tb_parametres_examens` (`id_examen`, `id_param_exam`) VALUES
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(12, 7),
(12, 13),
(12, 14),
(12, 15),
(12, 16),
(18, 19),
(18, 20),
(21, 22),
(21, 23),
(21, 24),
(21, 25),
(21, 26),
(21, 27);

-- --------------------------------------------------------

--
-- Table structure for table `tb_patients`
--

CREATE TABLE `tb_patients` (
  `id_personne` int(11) NOT NULL,
  `numero_patient` varchar(150) NOT NULL,
  `date_ajout` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_patients`
--

INSERT INTO `tb_patients` (`id_personne`, `numero_patient`, `date_ajout`) VALUES
(1, 'KR-2020-1', '2020-03-31 20:28:18'),
(2, 'SS-2020-2', '2020-03-31 20:51:22'),
(3, 'AR-2020-3', '2020-03-31 20:54:45'),
(4, 'KP-2020-4', '2020-04-01 08:24:01'),
(5, 'KP-2020-5', '2020-04-01 08:25:53'),
(6, 'MS-2020-6', '2020-04-02 21:30:23'),
(7, 'MS-2020-7', '2020-04-02 21:30:46'),
(8, 'BB-2020-8', '2020-04-07 08:12:08'),
(9, 'KL-2020-9', '2020-04-07 08:54:22'),
(10, 'MD-2020-10', '2020-04-07 08:57:56'),
(11, 'MM-2020-11', '2020-04-07 14:02:21'),
(12, 'CR-2020-12', '2020-04-09 19:50:10');

-- --------------------------------------------------------

--
-- Table structure for table `tb_personnes`
--

CREATE TABLE `tb_personnes` (
  `id` int(11) NOT NULL,
  `prenom` varchar(250) NOT NULL,
  `nom` varchar(250) NOT NULL,
  `sexe` varchar(10) NOT NULL,
  `date_nais` date NOT NULL,
  `adresse` varchar(250) NOT NULL,
  `telephone` varchar(100) NOT NULL,
  `statut` tinyint(1) NOT NULL DEFAULT '1',
  `visible` tinyint(1) DEFAULT '1' COMMENT 'When they delete the person'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_personnes`
--

INSERT INTO `tb_personnes` (`id`, `prenom`, `nom`, `sexe`, `date_nais`, `adresse`, `telephone`, `statut`, `visible`) VALUES
(1, 'Kender', 'Romain', 'M', '1988-08-02', '#12,Impasse Moreau,Débussy', '+50938606466', 1, 1),
(2, 'Stephanie', 'Saint-Louis', 'F', '1994-05-14', '15 38th Street', '4074043850', 1, 1),
(3, 'Hansderly', 'Rameau', 'M', '1995-10-18', '42,Rue Charlemagne Peralte', '39160384', 1, 1),
(4, 'Kelly', 'Paul', 'M', '1985-01-25', 'Canapevert', '3700-8975', 1, 1),
(5, 'Kelly', 'Paul', 'M', '1985-01-25', 'Canapevert', '3700-8975', 1, 1),
(6, 'Marise', 'SAINT-LOUIS', 'F', '1975-05-14', '8730 rue Émile Robichaud H1E5T2. Montréal QC.', '5143717818', 1, 1),
(7, 'Marise', 'SAINT-LOUIS', 'F', '1975-05-14', '8730 rue Émile Robichaud H1E5T2. Montréal QC.', '5143717818', 1, 1),
(8, 'Bergelin', 'Berger', 'M', '1980-03-31', 'Delmas 75', '3700-8975', 1, 1),
(9, 'Kerline', 'Louis', 'F', '1995-08-02', 'Canapevert', '3785-2564', 1, 1),
(10, 'Missie', 'Durosier', 'F', '1990-08-02', 'Delmas 40', '3700-5896', 1, 1),
(11, 'Marie Milcar', 'Moléron', 'F', '1992-05-02', 'Thomassin 60', '3789-2524', 1, 1),
(12, 'Catiana', 'Rameau', 'F', '1995-10-18', 'Delmas 40', '36001033', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_resultats`
--

CREATE TABLE `tb_resultats` (
  `id_resultat` int(11) NOT NULL,
  `test_request_id` int(11) NOT NULL,
  `examen_id` int(11) NOT NULL,
  `resultat` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tb_stocks`
--

CREATE TABLE `tb_stocks` (
  `id` int(11) NOT NULL,
  `numero_lot` varchar(150) NOT NULL,
  `materiau` int(11) NOT NULL,
  `date_recue` date NOT NULL,
  `date_expiration` date NOT NULL,
  `qte_recue` int(11) NOT NULL,
  `qte_utilisee` int(11) NOT NULL DEFAULT '0',
  `qte_restante` int(11) NOT NULL,
  `qte_endomage` int(11) NOT NULL,
  `statut` tinyint(4) NOT NULL DEFAULT '1',
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tb_test_requests`
--

CREATE TABLE `tb_test_requests` (
  `id` int(11) NOT NULL,
  `patient` int(11) NOT NULL,
  `date_manuelle` date DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_resultat` date DEFAULT NULL,
  `statut` int(11) DEFAULT '0',
  `acteur` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tb_test_requests_contents`
--

CREATE TABLE `tb_test_requests_contents` (
  `id` int(11) NOT NULL,
  `test_request_id` int(11) NOT NULL,
  `examen_id` int(11) NOT NULL,
  `resultat` text,
  `acteur` varchar(150) DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_edit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_evolution_stock`
--
ALTER TABLE `tb_evolution_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_examens`
--
ALTER TABLE `tb_examens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_examen` (`nom_examen`);

--
-- Indexes for table `tb_link_materiau_test`
--
ALTER TABLE `tb_link_materiau_test`
  ADD UNIQUE KEY `test_id` (`test_id`,`materiau`);

--
-- Indexes for table `tb_materiaux`
--
ALTER TABLE `tb_materiaux`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_materiau` (`nom_materiau`);

--
-- Indexes for table `tb_parametres_examens`
--
ALTER TABLE `tb_parametres_examens`
  ADD UNIQUE KEY `id_examen` (`id_examen`,`id_param_exam`);

--
-- Indexes for table `tb_patients`
--
ALTER TABLE `tb_patients`
  ADD UNIQUE KEY `id_personne` (`id_personne`),
  ADD UNIQUE KEY `numero_patient` (`numero_patient`);

--
-- Indexes for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_resultats`
--
ALTER TABLE `tb_resultats`
  ADD PRIMARY KEY (`id_resultat`),
  ADD UNIQUE KEY `test_request_id` (`test_request_id`,`examen_id`);

--
-- Indexes for table `tb_stocks`
--
ALTER TABLE `tb_stocks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_lot` (`numero_lot`,`materiau`);

--
-- Indexes for table `tb_test_requests`
--
ALTER TABLE `tb_test_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_test_requests_contents`
--
ALTER TABLE `tb_test_requests_contents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `test_request_id` (`test_request_id`,`examen_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_evolution_stock`
--
ALTER TABLE `tb_evolution_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_examens`
--
ALTER TABLE `tb_examens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `tb_materiaux`
--
ALTER TABLE `tb_materiaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `tb_resultats`
--
ALTER TABLE `tb_resultats`
  MODIFY `id_resultat` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_stocks`
--
ALTER TABLE `tb_stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_test_requests`
--
ALTER TABLE `tb_test_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_test_requests_contents`
--
ALTER TABLE `tb_test_requests_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
