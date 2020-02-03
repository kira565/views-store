/* eslint-disable @typescript-eslint/no-explicit-any */
import { types, flow, Instance, getParent } from 'mobx-state-tree';
import { InsertResult } from 'typeorm';
import { ViewStoreRepo } from './ViewEntity';

export const ViewModel = types
	.model('view_model', {
		id: types.string,
		name: types.string,
		index: types.number,
		roll: types.number,
		pitch: types.number,
		heading: types.number,
		cameraPositionId: types.number,
		url: types.string,
		worldId: types.string,
		//layers: types.array(LayerModel),
		//objects: types.array(LisObjectModel)
	})
	.views(self => ({

		get store(): {
			repository: ViewStoreRepo;
		} {
			return getParent(self);
		},
	}))
	.actions(self => ({
		update: flow(function* update(
			fieldsToUpdate: Partial<Omit<Instance<typeof self>, 'id'>>,
			isWriteToDb?: boolean,
		): Generator<any, void, InsertResult> {
			const id = self.store.repository.getRecordIdFromIdentifier(self.id);

			if (isWriteToDb) {
				yield self.store.repository.update(id, fieldsToUpdate);
			}
			Object.assign(self, fieldsToUpdate);
		}),
	}))
	.actions(self => ({
		changeViewName(name: string, isWriteToDb?: boolean): Promise<void> {
			return self.update({ name }, isWriteToDb);
		},
	}));
