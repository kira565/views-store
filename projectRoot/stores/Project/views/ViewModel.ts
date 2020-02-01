import {types, flow, ISimpleType, Instance, getParent, getRoot, IModelType, getSnapshot} from "mobx-state-tree";
import {LayerModel} from "../layers/LayerModel";
import {LisObjectModel} from "../objects/LisObjectModel";
import { ViewStoreModel, ViewStoreRepo } from "./ViewStore";
import { Connection, InsertResult, UpdateResult } from "typeorm";



export const ViewModel = types.model('view_model', {
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
		get upperLevelStore(): {
			repository: ViewStoreRepo
		} {
			return getParent(self)
		}
	}))
    .actions(self => ({
		update: flow(function* update(
			fieldsToUpdate: Partial<Omit<Instance<typeof self>, 'id'>>,
			isWriteToDb? : boolean
		): Generator<Promise<UpdateResult>, void> {
			let id = self.upperLevelStore.repository.getRecordIdFromIdentifier(self.id);
			let result: Promise<UpdateResult>;			

			if (isWriteToDb) {
				result = new Promise(resolve => 
					yield self.upperLevelStore.repository.save({id, fieldsToUpdate})
				);
				result.then(() => self = Object.assign(self, fieldsToUpdate))
			}
		}),
	}))
	.actions(self => ({
		changeViewName(
			name: string,
			isWriteToDb?: boolean
		): Promise<void> {
			return self.update({name: name}, isWriteToDb)
		},
	}));



