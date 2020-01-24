import {Check, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Layers} from "./layers";
import {Objects} from "./objects";

@Entity({name:"views_entity"})
@Check(`"index" > 0`)
export class ViewsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('integer')
    index: number;

    @Column('real')
    roll: number;

    @Column('real')
    pitch: number;

    @Column('real')
    heading: number;

    @Column('integer')
    camera_position_id: number;

    @Column('text')
    url: string;

    @Column('text')
    world_id: string;



    @ManyToMany(type => Layers)
    @JoinTable()
    layers: Layers[];

    @ManyToMany(type => Objects)
    @JoinTable()
    objects: Objects[];
}

// CHECK index >= 0