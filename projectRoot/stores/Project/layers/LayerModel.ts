import { types } from 'mobx-state-tree';

export const LayerModel = types.model('layer_model', {
	id: types.number,
});
