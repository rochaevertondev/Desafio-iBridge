import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chamada } from './chamada.entidade';

@Entity('operador')
export class Operador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Chamada, chamada => chamada.operador)
  chamadas: Chamada[];
}
