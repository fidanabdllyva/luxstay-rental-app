import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  type ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import React from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
)

interface LineChartProps {
  values: number[]
}

const BookingsLineChart: React.FC<LineChartProps> = ({ values }) => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Data',
        data: values,
        fill: false,
        borderColor: '#91c7a0',
        backgroundColor: '#fff',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Monthly Bookings Overview',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Value' }
      },
      x: {
        title: { display: true, text: 'Month' }
      }
    }
  }

  return <Line data={chartData} options={options} />
}

export default BookingsLineChart
