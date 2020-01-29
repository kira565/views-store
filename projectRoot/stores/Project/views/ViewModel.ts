import {types} from "mobx-state-tree";
import {LayerModel} from "../layers/LayerModel";
import {LisObjectModel} from "../objects/LisObjectModel";

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
    .actions(self => ({
        changeViewName(name: string) {
            self.name = name;
        }
    }));