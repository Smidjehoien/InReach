import { Box, LoadingOverlay, Paper, Text, Title } from '@mantine/core'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { ResponsiveContainer, Tooltip, Treemap } from 'recharts'

// import { api } from '~/utils/api';

// TODO: Implement and call getServiceDistribution endpoint
// const { data, isLoading } = api.dashboard.getServiceDistribution.useQuery({ /* country, govDist */ });

const FAKE_DATA = [
	{ name: 'Healthcare', size: 400 },
	{ name: 'Legal', size: 300 },
	{ name: 'Housing', size: 300 },
	{ name: 'Employment', size: 200 },
	{ name: 'Food', size: 278 },
	{ name: 'Education', size: 189 },
]

interface TreemapNodePayload {
	name: string
	size: number
	// Recharts can add other properties to the payload
	[key: string]: unknown
}

export default function ServiceTreemap() {
	const { t } = useTranslation('dashboard')
	// For demonstration, we'll continue using FAKE_DATA.
	// When the API is ready, you can swap FAKE_DATA with `data` from the query and use `isLoading`.
	const data = FAKE_DATA
	const isLoading = false

	const handleNodeClick = (data: unknown) => {
		const payload = data as TreemapNodePayload
		// TODO: Replace with real drill-down logic (e.g., open a modal with a data table)
		console.log('Drill-down clicked:', payload)
		alert(
			`Drill-down: this would load a modal Showing details for ${payload.name} (${payload.size} services)`
		)
	}

	return (
		<Paper withBorder p='md' shadow='sm'>
			<Title order={4}>{t('serviceTreemap.title', 'Services by Category')}</Title>
			<Text c='dimmed' fz='sm' mb='md'>
				{t('serviceTreemap.description', 'Hierarchical view of service category distribution.')}
			</Text>
			<Box sx={{ height: 400, position: 'relative' }}>
				<LoadingOverlay visible={isLoading} />
				<ResponsiveContainer width='100%' height='100%'>
					<Treemap
						data={data}
						dataKey='size'
						aspectRatio={4 / 3}
						stroke='#fff'
						fill='#8884d8'
						isAnimationActive={false} // Animation can be laggy with large datasets
						onClick={handleNodeClick}
					>
						<Tooltip />
					</Treemap>
				</ResponsiveContainer>
			</Box>
		</Paper>
	)
}
