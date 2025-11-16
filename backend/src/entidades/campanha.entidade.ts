import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lista } from './lista.entidade';
import { Chamada } from './chamada.entidade';

@Entity('campanha')
export class Campanha {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Lista, lista => lista.campanha)
  listas: Lista[];

  @OneToMany(() => Chamada, chamada => chamada.campanha)
  chamadas: Chamada[];
}
