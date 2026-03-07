import { Grid, Group, Loader, Stack, Text, Title } from '@mantine/core'
import React from 'react'

import { KpiCards } from '@weareinreach/ui/components/dashboard/KpiCards'
import { api } from '~app/utils/api'

import DataFreshnessWidget from './DataFreshnessWidget'
import InteractiveMap from './InteractiveMap'
import ServiceTreemap from './ServiceTreemap'

// This component contains all the logic and will only be rendered on the client
export default function DashboardContents() {
	const { data, isLoading, error } = api.dashboard.getKpiMetrics.useQuery()

	return (
		<Stack spacing='lg'>
			<div>
				{/* eslint-disable-next-line i18next/no-literal-string */}
				<Title order={2}>Data Admin Dashboard</Title>
				{/* eslint-disable-next-line i18next/no-literal-string */}
				<Text c='dimmed'>Overview of platform performance and data health.</Text>
			</div>

			{/* Phase 1: Platform Vital Signs */}
			{isLoading && (
				<Group position='center' p='xl'>
					<Loader />
				</Group>
			)}
			{error && (
				// eslint-disable-next-line i18next/no-literal-string
				<Text c='red'>An error occurred while fetching dashboard metrics: {error.message}</Text>
			)}
			{data && <KpiCards data={data} />}

			{/* Section: Data Health & Quality */}
			<Stack>
				{/* eslint-disable-next-line i18next/no-literal-string */}
				<Title order={3}>Data Health & Quality</Title>
				<DataFreshnessWidget />
				{/* TODO: Add Content Funnel and Migration Review widgets here */}
			</Stack>

			{/* Section: Geographic & Service Landscape */}
			<Grid>
				<Grid.Col span={12} lg={8}>
					<InteractiveMap />
				</Grid.Col>
				<Grid.Col span={12} lg={4}>
					<ServiceTreemap />
				</Grid.Col>
			</Grid>
		</Stack>
	)
}
