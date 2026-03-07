import { Card, Text, Title } from '@mantine/core'
import React from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export interface DataFreshnessData {
	name: string
	count: number
}

interface DataFreshnessChartProps {
	data: DataFreshnessData[]
}

export function DataFreshnessChart({ data }: DataFreshnessChartProps) {
	return (
		<Card withBorder shadow='sm' radius='md' p='lg'>
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<Title order={4}>Data Freshness</Title>
			{/* eslint-disable-next-line i18next/no-literal-string */}
			<Text c='dimmed' size='sm' mb='lg'>
				Organizations by last verification date.
			</Text>
			<ResponsiveContainer width='100%' height={300}>
				<BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
					<CartesianGrid strokeDasharray='3 3' vertical={false} />
					<XAxis dataKey='name' tick={{ fontSize: 12 }} />
					<YAxis allowDecimals={false} />
					<Tooltip
						contentStyle={{
							borderRadius: 'var(--mantine-radius-md)',
							borderColor: 'var(--mantine-color-gray-3)',
						}}
					/>
					<Bar dataKey='count' fill='var(--mantine-color-blue-6)' radius={[4, 4, 0, 0]} />
				</BarChart>
			</ResponsiveContainer>
		</Card>
	)
}
