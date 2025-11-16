import { MigrationInterface, QueryRunner } from "typeorm";

export class EsquemaInicial1763169197991 implements MigrationInterface {
    name = 'EsquemaInicial1763169197991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contato\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`telefone\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`operador\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`situacao\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categoria\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chamada\` (\`id\` int NOT NULL, \`datahora\` datetime NOT NULL, \`contato_id\` int NULL, \`lista_id\` int NULL, \`campanha_id\` int NULL, \`operador_id\` int NULL, \`situacao_id\` int NULL, \`categoria_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`lista\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, \`campanha_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`campanha\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nome\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_ea9d1e7f06ab968b238c7fc7ad7\` FOREIGN KEY (\`contato_id\`) REFERENCES \`contato\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_41145e5cea1c70c0f9b7ecece15\` FOREIGN KEY (\`lista_id\`) REFERENCES \`lista\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_75990c5cfb9efac59382149f482\` FOREIGN KEY (\`campanha_id\`) REFERENCES \`campanha\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_624a0c44a25048342baa6c5bfcb\` FOREIGN KEY (\`operador_id\`) REFERENCES \`operador\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_30569fffdf8c802afa373c37e0d\` FOREIGN KEY (\`situacao_id\`) REFERENCES \`situacao\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chamada\` ADD CONSTRAINT \`FK_d33dccf616045e2cdd98c179e74\` FOREIGN KEY (\`categoria_id\`) REFERENCES \`categoria\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`lista\` ADD CONSTRAINT \`FK_885a503a4d8e3d3e3f2384d7f7e\` FOREIGN KEY (\`campanha_id\`) REFERENCES \`campanha\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`lista\` DROP FOREIGN KEY \`FK_885a503a4d8e3d3e3f2384d7f7e\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_d33dccf616045e2cdd98c179e74\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_30569fffdf8c802afa373c37e0d\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_624a0c44a25048342baa6c5bfcb\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_75990c5cfb9efac59382149f482\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_41145e5cea1c70c0f9b7ecece15\``);
        await queryRunner.query(`ALTER TABLE \`chamada\` DROP FOREIGN KEY \`FK_ea9d1e7f06ab968b238c7fc7ad7\``);
        await queryRunner.query(`DROP TABLE \`campanha\``);
        await queryRunner.query(`DROP TABLE \`lista\``);
        await queryRunner.query(`DROP TABLE \`chamada\``);
        await queryRunner.query(`DROP TABLE \`categoria\``);
        await queryRunner.query(`DROP TABLE \`situacao\``);
        await queryRunner.query(`DROP TABLE \`operador\``);
        await queryRunner.query(`DROP TABLE \`contato\``);
    }

}
