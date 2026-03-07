import { defineRouter, protectedProcedure } from '../../lib/trpc'

/**
 * This is the router for all dashboard-related analytics.
 *
 * NOTE: All procedures in this file should be protected and ideally restricted to users with the
 * 'dataPortalAdmin' role.
 */
export const dashboardRouter = defineRouter({
	/**
	 * Fetches the high-level Key Performance Indicators (KPIs) for the platform. This query is designed to be
	 * fast and efficient, using simple counts.
	 */
	getKpiMetrics: protectedProcedure.query(async ({ ctx }) => {
		// We can run these simple count queries in parallel for maximum performance.
		const [orgCount, verifiedOrgCount, serviceCount, userCount, reviewCount, countryCount] =
			await ctx.db.$transaction([
				// Total Published Organizations
				ctx.db.organization.count({
					where: {
						published: true,
						deleted: false,
					},
				}),
				// Total Verified Organizations (Published and has been verified)
				ctx.db.organization.count({
					where: {
						published: true,
						deleted: false,
						lastVerified: { not: null },
					},
				}),
				// Total Published Services
				ctx.db.orgService.count({
					where: {
						published: true,
						deleted: false,
					},
				}),
				// Total Users
				ctx.db.user.count(),
				// Total Visible User Reviews
				ctx.db.orgReview.count({
					where: {
						visible: true,
						deleted: false,
					},
				}),
				// Total Countries Served (Distinct countries with published locations)
				// We use findMany + distinct because it's performant for the limited number of countries
				ctx.db.orgLocation.findMany({
					where: { published: true, deleted: false },
					distinct: ['countryId'],
					select: { countryId: true },
				}),
			])

		return {
			totalOrgs: orgCount,
			totalVerifiedOrgs: verifiedOrgCount,
			totalServices: serviceCount,
			totalUsers: userCount,
			totalReviews: reviewCount,
			totalCountries: Array.isArray(countryCount) ? countryCount.length : 0,
		}
	}),

	/**
	 * Fetches statistics about the freshness of organization data based on the `lastVerified` date.
	 */
	getDataHealthStats: protectedProcedure.query(async ({ ctx }) => {
		const now = new Date()
		// Set dates for 6 and 12 months ago to create our time buckets
		const sixMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 6))
		const twelveMonthsAgo = new Date(new Date().setMonth(now.getMonth() - 12))

		const [verifiedLast6Months, verifiedLast12Months, verifiedOver1Year, neverVerified] =
			await ctx.db.$transaction([
				// Orgs verified in the last 6 months
				ctx.db.organization.count({
					where: { published: true, deleted: false, lastVerified: { gte: sixMonthsAgo } },
				}),
				// Orgs verified between 6 and 12 months ago
				ctx.db.organization.count({
					where: {
						published: true,
						deleted: false,
						lastVerified: { lt: sixMonthsAgo, gte: twelveMonthsAgo },
					},
				}),
				// Orgs verified over a year ago
				ctx.db.organization.count({
					where: { published: true, deleted: false, lastVerified: { lt: twelveMonthsAgo } },
				}),
				// Orgs never verified
				ctx.db.organization.count({
					where: { published: true, deleted: false, lastVerified: null },
				}),
			])

		// Return data in a format that's ready for our charting library
		return [
			{ name: '0-6 Months', count: verifiedLast6Months },
			{ name: '6-12 Months', count: verifiedLast12Months },
			{ name: 'Over 1 Year', count: verifiedOver1Year },
			{ name: 'Never Verified', count: neverVerified },
		]
	}),
})
