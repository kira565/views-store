import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'positions' })
export class PositionEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('real')
	longitude: number;

	@Column('real')
	latitude: number;

	@Column('real')
	height: number;
}
