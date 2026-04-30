"use client";

import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Trash2, Mail, Phone, DollarSign, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Users, UserX } from 'lucide-react';

interface SuperPhoneContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  photo?: string;
  totalSpent?: number;
  vip?: boolean;
}

type SortField = 'name' | 'spent';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 10;

export default function MembersManagement() {
  const [contacts, setContacts] = useState<SuperPhoneContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch('/api/contact?first=100');
      if (!res.ok) {
        throw new Error('FETCH_FAILED');
      }
      const data = await res.json();
      setContacts(data.contacts?.nodes || []);
    } catch (err: any) {
      console.error('Members fetch error:', err);
      setError("Unable to load contacts. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Sort contacts
  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortField === 'name') {
      const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
      const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
      return sortDir === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else {
      const spentA = a.totalSpent || 0;
      const spentB = b.totalSpent || 0;
      return sortDir === 'asc' ? spentA - spentB : spentB - spentA;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedContacts.length / PAGE_SIZE));
  const paginatedContacts = sortedContacts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to page 1 when sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this contact from SuperPhone?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('DELETE_FAILED');
      }
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Delete contact error:', err);
      alert('Unable to remove this contact. Please try again later.');
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (contact: SuperPhoneContact) => {
    const first = contact.firstName?.[0] || '';
    const last = contact.lastName?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">MEMBERS MANAGEMENT</h1>
          <p className="text-white/40 uppercase tracking-widest text-sm font-medium">
            SuperPhone contacts &middot; {contacts.length} total
          </p>
        </header>

        {/* Sort Controls */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-white/30 text-[0.65rem] uppercase tracking-widest font-bold">Sort by</span>
          <button
            onClick={() => handleSort('name')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-bebas tracking-widest text-sm transition-all border ${
              sortField === 'name'
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
            }`}
          >
            <ArrowUpDown size={14} />
            Name {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('spent')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-bebas tracking-widest text-sm transition-all border ${
              sortField === 'spent'
                ? 'bg-primary/10 text-primary border-primary/30'
                : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
            }`}
          >
            <ArrowUpDown size={14} />
            Spent {sortField === 'spent' && (sortDir === 'asc' ? '↑' : '↓')}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-4 px-6 rounded-sm mb-8 flex items-center gap-3">
            <UserX size={20} />
            <span>{error}</span>
            <button onClick={fetchContacts} className="ml-auto text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-surface/20 border border-border-subtle p-6 rounded-sm animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-sm bg-white/5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-white/5 rounded w-48" />
                    <div className="h-3 bg-white/5 rounded w-64" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Members List */}
        {!isLoading && (
          <div className="grid grid-cols-1 gap-4">
            {paginatedContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-surface/30 border border-border-subtle p-6 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:border-white/10"
              >
                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-sm bg-black/50 border border-border-subtle flex items-center justify-center text-white/20 overflow-hidden shrink-0">
                    {contact.photo ? (
                      <img
                        src={contact.photo}
                        alt={contact.firstName || 'Contact'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="font-bebas text-2xl">${getInitials(contact)}</span>`;
                        }}
                      />
                    ) : (
                      <span className="font-bebas text-2xl">{getInitials(contact)}</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-bebas tracking-wider text-white mb-2">
                      {contact.firstName || ''} {contact.lastName || ''}
                    </h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/30 text-[0.7rem] font-bold uppercase tracking-widest">
                      {contact.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} className="text-primary" /> {contact.email}
                        </span>
                      )}
                      {contact.mobile && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={12} className="text-primary" /> {contact.mobile}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <DollarSign size={12} className="text-primary" />
                        ${(contact.totalSpent || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Delete */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white/20 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === contact.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {contacts.length === 0 && !error && (
              <div className="text-center py-20 bg-surface/10 border border-dashed border-border-subtle rounded-sm">
                <Users size={48} className="text-white/10 mx-auto mb-4" />
                <p className="text-white/40 font-bebas tracking-widest text-2xl">No contacts found in SuperPhone</p>
                <p className="text-white/20 text-sm mt-2 uppercase tracking-widest">Contacts added via the website form will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-3 rounded-sm font-bebas tracking-widest text-sm bg-white/5 border border-white/10 text-white/50 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="text-white/40 text-[0.7rem] font-bold uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-5 py-3 rounded-sm font-bebas tracking-widest text-sm bg-white/5 border border-white/10 text-white/50 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
