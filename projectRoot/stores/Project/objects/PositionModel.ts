import { types } from 'mobx-state-tree';

export const PositionModel = types.model('position_model', {
	id: types.number,
	longitude: types.number,
	latitude: types.number,
	height: types.number,
});
