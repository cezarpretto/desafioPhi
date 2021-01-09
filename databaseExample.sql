-- --------------------------------------------------------
-- Servidor:                     localhost
-- Versão do servidor:           10.5.8-MariaDB - Source distribution
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para teste_phi
CREATE DATABASE IF NOT EXISTS `teste_phi` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `teste_phi`;

-- Copiando estrutura para tabela teste_phi.movies
CREATE TABLE IF NOT EXISTS `movies` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `synopsis` text NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `price` float NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `director` text NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  FULLTEXT KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_phi.movies: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` (`id`, `title`, `synopsis`, `amount`, `price`, `created_at`, `director`) VALUES
	(1, 'Laranja Mecânica', 'O jovem Alex passa as noites com uma gangue de amigos briguentos. Depois que é preso, se submete a uma técnica de modificação de comportamento para poder ganhar sua liberdade.', 3, 5, '2021-01-05 13:20:33', 'Stanley Kubrick'),
	(2, 'Bastardos Inglórios', 'Durante a Segunda Guerra Mundial, na França, um grupo de judeus americanos conhecidos como Bastardos espalha o terror entre o terceiro Reich. Ao mesmo tempo, Shosanna, uma judia que fugiu dos nazistas, planeja vingança quando um evento em seu cinema reunirá os líderes do partido.', 1, 5, '2021-01-05 13:21:32', 'Quentin Tarantino'),
	(3, 'O Iluminado', 'Jack Torrance se torna caseiro de inverno do isolado Hotel Overlook, nas montanhas do Colorado, na esperança de curar seu bloqueio de escritor. Ele se instala com a esposa Wendy e o filho Danny, que é atormentando por premonições. Jack não consegue escrever e as visões de Danny se tornam mais perturbadoras. O escritor descobre os segredos sombrios do hotel e começa a se transformar em um maníaco homicida, aterrorizando sua família.', 2, 3, '2021-01-05 13:23:08', 'Stanley Kubrick');
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_phi.rents
CREATE TABLE IF NOT EXISTS `rents` (
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_movie` bigint(20) NOT NULL DEFAULT 0,
  `id_user` bigint(20) NOT NULL DEFAULT 0,
  `status` enum('leased','returned','rented') NOT NULL DEFAULT 'leased',
  `returned_at` timestamp NULL DEFAULT NULL,
  KEY `FK_MOVIE` (`id_movie`),
  KEY `FK_USER` (`id_user`),
  CONSTRAINT `FK_MOVIE` FOREIGN KEY (`id_movie`) REFERENCES `movies` (`id`),
  CONSTRAINT `FK_USER` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_phi.rents: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `rents` DISABLE KEYS */;
INSERT INTO `rents` (`created_at`, `id_movie`, `id_user`, `status`, `returned_at`) VALUES
	('2021-01-05 16:41:32', 2, 1, 'returned', '2021-01-09 16:20:31'),
	('2021-01-05 16:41:45', 1, 1, 'rented', NULL);
/*!40000 ALTER TABLE `rents` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_phi.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` text NOT NULL,
  `id_user` bigint(20) NOT NULL DEFAULT 0,
  `status` enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
  UNIQUE KEY `token` (`token`) USING HASH,
  KEY `FK_ID_USER` (`id_user`),
  CONSTRAINT `FK_ID_USER` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_phi.sessions: ~7 rows (aproximadamente)
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` (`created_at`, `token`, `id_user`, `status`) VALUES
	('2021-01-06 14:17:31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjA5OTQyNjUxLCJleHAiOjYzNDM1ODI2NTF9.9bXxYGbBAHv6dEjCzXQeRA5g8TpvIE7M6vHinXY0fnA', 1, 'disabled'),
	('2021-01-06 14:28:41', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjA5OTQzMzIxLCJleHAiOjYzNDM1ODMzMjF9.3N5dK2txo-qKUCwNSb047igjyXLo2iec8hMUyNjW7N4', 1, 'disabled'),
	('2021-01-06 16:13:35', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjA5OTQ5NjE1LCJleHAiOjYzNDM1ODk2MTV9.Xf-nQ1HpyJjUgm02UDcxPxN3B2KTZRZmr9cAm7jJCdc', 1, 'disabled'),
	('2021-01-09 16:15:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjEwMjA4OTIyLCJleHAiOjYzNDM4NDg5MjJ9.Lt8N6LYkHdkaAehj5uAR_Ddry5UaBQJJAKnih1pizYA', 1, 'disabled'),
	('2021-01-09 16:17:16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjEwMjA5MDM2LCJleHAiOjYzNDM4NDkwMzZ9.HErOvageEkS0KXTzCSxoV93InvK_IJYfy1zt82f4k6I', 1, 'disabled'),
	('2021-01-09 16:18:31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjEwMjA5MTExLCJleHAiOjYzNDM4NDkxMTF9.To0ODIGYVZv33qaIQS6SUYA5GvMHGJvEGMpb-CxMtD4', 1, 'disabled'),
	('2021-01-09 16:19:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkNlemFyIFByZXR0byIsImVtYWlsIjoiY2V6YXJvbGlwcmV0dG9AZ21haWwuY29tIiwiaWF0IjoxNjEwMjA5MTgyLCJleHAiOjYzNDM4NDkxODJ9.QYGG6Bqa49Mj43M0M0Pn24eaLGz0MetUJbqn6-Q2Pi0', 1, 'disabled'),
	('2021-01-09 17:19:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6IlVzdcOhcmlvIFJvb3QiLCJlbWFpbCI6InJvb3RAcm9vdC5jb20iLCJpYXQiOjE2MTAyMTI3NDIsImV4cCI6NjM0Mzg1Mjc0Mn0.rT-AFg_-zuB_pMoCOdQ54lbFlQvZ1cYyDIWkVv6wz5Y', 4, 'disabled');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;

-- Copiando estrutura para tabela teste_phi.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela teste_phi.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
	(1, 'Cezar Pretto', 'cezarolipretto@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2021-01-05 13:16:32'),
	(2, 'Alaine Scaranto Ullrich', 'alaine_ab@hotmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2021-01-09 16:30:03'),
	(3, 'João da Silva', 'joaosilva@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2021-01-09 17:01:53'),
	(4, 'Usuário Root', 'root@root.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2021-01-09 17:18:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
