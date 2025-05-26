import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
 type ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import React from 'react'

interface RevenueChartProps {
  monthlyRevenueData: number[]
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title)

const RevenueChart: React.FC<RevenueChartProps> = ({ monthlyRevenueData }) => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: monthlyRevenueData,
        backgroundColor: '#8684d1',
        borderRadius: 2,
        barPercentage: 0.6,
      }
    ]
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Revenue Overview',
        font: {
          size: 18
        }
      },
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        ticks: {
          callback: (value: number | string) => `$${value}`
        },
        title: {
          display: true,
          text: 'Revenue ($)'
        }
      },
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Month'
        }
      }
    }
  }

  return <Bar data={data} options={options} />
}

export default RevenueChart
