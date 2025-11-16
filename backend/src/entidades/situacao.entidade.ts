import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chamada } from './chamada.entidade';

@Entity('situacao')
export class Situacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Chamada, chamada => chamada.situacao)
  chamadas: Chamada[];
}
