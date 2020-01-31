import { types, getParent, flow, Instance, IModelType, ISimpleType, destroy, SnapshotIn } from 'mobx-state-tree';
import { ObjectType, Connection, InsertResult, EntityManager } from 'typeorm';
import BaseRepository from './BaseRepository';

export default function createBaseTableModel
<
	/* eslint-disable @typescript-eslint/no-explicit-any */
	ItemModel extends IModelType<{ id: ISimpleType<string> }, any, any, any>, // требует чтоь было ид и это была строка
	SnapshotInItemModel extends SnapshotIn<Instance<ItemModel>>,
	Entity extends { id: number } & { [key: string]: any },
	CustomRepository extends BaseRepository<Entity, SnapshotInItemModel> & Record<string, any>
	/* eslint-enable @typescript-eslint/no-explicit-any */
>
(Model: ItemModel, repository: ObjectType<CustomRepository>) {
	type IItem = Instance<typeof Model>;
	const BaseModel = types
		.model({
			items: types.optional(types.map(Model), {}),
		})
		.views(self => ({
			get project(): {
				connection: Connection;
				id: string;
				path: string;
			} {
				return getParent(self);
			},
			getItem(itemId: IItem['id']) {
				const item = self.items.get(itemId);
				if (item === undefined) {
					throw Error(`Неверный идентификатор ${itemId}`);
				}
				return item;
			},
		}))
		.views(self => ({ // второй .views для того, потому что self/project не инициализирован
			get repository(): CustomRepository {
				return self.project.connection.manager.getCustomRepository(repository);
			},
		})) // Кастом репозиторий, т.к у нас свои бейз репозиторий

		.actions(self => ({
			load: flow(function* load() {
				const snapshot = yield self.repository.getAsSnapshotData();
				self.items.merge(snapshot);
			}),
			addItem: flow(function* addItem( // загоняет в таблицу если ок то и в хранилище
				itemData: Partial<Entity>,
				manager?: EntityManager, 
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			): Generator<any, IItem, InsertResult> {
				let result: InsertResult;
				if (manager) {
					result = yield manager.getCustomRepository(repository).insert(itemData);
				} else {
					result = yield self.repository.insert(itemData);
				}
				return self.items.put({
					...itemData,
					id: self.repository.getIdentifierFromRecordId(result.identifiers[0].id),
				});
			}),
			removeItem: flow(function* removeItem(itemId: IItem['id'], manager?: EntityManager) {
				const item = self.getItem(itemId);
				if (manager) {
					yield manager
						.getCustomRepository(repository)
						.delete(self.repository.getRecordIdFromIdentifier(itemId));
				} else {
					yield self.repository.delete(self.repository.getRecordIdFromIdentifier(itemId));
				}
				destroy(item);
			}),
		}));
	return BaseModel;
}
