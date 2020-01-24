import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Layers {
    @PrimaryGeneratedColumn()
    id: number;

}
