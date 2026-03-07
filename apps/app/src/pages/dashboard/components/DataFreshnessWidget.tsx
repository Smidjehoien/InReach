import { Group, Loader, Text } from '@mantine/core'
import React from 'react'

import { DataFreshnessChart } from '@weareinreach/ui/components/dashboard/DataFreshnessChart'

import { api } from '../../../utils/api'

export default function DataFreshnessWidget() {
	const { data, isLoading, error } = api.dashboard.getDataHealthStats.useQuery()

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
