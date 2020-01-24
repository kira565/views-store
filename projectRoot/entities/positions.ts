import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Positions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('real')
    longitude: number;

    @Column('real')
    latitude: number;

    @Column('real')
    height: number;

}