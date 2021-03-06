import { Check, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, EntityRepository } from 'typeorm';
import { LayerEntity, LisObjectEntity } from '../../internal';
import BaseRepository from '../BaseRepository';
import { SnapshotIn, Instance } from 'mobx-state-tree';
import { ViewModel } from './ViewModel';

@Entity({ name: 'views' })
@Check('Views_Ограничение_index', `"index" > 0`)
export class ViewEntity {
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

	@Column({
		type: 'integer',
		name: 'camera_position_id',
	})
	cameraPositionId: number;

	@Column('text')
	url: string;

	@Column({
		type: 'text',
		name: 'world_id',
	})
	worldId: string;

	@ManyToMany(() => LayerEntity, {
		cascade: true,
	})
	@JoinTable({
		// То есть у нас Сущность Layers хранит данные о id своего вида, и свой ид
		name: 'views_layers',
		joinColumn: {
			name: 'view_id',
		},
		inverseJoinColumn: {
			name: 'layer_id',
		},
	})
	layers: LayerEntity[];

	@ManyToMany(() => LisObjectEntity, {
		cascade: true,
	})
	@JoinTable({
		name: 'views_objects',
		joinColumn: {
			name: 'view_id',
		},
		inverseJoinColumn: {
			name: 'object_id',
		},
	})
	objects: LisObjectEntity[];
}

@EntityRepository(ViewEntity)
export class ViewStoreRepo extends BaseRepository<ViewEntity, SnapshotIn<Instance<typeof ViewModel>>> {}
