import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Chamada } from './chamada.entidade';

@Entity('contato')
export class Contato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  telefone: string | null;

  @OneToMany(() => Chamada, chamada => chamada.contato)
  chamadas: Chamada[];
}
