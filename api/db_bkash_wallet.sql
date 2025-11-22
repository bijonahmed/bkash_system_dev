-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2025 at 06:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_bkash_wallet`
--

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` int(11) NOT NULL,
  `bank_name` varchar(255) NOT NULL,
  `short_name` varchar(50) DEFAULT NULL,
  `bank_code` varchar(20) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banks`
--

INSERT INTO `banks` (`id`, `bank_name`, `short_name`, `bank_code`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Islami Bank Bangladesh Limited', 'IBBL', 'IBBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(2, 'Dutch-Bangla Bank Limited', 'DBBL', 'DBBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(3, 'BRAC Bank Limited', 'BRAC', 'BRAC', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(4, 'Sonali Bank Limited', 'SONALI', 'SBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(5, 'Janata Bank Limited', 'JANATA', 'JBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(6, 'United Commercial Bank Limited', 'UCB', 'UCBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(7, 'Eastern Bank Limited', 'EBL', 'EBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(8, 'City Bank Limited', 'CITY', 'CTBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(9, 'Prime Bank Limited', 'PRIME', 'PBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(10, 'Pubali Bank Limited', 'PUBALI', 'PUB', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(11, 'AB Bank Limited', 'ABBL', 'ABBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(12, 'Agrani Bank Limited', 'AGRANI', 'AGBL', 1, '2025-11-14 04:23:30', '2025-11-15 15:55:44'),
(13, 'Bank Asia Limited', 'BANKASIA', 'BAL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(14, 'NCC Bank Limited', 'NCC', 'NCCBL', 1, '2025-11-14 04:23:30', '2025-11-14 04:30:11'),
(15, 'Mercantile Bank Limited', 'MBL', 'MBL', 1, '2025-11-14 04:23:30', '2025-11-15 16:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `banner`
--

CREATE TABLE `banner` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `home_slider` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banner`
--

INSERT INTO `banner` (`id`, `name`, `type`, `home_slider`, `banner_image`, `created_at`, `updated_at`) VALUES
(7, 'For Slider', 'slider', 'uploads/banner/thumb_1762003419.jpg', NULL, '2025-11-01 07:23:39', '2025-11-01 07:23:39'),
(8, 'For Slider', 'slider', 'uploads/banner/thumb_1762003424.jpg', NULL, '2025-11-01 07:23:44', '2025-11-01 07:23:44'),
(9, 'For Slider', 'slider', 'uploads/banner/thumb_1762003429.jpg', NULL, '2025-11-01 07:23:49', '2025-11-01 07:23:49'),
(14, 'For Top Banner', 'top_banner', NULL, 'uploads/banner/thumb_1762004608.jpg', '2025-11-01 07:43:28', '2025-11-01 07:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `bank_id` int(11) NOT NULL,
  `branch_name` varchar(255) NOT NULL,
  `branch_code` varchar(50) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `bank_id`, `branch_name`, `branch_code`, `district`, `city`, `address`, `phone`, `status`, `created_at`, `updated_at`) VALUES
