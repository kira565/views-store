import createBaseTableModel from "../createBaseTableModel";
import BaseRepository from "../BaseRepository";
import { ViewModel } from "./ViewModel";
import { ViewEntity } from "./ViewEntity";
import { EntityRepository } from "typeorm";
import { Instance} from "mobx-state-tree";

@EntityRepository(ViewEntity)
class ViewStoreRepo extends BaseRepository<ViewEntity, Instance<typeof ViewModel> & Record<string, any>> {}
export const viewStoreModel = createBaseTableModel(ViewModel, ViewStoreRepo);