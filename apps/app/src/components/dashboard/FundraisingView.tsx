import {
	Card,
	Grid,
	Group,
	NumberInput,
	Paper,
	RingProgress,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from '@mantine/core'
import { IconCheck, IconHeartHandshake, IconStar, IconUsers } from '@tabler/icons-react'
import { Trans, useTranslation } from 'next-i18next'
import React, { useState } from 'react'

const FAKE_REVIEWS_DATA = {
	totalReviews: 1250,
	averageRating: 4.8,
	recentQuotes: [
		'InReach helped me find legal aid when I had nowhere else to turn.',
		'A lifesaver for our family.',
		'Easy to use and very accurate information.',
	],
}

const FAKE_VERIFICATION_DATA = {
	verifiedCount: 850,
	totalCount: 1000,
	percentVerified: 85,
}

export default function FundraisingView() {
	const { t } = useTranslation('dashboard')
	const [donationAmount, setDonationAmount] = useState<number | ''>(100)

	const calculateImpact = (amount: number) => {
		// Fake impact logic: $50 = 1 new org onboarded, $10 = 5 users served
		return {
			orgsOnboarded: Math.floor(amount / 50),
			usersServed: Math.floor(amount / 10),
		}
	}

	const impact =
		typeof donationAmount === 'number'
			? calculateImpact(donationAmount)
			: { orgsOnboarded: 0, usersServed: 0 }

	return (
		<Stack spacing='lg'>
			<Title order={2}>{t('fundraising.title', 'Impact & Fundraising')}</Title>

			<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'md', cols: 1 }]} spacing='lg'>
				{/* Trust Meter */}
				<Paper withBorder p='md' radius='md'>
					<Group position='apart' mb='xs'>
						<Title order={4}>{t('fundraising.trustMeter', 'Community Trust')}</Title>
						<IconStar size={20} stroke={1.5} color='orange' />
					</Group>
					<Group align='flex-end' spacing='xs' mb='md'>
						<Text fz='xl' fw={700}>
							{FAKE_REVIEWS_DATA.averageRating}
						</Text>
						<Text fz='sm' c='dimmed' mb={4}>
							{t('fundraising.trustMeter.ratingOutOf', '/ 5.0')}
						</Text>
						<Text fz='sm' c='dimmed' mb={4}>
							{t('fundraising.trustMeter.reviews', '({{count}} reviews)', {
								count: FAKE_REVIEWS_DATA.totalReviews,
							})}
						</Text>
					</Group>
					<Stack spacing='xs'>
						{FAKE_REVIEWS_DATA.recentQuotes.map((quote, i) => (
							<Paper key={i} withBorder p='xs' bg='gray.0'>
								<Text fz='sm' fs='italic'>
									"{quote}"
								</Text>
							</Paper>
						))}
					</Stack>
				</Paper>

				{/* Data Freshness Gauge */}
				<Paper withBorder p='md' radius='md'>
					<Group position='apart' mb='xs'>
						<Title order={4}>{t('fundraising.dataFreshness', 'Data Reliability')}</Title>
						<IconCheck size={20} stroke={1.5} color='green' />
					</Group>
					<Group position='center'>
						<RingProgress
							size={180}
							thickness={16}
							roundCaps
							sections={[{ value: FAKE_VERIFICATION_DATA.percentVerified, color: 'teal' }]}
							label={
								<Stack spacing={0} align='center'>
									<Text fz='xl' fw={700}>
										{FAKE_VERIFICATION_DATA.percentVerified}%
									</Text>
									<Text fz='xs' c='dimmed' ta='center'>
										<Trans
											i18nKey='fundraising.dataFreshness.verifiedLabel'
											defaults='Verified <br/> (Last 12mo)'
											components={{ br: <br /> }}
										/>
									</Text>
								</Stack>
							}
						/>
					</Group>
					<Text ta='center' fz='sm' mt='md'>
						{t(
							'fundraising.dataFreshness.verifiedOrganizations',
							'{{verified}} of {{total}} organizations verified.',
							{
								verified: FAKE_VERIFICATION_DATA.verifiedCount,
								total: FAKE_VERIFICATION_DATA.totalCount,
							}
						)}
					</Text>
				</Paper>
			</SimpleGrid>

			{/* Impact Calculator */}
			<Paper withBorder p='xl' radius='md' bg='blue.0'>
				<Grid gutter='xl' align='center'>
					<Grid.Col span={12} md={5}>
						<Title order={3} mb='md'>
							{t('fundraising.impactCalculator', 'See Your Impact')}
						</Title>
						{/* eslint-disable-next-line i18next/no-literal-string */}
						<Text mb='lg'>
							{t(
								'fundraising.impactCalculator.description',
								'Your donation directly supports our mission to connect people with safe, verified resources.'
							)}
						</Text>
						<NumberInput
							label={t('fundraising.impactCalculator.donationLabel', 'Donation Amount ($)')}
							defaultValue={100}
							parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
							formatter={(value) =>
								!Number.isNaN(parseFloat(value)) ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ '
							}
							value={donationAmount}
							onChange={setDonationAmount}
							size='lg'
						/>
					</Grid.Col>
					<Grid.Col span={12} md={7}>
						<SimpleGrid cols={2}>
							<Card shadow='sm' p='lg' radius='md' withBorder>
								<ThemeIcon size='xl' radius='md' variant='light' color='blue' mb='sm'>
									<IconHeartHandshake />
								</ThemeIcon>
								<Text size='xl' weight={700}>
									{impact.orgsOnboarded}
								</Text>
								<Text size='sm' color='dimmed'>
									{t('fundraising.impactCalculator.orgsOnboarded', 'New Organizations Onboarded')}
								</Text>
							</Card>
							<Card shadow='sm' p='lg' radius='md' withBorder>
								<ThemeIcon size='xl' radius='md' variant='light' color='grape' mb='sm'>
									<IconUsers />
								</ThemeIcon>
								<Text size='xl' weight={700}>
									{impact.usersServed}
								</Text>
								<Text size='sm' color='dimmed'>
									{t('fundraising.impactCalculator.usersServed', 'Users Connected to Services')}
								</Text>
							</Card>
						</SimpleGrid>
					</Grid.Col>
				</Grid>
			</Paper>
		</Stack>
	)
}
