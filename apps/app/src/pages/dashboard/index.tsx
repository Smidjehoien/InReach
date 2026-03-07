import { Container, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { type GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'

import { KpiCards } from '@weareinreach/ui/components/dashboard/KpiCards'
import { getServerSideTranslations } from '~app/utils/i18n'

import DataFreshnessWidget from './components/DataFreshnessWidget'
import { api } from '../../utils/api'

// This component contains all the logic and will only be rendered on the client
function DashboardContents() {
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

			{/* Data Health Section */}
			<DataFreshnessWidget />
		</Stack>
	)
}

/**
 * Admin Dashboard Page Accessible at: http://localhost:3000/dashboard
 */
export default function AdminDashboardPage() {
	const [isClient, setIsClient] = useState(false)

	// This effect runs only once on the client after the component mounts
	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<Container size='xl' py='xl'>
			{isClient ? (
				<DashboardContents />
			) : (
				<Group position='center' p='xl'>
					<Loader />
				</Group>
			)}
		</Container>
	)
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await getServerSideTranslations(locale ?? 'en', ['common'])),
		},
	}
}
