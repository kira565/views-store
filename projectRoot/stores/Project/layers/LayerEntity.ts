import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'layers' })
export class LayerEntity {
	@PrimaryGeneratedColumn()
	id: number;
}
