import { Connection, createConnection } from 'typeorm';
import { ViewEntity, ViewStoreRepo } from './ViewEntity';
import { LayerEntity } from '../layers/LayerEntity';
import { LisObjectEntity } from '../objects/LisObjectEntity';
import { ViewModel } from './ViewModel';
import { configure } from 'mobx';
configure({ computedConfigurable: true });

let connection: Connection;

const MOCK_VIEW = {
	id: 'anyNameSpace:anyTableName:1',
	name: 'anyViewName',
	index: 1,
	roll: 20.91039276,
	pitch: 5.58994007,
	heading: 179.98199463,
	cameraPositionId: 1,
	url: 'https://anyurl.com',
	worldId: 'Earth1',
};
const view = ViewModel.create(MOCK_VIEW);

beforeEach(async () => {
	connection = await createConnection({
		type: 'sqlite',
		database: ':memory:',
		synchronize: true,
		logging: true,
		entities: [ViewEntity, LayerEntity, LisObjectEntity],
	});

	jest.spyOn(view, 'store', 'get').mockReturnValue({
		repository: connection.manager.getCustomRepository(ViewStoreRepo),
	});

	jest.clearAllMocks();
});
afterEach(() => {
	return connection.close();
});

describe('Проверка методов модели ViewModel', () => {
	// eslint-disable-next-line jest/expect-expect
	it('Функция update успешно обновляет поля объектов', async () => {
		// eslint-disable-next-line no-unused-expressions
		await view.update({ url: 'TEST_URL' }, true);
		expect(view.url).toEqual('TEST_URL');
	});

	it('Функция changeName обновляет имя и успешно вызывает функцию update', async () => {
		const spy = jest.spyOn(view, 'update');
		await view.changeViewName('TEST_NAME', true);
		expect(spy).toHaveBeenCalledWith({ name: 'TEST_NAME' }, true);
	});
});
