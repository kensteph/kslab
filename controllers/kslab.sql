-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 11, 2020 at 09:32 PM
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
  `logo_menu` varchar(250) NOT NULL,
  `entreprise_name` varchar(150) NOT NULL,
  `email_ent` varchar(250) NOT NULL,
  `back_db_path` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_app_settings`
--

INSERT INTO `tb_app_settings` (`labo`, `line1`, `line2`, `line3`, `line4`, `line5`, `line6`, `logo`, `logo_menu`, `entreprise_name`, `email_ent`, `back_db_path`) VALUES
(1, 'Polyclinique - Pharmacie - Laboratoire MÃ©dicale', 'Ultrasonographie pelvienne - Electrocardiogramme', 'Delmas 33 ProlongÃ© # 24 B', 'Delmas ht 6120', 'TÃ©l :(509) 28 17 1550 / (509) 38 17 8518', 'Email : centremedicalcliniplus@gmail.com', 'logo.png', 'logo_menu.png', 'Centre MÃ©dical Clini-Plus ', 'kenderromain@gmail.com', 'C:/Users/KS/OneDrive/KSLAB-BACK-UP');

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
  `acteur` varchar(150) DEFAULT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT '1',
  `approved_by` varchar(250) DEFAULT NULL
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
(1, 'HÃ©mogramme Complet', NULL, NULL, NULL, NULL, NULL, 1, 1),
(6, 'Globules Rouges', NULL, NULL, NULL, NULL, NULL, 1, 0),
(7, 'Globules Blancs', NULL, NULL, NULL, NULL, NULL, 1, 0),
(8, 'HÃ©matocrite', NULL, NULL, NULL, NULL, NULL, 1, 0),
(9, 'MCV', NULL, NULL, NULL, NULL, NULL, 1, 0),
(10, 'MCH', NULL, NULL, NULL, NULL, NULL, 1, 0),
(11, 'MCHC', NULL, NULL, NULL, NULL, NULL, 1, 0),
(12, 'Bilan hÃ©patique', NULL, NULL, NULL, NULL, NULL, 1, 1),
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
(25, 'BactÃ©ries', NULL, NULL, NULL, NULL, NULL, 3, 0),
(26, 'Coloration gram', NULL, NULL, NULL, NULL, NULL, 3, 0),
(27, 'OEufs et Parasites', NULL, NULL, NULL, NULL, NULL, 3, 0),
(28, 'Sang Occulte', NULL, NULL, NULL, NULL, NULL, 3, 0),
(29, 'Levures', NULL, NULL, NULL, NULL, NULL, 3, 0),
(30, 'HIV', NULL, NULL, NULL, NULL, NULL, 2, 0),
(31, 'ASO', NULL, NULL, NULL, NULL, NULL, 1, 0),
(32, 'COVID 19', NULL, NULL, NULL, NULL, NULL, 2, 0),
(33, 'Formules leucocytaires', NULL, NULL, NULL, NULL, NULL, 1, 1),
(34, 'Poly-neutrophiles', NULL, NULL, NULL, NULL, NULL, 1, 0),
(35, 'Eosinophiles', NULL, NULL, NULL, NULL, NULL, 1, 0),
(36, 'Basophiles', NULL, NULL, NULL, NULL, NULL, 1, 0),
(37, 'Lymphocytes', NULL, NULL, NULL, NULL, NULL, 1, 0),
(38, 'Monocytes', NULL, NULL, NULL, NULL, NULL, 1, 0),
(39, 'RÃ©ticulocytes', NULL, NULL, NULL, NULL, NULL, 1, 0),
(40, 'Plaquettes sanguines', NULL, NULL, NULL, NULL, NULL, 1, 0),
(41, 'Vitesse de sédimentation', NULL, NULL, NULL, NULL, NULL, 1, 0),
(43, 'Temps de saignement', NULL, NULL, NULL, NULL, NULL, 1, 0),
(44, 'Temps de coagulation', NULL, NULL, NULL, NULL, NULL, 1, 0),
(45, 'Taux de Prothrombine', NULL, NULL, NULL, NULL, NULL, 1, 0),
(46, 'T. de témoins', NULL, NULL, NULL, NULL, NULL, 1, 0),
(47, 'T. de Patient', NULL, NULL, NULL, NULL, NULL, 1, 0),
(48, 'Sickling test', NULL, NULL, NULL, NULL, NULL, 1, 0),
(49, 'Groupe sanguin', NULL, NULL, NULL, NULL, NULL, 1, 0),
(50, 'Sérologie', NULL, NULL, NULL, NULL, NULL, 1, 0),
(54, 'HÃ©moglobine', NULL, NULL, NULL, NULL, NULL, 1, 0);

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
(1, 25, 1),
(17, 14, 1),
(31, 1, 1),
(32, 25, 1);

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
(25, 'Seringue', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tb_notifications`
--

