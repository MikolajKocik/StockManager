import { useActivityFeed, type ActivityMessage } from '@/hooks/useActivityFeed';
import type { ReactElement } from 'react';
import inventoryIcon from '@/assets/shelf.svg';
import packageIcon from '@/assets/package.svg';
import orderIcon from '@/assets/order.svg';
import notificationIcon from '@/assets/notification.svg';

// indexed access type
const typeColors: Record<ActivityMessage['type'], string> = {
    Info: 'border-l-[#77A4B4]',
    Success: 'border-l-[#9BB477]',
    Warning: 'border-l-amber-400',
    Critical: 'border-l-[#CC6557]'
};

const categoryIcons: Record<string, ReactElement> = {
    Orders: <img src={orderIcon} alt="order icon" />,
    Inventory: <img src={inventoryIcon} alt="inventory icon" />,
    Maintenance: <img src={packageIcon} alt="packageIcon" />
};

export function LiveActivityFeed() {
    const { activities, isConnected } = useActivityFeed();

    return (
        <div className="card h-full flex flex-col p-4 bg-[#D9D9D9] rounded shadow-md">
            {/* Header with status */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-700">Live Activity Feed</h2>
            </div>

            {/* Activity list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[350px]">
                {activities.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm italic py-8">
                        Awaiting system activities...
                    </div>
                ) : (
                    activities.map((act, idx) => (
                        <div
                            key={idx}
                            className={`p-3 bg-white/75 hover:bg-white rounded shadow-sm border-l-4 transition-all duration-200 flex gap-3 items-start animate-slide-in ${typeColors[act.type] || 'border-l-slate-400'}`}
                        >
                            {/* Category Icon */}
                            <span className="text-xl select-none">
                                {categoryIcons[act.category] ?? <img src={notificationIcon} alt="notification icon" />}
                            </span>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline gap-2">
                                    <span className="font-semibold text-sm text-slate-800 truncate">{act.title}</span>
                                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                                        {new Date(act.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-0.5 wrap-break-word">{act.description}</p>
                                {act.user && (
                                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                                        Triggered by: {act.user}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
