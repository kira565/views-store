import createBaseTableModel from '../createBaseTableModel';
import BaseRepository from '../BaseRepository';
import { ViewModel } from './ViewModel';
import { ViewEntity } from './ViewEntity';
import { EntityRepository } from 'typeorm';
import { Instance, SnapshotIn } from 'mobx-state-tree';

@EntityRepository(ViewEntity)
export class ViewStoreRepo extends BaseRepository<ViewEntity, SnapshotIn<Instance<typeof ViewModel>>> {}

export const ViewStoreModel = createBaseTableModel(ViewModel, ViewStoreRepo);
