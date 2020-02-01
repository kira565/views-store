import { types } from 'mobx-state-tree';
import { createConnection, ViewEntity, getManager } from 'typeorm';
import { LayerEntity, LisObjectEntity } from '../internal';
import { ViewStoreModel } from './views/ViewStore';

export const DEFAULT_VIEW = {
	id: 1,
	name: 'anyViewName',
	index: 1,
	roll: 20.91039276,
	pitch: 5.58994007,
	heading: 179.98199463,
	cameraPositionId: 1,
	url: 'https://anyurl.com',
	worldId: 'Earth1',
};

export const ProjectModel = types.model('project_model', {
	id: '1_project',
	viewStore: types.maybe(ViewStoreModel),
});

const project = ProjectModel.create();
//test
createConnection({
	type: 'sqlite',
	database: ':memory:',
	synchronize: true,
	logging: true,
	entities: [ViewEntity, LayerEntity, LisObjectEntity],
}).then(async () => {
	await getManager().transaction(async transactionEntityManager => {
		await project.viewStore?.addItem({ DEFAULT_VIEW }, transactionEntityManager);
		await project.viewStore?.load();
		console.log(project.viewStore?.items);
	});
});
