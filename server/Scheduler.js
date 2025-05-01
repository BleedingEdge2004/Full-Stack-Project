const cron = require('node-cron');
const Sale = require('./models/Sales');
const User = require('./models/User');
const { sendSalesAlert } = require('./utils/emailServices');

function setupSalesMonitoringJob() {
    cron.schedule('0 9 * * *', async () => {
        try {
            const today = new Date();
            const lastWeek = new Date(today);
            lastWeek.setDate(today.getDate() - 7);

            const users = await User.find({}, 'name email role'); // Get all users

            for (const user of users) {
                const matchStage = {};

                if (user.role === 'Salesperson') {
                    matchStage.salesperson = user._id;
                }

                matchStage.createdAt = { $gte: lastWeek, $lt: today };

                const userSales = await Sale.aggregate([
                    { $match: matchStage },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: '$amount' }
                        }
                    }
                ]);

                const revenue = userSales[0]?.totalRevenue || 0;

                if (revenue > 5000) {
                    await sendSalesAlert(
                        '📈 Personal Revenue Spike Alert!',
                        `Hi ${user.name}, your revenue last week was $${revenue}. Great job!`,
                        user.email
                    );
                } else if (revenue < 1000) {
                    await sendSalesAlert(
                        '📉 Personal Revenue Dip Alert!',
                        `Hi ${user.name}, your revenue last week was only $${revenue}. Let's improve this week!`,
                        user.email
                    );
                }
            }

            console.log('✅ Sales checks complete for all users.');
        } catch (error) {
            console.error('❌ Error in scheduler:', error);
        }
    });
}

module.exports = setupSalesMonitoringJob;
