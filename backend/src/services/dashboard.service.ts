// backend\src\services\dashboard.service.ts
import Issue from '../models/issues.model';
import User from '../models/users.model';
import CivicUpdate from '../models/civicUpdates.model';

const getDashboardStats = async () => {
  const totalIssues = await Issue.countDocuments();
  const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
  const unresolvedIssues = totalIssues - resolvedIssues;

  const topContributors = await User.find()
    .sort({ points: -1 })
    .limit(5)
    .select('name profilePicture points badges');

  const recentUpdates = await CivicUpdate.find()
    .sort({ createdAt: -1 })
    .limit(5);

  const issuesByCategory = await Issue.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const issuesByStatus = await Issue.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  return {
    totalIssues,
    resolvedIssues,
    unresolvedIssues,
    resolutionRate: totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0,
    topContributors,
    recentUpdates,
    issuesByCategory,
    issuesByStatus,
  };
};

const getMapData = async (bounds?: {
  ne: [number, number];
  sw: [number, number];
}) => {
  let query = {};

  if (bounds) {
    query = {
      'location.coordinates': {
        $geoWithin: {
          $box: [bounds.sw, bounds.ne],
        },
      },
    };
  }

  return Issue.find(query).select(
    'title category status severity location.coordinates'
  );
};

export { getDashboardStats, getMapData };