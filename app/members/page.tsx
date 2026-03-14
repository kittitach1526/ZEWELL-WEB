'use client';
export const dynamic = 'force-dynamic';

// ... โค้ดที่เหลือของคุณ
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Member } from '@/types';
import famlogo from "@/app/assets/zw2.png";

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/members')
            .then(res => res.json())
            .then(data => setMembers(data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = members.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())
    );

    /* ===== ROLE ORDER ===== */
    const roleOrder = ['HEAD', 'LEADER', 'SUPPORT', 'MEMBER'];

    /* ===== ROLE COLOR ===== */
    const roleColorMap: Record<string, string> = {
        HEAD: 'bg-red-600 text-white',
        LEADER: 'bg-blue-600 text-white',
        SUPPORT: 'bg-yellow-400 text-black',
        MEMBER: 'bg-white text-black',
    };

    /* ===== GROUP BY ROLE ===== */
    const groupedMembers = roleOrder.map(role => ({
        role,
        members: filtered.filter(m => m.role === role),
    }));

    return (
        <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">

            {/* BACKGROUND AURA */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-600/15 via-black to-black" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-yellow-900/20" />

            <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-yellow-500/10 blur-[140px] rounded-full" />
            <div className="absolute bottom-0 -left-40 w-[420px] h-[420px] bg-yellow-700/10 blur-[160px] rounded-full" />

            {/* CONTENT */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-16">

                {/* HEADER */}
                <div className="text-center space-y-4 animate-fadeIn">
                    <h1 className="text-white text-4xl sm:text-5xl font-fugaz tracking-widest">
                        MEMBER LIST
                    </h1>

                    <p className="text-yellow-500 tracking-[0.35em] text-xs sm:text-sm font-fugaz">
                        ZEWELL OFFICIAL MEMBERS
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="SEARCH MEMBER..."
                            className="
                                bg-black/60 border border-yellow-500/30
                                text-yellow-400 placeholder-yellow-500/40
                                px-6 py-3 rounded-full
                                tracking-widest text-sm
                                focus:outline-none
                                focus:ring-2 focus:ring-yellow-500/40
                                w-full max-w-md
                            "
                        />

                        <Link
                            href="/"
                            className="
                                px-6 py-3 rounded-full
                                border border-yellow-500/40
                                text-yellow-400 text-sm tracking-widest
                                hover:bg-yellow-500 hover:text-black
                                transition
                            "
                        >
                            BACK
                        </Link>

                        <Link
                            href="/admin"
                            className="
                                px-6 py-3 rounded-full
                                border border-yellow-500/20
                                text-yellow-500/80 text-sm tracking-widest
                                bg-black/40
                                hover:border-yellow-500/60
                                hover:text-yellow-300
                                hover:shadow-[0_0_25px_rgba(255,200,80,0.25)]
                                transition-all
                            "
                        >
                            ADMIN
                        </Link>
                    </div>
                </div>

                {/* MEMBER LIST */}
                {loading ? (
                    <p className="text-center text-yellow-500 tracking-widest">
                        LOADING...
                    </p>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-yellow-500/70 tracking-widest">
                        NO MEMBER FOUND
                    </p>
                ) : (
                    <div className="space-y-20">
                        {groupedMembers.map(group =>
                            group.members.length === 0 ? null : (
                                <section key={group.role} className="space-y-10">

                                    {/* ROLE HEADER */}
                                    <div className="text-center space-y-4">
                                        <h2 className="text-yellow-400 text-3xl font-extrabold tracking-widest">
                                            {group.role}
                                        </h2>

                                        <p className="text-yellow-500/70 tracking-widest text-sm">
                                            {group.members.length} MEMBER{group.members.length > 1 ? 'S' : ''}
                                        </p>

                                        <div className="flex justify-center">
                                            <div className="w-32 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
                                        </div>
                                    </div>

                                    {/* MEMBERS GRID / CENTER */}
                                    <div
                                        className={
                                            group.members.length <= 2
                                                ? 'flex justify-center gap-8 flex-wrap'
                                                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'
                                        }
                                    >
                                        {group.members.map((m, i) => (
                                            <div
                                                key={m.id}
                                                className={`
                                                    bg-black/50 backdrop-blur-xl
                                                    border border-yellow-500/20
                                                    rounded-2xl p-6
                                                    hover:border-yellow-500/50
                                                    hover:shadow-[0_0_35px_rgba(255,200,80,0.15)]
                                                    transition-all
                                                    animate-fadeIn
                                                    ${group.members.length === 1 ? 'scale-110' : ''}
                                                `}
                                                style={{ animationDelay: `${i * 0.08}s` }}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-white text-xl font-bold tracking-wide">
                                                            {m.firstName} {m.lastName}
                                                        </h3>

                                                        <span
                                                            className={`
                                                                inline-block mt-2
                                                                px-3 py-1
                                                                rounded-full
                                                                text-[13px]
                                                                tracking-widest
                                                                uppercase
                                                                ${roleColorMap[m.role]}
                                                            `}
                                                        >
                                                            {m.role}
                                                        </span>

                                                        {m.facebookLink && (
                                                            <a
                                                                href={m.facebookLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="
                                                                    inline-block mt-4 ml-6
                                                                    text-blue-400 text-sm tracking-widest
                                                                    hover:text-white transition
                                                                "
                                                            >
                                                                FACEBOOK
                                                            </a>
                                                        )}
                                                    </div>

                                                    <img
                                                        src={famlogo.src}
                                                        alt="logo"
                                                        className="w-16 h-16 object-contain"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
