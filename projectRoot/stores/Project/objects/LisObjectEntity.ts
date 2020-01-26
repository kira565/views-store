import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'objects' })
export class LisObjectEntity {
	@PrimaryGeneratedColumn()
	id: number;
}
