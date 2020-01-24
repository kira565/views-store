import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Objects {
    @PrimaryGeneratedColumn()
    id: number;

}