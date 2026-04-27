import './StatisticsCard.css'

interface StatisticsCardProps {
    label: string;
    value: number | string | undefined
}

export default function StatisticsCard({ label, value }: StatisticsCardProps) {
    return (
        <div className="stat-card">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    )
}