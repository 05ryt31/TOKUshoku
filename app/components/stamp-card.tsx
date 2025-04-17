// app/components/stamp-card.tsx
import { Check } from "lucide-react"

interface StampCardProps {
  stamps: number
}

export default function StampCard({ stamps }: StampCardProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            i < stamps ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          {i < stamps ? <Check className="h-6 w-6" /> : <span className="text-sm font-bold">{i + 1}</span>}
        </div>
      ))}
    </div>
  )
}

