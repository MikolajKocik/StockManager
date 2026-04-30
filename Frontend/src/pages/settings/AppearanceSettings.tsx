import { useState } from 'react';
import { Button } from '@/components/common/Button';
import './Settings.css';

export default function AppearanceSettings() {
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState('medium');

    return (
        <div className="settings-page animate-fade">
            <header className="settings-header">
                <h1>Appearance Settings</h1>
                <p>Customize how StockManager looks on your device.</p>
            </header>

            <div className="settings-content">
                <section className="settings-section">
                    <h3>Theme</h3>
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
                </section>

                <section className="settings-section">
                    <h3>Typography</h3>
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
                </section>

                <div className="settings-actions">
                    <Button variant="primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
}
