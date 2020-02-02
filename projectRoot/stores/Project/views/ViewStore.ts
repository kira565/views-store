import createBaseTableModel from '../createBaseTableModel';
import { ViewModel } from './ViewModel';
import { ViewStoreRepo } from './ViewEntity';

export const ViewStoreModel = createBaseTableModel(ViewModel, ViewStoreRepo);
