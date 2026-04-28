"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Shield, Key, Mail, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProfileSettings() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile");
      const data = await response.json();
      if (data.emails) {
        setEmails(data.emails);
      } else if (data.email) {
        setEmails([data.email]);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showMessage("error", "New passwords do not match");
    }

    setIsActionLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updatePassword",
          currentPassword,
          newPassword
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage("success", "Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showMessage("error", data.error || "Failed to update password");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    setIsActionLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addEmail",
          email: newEmail
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage("success", "Email added successfully");
        setNewEmail("");
        fetchProfile();
      } else {
        showMessage("error", data.error || "Failed to add email");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteEmail = async (emailToDelete: string) => {
    if (emails.length <= 1) {
      return showMessage("error", "You must add a new email before deleting the current one.");
    }

    if (!confirm(`Are you sure you want to remove ${emailToDelete}?`)) return;

    setIsActionLoading(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteEmail",
          email: emailToDelete
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage("success", "Email removed successfully");
        fetchProfile();
      } else {
        showMessage("error", data.error || "Failed to delete email");
      }
    } catch (error) {
      showMessage("error", "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">PROFILE SETTINGS</h1>
          <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Manage your administrative identity</p>
        </header>

        {message.text && (
          <div className={`mb-8 p-4 rounded-sm flex items-center gap-3 border ${
            message.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="text-[0.7rem] uppercase tracking-widest font-bold">{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Email Management */}
          <div className="bg-surface/50 border border-border-subtle p-10 rounded-sm">
            <h3 className="text-2xl font-bebas tracking-widest text-white mb-8 flex items-center gap-3">
              <Mail size={24} className="text-primary" /> EMAIL ADDRESSES
            </h3>
            
            <div className="space-y-4 mb-10">
              {isLoading ? (
                <Loader2 className="animate-spin text-white/20 mx-auto" />
              ) : (
                emails.map((email, i) => (
                  <div key={email} className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-sm">
                    <span className="text-white/70 text-sm font-medium">{email}</span>
                    <button 
                      onClick={() => handleDeleteEmail(email)}
                      className="text-white/20 hover:text-red-500 transition-colors"
                      title="Remove Email"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddEmail} className="flex flex-col gap-4">
              <label className="text-white/40 text-[0.65rem] uppercase tracking-widest font-bold ml-1">Add New Email</label>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  required
                  placeholder="new-admin@jacesurreal.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all"
                />
                <button 
                  disabled={isActionLoading}
                  className="bg-primary text-white px-6 rounded-sm hover:bg-opacity-90 disabled:opacity-50 transition-all flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              </div>
              <p className="text-[0.6rem] text-white/20 italic">Note: You must have at least one email active at all times.</p>
            </form>
          </div>

          {/* Password Management */}
          <div className="bg-surface/50 border border-border-subtle p-10 rounded-sm">
            <h3 className="text-2xl font-bebas tracking-widest text-white mb-8 flex items-center gap-3">
              <Key size={24} className="text-primary" /> SECURITY
            </h3>

            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/40 text-[0.65rem] uppercase tracking-widest font-bold ml-1">Current Password</label>
                <input 
                  type="password" 
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/40 text-[0.65rem] uppercase tracking-widest font-bold ml-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/40 text-[0.65rem] uppercase tracking-widest font-bold ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border border-border-subtle rounded-sm py-4 px-6 text-white focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <button 
                disabled={isActionLoading}
                className="w-full bg-white text-black font-bebas tracking-[0.2em] text-xl py-5 rounded-sm hover:bg-zinc-200 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
              >
                {isActionLoading ? <Loader2 className="animate-spin" size={20} /> : "Update Credentials"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
