import { Container, Group, Loader, Stack, Text, Title } from '@mantine/core'
import { type GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'

import { getServerSideTranslations } from '~app/utils/i18n'

import DashboardContents from './components/DashboardContents'

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
