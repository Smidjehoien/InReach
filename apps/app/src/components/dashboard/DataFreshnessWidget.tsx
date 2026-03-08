import { Group, Loader, Text } from '@mantine/core'
import React from 'react'

import { DataFreshnessChart } from '@weareinreach/ui/components/dashboard/DataFreshnessChart'

// import { api } from '../../utils/api'

const FAKE_FRESHNESS_DATA = [
	{ name: '0-6 Months', count: 450 },
	{ name: '6-12 Months', count: 300 },
	{ name: 'Over 1 Year', count: 150 },
	{ name: 'Never Verified', count: 100 },
]

export default function DataFreshnessWidget() {
	// TODO: Implement and call getDataHealthStats endpoint
	// const { data, isLoading, error } = api.dashboard.getDataHealthStats.useQuery()
	const data = FAKE_FRESHNESS_DATA
	const isLoading = false
	const error = null as { message: string } | null

	if (isLoading) {
		return (
			<Group position='center' p='xl'>
				<Loader />
			</Group>
		)
	}

	if (error) {
		return (
			// eslint-disable-next-line i18next/no-literal-string
			<Text c='red'>An error occurred while fetching data freshness stats: {error.message}</Text>
		)
	}

	return <DataFreshnessChart data={data} />
}