CREATE TABLE `tb_notifications` (
  `id` int(11) NOT NULL,
  `de` varchar(150) NOT NULL,
  `a` text NOT NULL,
  `type_notif` varchar(150) NOT NULL,
  `titre` varchar(250) NOT NULL,
  `contenu` text NOT NULL,
  `publier` tinyint(4) NOT NULL DEFAULT '1',
  `if_see` tinyint(4) NOT NULL DEFAULT '0',
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
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11),
(1, 51),
(1, 52),
(1, 54),
(1, 55),
(12, 0),
(12, 6),
(12, 7),
(21, 22),
(21, 23),
(21, 24),
(21, 25),
(21, 26),
(21, 27),
(21, 28),
(21, 29),
(33, 34),
(33, 35),
(33, 36),
(33, 37),
(33, 38),
(33, 39),
(33, 40),
(33, 41),
(33, 42),
(33, 43),
(33, 44),
(33, 45),
(33, 46),
(33, 47),
(33, 48),
(33, 49);

-- --------------------------------------------------------

--
-- Table structure for table `tb_patients`
--

CREATE TABLE `tb_patients` (
  `id_personne` int(11) NOT NULL,
  `numero_patient` varchar(150) NOT NULL,
  `date_ajout` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
(1, 'Super', 'Admin', 'M', '2020-05-18', '42,Rue Charlemagne Péralte,PV', '50938606466', 'kenderromain@gmail.com', 1, 0);

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
  `acteur` varchar(150) DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `acteur` varchar(150) DEFAULT NULL,
  `realiser_par` varchar(250) DEFAULT NULL,
  `poste` varchar(250) DEFAULT NULL
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
  `poste` varchar(250) DEFAULT NULL,
  `date_record` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`id_personne`, `id_employe`, `user_name`, `pass_word`, `change_pass`, `menu_access`, `sub_menu_access`, `poste`, `date_record`) VALUES
(1, 'AA-2020-26', 'superadmin', '$2b$08$EP1MtilHXdfOxo/qe632vuxgAWW9vhXjdzCQf/6axSRjkoprMChmy', 0, 'All', 'All', NULL, '2020-05-18 10:54:14');

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
(6, '', '', '', '3.6 – 5', '4.2 – 5.4', 'millions/mm3'),
(7, '4.500 â€“ 10.000', '4.500 â€“ 10.000', '4.500 â€“ 10.000', '4.500 â€“ 10.000', '4.500 â€“ 10.000', 'millions/mm3'),
(8, '', '', '', '35 - 47', '40 - 52', '%'),
(9, '80 -105', '80 -105', '80 -105', '80 -105', '80 -105', 'micr. Cu'),
(10, '27 â€“ 31', '27 â€“ 31', '27 â€“ 31', '27 â€“ 31', '27 â€“ 31', 'Î¼Î¼/g'),
(11, '22 – 36', '22 – 36', '22 – 36', '22 – 36', '22 – 36', '%'),
(31, '<100', '<100', '<200', '<100', '<100', 'UI/L'),
(54, '', '', '', '11.7 -15.7', '13.3 – 17.7', ' g/dl');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_examens`
--
ALTER TABLE `tb_examens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
--
-- AUTO_INCREMENT for table `tb_materiaux`
--
ALTER TABLE `tb_materiaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
--
-- AUTO_INCREMENT for table `tb_notifications`
--
ALTER TABLE `tb_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tb_personnes`
--
ALTER TABLE `tb_personnes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
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
