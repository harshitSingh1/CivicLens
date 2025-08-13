// backend\src\services\issues.service.ts
import { FilterQuery } from 'mongoose';
import Issue from '../models/issues.model';
import User from '../models/users.model';
import { IIssue, ICreateIssueInput, IUpdateIssueInput, IIssueFilter } from '../interfaces/issues.interface';
import { NotFoundError} from '../utils/apiError';
import { uploadToCloudinary } from '../utils/upload';

const createIssue = async (userId: string, issueData: ICreateIssueInput, files?: Express.Multer.File[]): Promise<IIssue> => {
  const images = [];
  
  if (files && files.length > 0) {
    for (const file of files) {
      const imageUrl = await uploadToCloudinary(file);
      images.push(imageUrl as string);
    }
  }

  const issue = await Issue.create({
    title: issueData.title,
    description: issueData.description,
    category: issueData.category,
    severity: issueData.severity,
    location: issueData.location,
    images,
    reportedBy: userId,
  });

  // Add points to user for reporting
  await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

  return issue;
};

const getIssueById = async (issueId: string): Promise<IIssue> => {
  const issue = await Issue.findById(issueId)
    .populate('reportedBy', 'name profilePicture points')
    .populate('assignedTo', 'name profilePicture')
    .populate('comments.userId', 'name profilePicture');

  if (!issue) {
    throw new NotFoundError('Issue not found');
  }

  return issue;
};

const updateIssue = async (issueId: string, updateData: IUpdateIssueInput, userId?: string): Promise<IIssue> => {
  const issue = await Issue.findById(issueId);

  if (!issue) {
    throw new NotFoundError('Issue not found');
  }

  if (updateData.status) {
    issue.status = updateData.status;
  }

  if (updateData.assignedTo) {
    issue.assignedTo = updateData.assignedTo;
  }

  if (updateData.comment && userId) {
    issue.comments.push({
      userId,
      text: updateData.comment,
      createdAt: new Date()
    });
  }

  await issue.save();
  return issue;
};

const deleteIssue = async (issueId: string): Promise<void> => {
  const issue = await Issue.findByIdAndDelete(issueId);

  if (!issue) {
    throw new NotFoundError('Issue not found');
  }
};

const getIssues = async (filter: IIssueFilter, options: {
  limit?: number;
  page?: number;
  sortBy?: string;
}): Promise<{ issues: IIssue[]; count: number }> => {
  const query: FilterQuery<IIssue> = {};

   console.log('Building query with filter:', filter); 

  if (filter.category) {
    query.category = filter.category;
  }

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.severity) {
    query.severity = filter.severity;
  }

  if (filter.state) {
    query['location.state'] = filter.state;
  }

  if (filter.district) {
    query['location.district'] = filter.district;
  }

  if (filter.pincode) {
    query['location.pincode'] = filter.pincode;
  }

  if (filter.userId) {
    query.reportedBy = filter.userId;
  }

  if (filter.search) {
    query.$text = { $search: filter.search };
  }

  if (Object.keys(query).length === 0) {
    query.$or = [
      { status: { $exists: true } },
      { _id: { $exists: true } }
    ];
  }

  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;

  const sort: any = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1;
  }

    console.log('Final query:', query);
  console.log('Sort options:', sort);

  const [issues, count] = await Promise.all([
    Issue.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('reportedBy', 'name profilePicture points')
      .populate('comments.userId', 'name profilePicture')
      .lean(),
    Issue.countDocuments(query)
  ]);

  console.log('Query results:', issues.length, 'issues found'); // Debug log

  return { 
    issues: issues.map(issue => ({
      ...issue,
      // Ensure required fields exist
      location: issue.location || { coordinates: [0, 0], state: '', district: '', pincode: '' },
      images: issue.images || [],
      upvotes: issue.upvotes || []
    })), 
    count 
  };
};

const upvoteIssue = async (issueId: string, userId: string): Promise<IIssue> => {
  const issue = await Issue.findById(issueId);
  if (!issue) throw new NotFoundError('Issue not found');

  const upvoteIndex = issue.upvotes.indexOf(userId);
  if (upvoteIndex >= 0) {
    // Remove upvote if already exists
    issue.upvotes.splice(upvoteIndex, 1);
  } else {
    // Add upvote if doesn't exist
    issue.upvotes.push(userId);
  }

  await issue.save();
  return issue;
};

const addComment = async (issueId: string, comment: {
  userId: string;
  text: string;
  createdAt: Date;
}): Promise<IIssue> => {
  const issue = await Issue.findByIdAndUpdate(
    issueId,
    { $push: { comments: comment } },
    { new: true }
  )
  .populate('reportedBy', 'name profilePicture points')
  .populate('comments.userId', 'name profilePicture'); // Ensure population

  if (!issue) throw new NotFoundError('Issue not found');
  return issue;
};

const deleteComment = async (issueId: string, commentId: string, userId: string): Promise<IIssue> => {
  const issue = await Issue.findOneAndUpdate(
    {
      _id: issueId,
      'comments._id': commentId,
      'comments.userId': userId
    },
    { $pull: { comments: { _id: commentId, userId } } },
    { new: true }
  ).populate('comments.userId', 'name profilePicture');

  if (!issue) throw new NotFoundError('Comment not found or not authorized');
  return issue;
};

export {
  createIssue,
  getIssueById,
  updateIssue,
  deleteIssue,
  getIssues,
  upvoteIssue,
  addComment,
  deleteComment
};