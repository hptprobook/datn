
import { GET_DB } from '~/config/mongodb';
const userStatistics = async () => {
    const db = await GET_DB();
    const collection = db.collection('users');
    const users = await collection
        .find()
        .sort({ createdAt: -1 }) // Sắp xếp theo `createdAt` giảm dần
        .limit(5) // Giới hạn 5 kết quả
        .project({
            _id: 1,
            email: 1,
            name: 1,
            role: 1,
            createdAt: 1,
        })
        .toArray();

    const totalUsers = await collection.countDocuments();
    return {
        totalUsers,
        users,
    };
}
export const dashboardModel = {
    userStatistics,
};
