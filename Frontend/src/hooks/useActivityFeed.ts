import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export interface ActivityMessage {
    title: string;
    description: string;
    category: string;
    type: 'Info' | 'Success' | 'Warning' | 'Critical';
    timestamp: string;
    user?: string;
}

const URL = 'http://localhost:5000/hubs/activity';

export function useActivityFeed() {
    const [activities, setActivities] = useState<ActivityMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let isMounted = true;
        let startTimeoutId: any;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        connection.on('ReceiveActivity', (message: ActivityMessage) => {
            if (isMounted) {
                setActivities(prev => [message, ...prev].slice(0, 30));
            }
        });

        startTimeoutId = setTimeout(() => {
            if (isMounted) {
                connection.start()
                    .then(() => {
                        if (isMounted) {
                            setIsConnected(true);
                        }
                    })
                    .catch(err => {
                        if (isMounted) {
                            console.error('Error during signalR connection:', err);
                        }
                    });
            }
        }, 50);

        connection.onreconnecting(() => {
            if (isMounted) {
                setIsConnected(false);
            }
        });
        connection.onreconnected(() => {
            if (isMounted) {
                setIsConnected(true);
            }
        });

        return () => {
            isMounted = false;
            clearTimeout(startTimeoutId);
            connection.stop();
        };
    }, []);

    return { activities, isConnected };
}