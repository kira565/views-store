import createBaseTableModel from "../createBaseTableModel";
import BaseRepository from "../BaseRepository";
import { ViewModel } from "./ViewModel";
import { ViewEntity } from "./ViewEntity";
import { EntityRepository} from "typeorm";
import { Instance} from "mobx-state-tree";

@EntityRepository(ViewEntity)
class ViewStoreRepo extends BaseRepository<ViewEntity, Instance<typeof ViewModel> & Record<string, any>> {}

export const ViewStoreModel = createBaseTableModel(ViewModel, ViewStoreRepo);


const store = ViewStoreModel.create()
console.log(store)