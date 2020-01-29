import createBaseTableModel from "../createBaseTableModel";
import BaseRepository from "../BaseRepository";
import { ViewModel } from "./ViewModel";
import { ViewEntity } from "./ViewEntity";
import { getConnection, createConnection, getCustomRepository, Repository, EntityRepository } from "typeorm";
import { LayerEntity, LisObjectEntity } from "../../internal";
import { Instance, getSnapshot, SnapshotIn } from "mobx-state-tree";
const DEFAULT_VIEW = {                                  // дефолтный Вид для тестов ( валидный )
	id: '1',
	name: 'anyViewName',
	index: 1,
	roll: 20.91039276,
	pitch: 5.58994007,
	heading: 179.98199463,
	cameraPositionId: 1,
	url: 'https://anyurl.com',
	worldId: 'Earth1',
};


export let viewStore;
let viewStoreRepo;

@EntityRepository(ViewEntity)
class ViewStoreRepo extends BaseRepository<ViewEntity, Instance<typeof ViewModel> & Record<string, any>> {}


createConnection({
		type: 'sqlite',
		database: ':memory:',
		synchronize: true,
		logging: true,
		entities: [ViewEntity, LayerEntity, LisObjectEntity]
}).then( async () => {
	await getConnection().transaction(async transEnManager => {
		viewStoreRepo = transEnManager.getCustomRepository(ViewStoreRepo);

		viewStore = createBaseTableModel(ViewModel, viewStoreRepo);
		const store = viewStore.create();
		try{
			await store.addItem(DEFAULT_VIEW, transEnManager)
		}catch(err){

		}
	})

});



