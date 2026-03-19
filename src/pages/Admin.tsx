import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Member, Admin } from '@/types';

const roleColor: Record<string, string> = {
    HEAD: 'text-red-400',
    LEADER: 'text-blue-400',
    SUPPORT: 'text-green-400',
    MEMBER: 'text-gray-400',
};

// Web Crypto hash equivalent to Next.js crypto.createHash
async function hashPassword(password: string) {
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const [members, setMembers] = useState<Member[]>([]);
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', facebookLink: '', role: 'MEMBER',
    });
    const [adminFormData, setAdminFormData] = useState({
        username: '', password: '',
    });
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    const [editingAdminId, setEditingAdminId] = useState<string | null>(null);

    /* ================= GET ================= */
    const fetchMembers = async () => {
        try {
            const snap = await getDocs(collection(db, 'members'));
            setMembers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Member));
        } catch (e) {
            console.error('Error fetching members:', e);
        }
    };

    const fetchAdmins = async () => {
        if (userRole !== 'root') return;
        try {
            const snap = await getDocs(collection(db, 'admins'));
            setAdmins(snap.docs.map(d => ({ id: d.id, username: d.data().username, password: d.data().password })));
        } catch (e) {
            console.error('Error fetching admins:', e);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchMembers();
            if (userRole === 'root') fetchAdmins();
        }
    }, [isAuthenticated, userRole]);

    /* ================= LOGIN ================= */
    const handleLogin = async () => {
        setLoading(true);
        try {
            const { username, password } = credentials;
            if (!username || !password) {
                alert('Missing credentials');
                return;
            }

            const rootUser = import.meta.env.VITE_ROOT_USERNAME || 'admin';
            const rootPass = import.meta.env.VITE_ROOT_PASSWORD || 'admin123';

            if (username === rootUser && password === rootPass) {
                setIsAuthenticated(true);
                setCurrentUser({ username: 'Root Admin', role: 'root' });
                setUserRole('root');
                setLoading(false);
                return;
            }

            const hashedPassword = await hashPassword(password);
            const q = query(
                collection(db, 'admins'),
                where('username', '==', username),
                where('password', '==', hashedPassword)
            );
            const adminQuery = await getDocs(q);

            if (!adminQuery.empty) {
                const adminDoc = adminQuery.docs[0];
                setIsAuthenticated(true);
                setCurrentUser({ username: adminDoc.data().username, role: 'admin' });
                setUserRole('admin');
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            alert('Something went wrong');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= MEMBERS ================= */
    const handleSubmitMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingMemberId) {
                await updateDoc(doc(db, 'members', editingMemberId), formData);
            } else {
                await addDoc(collection(db, 'members'), formData);
            }
            setFormData({ firstName: '', lastName: '', facebookLink: '', role: 'MEMBER' });
            setEditingMemberId(null);
            fetchMembers();
        } catch (err) {
            console.error(err);
            alert("Error saving member");
        }
    };

    const handleDeleteMember = async (id: string) => {
        if (!confirm('Delete this member?')) return;
        await deleteDoc(doc(db, 'members', id));
        fetchMembers();
    };

    /* ================= ADMINS ================= */
    const handleSubmitAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { username, password } = adminFormData;
            if (editingAdminId) {
                // Update Admin
                const updatePayload: any = { username };
                if (password) updatePayload.password = await hashPassword(password);
                await updateDoc(doc(db, 'admins', editingAdminId), updatePayload);
            } else {
                // Check if username exists
                const existing = await getDocs(query(collection(db, 'admins'), where('username', '==', username)));
                if (!existing.empty) {
                    alert('Username already exists');
                    return;
                }
                const hashedPassword = await hashPassword(password);
                await addDoc(collection(db, 'admins'), { username, password: hashedPassword });
            }
            setAdminFormData({ username: '', password: '' });
            setEditingAdminId(null);
            fetchAdmins();
        } catch (err) {
            console.error(err);
            alert("Error saving admin");
        }
    };

    /* ================= UI RENDERING ================= */
    if (!isAuthenticated) {
        return (
            <main className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-yellow-600/20 via-black to-black" />
                <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-10 w-full max-w-md text-center">
                    <h1 className="text-white text-3xl tracking-widest font-bold mb-6">ADMIN ACCESS</h1>
                    <input
                        placeholder="USERNAME"
                        className="w-full mb-4 px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400 tracking-widest"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        className="w-full mb-6 px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400 tracking-widest"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    />
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-3 rounded-full border border-yellow-500/50 text-yellow-400 tracking-widest hover:bg-yellow-500 hover:text-black transition mb-4"
                    >
                        {loading ? 'CHECKING...' : 'LOGIN'}
                    </button>
                    <Link
                        to="/"
                        className="block w-full py-3 rounded-full border border-yellow-500/50 text-yellow-400 tracking-widest hover:bg-yellow-500 hover:text-black transition"
                    >
                        BACK TO HOME
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#0a0a0a] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-yellow-600/15 via-black to-black" />
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 space-y-14">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                    <div>
                        <h1 className="text-white text-4xl font-bold tracking-widest">ADMIN PANEL</h1>
                        <p className="text-yellow-500 text-sm tracking-widest mt-2">
                            LOGGED AS {currentUser?.username} ({userRole})
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Link to="/" className="px-6 py-2 rounded-full border border-yellow-500/40 text-yellow-400 tracking-widest text-sm hover:bg-yellow-500 hover:text-black transition">
                            HOME
                        </Link>
                        <Link to="/members" className="px-6 py-2 rounded-full border border-yellow-500/20 text-yellow-500/80 tracking-widest text-sm bg-black/40 hover:border-yellow-500/60 hover:text-yellow-300 hover:shadow-[0_0_20px_rgba(255,200,80,0.25)] transition-all">
                            MEMBERS
                        </Link>
                        <button onClick={() => setIsAuthenticated(false)} className="px-6 py-2 rounded-full border border-red-400/30 text-red-400 tracking-widest text-sm hover:bg-red-400 hover:text-black transition">
                            LOGOUT
                        </button>
                    </div>
                </div>

                {/* FORM MEMBER */}
                <section className="bg-black/50 border border-yellow-500/20 rounded-3xl p-8">
                    <h2 className="text-white text-xl mb-6">{editingMemberId ? 'EDIT MEMBER' : 'ADD MEMBER'}</h2>
                    <form onSubmit={handleSubmitMember} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input placeholder="FIRST NAME" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400" required />
                        <input placeholder="LAST NAME" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400" required />
                        <input placeholder="FACEBOOK LINK" value={formData.facebookLink} onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400" />
                        <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/40 text-yellow-400">
                            {Object.keys(roleColor).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button type="submit" className="md:col-span-4 py-3 rounded-full bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black transition">
                            {editingMemberId ? 'UPDATE MEMBER' : 'SAVE MEMBER'}
                        </button>
                        {editingMemberId && (
                            <button type="button" onClick={() => { setEditingMemberId(null); setFormData({ firstName: '', lastName: '', facebookLink: '', role: 'MEMBER' }) }} className="md:col-span-4 text-gray-500 underline">Cancel Edit</button>
                        )}
                    </form>
                </section>

                {/* ADMIN MANAGEMENT (Only for root) */}
                {userRole === 'root' && (
                    <section className="bg-black/50 border border-yellow-500/20 rounded-3xl p-8">
                        <h2 className="text-white text-xl mb-6">{editingAdminId ? 'EDIT ADMIN' : 'ADD ADMIN'}</h2>
                        <form onSubmit={handleSubmitAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <input placeholder="USERNAME" value={adminFormData.username} onChange={(e) => setAdminFormData({ ...adminFormData, username: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400" required />
                            <input type="password" placeholder="PASSWORD" value={adminFormData.password} onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })} className="px-5 py-3 rounded-full bg-black border border-yellow-500/30 text-yellow-400" required={!editingAdminId} />
                            <button type="submit" className="md:col-span-2 py-3 rounded-full border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black transition">SAVE ADMIN</button>
                        </form>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {admins.map(admin => (
                                <div key={admin.id} className="p-4 border border-yellow-500/20 rounded-xl flex justify-between items-center">
                                    <span className="text-yellow-400">{admin.username}</span>
                                    <button onClick={() => { setEditingAdminId(admin.id!); setAdminFormData({ username: admin.username, password: '' }) }} className="text-xs text-yellow-400 underline">Edit</button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* MEMBER LIST */}
                <h2 className="text-white text-2xl tracking-widest">MEMBER LIST ({members.length})</h2>
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((m) => (
                        <div key={m.id} className="bg-black/50 border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/50 transition">
                            <h3 className="text-white font-bold">{m.firstName} {m.lastName}</h3>
                            <p className={`text-xs uppercase mt-1 ${roleColor[m.role]}`}>{m.role}</p>
                            <div className="flex gap-2 mt-5">
                                <button onClick={() => { setFormData({ firstName: m.firstName, lastName: m.lastName, facebookLink: m.facebookLink || '', role: m.role }); setEditingMemberId(m.id!); }} className="flex-1 py-2 rounded-full border border-yellow-500/40 text-yellow-400 text-sm hover:bg-yellow-500/10">EDIT</button>
                                <button onClick={() => handleDeleteMember(m.id!)} className="flex-1 py-2 rounded-full border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10">DELETE</button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
