import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chamada } from './chamada.entidade';

@Entity('categoria')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @OneToMany(() => Chamada, chamada => chamada.categoria)
  chamadas: Chamada[];
}
