"use client";

import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { mockMembers, Member } from '@/lib/mockData';
import { Search, UserMinus, UserCheck, Trash2, Mail, Instagram, MapPin, Briefcase } from 'lucide-react';

export default function MembersManagement() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState(members);
  
  const lastRequestId = useRef(0);

  useEffect(() => {
    const requestId = ++lastRequestId.current;
    
    const timer = setTimeout(async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (requestId === lastRequestId.current) {
        const results = members.filter(m => 
          `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.instagram.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.occupation.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredMembers(results);
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, members]);

  const toggleStatus = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'suspended' ? 'active' : 'suspended' };
      }
      return m;
    }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently remove this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <h1 className="text-5xl font-bebas tracking-widest text-white mb-2">MEMBERS MANAGEMENT</h1>
          <p className="text-white/40 uppercase tracking-widest text-sm font-medium">Moderate the inner circle community</p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={24} />
          <input 
            type="text" 
            placeholder="Search by name, occupation, or IG handle..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-border-subtle rounded-sm py-6 pl-16 pr-6 text-white text-xl font-bebas tracking-widest focus:outline-none focus:border-primary transition-all backdrop-blur-md"
          />
          {isLoading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="grid grid-cols-1 gap-6">
          {filteredMembers.map((member) => (
            <div key={member.id} className={`bg-surface/30 border ${member.status === 'suspended' ? 'border-red-900/30 opacity-60' : 'border-border-subtle'} p-6 rounded-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all`}>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-sm bg-black/50 border border-border-subtle flex items-center justify-center text-white/20 overflow-hidden shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bebas text-3xl">{member.firstName[0]}{member.lastName[0]}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bebas tracking-wider text-white">{member.firstName} {member.lastName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest ${
                      member.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-white/30 text-[0.7rem] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Briefcase size={12} className="text-primary" /> {member.occupation}</span>
                    <span className="flex items-center gap-1.5"><Instagram size={12} className="text-primary" /> {member.instagram}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {member.city}, {member.zip}</span>
                    <span className="flex items-center gap-1.5"><Mail size={12} /> member_{member.id.split('_')[1]}@archive.com</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleStatus(member.id)}
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-bebas tracking-widest text-sm transition-all border ${
                    member.status === 'suspended' 
                    ? 'bg-green-500 text-white border-green-600 hover:bg-green-600' 
                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30'
                  }`}
                >
                  {member.status === 'suspended' ? <><UserCheck size={16} /> Activate</> : <><UserMinus size={16} /> Suspend</>}
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="w-12 h-12 rounded-sm bg-white/5 border border-white/10 text-white/20 flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {filteredMembers.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-surface/10 border border-dashed border-border-subtle rounded-sm">
              <Search size={48} className="text-white/10 mx-auto mb-4" />
              <p className="text-white/40 font-bebas tracking-widest text-2xl">No members found matching your search</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
