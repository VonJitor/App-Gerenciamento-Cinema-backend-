-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema apiplayerdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema apiplayerdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `apiplayerdb` ;
USE `apiplayerdb` ;

-- -----------------------------------------------------
-- Table `apiplayerdb`.`cliente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apiplayerdb`.`cliente` ;

CREATE TABLE IF NOT EXISTS `apiplayerdb`.`cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `idade` INT NOT NULL,
  `fone` INT NOT NULL,
  `email` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apiplayerdb`.`processo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apiplayerdb`.`processo` ;

CREATE TABLE IF NOT EXISTS `apiplayerdb`.`processo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `descricao` VARCHAR(150) NULL,
  `valor_da_causa` INT NULL,
  `status_do_processo` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_processo_cliente1_idx` (`id_cliente` ASC),
  CONSTRAINT `fk_processo_cliente1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `apiplayerdb`.`cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apiplayerdb`.`processo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apiplayerdb`.`processo` ;

CREATE TABLE IF NOT EXISTS `apiplayerdb`.`processo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_cliente` INT NOT NULL,
  `descricao` VARCHAR(150) NULL,
  `valor_da_causa` INT NULL,
  `status_do_processo` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_processo_cliente1_idx` (`id_cliente` ASC),
  CONSTRAINT `fk_processo_cliente1`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `apiplayerdb`.`cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Data for table `apiplayerdb`.`cliente`
-- -----------------------------------------------------
START TRANSACTION;
USE `apiplayerdb`;
INSERT INTO `apiplayerdb`.`cliente` (`id`, `nome`, `idade`, `fone`, `email`) VALUES (DEFAULT, 'player1', 40, 50, 100);

COMMIT;


-- -----------------------------------------------------
-- Data for table `apiplayerdb`.`processo`
-- -----------------------------------------------------
START TRANSACTION;
USE `apiplayerdb`;
INSERT INTO `apiplayerdb`.`processo` (`id`, `id_cliente`, `descricao`, `valor_da_causa`, `status_do_processo`) VALUES (DEFAULT, 1, 'espada', 30, 15);
INSERT INTO `apiplayerdb`.`processo` (`id`, `id_cliente`, `descricao`, `valor_da_causa`, `status_do_processo`) VALUES (DEFAULT, 1, 'escudo', 5, 80);

COMMIT;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

