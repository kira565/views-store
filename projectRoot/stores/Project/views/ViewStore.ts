import createBaseTableModel from "../createBaseTableModel";
import BaseRepository from "../BaseRepository";
import { ViewModel } from "./ViewModel";
import { ViewEntity } from "./ViewEntity";
import { getConnection, createConnection, getCustomRepository, Repository, EntityRepository } from "typeorm";
import { LayerEntity, LisObjectEntity } from "../../internal";
import { Instance, getSnapshot, SnapshotIn } from "mobx-state-tree";

@EntityRepository(ViewEntity)
class ViewStoreRepo extends BaseRepository<ViewEntity, Instance<typeof ViewModel> & Record<string, any>> {}

const viewStoreModel = createBaseTableModel(ViewModel, ViewStoreRepo);
export const viewStore = viewStoreModel.create();
