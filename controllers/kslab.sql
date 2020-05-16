-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 16, 2020 at 12:29 AM
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
-- Table structure for table `tb_app_settings`
--

CREATE TABLE `tb_app_settings` (
  `labo` int(11) NOT NULL,
  `line1` varchar(250) NOT NULL,
  `line2` varchar(250) NOT NULL,
  `line3` varchar(250) NOT NULL,
  `line4` varchar(250) NOT NULL,
  `line5` varchar(250) NOT NULL,
  `line6` varchar(250) NOT NULL,
  `logo` varchar(150) NOT NULL,
  `email_ent` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_app_settings`
--

INSERT INTO `tb_app_settings` (`labo`, `line1`, `line2`, `line3`, `line4`, `line5`, `line6`, `logo`, `email_ent`) VALUES
(1, 'Polyclinique – Pharmacie – Laboratoire Médicale', 'Ultrasonographie pelvienne - Électrocardiogramme', 'Delmas 33 Prolongé # 24 B', 'Delmas ht 6120', 'Tél :(509) 28 17 1550 / (509) 38 17 8518', 'Email : centremedicalcliniplus@gmail.com', 'logo.png', 'kenderromain@gmail.com');

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

--
-- Dumping data for table `tb_evolution_stock`
--

INSERT INTO `tb_evolution_stock` (`id`, `lot`, `materiau`, `qte`, `transaction`, `test`, `commentaire`, `date_manuel`, `date_record`, `acteur`) VALUES
(1, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 1', NULL, '2020-04-24 08:49:04', NULL),
(2, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 4', NULL, '2020-04-28 07:02:33', NULL),
(3, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 5', NULL, '2020-04-28 08:05:02', NULL),
(4, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 6', NULL, '2020-04-30 07:31:18', NULL),
(5, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 7', NULL, '2020-05-09 13:53:14', NULL),
(6, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 8', NULL, '2020-05-10 18:09:27', NULL),
(7, 'GR8789', 1, 1, 'endommagee', NULL, 'Unité endommagée...', NULL, '2020-05-13 15:33:41', NULL),
(9, 'FR5896', 3, 6, 'Add', NULL, '6 FACTEUR RHUMATOIDE ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 19:24:06', NULL),
(10, 'HP269875', 17, 25, 'Add', NULL, '25 H. PYLORI ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 19:25:30', NULL),
(11, 'GR8788', 1, 1, 'endommagee', NULL, 'Unité endomagée', NULL, '2020-05-13 19:42:51', NULL),
(12, 'FR58969', 3, 16, 'Add', NULL, '16 FACTEUR RHUMATOIDE ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 19:54:03', 'twoel'),
(13, 'HI2457', 17, 26, 'Add', NULL, '26 H. PYLORI ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 20:38:06', 'twoel'),
(14, 'DG47896', 18, 25, 'Add', NULL, '25 DENGUE ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 20:53:03', 'twoel'),
(15, 'EB2289', 8, 10, 'Add', NULL, '10 HEPATITE A ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 21:01:04', 'twoel'),
(16, 'EPB658522', 9, 20, 'Add', NULL, '20 HEPATITE B ont été ajoutés au stock. QTE endomagée : 0', NULL, '2020-05-13 21:04:56', 'twoel'),
(17, 'S125366', 25, 1, 'substract', NULL, '1 Seringue a été prélevé du stock pour le test # 9', NULL, '2020-05-14 15:50:05', NULL);

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
(21, 'Selles', NULL, NULL, NULL, NULL, NULL, 3, 1),
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

--
-- Dumping data for table `tb_link_materiau_test`
--

INSERT INTO `tb_link_materiau_test` (`test_id`, `materiau`, `qte`) VALUES
(1, 25, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_materiaux`
--

CREATE TABLE `tb_materiaux` (
  `id` int(11) NOT NULL,
  `nom_materiau` varchar(250) NOT NULL,
  `min_stock` int(11) NOT NULL,
  `expirable` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_materiaux`
--

INSERT INTO `tb_materiaux` (`id`, `nom_materiau`, `min_stock`, `expirable`) VALUES
(1, 'ASO', 15, 0),
(2, 'HIV', 0, 1),
(3, 'FACTEUR RHUMATOIDE', 0, 1),
(4, 'CRP', 0, 1),
(5, 'RPR', 0, 1),
(6, 'MALARIA', 0, 1),
(7, 'CHLAMYDIA FROTTIS', 5, 1),
(8, 'HEPATITE A', 0, 1),
(9, 'HEPATITE B', 0, 1),
(10, 'HEPATITE C', 0, 1),
(11, 'HEPATITE A & B', 0, 1),
(12, 'TORCH', 0, 1),
(13, 'HERPES', 0, 1),
(14, 'GRAVINDEX', 0, 1),
(15, 'URINE TEST', 0, 1),
(16, 'ß-HCG PLASMA', 0, 1),
(17, 'H. PYLORI', 0, 1),
(18, 'DENGUE', 30, 1),
(19, 'STRIP / GLYCOMETRE', 0, 1),
(20, 'PSA', 0, 1),
(21, 'TUBE MAUVE', 0, 1),
(22, 'TUBE ROUGE', 0, 1),
(23, 'POTS STERILES/ URINE', 0, 1),
(24, 'POTS STERILES/ SELLES', 0, 1),
(25, 'Seringue', 0, 1),
(26, 'TEST', 25, 0),
(28, 'TEST 25', 25, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_notifications`
--

CREATE TABLE `tb_notifications` (
  `id` int(11) NOT NULL,
  `de` varchar(150) NOT NULL,
  `a` varchar(150) NOT NULL,
  `type_notif` varchar(150) NOT NULL,
  `contenu` text NOT NULL,
  `date_notif` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(12, 'CR-2020-12', '2020-04-09 19:50:10'),
(13, 'MV-2020-13', '2020-04-18 21:53:39'),
(14, 'MJ-2020-14', '2020-04-30 07:30:45'),
(15, 'kR-2020-15', '2020-05-04 23:11:28'),
(16, 'WD-2020-16', '2020-05-10 19:01:41'),
(20, 'MJ-2020-20', '2020-05-13 07:02:50');

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
  `email` varchar(250) DEFAULT NULL,
  `statut` tinyint(1) NOT NULL DEFAULT '1',
  `visible` tinyint(1) DEFAULT '1' COMMENT 'When they delete the person'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_personnes`
--

INSERT INTO `tb_personnes` (`id`, `prenom`, `nom`, `sexe`, `date_nais`, `adresse`, `telephone`, `email`, `statut`, `visible`) VALUES
(1, 'Kender', 'Romain', 'M', '1988-08-02', '#12,Impasse Moreau,Débussy', '+50938606466', NULL, 1, 1),
(2, 'Stephanie', 'Saint-Louis', 'F', '1994-05-14', '15 38th Street', '4074043850', NULL, 1, 1),
(3, 'Hansderly', 'Rameau', 'M', '1995-10-18', '42,Rue Charlemagne Peralte', '39160384', NULL, 1, 1),
(4, 'Kelly', 'Paul', 'M', '1985-01-25', 'Canapevert', '3700-8975', NULL, 1, 1),
(5, 'Kelly', 'Paul', 'M', '1985-01-25', 'Canapevert', '3700-8975', NULL, 1, 1),
(6, 'Marise', 'SAINT-LOUIS', 'F', '1975-05-14', '8730 rue Émile Robichaud H1E5T2. Montréal QC.', '5143717818', NULL, 1, 1),
(7, 'Marise', 'SAINT-LOUIS', 'F', '1975-05-14', '8730 rue Émile Robichaud H1E5T2. Montréal QC.', '5143717818', NULL, 1, 1),
(8, 'Bergelin', 'Berger', 'M', '1980-03-31', 'Delmas 75', '3700-8975', NULL, 1, 1),
(9, 'Kerline', 'Louis', 'F', '1995-08-02', 'Canapevert', '3785-2564', NULL, 1, 1),
(10, 'Missie', 'Durosier', 'F', '1990-08-02', 'Delmas 40', '3700-5896', NULL, 1, 1),
(11, 'Marie Milcar', 'Moléron', 'F', '1992-05-02', 'Thomassin 60', '3789-2524', NULL, 1, 1),
(12, 'Catiana', 'Rameau', 'F', '1995-10-18', 'Delmas 40', '36001033', NULL, 1, 1),
(13, 'Mathurin', 'Valcin', 'M', '1988-04-02', '', '', NULL, 1, 1),
(14, 'Marie Guirlaine', 'Joseph', 'F', '1975-05-14', 'Thomassin 65,PV', '37007031', NULL, 1, 1),
(15, 'kevin Olivier', 'Romain', 'M', '2002-03-31', '#12,Impasse Moreau,Débussy', '+50936985423', NULL, 1, 1),
(16, 'Wistor ', 'Dérilus', 'M', '1990-08-02', 'Thomassin 60', '26987411', 'wderilus@gmail.com', 1, 1),
(18, 'Théodora', 'W. Romain', 'F', '1994-10-25', '42,Rue Charlemagne Peralte', '38606466', 'twoel@gmail.com', 1, 1),
(19, 'Kender', 'ROMAIN', 'M', '1988-08-02', '42,Rue Charlemagne Peralte', '38606466', 'kenderromain@gmail.com', 1, 1),
(20, 'Marie Guirlaine', 'JOSEPH', 'F', '1980-08-02', 'Thomassin 70', '37007031', 'mgjoseph@gmail.com', 1, 1);

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

--
-- Dumping data for table `tb_resultats`
--

INSERT INTO `tb_resultats` (`id_resultat`, `test_request_id`, `examen_id`, `resultat`) VALUES
(1, 1, 30, 'Négatif'),
(2, 1, 22, 'Couleur marron'),
(3, 1, 23, 'pateuse'),
(4, 1, 24, '"Thanks Chris! I can\'t wait to put this plugin to good use and thanks for making this a possibility. It\'s people like you that make developing hybrid apps possible and more practical and for that I thank you."'),
(5, 1, 25, 'test'),
(6, 1, 26, 'test'),
(7, 1, 27, 'Aucune présence '),
(8, 1, 6, '25000'),
(9, 1, 7, '20000'),
(10, 1, 8, '56'),
(11, 1, 9, '25'),
(12, 1, 10, '75'),
(13, 1, 11, '76'),
(14, 2, 30, 'Négatif'),
(15, 7, 6, '25000'),
(16, 7, 7, '270000'),
(17, 7, 8, '566'),
(18, 7, 9, '455'),
(19, 7, 10, '999'),
(20, 7, 11, '875445'),
(21, 7, 22, 'test'),
(22, 7, 23, 'wertyu'),
(23, 7, 24, 'erty'),
(24, 7, 25, 'sii'),
(25, 7, 26, 'tiuuii'),
(26, 7, 27, '4444444hhhg');

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
  `acteur` varchar(150) DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_stocks`
--

INSERT INTO `tb_stocks` (`id`, `numero_lot`, `materiau`, `date_recue`, `date_expiration`, `qte_recue`, `qte_utilisee`, `qte_restante`, `qte_endomage`, `statut`, `acteur`, `date_record`) VALUES
(1, 'S125366', 25, '2020-04-18', '2025-04-18', 50, 11, 37, 2, 1, NULL, '2020-04-18 12:38:15'),
(2, 'AS2658', 1, '2019-06-12', '2020-04-22', 5, 0, 5, 0, 0, NULL, '2020-04-23 08:58:21'),
(3, 'UT3654', 15, '2019-01-29', '2020-05-01', 15, 0, 15, 0, 1, NULL, '2020-04-30 14:21:50'),
(4, 'GR8789', 1, '2020-05-13', '2020-06-18', 5, 0, 4, 1, 1, NULL, '2020-05-13 14:51:57'),
(5, 'GR8788', 1, '2020-05-13', '2020-05-14', 6, 0, 5, 1, 1, NULL, '2020-05-13 18:40:59'),
(8, 'FR5896', 3, '2020-05-10', '2020-08-14', 6, 0, 6, 0, 1, NULL, '2020-05-13 19:24:06'),
(9, 'HP269875', 17, '2020-05-11', '2022-07-14', 25, 0, 25, 0, 1, NULL, '2020-05-13 19:25:30'),
(10, 'FR58969', 3, '2020-05-06', '2020-05-13', 16, 0, 16, 0, 1, 'twoel', '2020-05-13 19:54:03'),
(11, 'HI2457', 17, '2020-05-09', '2020-08-13', 26, 0, 26, 0, 1, 'twoel', '2020-05-13 20:38:06'),
(12, 'DG47896', 18, '2020-05-13', '2020-10-14', 25, 0, 25, 0, 1, 'twoel', '2020-05-13 20:53:03'),
(13, 'EB2289', 8, '2020-05-15', '2020-06-06', 10, 0, 10, 0, 1, 'twoel', '2020-05-13 21:01:04'),
(14, 'EPB658522', 9, '2020-05-06', '2020-07-24', 20, 0, 20, 0, 1, 'twoel', '2020-05-13 21:04:56');

-- --------------------------------------------------------

--
-- Table structure for table `tb_test_requests`
--

CREATE TABLE `tb_test_requests` (
  `id` int(11) NOT NULL,
  `patient` int(11) NOT NULL,
  `docteur` varchar(250) DEFAULT NULL,
  `date_manuelle` date DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_resultat` date DEFAULT NULL,
  `statut` int(11) DEFAULT '0',
  `acteur` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_test_requests`
--

INSERT INTO `tb_test_requests` (`id`, `patient`, `docteur`, `date_manuelle`, `date_record`, `date_resultat`, `statut`, `acteur`) VALUES
(1, 2, NULL, NULL, '2020-04-24 08:49:04', '2020-04-27', 2, NULL),
(2, 1, NULL, NULL, '2020-04-27 13:23:39', '2020-04-27', 1, NULL),
(3, 4, 'Hopital Saint-Nicolas', NULL, '2020-04-27 13:23:54', NULL, 0, NULL),
(4, 9, NULL, NULL, '2020-04-28 07:02:33', NULL, 0, NULL),
(5, 10, NULL, NULL, '2020-04-28 08:05:02', NULL, 0, NULL),
(6, 14, NULL, NULL, '2020-04-30 07:31:18', NULL, 0, NULL),
(7, 12, NULL, NULL, '2020-05-09 13:53:14', '2020-05-09', 1, NULL),
(8, 15, NULL, NULL, '2020-05-10 18:09:27', NULL, 0, NULL),
(9, 1, 'Dr. Mario Sajous', NULL, '2020-05-14 15:50:05', NULL, 0, NULL);

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
-- Dumping data for table `tb_test_requests_contents`
--

INSERT INTO `tb_test_requests_contents` (`id`, `test_request_id`, `examen_id`, `resultat`, `acteur`, `date_record`, `date_edit`) VALUES
(1, 1, 1, NULL, NULL, '2020-04-24 08:49:04', NULL),
(2, 1, 21, NULL, NULL, '2020-04-24 08:49:04', NULL),
(3, 1, 30, NULL, NULL, '2020-04-24 08:49:04', NULL),
(4, 2, 30, NULL, NULL, '2020-04-27 13:23:39', NULL),
(5, 3, 21, NULL, NULL, '2020-04-27 13:23:54', NULL),
(6, 4, 1, NULL, NULL, '2020-04-28 07:02:33', NULL),
(7, 4, 30, NULL, NULL, '2020-04-28 07:02:33', NULL),
(8, 5, 1, NULL, NULL, '2020-04-28 08:05:02', NULL),
(9, 5, 18, NULL, NULL, '2020-04-28 08:05:02', NULL),
(10, 6, 1, NULL, NULL, '2020-04-30 07:31:18', NULL),
(11, 6, 21, NULL, NULL, '2020-04-30 07:31:18', NULL),
(12, 7, 1, NULL, NULL, '2020-05-09 13:53:14', NULL),
(13, 7, 21, NULL, NULL, '2020-05-09 13:53:14', NULL),
(14, 8, 1, NULL, NULL, '2020-05-10 18:09:27', NULL),
(15, 8, 6, NULL, NULL, '2020-05-10 18:09:27', NULL),
(16, 8, 7, NULL, NULL, '2020-05-10 18:09:27', NULL),
(17, 8, 8, NULL, NULL, '2020-05-10 18:09:27', NULL),
(18, 8, 9, NULL, NULL, '2020-05-10 18:09:27', NULL),
(19, 8, 10, NULL, NULL, '2020-05-10 18:09:27', NULL),
(20, 8, 21, NULL, NULL, '2020-05-10 18:09:27', NULL),
(21, 9, 1, NULL, NULL, '2020-05-14 15:50:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `id_personne` int(11) NOT NULL,
  `id_employe` varchar(250) NOT NULL,
  `user_name` varchar(250) NOT NULL,
  `pass_word` text NOT NULL,
  `change_pass` tinyint(1) NOT NULL DEFAULT '1',
  `menu_access` text,
  `sub_menu_access` text,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`id_personne`, `id_employe`, `user_name`, `pass_word`, `change_pass`, `menu_access`, `sub_menu_access`, `date_record`) VALUES
(18, 'TW-2020-18', 'twoel', '12345678', 0, 'All', 'All', '2020-05-10 19:12:01'),
(19, 'KR-2020-19', 'keromain', 'K@i14969', 0, 'Test Patient|Patients', 'Ajouter Patient', '2020-05-12 20:13:11');

-- --------------------------------------------------------

--
-- Table structure for table `tb_valeurs_normales`
--

CREATE TABLE `tb_valeurs_normales` (
  `exam_id` int(11) NOT NULL,
  `bebe` varchar(250) NOT NULL,
  `enfant` varchar(250) NOT NULL,
  `adolescent` varchar(250) NOT NULL,
  `femme` varchar(250) NOT NULL,
  `homme` varchar(250) NOT NULL,
  `unite` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_valeurs_normales`
--

INSERT INTO `tb_valeurs_normales` (`exam_id`, `bebe`, `enfant`, `adolescent`, `femme`, `homme`, `unite`) VALUES
(6, '4.2 –  5.4', '4.3 –  5.4', '4.4 –  5.4', '4.5 –  5.4', '4.6 –  5.4', 'millions/mm3'),
(7, '4.2 –  5.4', '4.3 –  5.4', '4.4 –  5.4', '4.5 –  5.4', '4.6 –  5.4', 'millions/mm3'),
(9, '80 - 105', '81 - 105', '82 - 105', '83 - 105', '84 - 105', 'micr. Cu'),
(20, '80 -105', '81 -105', '82 -105', '83 -105', '84 -105', 'micr. Cu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_app_settings`
--
ALTER TABLE `tb_app_settings`
  ADD PRIMARY KEY (`labo`),
  ADD UNIQUE KEY `line1` (`line1`,`line2`,`line3`,`line4`,`line5`,`line6`);

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
-- Indexes for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  ADD PRIMARY KEY (`id`);

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
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD UNIQUE KEY `id_personne` (`id_personne`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `id_personne_2` (`id_personne`,`user_name`),
  ADD UNIQUE KEY `id_emp` (`id_employe`);

--
-- Indexes for table `tb_valeurs_normales`
--
ALTER TABLE `tb_valeurs_normales`
  ADD UNIQUE KEY `exam_id` (`exam_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_app_settings`
--
ALTER TABLE `tb_app_settings`
  MODIFY `labo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tb_evolution_stock`
--
ALTER TABLE `tb_evolution_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `tb_examens`
--
ALTER TABLE `tb_examens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT for table `tb_materiaux`
--
ALTER TABLE `tb_materiaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
--
-- AUTO_INCREMENT for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `tb_resultats`
--
ALTER TABLE `tb_resultats`
  MODIFY `id_resultat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `tb_stocks`
--
ALTER TABLE `tb_stocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `tb_test_requests`
--
ALTER TABLE `tb_test_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `tb_test_requests_contents`
--
ALTER TABLE `tb_test_requests_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
