import { Repository, Column, ColumnOptions, Check } from 'typeorm';

export const BooleanColumn = (options: Omit<ColumnOptions, 'type' | 'transformer'> = {}) => (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	object: Record<string, any>,
	propertyName: string,
) => {
	Column({
		...options,
		type: 'int',
		transformer: {
			to(value: boolean) {
				return +value;
			},
			from(value: number) {
				return Boolean(value);
			},
		},
	})(object, propertyName);
	Check(`Ограничение ${propertyName}`, `[${propertyName}] IN ('0', '1')`)(object);
};
// Функция для работы с boolean для орм. Конвертирует опцию колонки в опцию булин

export function getRecordIdFromIdentifier(identifier: string) {
	const array = identifier.split(':');
	if (array.length === 3) {
		const id = parseInt(array[2]);
		if (isNaN(id)) {
			throw Error('id = NaN');
		}
		return id;
	}
	throw Error();
} // Функция для получения айдишника. уникального для каждой функции. Речь идет о том что в базе айдишники числовые. В таблице видов, слоев, объектов
// Когда все это зальется в мст хранилище , они совпадут. Для этого существует две функции. ИД записи

export function getIdentifierFromRecordId(namespace: string, tableName: string, recordId: number) {
	return `${namespace}:${tableName}:${recordId}`; // Уникальность название подключения к базе, уникальность имени таблицы, и уникальность внутри таблицы
} // Обратная функцмя. namespace - название подключение. tableName - имя таблицы, recordId - числовой ид из базы. ПОзволяет сделать его в приложении уникальным

export default class BaseRepository<
	Entity extends { id: number },
	SnapshotIn extends { id: string }
> extends Repository<Entity> {
	getNamespace(): string {
		return this.metadata.connection.name;
	}
	getIdentifierFromRecordId(id: number) {
		// вернет строку
		return getIdentifierFromRecordId(this.getNamespace(), this.metadata.tableName, id);
	}
	// eslint-disable-next-line class-methods-use-this
	getRecordIdFromIdentifier(identifier: string) {
		// вернет число
		return getRecordIdFromIdentifier(identifier); // вытаскивает рекорд ид
	}
	async getAsSnapshotData(): Promise<Record<SnapshotIn['id'], SnapshotIn>> {
		const rows = await this.find();
		return rows.reduce((total, record) => {
			const prefixedId = this.getIdentifierFromRecordId(record.id);
			const recordAsSnapshot = this.recordToSnapshot(record, prefixedId);
			return {
				...total,
				[prefixedId]: recordAsSnapshot,
			};
		}, {} as Record<SnapshotIn['id'], SnapshotIn>);
	} // Тот мето
	// eslint-disable-next-line class-methods-use-this
	recordToSnapshot(record: Entity, id: SnapshotIn['id']): SnapshotIn {
		// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
		// @ts-ignore
		return {
			...record,
			id,
		};
	}
}