(35, 1, 'IBBL Motijheel Branch', 'IBBL-MTJ', 'Dhaka', NULL, 'Motijheel, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(36, 1, 'IBBL Mirpur Branch', 'IBBL-MRP', 'Dhaka', NULL, 'Mirpur-10, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(37, 2, 'DBBL Uttara Branch', 'DBBL-UTR', 'Dhaka', NULL, 'Uttara, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(38, 2, 'DBBL Dhanmondi Branch', 'DBBL-DHM', 'Dhaka', NULL, 'Dhanmondi, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(39, 3, 'BRAC Gulshan Branch', 'BRAC-GLS', 'Dhaka', NULL, 'Gulshan-1, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(40, 3, 'BRAC Chittagong Branch', 'BRAC-CTG', 'Chittagong', NULL, 'Agrabad, Chittagong', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(41, 4, 'Sonali Motijheel Branch', 'SBL-MTJ', 'Dhaka', NULL, 'Motijheel, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(42, 4, 'Sonali Khulna Branch', 'SBL-KHL', 'Khulna', NULL, 'Khulna Sadar', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(43, 5, 'Janata Bank Motijheel Branch', 'JBL-MTJ', 'Dhaka', NULL, 'Motijheel, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(44, 5, 'Janata Bank Rajshahi Branch', 'JBL-RJS', 'Rajshahi', NULL, 'Rajshahi City', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(45, 6, 'UCBL Gulshan Branch', 'UCBL-GLS', 'Dhaka', NULL, 'Gulshan-2, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(46, 6, 'UCBL Chittagong Branch', 'UCBL-CTG', 'Chittagong', NULL, 'Jubilee Road, Chittagong', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(47, 7, 'EBL Banani Branch', 'EBL-BNN', 'Dhaka', NULL, 'Banani, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(48, 7, 'EBL Sylhet Branch', 'EBL-SLT', 'Sylhet', NULL, 'Zindabazar, Sylhet', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(49, 8, 'City Bank Dhanmondi Branch', 'CITY-DHM', 'Dhaka', NULL, 'Dhanmondi, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(50, 8, 'City Bank Khulna Branch', 'CITY-KHL', 'Khulna', NULL, 'Khulna City', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(51, 9, 'Prime Bank Motijheel Branch', 'PBL-MTJ', 'Dhaka', NULL, 'Motijheel, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(52, 9, 'Prime Bank Sylhet Branch', 'PBL-SLT', 'Sylhet', NULL, 'Sylhet City', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(53, 10, 'Pubali Bank Agrabad Branch', 'PUB-AGR', 'Chittagong', NULL, 'Agrabad, Chittagong', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(54, 10, 'Pubali Bank Lalmatia Branch', 'PUB-LMT', 'Dhaka', NULL, 'Lalmatia, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(55, 11, 'AB Bank Karwan Bazar Branch', 'ABBL-KWB', 'Dhaka', NULL, 'Karwan Bazar, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(56, 11, 'AB Bank Sylhet Branch', 'ABBL-SLT', 'Sylhet', NULL, 'Sylhet City', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(57, 12, 'Agrani Bank Motijheel Branch', 'AGR-MTJ', 'Dhaka', NULL, 'Motijheel, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(58, 12, 'Agrani Bank Bogura Branch', 'AGR-BGR', 'Bogura', NULL, 'Bogura Sadar', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(59, 13, 'Bank Asia Uttara Branch', 'BAL-UTR', 'Dhaka', NULL, 'Uttara, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(60, 13, 'Bank Asia Feni Branch', 'BAL-FNI', 'Feni', NULL, 'Feni Sadar', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(61, 14, 'NCC Dilkusha Branch', 'NCC-DLK', 'Dhaka', NULL, 'Dilkusha, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(62, 14, 'NCC Gazipur Branch', 'NCC-GZP', 'Gazipur', NULL, 'Gazipur Sadar', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(63, 15, 'Mercantile Bank Gulshan Branch', 'MBL-GLS', 'Dhaka', NULL, 'Gulshan Ave, Dhaka', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(64, 15, 'Mercantile Bank Cumilla Branch', 'MBL-CML', 'Cumilla', NULL, 'Cumilla City', NULL, 1, '2025-11-14 04:28:35', '2025-11-14 04:30:58'),
(65, 1, 'Branch name 22', '5898999', NULL, NULL, 'Address', '59989999', 1, '2025-11-15 17:02:35', '2025-11-15 17:02:35'),
(66, 1, 'branch name 22222222222222222', '234234234', NULL, NULL, 'Address', '85484888', NULL, '2025-11-15 17:05:19', '2025-11-15 17:19:44');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-spatie.permission.cache', 'a:3:{s:5:\"alias\";a:6:{s:1:\"a\";s:2:\"id\";s:1:\"b\";s:4:\"name\";s:1:\"c\";s:10:\"guard_name\";s:1:\"d\";s:9:\"role_type\";s:1:\"e\";s:9:\"parent_id\";s:1:\"r\";s:5:\"roles\";}s:11:\"permissions\";a:53:{i:0;a:6:{s:1:\"a\";i:1;s:1:\"b\";s:9:\"view rate\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:27;s:1:\"r\";a:1:{i:0;i:1;}}i:1;a:6:{s:1:\"a\";i:2;s:1:\"b\";s:11:\"create rate\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:27;s:1:\"r\";a:1:{i:0;i:1;}}i:2;a:6:{s:1:\"a\";i:3;s:1:\"b\";s:9:\"edit rate\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:27;s:1:\"r\";a:1:{i:0;i:1;}}i:3;a:5:{s:1:\"a\";i:4;s:1:\"b\";s:11:\"delete rate\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:27;}i:4;a:6:{s:1:\"a\";i:5;s:1:\"b\";s:10:\"view users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:28;s:1:\"r\";a:1:{i:0;i:1;}}i:5;a:6:{s:1:\"a\";i:6;s:1:\"b\";s:12:\"create users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:28;s:1:\"r\";a:1:{i:0;i:1;}}i:6;a:6:{s:1:\"a\";i:7;s:1:\"b\";s:10:\"edit users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:28;s:1:\"r\";a:1:{i:0;i:1;}}i:7;a:5:{s:1:\"a\";i:8;s:1:\"b\";s:12:\"delete users\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:28;}i:8;a:6:{s:1:\"a\";i:22;s:1:\"b\";s:9:\"view role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:31;s:1:\"r\";a:1:{i:0;i:1;}}i:9;a:5:{s:1:\"a\";i:23;s:1:\"b\";s:11:\"create role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:31;}i:10;a:6:{s:1:\"a\";i:24;s:1:\"b\";s:9:\"edit role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:3:\"1,2\";s:1:\"e\";i:31;s:1:\"r\";a:1:{i:0;i:1;}}i:11;a:5:{s:1:\"a\";i:25;s:1:\"b\";s:11:\"delete role\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:5:\"1,2,3\";s:1:\"e\";i:31;}i:12;a:5:{s:1:\"a\";i:26;s:1:\"b\";s:22:\"Update website setting\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:13;a:5:{s:1:\"a\";i:27;s:1:\"b\";s:4:\"Rate\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:14;a:5:{s:1:\"a\";i:28;s:1:\"b\";s:15:\"User Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:15;a:5:{s:1:\"a\";i:31;s:1:\"b\";s:15:\"Role Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:16;a:5:{s:1:\"a\";i:32;s:1:\"b\";s:21:\"Permission Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:17;a:6:{s:1:\"a\";i:33;s:1:\"b\";s:15:\"view permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:18;a:6:{s:1:\"a\";i:34;s:1:\"b\";s:17:\"create permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:19;a:6:{s:1:\"a\";i:35;s:1:\"b\";s:15:\"edit permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;s:1:\"r\";a:1:{i:0;i:1;}}i:20;a:5:{s:1:\"a\";i:36;s:1:\"b\";s:17:\"delete permission\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:32;}i:21;a:5:{s:1:\"a\";i:57;s:1:\"b\";s:5:\"Limit\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:22;a:6:{s:1:\"a\";i:58;s:1:\"b\";s:10:\"view limit\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:23;a:6:{s:1:\"a\";i:59;s:1:\"b\";s:12:\"create limit\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:24;a:6:{s:1:\"a\";i:60;s:1:\"b\";s:10:\"edit limit\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;s:1:\"r\";a:1:{i:0;i:1;}}i:25;a:5:{s:1:\"a\";i:61;s:1:\"b\";s:12:\"delete limit\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:57;}i:26;a:5:{s:1:\"a\";i:62;s:1:\"b\";s:3:\"Fee\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:27;a:6:{s:1:\"a\";i:63;s:1:\"b\";s:8:\"view fee\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:28;a:6:{s:1:\"a\";i:64;s:1:\"b\";s:10:\"create fee\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:29;a:6:{s:1:\"a\";i:65;s:1:\"b\";s:8:\"edit fee\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;s:1:\"r\";a:1:{i:0;i:1;}}i:30;a:5:{s:1:\"a\";i:66;s:1:\"b\";s:10:\"delete fee\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:62;}i:31;a:5:{s:1:\"a\";i:74;s:1:\"b\";s:17:\"Report Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:32;a:6:{s:1:\"a\";i:75;s:1:\"b\";s:11:\"view report\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:74;s:1:\"r\";a:1:{i:0;i:1;}}i:33;a:5:{s:1:\"a\";i:76;s:1:\"b\";s:22:\"Transaction Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:34;a:6:{s:1:\"a\";i:77;s:1:\"b\";s:16:\"view transaction\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:76;s:1:\"r\";a:1:{i:0;i:1;}}i:35;a:6:{s:1:\"a\";i:78;s:1:\"b\";s:18:\"create transaction\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:76;s:1:\"r\";a:1:{i:0;i:1;}}i:36;a:6:{s:1:\"a\";i:79;s:1:\"b\";s:16:\"edit transaction\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:76;s:1:\"r\";a:1:{i:0;i:1;}}i:37;a:5:{s:1:\"a\";i:80;s:1:\"b\";s:18:\"delete transaction\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:76;}i:38;a:5:{s:1:\"a\";i:81;s:1:\"b\";s:17:\"Wallet Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:39;a:6:{s:1:\"a\";i:82;s:1:\"b\";s:11:\"view wallet\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:81;s:1:\"r\";a:1:{i:0;i:1;}}i:40;a:6:{s:1:\"a\";i:83;s:1:\"b\";s:13:\"create wallet\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:81;s:1:\"r\";a:1:{i:0;i:1;}}i:41;a:6:{s:1:\"a\";i:84;s:1:\"b\";s:11:\"edit wallet\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:81;s:1:\"r\";a:1:{i:0;i:1;}}i:42;a:5:{s:1:\"a\";i:85;s:1:\"b\";s:13:\"delete wallet\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:81;}i:43;a:5:{s:1:\"a\";i:86;s:1:\"b\";s:15:\"Bank Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:44;a:6:{s:1:\"a\";i:87;s:1:\"b\";s:9:\"view bank\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:86;s:1:\"r\";a:1:{i:0;i:1;}}i:45;a:6:{s:1:\"a\";i:88;s:1:\"b\";s:11:\"create bank\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:86;s:1:\"r\";a:1:{i:0;i:1;}}i:46;a:6:{s:1:\"a\";i:89;s:1:\"b\";s:9:\"edit bank\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:86;s:1:\"r\";a:1:{i:0;i:1;}}i:47;a:5:{s:1:\"a\";i:90;s:1:\"b\";s:11:\"delete bank\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:86;}i:48;a:5:{s:1:\"a\";i:91;s:1:\"b\";s:17:\"Branch Management\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:0;}i:49;a:6:{s:1:\"a\";i:92;s:1:\"b\";s:11:\"view branch\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:91;s:1:\"r\";a:1:{i:0;i:1;}}i:50;a:6:{s:1:\"a\";i:93;s:1:\"b\";s:13:\"create branch\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:91;s:1:\"r\";a:1:{i:0;i:1;}}i:51;a:6:{s:1:\"a\";i:94;s:1:\"b\";s:11:\"edit branch\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:91;s:1:\"r\";a:1:{i:0;i:1;}}i:52;a:5:{s:1:\"a\";i:95;s:1:\"b\";s:13:\"delete branch\";s:1:\"c\";s:3:\"api\";s:1:\"d\";s:1:\"1\";s:1:\"e\";i:91;}}s:5:\"roles\";a:1:{i:0;a:4:{s:1:\"a\";i:1;s:1:\"b\";s:5:\"admin\";s:1:\"c\";s:3:\"api\";s:1:\"d\";i:1;}}}', 1763308792);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categorys`
--

CREATE TABLE `categorys` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `parent_id` int(11) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `status` int(11) DEFAULT NULL,
  `thumbnail_image` varchar(255) DEFAULT NULL,
  `banner_image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categorys`
--

INSERT INTO `categorys` (`id`, `name`, `slug`, `parent_id`, `sort_order`, `status`, `thumbnail_image`, `banner_image`, `created_at`, `updated_at`) VALUES
(1, 'Bir Tools', 'bir-tools', 0, 1, 1, 'uploads/categories/thumb_1761908947.gif', 'uploads/categories/thumb_1761909766.png', NULL, '2025-10-31 11:22:46'),
(2, 'Hardware', 'hardware', 0, 2, 1, 'uploads/categories/thumb_1761880670.gif', 'uploads/categories/thumb_1761911067.jpg', NULL, '2025-10-31 11:44:27'),
(3, 'Aluminium Level', 'aluminium-level', 1, 1, 1, NULL, NULL, NULL, NULL),
(4, 'Cutting Disc', 'cutting-disc', 1, 2, 1, NULL, NULL, NULL, NULL),
(5, 'Cutting Tools', 'cutting-tools', 1, 3, 1, NULL, NULL, NULL, NULL),
(6, 'Dril Bit', 'dril-bit', 1, 4, 1, NULL, NULL, NULL, NULL),
(7, 'File', 'file', 1, 5, 1, NULL, NULL, NULL, NULL),
(8, 'Hammer', 'hammer', 1, 6, 1, NULL, NULL, NULL, NULL),
(9, 'Hand Saw', 'hand-saw', 1, 7, 1, NULL, NULL, NULL, NULL),
(10, 'House Tools', 'house-tools', 1, 8, 1, NULL, NULL, NULL, NULL),
(11, 'LN Key', 'ln-key', 1, 9, 1, NULL, NULL, NULL, NULL),
(12, 'Pad Lock', 'pad-lock', 1, 10, 1, NULL, NULL, NULL, NULL),
(13, 'Plier', 'plier', 1, 11, 1, NULL, NULL, NULL, NULL),
(14, 'Power Tools', 'power-tools', 1, 12, 1, NULL, NULL, NULL, NULL),
(15, 'Professional Tools', 'professional-tools', 1, 13, 1, NULL, NULL, NULL, NULL),
(16, 'Rivet Gun', 'rivet-gun', 1, 14, 1, NULL, NULL, NULL, NULL),
(17, 'Royal Bolt', 'royal-bolt', 1, 15, 1, NULL, NULL, NULL, NULL),
(18, 'Safety Iteam', 'safety-iteam', 1, 16, 1, NULL, NULL, NULL, NULL),
(19, 'Sanitary Tools', 'sanitary-tools', 1, 17, 1, NULL, NULL, NULL, NULL),
(20, 'Screw Driver', 'screw-driver', 1, 18, 1, NULL, NULL, NULL, NULL),
(21, 'Socket', 'socket', 1, 19, 1, NULL, NULL, NULL, NULL),
(22, 'Spanner', 'spanner', 1, 20, 1, NULL, NULL, NULL, NULL),
(23, 'Spare Parts-Power Tools', 'spare-parts-power-tools', 1, 21, 1, NULL, NULL, NULL, NULL),
(24, 'Tape', 'tape', 1, 22, 1, NULL, NULL, NULL, NULL),
(25, 'Wrench', 'wrench', 1, 23, 1, NULL, NULL, NULL, NULL),
(26, 'Water Proofing', 'water-proofing', 1, 24, 1, NULL, NULL, NULL, NULL),
(27, 'Aluminium ladder - Industrial Grade I7100', 'aluminium-ladder-industrial-grade-i7100', 2, 1, 1, NULL, NULL, NULL, NULL),
(28, 'Aluminium ladder - Household Grade 1000', 'aluminium-ladder-household-grade-1000', 2, 2, 1, NULL, NULL, NULL, NULL),
(29, 'Aluminium ladder - Household Grade 700', 'aluminium-ladder-household-grade-700', 2, 3, 1, NULL, NULL, NULL, NULL),
(30, 'Concrete Nail - MS', 'concrete-nail-ms', 2, 4, 1, NULL, NULL, NULL, NULL),
(31, 'Stainless Steel Screws', 'stainless-steel-screws', 2, 5, 1, NULL, NULL, NULL, NULL),
(32, 'Brad Nails', 'brad-nails', 2, 6, 1, NULL, NULL, NULL, NULL),
(33, 'Foldable Cloth Drying Rack', 'foldable-cloth-drying-rack', 2, 7, 1, NULL, NULL, NULL, NULL),
(56, 'Round Lock- SS Sheet -58 MM Knob.80 MM Rose Plate-Brass Key', 'round-lock-ss-sheet-58-mm-knob-80-mm-rose-plate-brass-key', 2, 8, 1, NULL, NULL, NULL, NULL),
(57, 'Round Lock- Zinc-58 MM Knob.80 MM Rose Plate-Brass Key', 'round-lock-zinc-58-mm-knob-80-mm-rose-plate-brass-key', 2, 9, 1, NULL, NULL, NULL, NULL),
(58, 'Handle Lock -Medium- 85 MM X 45 MM. SS Body. Cylinder & Latch Brass with SB Finish. 4 Pcs Computer key', 'handle-lock-medium-85-mm-x-45-mm-ss-body-cylinder-latch-brass-with-sb-finish-4-pcs-computer-key', 2, 10, 1, NULL, NULL, NULL, NULL),
(59, 'Aluminium Handle Lock -Medium- 85 MM X 45 MM. SS Body. Cylinder & Latch Brass With SB Finish. 4 Pcs Computer key', 'aluminium-handle-lock-medium-85-mm-x-45-mm-ss-body-cylinder-latch-brass-with-sb-finish-4-pcs-computer-key', 2, 11, 1, NULL, NULL, NULL, NULL),
(60, 'Handle Lock -Small - 58 MM X 45 MM. SS Body. Cylinder & Latch Brass with SB Finish. 4 Pcs Computer key', 'handle-lock-small-58-mm-x-45-mm-ss-body-cylinder-latch-brass-with-sb-finish-4-pcs-computer-key', 2, 12, 1, NULL, NULL, NULL, NULL),
(61, 'Handle Lock -Big - 68 MM X 60 MM. SS Body. Cylinder & Latch Brass With SB Finish.', 'handle-lock-big-68-mm-x-60-mm-ss-body-cylinder-latch-brass-with-sb-finish', 2, 13, 1, NULL, NULL, NULL, NULL),
(62, 'Dead Bolt / Security Lock', 'dead-bolt-security-lock', 2, 14, 1, NULL, NULL, NULL, NULL),
(63, 'Door Stopper', 'door-stopper', 2, 15, 1, NULL, NULL, NULL, NULL),
(64, 'Door Viewer', 'door-viewer', 2, 16, 1, NULL, NULL, NULL, NULL),
(65, 'Door Chain-Zinc', 'door-chain-zinc', 2, 17, 1, NULL, NULL, NULL, NULL),
(66, 'Door Knocker with Viewer-Zinc', 'door-knocker-with-viewer-zinc', 2, 18, 1, NULL, NULL, NULL, NULL),
(67, 'Door Closer', 'door-closer', 2, 19, 1, NULL, NULL, NULL, NULL),
(68, 'Rim Lock-Iron', 'rim-lock-iron', 2, 20, 1, NULL, NULL, NULL, NULL),
(69, 'Liver Lock-High Quality', 'liver-lock-high-quality', 2, 21, 1, NULL, NULL, NULL, NULL),
(70, 'Piano Hinge', 'piano-hinge', 2, 23, 1, NULL, NULL, NULL, NULL),
(71, 'Drawer Lock-Zinc', 'drawer-lock-zinc', 2, 24, 1, NULL, NULL, NULL, NULL),
(72, 'Hydrolic & Normal Concealed Hinge', 'hydrolic-normal-concealed-hinge', 2, 25, 1, NULL, NULL, NULL, NULL),
(73, 'Painting Tools 6\" Roller', 'painting-tools-6-inch-roller', 2, 26, 1, NULL, NULL, NULL, NULL),
(74, 'Painting Tools 7\" Roller', 'painting-tools-7-inch-roller', 2, 27, 1, NULL, NULL, NULL, NULL),
(75, 'Sponge Kit', 'sponge-kit', 2, 28, 1, NULL, NULL, NULL, NULL),
(76, 'Tower Bolt', 'tower-bolt', 2, 29, 1, NULL, NULL, NULL, NULL),
(77, 'Foldable Clothes Drying Racks', 'foldable-clothes-drying-racks', 0, 3, 1, 'uploads/categories/thumb_1761909117.gif', 'uploads/categories/thumb_1761968367.png', NULL, '2025-11-01 03:39:27'),
(78, 'Vikars Ladder', 'vikars-ladder', 0, 4, 1, 'uploads/categories/thumb_1761909181.gif', 'uploads/categories/thumb_1761966547.jpg', NULL, '2025-11-01 03:09:07'),
(79, 'WD-40 Anti Rust Spray', 'wd-40-anti-rust-spray', 0, 5, 1, 'uploads/categories/thumb_1761909067.gif', 'uploads/categories/thumb_1761966831.jpg', NULL, '2025-11-01 03:13:51'),
(80, 'Makita Power Tools', 'makita-power-tools', 0, 6, 1, 'uploads/categories/thumb_1761908999.gif', 'uploads/categories/thumb_1761968977.png', NULL, '2025-11-01 03:49:37'),
(81, 'Spare Parts-Power Tools', 'spare-part-pwr-tools', 0, 7, 1, NULL, NULL, NULL, NULL),
(82, 'Water Proofing', 'water-proofing-products', 0, 8, 1, NULL, NULL, NULL, '2025-10-31 11:04:58');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fees`
--

CREATE TABLE `fees` (
  `id` int(11) NOT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `from_bdt` decimal(10,2) DEFAULT NULL,
  `to_bdt` decimal(10,2) DEFAULT NULL,
  `fee_gbp` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fees`
--

INSERT INTO `fees` (`id`, `paymentMethod`, `from_bdt`, `to_bdt`, `fee_gbp`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Wallet', 1.00, 10000.00, 2.00, 1, '2025-11-08 04:49:35', '2025-11-08 04:49:35'),
(2, 'Wallet', 10001.00, 20000.00, 2.50, 1, '2025-11-08 04:49:59', '2025-11-08 04:49:59'),
(3, 'Wallet', 20001.00, 30000.00, 3.00, 1, '2025-11-08 04:50:19', '2025-11-10 19:46:14'),
(4, 'Wallet', 30001.00, 40000.00, 4.00, 1, '2025-11-08 04:50:54', '2025-11-10 19:46:39'),
(5, 'Wallet', 40001.00, 50000.00, 5.00, 1, '2025-11-08 04:52:01', '2025-11-08 04:52:01'),
(6, 'Bank', 1.00, 10000.00, 3.00, 1, '2025-11-08 04:52:47', '2025-11-08 04:53:27'),
(7, 'Bank', 10001.00, 20000.00, 4.00, 1, '2025-11-08 04:53:48', '2025-11-08 04:53:48'),
(8, 'Bank', 20001.00, 30000.00, 5.00, 1, '2025-11-08 04:54:10', '2025-11-08 04:54:10');

-- --------------------------------------------------------

--
-- Table structure for table `fees_log`
--

CREATE TABLE `fees_log` (
  `fees_id` int(11) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `from_bdt` decimal(10,2) DEFAULT NULL,
  `to_bdt` decimal(10,2) DEFAULT NULL,
  `fee_gbp` decimal(10,2) DEFAULT NULL,
  `type` varchar(50) NOT NULL COMMENT 'Create,Update',
  `created_by` varchar(255) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fees_log`
--

INSERT INTO `fees_log` (`fees_id`, `paymentMethod`, `from_bdt`, `to_bdt`, `fee_gbp`, `type`, `created_by`, `update_by`, `created_at`, `updated_at`) VALUES
(1, 'Wallet', 1.00, 10000.00, 2.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:49:35', '2025-11-08 04:49:35'),
(2, 'Wallet', 10001.00, 20000.00, 2.50, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:49:59', '2025-11-08 04:49:59'),
(3, 'Wallet', 20001.00, 30000.00, 3.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:50:19', '2025-11-08 04:50:19'),
(4, 'Wallet', 40001.00, 50000.00, 5.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:50:54', '2025-11-08 04:50:54'),
(3, 'Wallet', 30001.00, 40000.00, 4.00, 'update', NULL, 'Bijon Ahmed', '2025-11-08 04:51:28', '2025-11-08 04:51:28'),
(5, 'Wallet', 40001.00, 50000.00, 5.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:52:01', '2025-11-08 04:52:01'),
(6, 'Bank', 20001.00, 30000.00, 5.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:52:47', '2025-11-08 04:52:47'),
(6, 'Bank', 1.00, 10000.00, 3.00, 'update', NULL, 'Bijon Ahmed', '2025-11-08 04:53:27', '2025-11-08 04:53:27'),
(7, 'Bank', 10001.00, 20000.00, 4.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:53:48', '2025-11-08 04:53:48'),
(8, 'Bank', 20001.00, 30000.00, 5.00, 'create', 'Bijon Ahmed', NULL, '2025-11-08 04:54:10', '2025-11-08 04:54:10'),
(3, 'Wallet', 20001.00, 30000.00, 3.00, 'update', NULL, 'Bijon Ahmed', '2025-11-10 19:46:14', '2025-11-10 19:46:14'),
(4, 'Wallet', 30001.00, 40000.00, 4.00, 'update', NULL, 'Bijon Ahmed', '2025-11-10 19:46:39', '2025-11-10 19:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `limits`
--

CREATE TABLE `limits` (
  `id` int(11) NOT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `walletTypeId` int(11) DEFAULT NULL,
  `maxLimit` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `limits`
--

INSERT INTO `limits` (`id`, `paymentMethod`, `walletTypeId`, `maxLimit`, `created_by`, `created_at`, `updated_at`) VALUES
(3, 'Wallet', 2, 333.00, 1, '2025-11-08 06:35:38', '2025-11-08 06:35:38'),
(4, 'Bank', NULL, 700.00, 1, '2025-11-08 06:35:53', '2025-11-08 06:39:29'),
(5, 'Wallet', 1, 33.00, 1, '2025-11-08 06:40:00', '2025-11-08 06:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `limits_log`
--

CREATE TABLE `limits_log` (
  `limit_id` int(11) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `walletTypeId` varchar(200) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `maxLimit` decimal(10,2) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `limits_log`
--

INSERT INTO `limits_log` (`limit_id`, `paymentMethod`, `walletTypeId`, `type`, `maxLimit`, `created_by`, `update_by`, `created_at`, `updated_at`) VALUES
(3, 'Wallet', 'Bkash', 'create', 333.00, 'Bijon Ahmed', NULL, '2025-11-08 06:35:38', '2025-11-08 06:35:38'),
(4, 'Bank', '', 'create', 333.00, 'Bijon Ahmed', NULL, '2025-11-08 06:35:53', '2025-11-08 06:35:53'),
(4, 'Bank', '', 'update', 500.00, NULL, NULL, '2025-11-08 06:37:48', '2025-11-08 06:37:48'),
(4, 'Bank', '', 'update', 700.00, NULL, 'Bijon Ahmed', '2025-11-08 06:39:29', '2025-11-08 06:39:29'),
(5, 'Wallet', 'Nagad', 'create', 33.00, 'Bijon Ahmed', NULL, '2025-11-08 06:40:00', '2025-11-08 06:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_09_160506_create_permission_tables', 2);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `model_has_roles`
--

INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES
(1, 'App\\Models\\User', 1),
(1, 'App\\Models\\User', 4),
(1, 'App\\Models\\User', 19),
(2, 'App\\Models\\User', 2),
(2, 'App\\Models\\User', 3),
(2, 'App\\Models\\User', 5),
(2, 'App\\Models\\User', 8),
(2, 'App\\Models\\User', 9),
(2, 'App\\Models\\User', 11),
(2, 'App\\Models\\User', 12),
(2, 'App\\Models\\User', 14),
(2, 'App\\Models\\User', 15),
(2, 'App\\Models\\User', 16),
(2, 'App\\Models\\User', 17),
(2, 'App\\Models\\User', 18);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `customer_id` int(11) DEFAULT NULL COMMENT 'ref users table role_id=2',
  `shipping_phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `coupons` text DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `payment_type` varchar(255) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL COMMENT '%',
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `grand_total` decimal(10,2) DEFAULT NULL,
  `advance` decimal(10,2) DEFAULT NULL,
  `due` decimal(10,2) DEFAULT NULL,
  `order_status` int(11) NOT NULL DEFAULT 1 COMMENT '1=Pending\r\n2=Order Received\r\n3=Shipped\r\n4=Out for Delivery\r\n5=Delivered\r\n6=Cancelled\r\n7=Returned\r\n8=Refunded\r\n9=Return complete\r\n',
  `bkash_number` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `paymentMethod` varchar(255) DEFAULT NULL,
  `devliery_charge` decimal(10,2) DEFAULT NULL,
  `order_type` int(1) NOT NULL COMMENT '1=online\r\n2=instant_order',
  `coupon_code` varchar(255) DEFAULT NULL,
  `coupon_offer_status` int(11) DEFAULT NULL,
  `orderUpdateDate` date DEFAULT NULL,
  `orderUpdateby` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_history`
--

CREATE TABLE `order_history` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `attribue_id` int(11) DEFAULT NULL,
  `variation_value` varchar(255) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Pending', 'The order has been placed but not yet confirmed or paid.', 1, '2023-12-04 11:15:23', '2023-12-04 05:55:06'),
(2, 'Order Received', 'Payment has been received (for prepaid), and the order is being prepared.', 1, '2023-12-04 11:15:23', '2023-12-04 05:55:48'),
(3, 'Shipped', 'The order has been dispatched from the warehouse and is in transit.', 1, '2023-12-04 11:15:23', '2023-12-04 05:56:14'),
(4, 'Out for Delivery', 'The order is with the delivery agent and will reach the customer soon.', 1, '2023-12-04 11:15:23', '2023-12-04 05:56:45'),
(5, 'Delivered', 'The order has successfully reached the customer.', 1, '2023-12-04 11:15:23', '2023-12-04 05:57:14'),
(6, 'Cancelled', 'The order has been cancelled either by the user or the system (e.g., due to payment failure or stock issues).', 1, '2023-12-04 11:15:23', '2023-12-04 05:57:42'),
(7, 'Returned', 'The customer has returned the product after delivery.', 1, '2023-12-04 11:15:23', '2023-12-04 05:58:19'),
(8, 'Refunded', 'Returning', 1, '2023-12-04 11:15:23', '2023-12-04 05:58:53'),
(9, 'Return complete', 'A refund has been initiated and processed for the customer.', 1, '2023-12-04 11:15:23', '2023-12-04 05:59:17');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `role_type` varchar(255) DEFAULT NULL COMMENT '1=admin, 2=Editor, 3=Viewer, 4=General Post 5=Product Manage 6=User Manage ',
  `parent_id` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `role_type`, `parent_id`, `created_at`, `updated_at`) VALUES
(1, 'view rate', 'api', '1,2,3', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(2, 'create rate', 'api', '1,2', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(3, 'edit rate', 'api', '1,2', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(4, 'delete rate', 'api', '1,2,3', 27, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(5, 'view users', 'api', '1,2,3', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(6, 'create users', 'api', '1,2', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(7, 'edit users', 'api', '1,2', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(8, 'delete users', 'api', '1,2,3', 28, '2025-10-09 14:53:43', '2025-10-09 14:53:43'),
(22, 'view role', 'api', '1,2,3', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(23, 'create role', 'api', '1,2', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(24, 'edit role', 'api', '1,2', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(25, 'delete role', 'api', '1,2,3', 31, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(26, 'Update website setting', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(27, 'Rate', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(28, 'User Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(31, 'Role Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(32, 'Permission Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(33, 'view permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(34, 'create permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(35, 'edit permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(36, 'delete permission', 'api', '1', 32, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(57, 'Limit', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(58, 'view limit', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(59, 'create limit', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(60, 'edit limit', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(61, 'delete limit', 'api', '1', 57, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(62, 'Fee', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(63, 'view fee', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(64, 'create fee', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(65, 'edit fee', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(66, 'delete fee', 'api', '1', 62, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(74, 'Report Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(75, 'view report', 'api', '1', 74, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(76, 'Transaction Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(77, 'view transaction', 'api', '1', 76, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(78, 'create transaction', 'api', '1', 76, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(79, 'edit transaction', 'api', '1', 76, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(80, 'delete transaction', 'api', '1', 76, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(81, 'Wallet Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(82, 'view wallet', 'api', '1', 81, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(83, 'create wallet', 'api', '1', 81, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(84, 'edit wallet', 'api', '1', 81, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(85, 'delete wallet', 'api', '1', 81, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(86, 'Bank Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(87, 'view bank', 'api', '1', 86, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(88, 'create bank', 'api', '1', 86, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(89, 'edit bank', 'api', '1', 86, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(90, 'delete bank', 'api', '1', 86, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(91, 'Branch Management', 'api', '1', 0, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(92, 'view branch', 'api', '1', 91, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(93, 'create branch', 'api', '1', 91, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(94, 'edit branch', 'api', '1', 91, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(95, 'delete branch', 'api', '1', 91, '2025-10-09 10:09:35', '2025-10-09 10:09:35');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `description_short` text DEFAULT NULL,
  `description_full` text DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keyword` text DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `categoryId` int(11) DEFAULT NULL COMMENT 'Post Category ID \r\n1=pdf\r\n2=torrent',
  `entry_by` int(11) DEFAULT NULL,
  `thumnail_img` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(4, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(5, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(6, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(7, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(8, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(9, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(10, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(11, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(12, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(13, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(14, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(15, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(16, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(17, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(18, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(19, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(20, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33');
INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(21, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(22, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(23, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(24, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(25, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(26, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(27, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(28, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(29, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(30, 'Vogexi Return & Refund Policy', 'vogexi-return-refund-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, we \r\nwant you to love every purchase you make. If you’re not completely \r\nsatisfied with your order, we’re here to help with an easy and \r\ntransparent return process.</p><p class=\"about__content--desc mb-20\"><strong>1. Return Eligibility:</strong> Products are eligible for return within <strong>7 days</strong>\r\n of delivery, provided they are unused, unwashed, in original packaging,\r\n and with all tags intact. Items showing signs of wear or damage may not\r\n be eligible.</p><p class=\"about__content--desc mb-20\"><strong>2. Non-Returnable Items:</strong> The following items are not eligible for return:</p><ul><li>Personal care and hygiene products</li><li>Customized or made-to-order items</li><li>Items marked as \"Final Sale\"</li><li>Opened electronics and accessories</li></ul><p></p><p class=\"about__content--desc mb-20\"><strong>3. Return Process:</strong> To initiate a return, please contact our customer service team at <a href=\"http://localhost:5173/contact\">Contact Us</a> with your order number and reason for return. Our team will guide you through the next steps.</p><p class=\"about__content--desc mb-20\"><strong>4. Return Shipping:</strong>\r\n Return shipping charges are the responsibility of the customer unless \r\nthe item was defective or sent in error. Please ensure the product is \r\nsecurely packaged to avoid damage in transit.</p><p class=\"about__content--desc mb-20\"><strong>5. Refunds:</strong> Once we receive and inspect the returned item, a refund will be issued to your original payment method within <strong>5–10 business days</strong>. You will be notified via email once your refund has been processed.</p><p class=\"about__content--desc mb-20\"><strong>6. Exchanges:</strong> If you wish to exchange an item for a different size or variant, please return the original item and place a new order.</p><p class=\"about__content--desc mb-20\"><strong>7. Damaged or Wrong Items:</strong> If you receive a damaged, defective, or incorrect item, please contact us within <strong>48 hours</strong> of delivery with photo evidence. We will arrange a replacement or full refund as quickly as possible.</p><p class=\"about__content--desc mb-20\"><strong>8. Policy Updates:</strong>\r\n Vogexi reserves the right to modify this return policy at any time. \r\nUpdates will be posted on this page, so we recommend reviewing it \r\nregularly.</p><p class=\"about__content--desc mb-20\">For further assistance, feel free to reach out to our support team at any time. Your satisfaction is our priority.</p><p><br></p>', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', 'Vogexi Return & Refund Policy', NULL, NULL, 5, 1, NULL, 1, '2025-07-29 18:05:33', '2025-07-29 18:05:33'),
(31, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(32, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(33, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(34, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(35, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(36, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52');
INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(37, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(38, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(39, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(40, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(41, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(42, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(43, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(44, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(45, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(46, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(47, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(48, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(49, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(50, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(51, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52');
INSERT INTO `posts` (`id`, `name`, `slug`, `description_short`, `description_full`, `meta_title`, `meta_description`, `meta_keyword`, `question`, `answer`, `categoryId`, `entry_by`, `thumnail_img`, `status`, `created_at`, `updated_at`) VALUES
(52, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(53, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(54, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52'),
(55, 'Vogexi Privacy Policy', 'vogexi-privacy-policy', '', '<p class=\"about__content--desc mb-20\">At <strong>Vogexi</strong>, your \r\nprivacy is our priority. This Privacy Policy outlines how we collect, \r\nuse, and safeguard your personal information when you visit or make a \r\npurchase from our website.</p><p class=\"about__content--desc mb-20\"><strong>1. Information We Collect:</strong>\r\n We may collect personal information such as your name, phone number, \r\nemail address, billing/shipping address, and payment details when you \r\nregister, place an order, or contact us.</p><p class=\"about__content--desc mb-20\"><strong>2. How We Use Your Information:</strong>\r\n The information we collect is used to process your orders, deliver \r\nproducts, respond to inquiries, send updates or promotions, and improve \r\nyour overall experience with Vogexi.</p><p class=\"about__content--desc mb-20\"><strong>3. Protection of Your Data:</strong>\r\n We implement a variety of security measures to maintain the safety of \r\nyour personal data. Your sensitive information is encrypted using \r\nindustry-standard protocols during transmission and securely stored.</p><p class=\"about__content--desc mb-20\"><strong>4. Sharing Your Information:</strong>\r\n We do not sell, trade, or rent your personal information to others. \r\nYour data may only be shared with trusted third parties who assist us in\r\n operating our website or servicing you — and only under strict \r\nconfidentiality agreements.</p><p class=\"about__content--desc mb-20\"><strong>5. Cookies &amp; Tracking Technologies:</strong>\r\n Our website uses cookies to personalize content, analyze traffic, and \r\nenhance your browsing experience. You may choose to disable cookies \r\nthrough your browser settings, though some site features may not \r\nfunction properly as a result.</p><p class=\"about__content--desc mb-20\"><strong>6. Third-Party Links:</strong>\r\n Our site may contain links to third-party websites. We are not \r\nresponsible for the privacy practices or content of those sites. We \r\nencourage users to read their privacy policies before sharing any \r\npersonal information.</p><p class=\"about__content--desc mb-20\"><strong>7. Your Rights:</strong>\r\n You have the right to access, correct, or delete your personal data \r\nstored with us. To make such a request, please contact our support team \r\nvia our <a href=\"http://localhost:5173/contact\">Contact Us</a> page.</p><p class=\"about__content--desc mb-20\"><strong>8. Updates to This Policy:</strong>\r\n Vogexi reserves the right to modify this privacy policy at any time. \r\nAll updates will be posted on this page. We recommend reviewing this \r\npolicy regularly to stay informed about how we protect your information.</p><p class=\"about__content--desc mb-20\">By\r\n using our website, you agree to the terms outlined in this Privacy \r\nPolicy. If you have any questions or concerns, feel free to reach out to\r\n us directly.</p><p><br></p>', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', 'Vogexi Privacy Policy', NULL, NULL, 4, 1, NULL, 1, '2025-07-29 18:04:52', '2025-07-29 18:04:52');

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE `post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `post_category`
--

INSERT INTO `post_category` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'About Us', 1, '2025-10-11 19:01:22', '2025-10-11 13:01:35'),
(2, 'Terms & Conditions', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22'),
(4, 'Privacy Policy', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22'),
(5, 'Return Policy', 1, '2025-10-11 19:01:22', '2025-10-11 19:01:22');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `role_type` int(11) NOT NULL COMMENT '1=admin,\r\n2=Editor,\r\n3=Viewer,\r\n4=General Post\r\n5=Product Manage\r\n6=User Manage\r\n\r\n\r\n',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `guard_name`, `role_type`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'api', 1, '2025-10-09 10:09:35', '2025-10-09 10:09:35'),
(2, 'agent', 'api', 2, '2025-10-09 10:09:35', '2025-10-09 10:09:35');

-- --------------------------------------------------------

--
-- Table structure for table `roles_type`
--

CREATE TABLE `roles_type` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `roles_type`
--

INSERT INTO `roles_type` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'api', '2023-01-08 12:10:18', '2023-01-08 12:10:18'),
(2, 'Agent', 'api', '2023-01-23 14:58:53', '2023-01-23 14:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_has_permissions`
--

INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(5, 1),
(6, 1),
(7, 1),
(22, 1),
(24, 1),
(33, 1),
(34, 1),
(35, 1),
(58, 1),
(59, 1),
(60, 1),
(63, 1),
(64, 1),
(65, 1),
(75, 1),
(77, 1),
(78, 1),
(79, 1),
(82, 1),
(83, 1),
(84, 1),
(87, 1),
(88, 1),
(89, 1),
(92, 1),
(93, 1),
(94, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('45qwWuWBckitiwDqVuo4s1TTO8lMFvtwNboZ1cxP', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiU2hPMUVmWHltN1FiaXNjQXpyR01mM1gxUUdSV0tUTXpkaW1UV1hDdiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763178451),
('5JQ31BUynI7Ox0EhO6j5YF7cspS9XjbeMkVB57R2', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoicFNUMzB4WXVMZnRoTGs0ZzJNNEc0elhZNXFBNmM1M2l5OUdKWDNiSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763178441),
('5pL7wYY8NG3dNCh0rTXfIGNCDXptS274xJUtT9pb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNGJ2RTh2ZEI3OEkyR1ZkVzdCR0NMbVJQUjVEMlVnTHhRZGJaa21sQiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1762543317),
('efs7tipJ5EzeJnZ0auszXc5CNzyTIWobHe7NckLf', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiOFFIWURSd1VpRjROSUdTWmhoOXdjdkNOU1ZhYWFjSzN6Y0ZDakdGTiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761881044),
('iAKJpaVSwUSnDld3LbNvU8A6GSOOMrh24jFQVoBb', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoieHBtOThhb1BjY1QzUkNGVVpvM2h3eTM1a25GMlNNaDE2Q2RsakdBMSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761881086),
('tXMytEVVuxRjFPeXFJbX0bzGYSefDpqOTLutkngR', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiT1BmQnE0SlJFM2tjRWdGbkNYMzI0ZE41Q0ZNdURyc24zUnFEaHBteSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763178441),
('VSjdrNnBmkmgGhlTy88YdIg39LNr5Qcx4RvHxK2G', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN3B0cjg5Z1k5RENldjhoanVnOGlWUzdNSHdWdUlLcXFEdDZ2T0VUSCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761881021),
('yUqxBxvzTzBBfL39RxxrUSSccrqX26ZTOcfsAlfD', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiZ3lRVnhFaVN6cXhBYVFuNlBDakNkZmd6U2FxM1Z6NmFJaWFIclV6RiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1763178451);

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` mediumtext NOT NULL,
  `whatsApp` varchar(255) NOT NULL,
  `bkash_number` varchar(255) DEFAULT NULL,
  `emergency` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `description` mediumtext NOT NULL,
  `copyright` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `admin_photo` varchar(244) NOT NULL,
  `admin_name` varchar(255) NOT NULL,
  `admin_email` varchar(255) NOT NULL,
  `admin_phone` varchar(255) NOT NULL,
  `sending_currency` varchar(100) DEFAULT NULL,
  `receiving_currency` varchar(100) DEFAULT NULL,
  `exchange_rate_wallet` decimal(10,2) NOT NULL,
  `exchange_rate_bank` decimal(10,2) NOT NULL,
  `meta_keywords` mediumtext DEFAULT NULL,
  `meta_description` mediumtext DEFAULT NULL,
  `pphoto` varchar(255) NOT NULL,
  `bg_color` varchar(255) DEFAULT NULL,
  `currency` varchar(150) DEFAULT NULL,
  `reffer_bonus` int(11) DEFAULT NULL,
  `fblink` varchar(255) DEFAULT NULL,
  `twitterlink` varchar(255) DEFAULT NULL,
  `linkdinlink` varchar(255) DEFAULT NULL,
  `instragramlink` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `update_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `name`, `tel`, `email`, `address`, `whatsApp`, `bkash_number`, `emergency`, `photo`, `description`, `copyright`, `status`, `admin_photo`, `admin_name`, `admin_email`, `admin_phone`, `sending_currency`, `receiving_currency`, `exchange_rate_wallet`, `exchange_rate_bank`, `meta_keywords`, `meta_description`, `pphoto`, `bg_color`, `currency`, `reffer_bonus`, `fblink`, `twitterlink`, `linkdinlink`, `instragramlink`, `website`, `telegram`, `update_by`, `created_at`, `updated_at`) VALUES
(1, 'XMG REMIT', '+880 1301-047166', 'info@xmg.com', '57,agpara sylhet', '#', '01740586574', '+880 1301-047166', 'pic/2tAjiUpJ0X8GziIrKJJJ.png', 'XMG REMIT is a trusted and secure international money transfer company dedicated to connecting families, friends, and businesses across borders. We make sending and receiving money simple, fast, and affordable — anytime, anywhere.\n\nOur mission is to empower people with reliable financial solutions that bridge distances and support economic growth. Whether you’re sending funds to loved ones, paying for services abroad, or managing business payments, XMG REMIT ensures your transactions are safe, transparent, and delivered on time.\n\nWe combine cutting-edge digital technology with strong global partnerships to provide seamless remittance services across multiple countries. Every transfer is backed by advanced encryption, real-time tracking, and 24/7 customer support — giving our customers confidence and peace of mind.\n\nAt XMG REMIT, we believe in more than just money transfers — we believe in strengthening human connections, supporting communities, and making global remittance easier for everyone.\n\nFast. Secure. Reliable.\nThat’s the XMG REMIT promise.', 'Copyright © 2025 xmgremit. All Rights Reserved', 1, 'pic/ZOdc8nsWAMY1YELkp9zH.jpg', 'admin', 'info@admin.com', '+44245454545', 'GBP', 'BDT', 158.00, 1.00, NULL, NULL, '', '#ffffff', '', 5, '#', 'https://www.facebook.com', 'https://web.whatsapp.com/', '#', '#', '#', 1, '2024-05-12 05:32:50', '2025-11-08 05:25:44');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'KAI INTERNATIONAL LTD', 1, '2025-11-03 00:09:06', '2025-11-03 00:09:06'),
(2, 'KGI HARDWARE ACCESSORIES LTD.', 1, '2025-11-03 00:09:16', '2025-11-03 00:09:16'),
(3, 'BIR METAL ENGINEERING & MANUFACTURING CO. LTD.', 1, '2025-11-03 00:09:30', '2025-11-03 00:09:30'),
(4, 'XINPENG-BIR INDUSTRIAL CO. LTD.', 1, '2025-11-03 00:09:49', '2025-11-03 00:09:49');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `beneficiaryName` varchar(100) DEFAULT NULL,
  `beneficiaryPhone` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `wallet_id` int(11) DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `branchCode` varchar(50) DEFAULT NULL,
  `accountNo` varchar(50) DEFAULT NULL,
  `walletrate` decimal(10,2) DEFAULT 0.00,
  `bankRate` decimal(10,2) DEFAULT 0.00,
  `charges` decimal(15,2) DEFAULT NULL,
  `fee` decimal(15,2) DEFAULT NULL,
  `totalAmount` decimal(15,2) DEFAULT NULL,
  `sendingMoney` decimal(15,2) DEFAULT NULL,
  `senderName` varchar(100) DEFAULT NULL,
  `receiving_money` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `created_at` varchar(100) NOT NULL,
  `updated_at` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions_log`
--

CREATE TABLE `transactions_log` (
  `transaction_id` int(11) NOT NULL,
  `beneficiaryName` varchar(100) DEFAULT NULL,
  `beneficiaryPhone` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `wallet_id` int(11) DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `branchCode` varchar(50) DEFAULT NULL,
  `accountNo` varchar(50) DEFAULT NULL,
  `walletrate` decimal(10,2) DEFAULT 0.00,
  `bankRate` decimal(10,2) DEFAULT 0.00,
  `charges` decimal(15,2) DEFAULT NULL,
  `fee` decimal(15,2) DEFAULT NULL,
  `totalAmount` decimal(15,2) DEFAULT NULL,
  `sendingMoney` decimal(15,2) DEFAULT NULL,
  `senderName` varchar(100) DEFAULT NULL,
  `receiving_money` decimal(15,2) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role_type` int(11) DEFAULT NULL,
  `agentCode` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `entry_by` int(11) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `role_type`, `agentCode`, `email_verified_at`, `password`, `phone_number`, `address`, `facebook`, `website`, `github`, `twitter`, `instagram`, `status`, `entry_by`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Bijon Ahmed', 'mdbijon@gmail.com', NULL, 'JAHERANDSONS@GMAIL.COM2', NULL, '$2y$10$hLHiwDhNeiVKcU8bm9LYn.YjUHARvm26.o8ipX5KJCJuDCuo.Yyem', '01915728982', 'DHK', 'https://www.facebook.com/watch/?ref=tab', '', '', '', '', 1, 1, NULL, '2025-10-09 10:28:23', '2025-11-04 02:25:44'),
(2, 'MAHFUZUR RAHMAN CHOWDHURY', 'MAHFUZ@GMAIL.COM', 2, 'MAHFUZ@GMAIL.COM', NULL, '$2y$12$xOUvAnlEEGOcWejndLLUD.4JXzhvHqMWv5KM2PYYb3BjJ2Ua8W0ru', '01915728988', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(3, 'JAHER AND SONS LIMITED', 'JAHERANDSONS@GMAIL.COM', 2, 'JAHERANDSONS@GMAIL.COM', NULL, '$2y$12$O5ock03HyNjqCkol8tHNYOMhUUUCRoxsgQqUA2316C2W7SgizmXuS', '01954787888', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, '2025-11-04 20:28:10'),
(4, 'Hasan', 'hasan@gmail.com', 1, NULL, NULL, '$2y$12$gmRIcCZHd2UxtVt.zgyVAOLisP2aY52KqV./OjoFDdQx/cBuwSPea', '00158787882', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(5, 'test12345', 'test123@gmail.com', 2, '5555', NULL, '$2y$12$EM01gPYhpll2IoQe3O3ZYertGfMXWN9jlfHo1fr/9vAw2rfqfB7Cm', '0165878789', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(8, 'test123', 'stest126663@gmail.com', 2, '555565', NULL, '$2y$12$CPifZmQcttUmqRDzAOaxjeQEELmMJ6Ycf2Rtb7DBkRsilSFjLBUym', '0165878789', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(9, 'test123', 'stes4t126663@gmail.com', 2, '5555654', NULL, '$2y$12$netY3Ez2TYgdAYHKBoN6a.BQHPXcz/qFZPP.CLSu9/lWkspzbr/XG', '01658787894', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(11, 'test123', 'ste43s4t126663@gmail.com', 2, '555565433', NULL, '$2y$12$0pxeo73iNa484S63UqrkUOunMsgJ6UhDGWOOL9LvBBL6Qra110P46', '016587837894', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(12, 'test123', 'ste43s4t1326663@gmail.com', 2, '5555654333', NULL, '$2y$12$X2nTDzba1dshUla2uGUUKupUD4hds56VxLxNE21I1bevTnkDLPhr.', '016587837894', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(14, 'test123', 'ste43s4tw1326663@gmail.com', 2, '5555654333w', NULL, '$2y$12$TXMR2HAz8/tMc4rxejVNruY3yZXAFP0HrgQefAyIWWsK9tTxfiou.', '016587837894', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(15, 'test45', 'test45@gmail.com', 2, '557474', NULL, '$2y$12$KNwkMC4MIPD5R7tHr7JlKe3fZDdOrHWy60vQwGk/GbvXmWx7ZMPf.', '41878788', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(16, 'test46', 'test46@gmail.com', 2, '54787878888', NULL, '$2y$12$5H4tUcmQ/YHo5j4h1H8I4ODibKCUcHhBoB/H1pYhrC6MMNssAX8qC', '48787888', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(17, 'test47', 'test47@gmail.com', 2, '4545', NULL, '$2y$12$Xt9fkLUl34UvaaW9QctA8OdqrwuQbFBDZPC3B613Jbg9il8lCU3x6', '54878788', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL),
(18, 'test48', 'test48@gmail.com', 2, '989899', NULL, '$2y$12$lVzv7xxzZwOBL4TfupKOkuVcHlzGAc/H881Jp78FoGkl8rArpCr4e', '48787888', 'DHKs', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, '2025-11-08 07:58:44'),
(19, 'Admin', 'admin123@gmail.com', 1, NULL, NULL, '$2y$12$78J9JPLbadiY4JMqG.DaNO2loD0/JeqX997RL89HogsWYyT823jdC', '5978978', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, '2025-11-15 13:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `users_log`
--

CREATE TABLE `users_log` (
  `user_id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role_type` varchar(255) DEFAULT NULL,
  `agentCode` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  `created_by` varchar(255) DEFAULT NULL,
  `update_by` varchar(255) DEFAULT NULL,
  `entry_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users_log`
--

INSERT INTO `users_log` (`user_id`, `type`, `name`, `email`, `role_type`, `agentCode`, `password`, `phone_number`, `address`, `facebook`, `website`, `github`, `twitter`, `instagram`, `status`, `created_by`, `update_by`, `entry_by`, `created_at`, `updated_at`) VALUES
(15, NULL, 'test45', 'test45@gmail.com', 'Agent', NULL, '$2y$12$dUVjOX2ITZ61eH8m8TD4jOerNI4o4lNJ128fv3NIXrZb.WgKP53mu', '41878788', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-11-08 07:44:50', '2025-11-08 07:44:50'),
(16, NULL, 'test46', 'test46@gmail.com', 'Agent', NULL, '$2y$12$w9TrjCkiKjEtTqy0J5uS4ettmPzHu30ugu4Mc2BtoOFrOrfKWe3CK', '48787888', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, '2025-11-08 07:45:39', '2025-11-08 07:45:39'),
(17, NULL, 'test47', 'test47@gmail.com', 'Agent', NULL, '$2y$12$0KfiJHttW7N4pdb3Z3o4G.CKkRX6mpAlDjI1PzGGdhY/CvsZC0qTa', '54878788', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 'Bijon Ahmed', NULL, NULL, '2025-11-08 07:47:01', '2025-11-08 07:47:01'),
(18, NULL, 'test48', 'test48@gmail.com', 'Agent', '989899', '$2y$12$6q1MbXGVrKqfP2OFFSpCVOfFg44ErxPbQCrIM9Sz9XvInHCn0e8se', '48787888', 'DHKs', NULL, NULL, NULL, NULL, NULL, 1, 'Bijon Ahmed', NULL, NULL, '2025-11-08 07:47:55', '2025-11-08 07:47:55'),
(18, NULL, 'test48', 'test48@gmail.com', 'Agent', '989899', NULL, '48787888', 'DHKs', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'test48', NULL, '2025-11-08 07:56:52', '2025-11-08 07:56:52'),
(18, 'udpate', 'test48', 'test48@gmail.com', 'Agent', '989899', NULL, '48787888', 'DHKs', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'test48', NULL, '2025-11-08 07:58:01', '2025-11-08 07:58:01'),
(18, 'udpate', 'test48', 'test48@gmail.com', 'Agent', '989899', NULL, '48787888', 'DHKs', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'Bijon Ahmed', NULL, '2025-11-08 07:58:44', '2025-11-08 07:58:44'),
(19, 'create', 'tetsAdmin', 'testadmin@gmail.com', 'Admin', NULL, '$2y$12$ELeOHyDEs5Ls7tcUIyVJ0.yG1rQ.15Njz.rJ/K/XCT2/AsJCfKEx2', '5978978', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, 'Bijon Ahmed', NULL, NULL, '2025-11-08 07:59:15', '2025-11-08 07:59:15'),
(19, 'udpate', 'Admin', 'admin123@gmail.com', 'Admin', NULL, NULL, '5978978', 'DHK', NULL, NULL, NULL, NULL, NULL, 1, NULL, 'Bijon Ahmed', NULL, '2025-11-15 13:29:41', '2025-11-15 13:29:41');

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Nagad', 1, '2025-11-07 17:16:29', '2025-11-07 17:16:34'),
(2, 'Bkash', 1, '2025-11-07 17:16:37', '2025-11-07 17:16:40'),
(3, 'Roket', 1, '2025-11-07 17:16:37', '2025-11-07 17:16:40'),
(6, 'ddd', 1, '2025-11-15 16:25:31', '2025-11-15 16:25:31'),
(7, 'ssssss', 1, '2025-11-15 16:26:27', '2025-11-15 16:26:27'),
(8, 'baks222', 1, '2025-11-15 16:28:01', '2025-11-15 16:28:28'),
(9, 'banks', 1, '2025-11-15 16:29:13', '2025-11-15 16:29:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banner`
--
ALTER TABLE `banner`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank_id` (`bank_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categorys`
--
ALTER TABLE `categorys`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `fees`
--
ALTER TABLE `fees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `limits`
--
ALTER TABLE `limits`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  ADD KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  ADD KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderId` (`orderId`);

--
-- Indexes for table `order_history`
--
ALTER TABLE `order_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `roles_type`
--
ALTER TABLE `roles_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_guard_name_unique` (`name`,`guard_name`);

--
-- Indexes for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_has_permissions_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `agentCode` (`agentCode`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `banner`
--
ALTER TABLE `banner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `categorys`
--
ALTER TABLE `categorys`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fees`
--
ALTER TABLE `fees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `limits`
--
ALTER TABLE `limits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_history`
--
ALTER TABLE `order_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `post_category`
--
ALTER TABLE `post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `roles_type`
--
ALTER TABLE `roles_type`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `branches`
--
ALTER TABLE `branches`
  ADD CONSTRAINT `branches_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_permissions`
--
ALTER TABLE `model_has_permissions`
  ADD CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `model_has_roles`
--
ALTER TABLE `model_has_roles`
  ADD CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_has_permissions`
--
ALTER TABLE `role_has_permissions`
  ADD CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
