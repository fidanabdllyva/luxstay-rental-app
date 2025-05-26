import React, { useEffect, useState } from 'react'
import { getApartments } from '@/api/requests/apartments'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const AptTypesChart: React.FC = () => {
    const [aptTypeCounts, setAptTypeCounts] = useState<{ [type: string]: number }>({})

    useEffect(() => {
        const fetchApartmentTypes = async () => {
            try {
                const apartments = await getApartments()

                const counts: { [type: string]: number } = {}
                apartments.forEach((apt) => {
                    const type = apt.type || 'Unknown'
                    counts[type] = (counts[type] || 0) + 1
                })

                setAptTypeCounts(counts)
            } catch (error) {
                console.error('Failed to fetch apartment types:', error)
            }
        }

        fetchApartmentTypes()
    }, [])

    const labels = Object.keys(aptTypeCounts)
    const values = Object.values(aptTypeCounts)

    const data = {
        labels,
        datasets: [
            {
                label: 'Apartment Types',
                data: values,
                backgroundColor: [
                    '#f87171', // red
                    '#60a5fa', // blue
                    '#facc15', // yellow
                    '#34d399', // green
                    '#a78bfa', // purple
                    '#f472b6', // pink
                    '#c084fc', // violet
                ],
                hoverOffset: 6,
            },
        ],
    }

    return (

        <div className="">
            <Pie data={data}   options={{
    responsive: true,
    maintainAspectRatio: false,
  }}
  style={{ width: '300px', height: '300px' }}/>
        </div>
    )
}

export default AptTypesChart
