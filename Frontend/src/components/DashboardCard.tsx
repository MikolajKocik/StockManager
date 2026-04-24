import { Link } from 'react-router-dom';
import './DashboardCard.css';

interface DashboardCardProps {
    icon: string;
    title: string;
    subtitle: string;
    linkTo: string;
    linkText: string;
    count: number | string;
}

export default function DashboardCard({ icon, title, subtitle, linkTo, linkText, count }: DashboardCardProps) {
    return (
        <div className="card">
            <div className="card-icon-wrapper">
                <img src={icon} alt={title} className="card-icon" />
            </div>
            <h2 className="card-title">{title}</h2>
            <p className="card-subtitle">
                {subtitle}: <strong>{count}</strong>
            </p>
            <Link to={linkTo} className="card-link">
                {linkText} <span className="card-link-arrow">→</span>
            </Link>
        </div>
    );
}
