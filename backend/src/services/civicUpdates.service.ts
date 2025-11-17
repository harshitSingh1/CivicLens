// backend\src\services\civicUpdates.service.ts
import { FilterQuery } from 'mongoose';
import CivicUpdate from '../models/civicUpdates.model';
import { ICivicUpdate, ICreateCivicUpdateInput, IUpdateCivicUpdateInput, ICivicUpdateFilter } from '../interfaces/civicUpdates.interface';
import { NotFoundError } from '../utils/apiError';

const createCivicUpdate = async (civicUpdateData: ICreateCivicUpdateInput): Promise<ICivicUpdate> => {
  return CivicUpdate.create(civicUpdateData);
};

const getCivicUpdateById = async (updateId: string): Promise<ICivicUpdate> => {
  const update = await CivicUpdate.findById(updateId);

  if (!update) {
    throw new NotFoundError('Civic update not found');
  }

  return update;
};

const updateCivicUpdate = async (updateId: string, updateData: IUpdateCivicUpdateInput): Promise<ICivicUpdate> => {
  const update = await CivicUpdate.findByIdAndUpdate(updateId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!update) {
    throw new NotFoundError('Civic update not found');
  }

  return update;
};

const deleteCivicUpdate = async (updateId: string): Promise<void> => {
  const update = await CivicUpdate.findByIdAndDelete(updateId);

  if (!update) {
    throw new NotFoundError('Civic update not found');
  }
};

const getCivicUpdates = async (filter: ICivicUpdateFilter, options: {
  limit?: number;
  page?: number;
  sortBy?: string;
}): Promise<{ updates: ICivicUpdate[]; count: number }> => {
  const query: FilterQuery<ICivicUpdate> = {};

  if (filter.type) {
    query.type = filter.type;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.severity) {
    query.severity = filter.severity;
  }

  if (filter.source) {
    query.source = filter.source;
  }

  if (filter.state) {
    query['affectedAreas.state'] = filter.state;
  }

  if (filter.district) {
    query['affectedAreas.district'] = filter.district;
  }

  if (filter.pincode) {
    query['affectedAreas.pincode'] = filter.pincode;
  }

  if (filter.areaName) {
    query['affectedAreas.areaName'] = filter.areaName;
  }

  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;

  const sort: any = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.startDate = -1;
  }

  const updates = await CivicUpdate.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const count = await CivicUpdate.countDocuments(query);

  return { updates, count };
};

const searchCivicUpdatesByLocation = async (location: {
  state: string;
  district?: string;
  pincode?: string;
  areaName?: string;
}): Promise<ICivicUpdate[]> => {
  const query: FilterQuery<ICivicUpdate> = {
    'affectedAreas.state': location.state,
  };

  if (location.district) {
    query['affectedAreas.district'] = location.district;
  }

  if (location.pincode) {
    query['affectedAreas.pincode'] = location.pincode;
  }

  if (location.areaName) {
    query['affectedAreas.areaName'] = location.areaName;
  }

  return CivicUpdate.find(query).sort({ startDate: -1 });
};

export {
  createCivicUpdate,
  getCivicUpdateById,
  updateCivicUpdate,
  deleteCivicUpdate,
  getCivicUpdates,
  searchCivicUpdatesByLocation,
};