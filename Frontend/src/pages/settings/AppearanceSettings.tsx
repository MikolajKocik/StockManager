import { useState } from 'react';
import { Header, Section, Button } from '@/components/common';
import './Settings.css';

export default function AppearanceSettings() {
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('medium');

    return (
        <div className="settings-page animate-fade">
            <Header
                title="Appearance Settings"
                subtitle="Customize how StockManager looks on your device."
            />

            <div className="settings-content">
                <Section title="Theme" variant="card">
                    <div className="theme-options">
                        <button
                            className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                        >
                            <div className="theme-preview light"></div>
                            <span>Light Mode</span>
                        </button>
                        <button
                            className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                        >
                            <div className="theme-preview dark"></div>
                            <span>Dark Mode</span>
                        </button>
                    </div>
                </Section>

                <Section title="Typography" variant="card">
                    <div className="font-options">
                        <Button
                            variant={fontSize === 'small' ? 'primary' : 'secondary'}
                            onClick={() => setFontSize('small')}
                        >
                            Small
                        </Button>
                        <Button
                            variant={fontSize === 'medium' ? 'primary' : 'secondary'}
                            onClick={() => setFontSize('medium')}
                        >
                            Medium
                        </Button>
                        <Button
                            variant={fontSize === 'large' ? 'primary' : 'secondary'}
                            onClick={() => setFontSize('large')}
                        >
                            Large
                        </Button>
                    </div>
                </Section>

                <div className="settings-actions">
                    <Button variant="primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
