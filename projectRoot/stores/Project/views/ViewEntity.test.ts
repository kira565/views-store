import { Connection, createConnection, Repository } from 'typeorm';
import { ViewEntity, LayerEntity, LisObjectEntity } from '../../internal';

let connection: Connection,
	viewsRepo: Repository<ViewEntity>,
	layersRepo: Repository<LayerEntity>,
	objectsRepo: Repository<LisObjectEntity>;

beforeEach(async () => {
	connection = await createConnection({
		type: 'sqlite',
		database: ':memory:',
		synchronize: true,
		logging: true,
		entities: [ViewEntity, LayerEntity, LisObjectEntity],
	});
	viewsRepo = connection.getRepository(ViewEntity);
	layersRepo = connection.getRepository(LayerEntity);
	objectsRepo = connection.getRepository(LisObjectEntity);
});

afterEach(() => {
	return connection.close();
});

const DEFAULT_VIEW = {
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

//  при помощи spread оператора ... Получаем все из дефолтного вида + заменяем что-то то поле из входящего аргумента
function createView(view: ViewEntity) {
	return viewsRepo.save({
		...DEFAULT_VIEW,
		...view,
	});
}

// Создаем вид с помощью нашей функции, затем удаляем его
async function createViewAndDelete(view: ViewEntity) {
	const entity = await createView(view);
	return viewsRepo.delete(entity.id);
}
// Получаем поля из связанной сущности Layers
function getRowsFromViewsLayers() {
	return connection.manager
		.createQueryBuilder()
		.select('*')
		.from('views_layers', 'views_layers')
		.getRawMany();
}
// Получаем поля из связанной сущности Objects
function getRowsFromViewsObjects() {
	return connection.manager
		.createQueryBuilder()
		.select('*')
		.from('views_objects', 'views_objects')
		.getRawMany();
}

describe('Проверка связей', () => {
	it('Все связи должны быть добавлены', async () => {
		await createView({
			layers: [{ id: 1 }],
			objects: [{ id: 1 }],
		} as ViewEntity);
		// eslint-disable-next-line @typescript-eslint/camelcase
		await expect(getRowsFromViewsLayers()).resolves.toEqual([{ layer_id: 1, view_id: 1 }]);
		// eslint-disable-next-line @typescript-eslint/camelcase
		await expect(getRowsFromViewsObjects()).resolves.toEqual([{ object_id: 1, view_id: 1 }]);
	});
	it('После удаления вида данные из таблицы views_layers должны быть удалены', async () => {
		await createViewAndDelete({
			layers: [{ id: 1 }],
			objects: [{ id: 1 }],
		} as ViewEntity);
		await expect(getRowsFromViewsLayers()).resolves.toEqual([]);
	});
	it('После удаления вида данные из таблицы views_objects должны быть удалены', async () => {
		await createViewAndDelete({
			layers: [{ id: 1 }],
			objects: [{ id: 1 }],
		} as ViewEntity);
		await expect(getRowsFromViewsObjects()).resolves.toEqual([]);
	});
	it('После удаления слоя данные из таблицы views_layers должны быть удалены', async () => {
		await createView({
			layers: [{ id: 1 }],
			objects: [{ id: 1 }],
		} as ViewEntity);
		await layersRepo.delete(1);
		await expect(getRowsFromViewsLayers()).resolves.toEqual([]);
	});
	it('После удаления объекта данные из таблицы views_objects должны быть удалены', async () => {
		await createView({
			layers: [{ id: 1 }],
			objects: [{ id: 1 }],
		} as ViewEntity);
		await objectsRepo.delete(1);
		await expect(getRowsFromViewsObjects()).resolves.toEqual([]);
	});
});
describe('Проверка ограничений', () => {
	it('Должна быть ошибка из-за неверного index', async () => {
		await expect(createView({ index: -2 } as ViewEntity)).rejects.toThrowError(
			'SQLITE_CONSTRAINT: CHECK constraint failed: Views_Ограничение_index',
		);
	});
});
