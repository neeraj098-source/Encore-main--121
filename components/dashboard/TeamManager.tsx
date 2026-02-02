"use client";

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { eventsData } from '@/lib/data';
import { Users, Plus, UserPlus, Copy } from 'lucide-react';

interface Team {
    id: string;
    name: string;
    code: string;
    eventSlug: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[];
}

export default function TeamManager({ userEmail, userId }: { userEmail: string, userId: string }) {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<'list' | 'create' | 'join'>('list');

    // Form States
    const [selectedEvent, setSelectedEvent] = useState('');
    const [teamName, setTeamName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchTeams = useCallback(async () => {
        try {
            const res = await fetch('/api/user/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail })
            });
            if (res.ok) {
                const data = await res.json();
                setTeams(data.teams);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    useEffect(() => {
        if (userEmail) fetchTeams();
    }, [userEmail, fetchTeams]);

    const handleCreateTeam = async () => {
        setError(''); setSuccess('');
        try {
            if (!userId) {
                setError('Session expired. Please log in again.');
                return;
            }

            const res = await fetch('/api/team/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, eventSlug: selectedEvent, teamName })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(`Team Created! Code: ${data.team.code}`);
                fetchTeams();
                setTimeout(() => setView('list'), 2000);
            } else {
                setError(data.error);
            }
        } catch {
            setError('Failed to create team');
        }
    };

    const handleJoinTeam = async () => {
        setError(''); setSuccess('');
        try {
            if (!userId) {
                setError('Session expired. Please log in again.');
                return;
            }

            const res = await fetch('/api/team/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, teamCode: joinCode })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(`Joined team: ${data.teamName}`);
                fetchTeams();
                setTimeout(() => setView('list'), 2000);
            } else {
                setError(data.error);
            }
        } catch {
            setError('Failed to join team');
        }
    };

    // Filter events that allow teams

    const teamEvents = eventsData.filter(e => e.isTeam);
    const availableEvents = teamEvents.filter(e => !teams.find(t => t.eventSlug === e.slug));

    if (loading) return <div className="text-gray-500 text-sm">Loading teams...</div>;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-cinzel text-gold flex items-center gap-2">
                    <Users size={20} /> My Teams
                </h3>
                {view === 'list' && (
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => setView('join')}>
                            <UserPlus size={14} className="mr-1" /> Join Team
                        </Button>
                        <Button size="sm" className="text-xs bg-gold text-black hover:bg-gold/80" onClick={() => setView('create')}>
                            <Plus size={14} className="mr-1" /> Create Team
                        </Button>
                    </div>
                )}
            </div>

            {/* Error / Success Messages */}
            {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded mb-4">{error}</div>}
            {success && <div className="text-green-400 text-sm bg-green-900/20 p-2 rounded mb-4">{success}</div>}

            {/* VIEW: LIST */}
            {view === 'list' && (
                <div className="space-y-4">
                    {teams.length === 0 ? (
                        <p className="text-gray-500 text-sm">You haven&apos;t joined any teams yet.</p>
                    ) : (
                        teams.map(team => {
                            const event = eventsData.find(e => e.slug === team.eventSlug);
                            return (
                                <div key={team.id} className="bg-black/40 border border-white/10 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-white font-medium">{team.name}</h4>
                                            <p className="text-xs text-gold uppercase tracking-wider">{event?.title || team.eventSlug}</p>
                                        </div>
                                        <div className="bg-white/10 px-2 py-1 rounded text-xs font-mono text-gray-300 flex items-center gap-2">
                                            {team.code}
                                            <button onClick={() => navigator.clipboard.writeText(team.code)} className="hover:text-gold"><Copy size={12} /></button>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-400 mb-1">Members ({team.members.length})</p>
                                        <div className="flex -space-x-2">
                                            {team.members.map((m, i) => (
                                                <div key={i} title={m.name} className="w-6 h-6 rounded-full bg-gold/20 border border-black flex items-center justify-center text-[10px] text-gold font-bold">
                                                    {m.name.charAt(0)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* VIEW: CREATE */}
            {view === 'create' && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Select Event</label>
                        <select
                            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                        >
                            <option value="">-- Choose Event --</option>
                            {availableEvents.map(e => (
                                <option key={e.slug} value={e.slug}>{e.title} ({e.category})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Team Name</label>
                        <input
                            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm"
                            placeholder="e.g. The Avengers"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setView('list')}>Cancel</Button>
                        <Button className="flex-1 bg-gold text-black" onClick={handleCreateTeam} disabled={!selectedEvent || !teamName}>Create</Button>
                    </div>
                </div>
            )}

            {/* VIEW: JOIN */}
            {view === 'join' && (
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Enter Team Code</label>
                        <input
                            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white text-sm font-mono uppercase"
                            placeholder="e.g. X8J2P9"
                            maxLength={6}
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setView('list')}>Cancel</Button>
                        <Button className="flex-1 bg-gold text-black" onClick={handleJoinTeam} disabled={joinCode.length < 6}>Join Team</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
