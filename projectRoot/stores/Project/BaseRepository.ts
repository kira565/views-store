import { Repository, Column, ColumnOptions, Check } from 'typeorm';

export const BooleanColumn = (options: Omit<ColumnOptions, 'type' | 'transformer'> = {}) => (
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
}

export function getIdentifierFromRecordId(namespace: string, tableName: string, recordId: number) {
	return `${namespace}:${tableName}:${recordId}`;
}

export default class BaseRepository<
	Entity extends { id: number },
	SnapshotIn extends { id: string }
> extends Repository<Entity> {
	getNamespace(): string {
		return this.metadata.connection.name;
	}
	getIdentifierFromRecordId(id: number) {
		return getIdentifierFromRecordId(this.getNamespace(), this.metadata.tableName, id);
	}
	// eslint-disable-next-line class-methods-use-this
	getRecordIdFromIdentifier(identifier: string) {
		return getRecordIdFromIdentifier(identifier);
	}
	async getAsSnapshotData(): Promise<Record<SnapshotIn['id'], SnapshotIn>> {
		const rows = await this.find();
		return rows.reduce(
			(total, record) => {
				const prefixedId = this.getIdentifierFromRecordId(record.id);
				const recordAsSnapshot = this.recordToSnapshot(record, prefixedId);
				return {
					...total,
					[prefixedId]: recordAsSnapshot,
				};
			},
			{} as Record<SnapshotIn['id'], SnapshotIn>,
		);
	}
	// eslint-disable-next-line class-methods-use-this
	recordToSnapshot(record: Entity, id: SnapshotIn['id']): SnapshotIn {
		// @ts-ignore
		return {
			...record,
			id,
		};
	}
}
