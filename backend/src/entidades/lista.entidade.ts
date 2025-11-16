import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Campanha } from './campanha.entidade';
import { Chamada } from './chamada.entidade';

@Entity('lista')
export class Lista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToOne(() => Campanha, campanha => campanha.listas)
  @JoinColumn({ name: 'campanha_id' })
  campanha: Campanha;

  @OneToMany(() => Chamada, chamada => chamada.lista)
  chamadas: Chamada[];
}
