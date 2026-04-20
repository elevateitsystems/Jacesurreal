"use client";

import { useState } from "react";
import { Smartphone, Zap, Shield, Sparkles } from "lucide-react";

export default function SuperPhone() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [phone, setPhone] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) return;
        
        setIsSubscribed(true);
        setTimeout(() => {
            setIsSubscribed(false);
            setPhone("");
        }, 5000);
    };

    return (
        <section className="superphone-section-modern">
            <div className="superphone-card-premium">
                <div className="card-glow-effect"></div>
                <div className="superphone-content">
                    <div className="superphone-badge">
                        <Sparkles size={14} className="mr-2" />
                        EXCLUSIVE ACCESS
                    </div>
                    <h2 className="superphone-title">JOIN THE INNER CIRCLE</h2>
                    <p className="superphone-description">
                        Receive unreleased demos, early tour dates, and exclusive community content directly to your phone.
                    </p>

                    <form className="superphone-form-modern" onSubmit={handleSubscribe}>
                        <div className="phone-input-wrapper">
                            <Smartphone className="input-icon" size={20} />
                            <input 
                                type="tel" 
                                placeholder="+1 (555) 000-0000" 
                                className="superphone-input-refined"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={isSubscribed}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className={`superphone-btn-premium ${isSubscribed ? 'success' : ''}`}
                            disabled={isSubscribed}
                        >
                            {isSubscribed ? 'WELCOME! 🎉' : 'GET ACCESS'}
                        </button>
                    </form>

                    <div className="superphone-features-grid">
                        <div className="feature-item">
                            <Zap size={18} className="text-primary" />
                            <span>First to Play</span>
                        </div>
                        <div className="feature-item">
                            <Shield size={18} className="text-secondary" />
                            <span>Privacy First</span>
                        </div>
                        <div className="feature-item">
                            <Sparkles size={18} className="text-accent" />
                            <span>NFT Drops</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
