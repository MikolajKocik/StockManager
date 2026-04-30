import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import './Settings.css';

export default function ApiSettings() {
    const [apiKey, setApiKey] = useState('sk-stock-••••••••••••••••');
    const [showKey, setShowKey] = useState(false);

    return (
        <div className="settings-page animate-fade">
            <header className="settings-header">
                <h1>API Settings</h1>
                <p>Manage your API keys to integrate StockManager with other services.</p>
            </header>

            <div className="settings-content">
                <section className="settings-section">
                    <h3>Your API Keys</h3>
                    <div className="api-key-card">
                        <div className="api-key-info">
                            <span className="key-label">Production Key</span>
                            <div className="key-display">
                                <code className="key-code">
                                    {showKey ? 'sk-stock-1a2b3c4d5e6f7g8h9i0j' : apiKey}
                                </code>
                                <Button size="sm" variant="secondary" onClick={() => setShowKey(!showKey)}>
                                    {showKey ? 'Hide' : 'Show'}
                                </Button>
                            </div>
                        </div>
                        <div className="api-key-actions">
                            <Button size="sm" variant="secondary">Regenerate</Button>
                            <Button size="sm" variant="danger">Revoke</Button>
                        </div>
                    </div>
                </section>

                <section className="settings-section">
                    <h3>Webhook URL</h3>
                    <div className="webhook-form">
                        <Input 
                            label="Endpoint URL" 
                            placeholder="https://your-service.com/webhook"
                            defaultValue="https://hooks.stockmanager.com/v1/updates"
                        />
                        <p className="hint">We'll send POST requests to this URL for inventory updates.</p>
                    </div>
                </section>

                <div className="settings-actions">
                    <Button variant="primary">Save Configuration</Button>
                </div>
            </div>
        </div>
    );
}
