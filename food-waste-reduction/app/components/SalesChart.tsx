"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import { useEffect, useState } from "react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function SalesChart({ salesData }: { salesData: { date: string; totalSales: number; totalOrders: number }[] }) {
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    if (salesData) {
      const labels = salesData.map((data) => data.date)
      const totalSales = salesData.map((data) => data.totalSales)
      const totalOrders = salesData.map((data) => data.totalOrders)

      setChartData({
        labels,
        datasets: [
          {
            label: "総売り上げ (円)",
            data: totalSales,
            borderColor: "rgba(75, 192, 192, 1)",
            yAxisID: "y1",
          },
          {
            label: "注文数",
            data: totalOrders,
            borderColor: "rgba(255, 99, 132, 1)",
            yAxisID: "y2",
          },
        ],
      })
    }
  }, [salesData])

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    stacked: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "売上と注文数の推移",
      },
    },
    scales: {
      y1: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "総売り上げ (円)",
        },
      },
      y2: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false, // 重なり防止
        },
        title: {
          display: true,
          text: "注文数",
        },
      },
      x: {
        title: {
          display: true,
          text: "日付",
        },
      },
    },
  }

  if (!chartData) return <p>グラフデータを読み込み中...</p>

  return <Line data={chartData} options={options} />
}
