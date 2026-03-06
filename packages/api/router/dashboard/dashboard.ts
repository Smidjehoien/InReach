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
})
