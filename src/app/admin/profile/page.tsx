"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminSidebar from '../components/AdminSidebar';
import { Shield, Key, Mail, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ProfileSettings() {
  const [emails, setEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // Delete Confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);

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

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
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
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred");
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
        toast.success("Email added successfully");
        setNewEmail("");
        fetchProfile();
      } else {
        toast.error(data.error || "Failed to add email");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteEmail = (email: string) => {
    if (emails.length <= 1) {
      return toast.error("You must add a new email before deleting the current one.");
    }
    setEmailToDelete(email);
    setShowDeleteDialog(true);
  };

  const executeDeleteEmail = async () => {
    if (!emailToDelete) return;
    
    const email = emailToDelete;
    setEmailToDelete(null);
    setShowDeleteDialog(false);
    setIsActionLoading(true);

    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deleteEmail",
          email: email
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Email removed successfully");
        fetchProfile();
      } else {
        toast.error(data.error || "Failed to delete email");
      }
    } catch (error) {
      toast.error("An error occurred");
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

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-surface border-white/10 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl font-bebas tracking-widest">REMOVE EMAIL?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/40 font-medium tracking-wide uppercase text-xs">
                Are you sure you want to remove {emailToDelete?.toUpperCase()}? You will no longer be able to use this email for administrative access.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-4">
              <AlertDialogCancel className="bg-transparent border-white/5 text-white/40 hover:bg-white/5 hover:text-white rounded-sm font-bebas tracking-widest uppercase transition-all">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={executeDeleteEmail}
                className="bg-primary text-white hover:bg-opacity-90 rounded-sm font-bebas tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(255,45,85,0.2)]"
              >
                Confirm Removal
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
