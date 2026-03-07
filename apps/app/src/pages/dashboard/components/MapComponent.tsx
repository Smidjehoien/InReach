import React from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet'

interface GeoDataPoint {
	id: string
	region: string
	zip: string
	count: number
	lat: number
	lng: number
}

interface MapComponentProps {
	data: GeoDataPoint[]
}

const MapComponent = ({ data }: MapComponentProps) => {
	return (
		<MapContainer
			center={[34.0522, -118.2437]} // Default to LA center for demo
			zoom={10}
			style={{ height: '100%', width: '100%', borderRadius: '8px' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
			/>
			{data.map((item) => (
				<CircleMarker
					key={item.id}
					center={[item.lat, item.lng]}
					pathOptions={{ color: '#228be6', fillColor: '#228be6', fillOpacity: 0.6 }}
					radius={Math.sqrt(item.count) * 1.5} // Scale radius based on count
				>
					<Popup>
						<div>
							<strong>{item.region}</strong>
							<div style={{ fontSize: '12px' }}>ZIP: {item.zip}</div>
							<div style={{ fontSize: '12px' }}>Services: {item.count}</div>
						</div>
					</Popup>
					<Tooltip>
						{item.region}: {item.count}
					</Tooltip>
				</CircleMarker>
			))}
		</MapContainer>
	)
}

export default MapComponent
