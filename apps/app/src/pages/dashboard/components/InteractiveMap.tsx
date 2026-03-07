import { Box, Loader, Paper, Text, Title } from '@mantine/core'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import React from 'react'

// Dynamically import React Leaflet components to avoid SSR issues (Leaflet requires window)
const Map = dynamic(() => import('./MapComponent'), {
	ssr: false,
	loading: () => (
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#f8f9fa',
			}}
		>
			<Loader />
		</Box>
	),
})

// TODO: Implement and call getGeoHeatmapData endpoint
// const { data, isLoading } = api.dashboard.getGeoHeatmapData.useQuery({ country, govDist });

const FAKE_GEO_DATA = [
	{ id: '1', region: 'Downtown', zip: '90210', count: 150, lat: 34.0522, lng: -118.2437 },
	{ id: '2', region: 'Westside', zip: '90025', count: 85, lat: 34.0448, lng: -118.4484 },
	{ id: '3', region: 'Eastside', zip: '90033', count: 65, lat: 34.0488, lng: -118.2082 },
	{ id: '4', region: 'North', zip: '91601', count: 45, lat: 34.1808, lng: -118.3089 },
	{ id: '5', region: 'South', zip: '90003', count: 120, lat: 33.963, lng: -118.274 },
]

export default function InteractiveMap() {
	const { t } = useTranslation('dashboard')
	const data = FAKE_GEO_DATA

	return (
		<Paper withBorder p='md' shadow='sm'>
			<Title order={4}>{t('interactiveMap.title', 'Geographic & Service Landscape')}</Title>
			<Text c='dimmed' fz='sm' mb='md'>
				{t('interactiveMap.description', 'Heatmap of service concentration by ZIP code.')}
			</Text>
			<Box
				sx={(theme) => ({
					height: 400,
					backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
					borderRadius: theme.radius.sm,
					overflow: 'hidden',
					position: 'relative',
				})}
			>
				<Map data={data} />
			</Box>
			{/* TODO: Add filters for Country and GovDist */}
		</Paper>
	)
}
