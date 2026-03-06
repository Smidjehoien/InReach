import { Card, SimpleGrid, Text } from '@mantine/core'
import React from 'react'

export interface KpiData {
	totalOrgs: number
	totalVerifiedOrgs: number
	totalServices: number
	totalCountries: number
	totalUsers: number
	totalReviews: number
}

interface KpiCardProps {
	title: string
	value: string
}

function KpiCard({ title, value }: KpiCardProps) {
	return (
		<Card withBorder shadow='sm' radius='md' p='lg'>
			<Text size='lg' fw={500} c='dimmed'>
				{title}
			</Text>
			<Text size='2.5rem' fw={700} mt='sm'>
				{value}
			</Text>
		</Card>
	)
}

export function KpiCards({ data }: { data: KpiData }) {
	// Format numbers with commas for readability
	const formatNumber = (num: number) => num.toLocaleString()

	return (
		<SimpleGrid
			cols={1}
			breakpoints={[
				{ minWidth: 'sm', cols: 2 },
				{ minWidth: 'lg', cols: 3 },
				{ minWidth: 'xl', cols: 6 },
			]}
		>
			<KpiCard title='Total Published Orgs' value={formatNumber(data.totalOrgs)} />
			<KpiCard title='Total Verified Orgs' value={formatNumber(data.totalVerifiedOrgs)} />
			<KpiCard title='Total Published Services' value={formatNumber(data.totalServices)} />
			<KpiCard title='Countries Served' value={formatNumber(data.totalCountries)} />
			<KpiCard title='Total Users' value={formatNumber(data.totalUsers)} />
			<KpiCard title='Total User Reviews' value={formatNumber(data.totalReviews)} />
		</SimpleGrid>
	)
}
