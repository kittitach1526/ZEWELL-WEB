import Link from "next/link";
import Image from "next/image";
import famlogo from "@/app/assets/zw2.png";


export default function Home() {
    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">

            {/* GOLD AURA BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-radial from-yellow-600/20 via-black to-black" />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent to-yellow-900/30" />

            {/* Aura blobs */}
            <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] bg-yellow-700/10 blur-[140px] rounded-full" />

            {/* CONTENT */}
            <div className="relative z-10 text-center px-6">

                {/* LOGO */}
                <div className="flex justify-center mb-8">
                    <Image
                        src={famlogo}
                        alt="Zewell Logo"
                        priority
                        className="
              w-36 h-36
              animate-float
              drop-shadow-[0_0_25px_rgba(255,200,80,0.25)]
            "
                    />
                </div>

                {/* TITLE text-white text-4xl sm:text-6xl font-extrabold tracking-widest  */}
                <h1 className="font-fugaz text-6xl text-white italic">
                    ZEWELL NEVER DIE
                </h1>

                <p className="text-yellow-500 tracking-[0.35em] text-xs sm:text-sm mt-3">
                    OFFICIAL WEBSITE MEMBER LIST
                </p>

                {/* DIAMOND BUTTON */}
                <div className="mt-14 flex justify-center">
                    <Link
                        href="/members"
                        className="
              relative group
              px-14 py-4
              text-yellow-400 font-semibold tracking-widest
              text-sm sm:text-base
              border border-yellow-500/50
              bg-gradient-to-br from-yellow-500/10 to-yellow-700/10
              shadow-[0_0_25px_rgba(255,200,80,0.15)]
              transition-all duration-300
              transform skew-x-[-15deg]
              hover:bg-yellow-500
              hover:text-black
              hover:shadow-[0_0_45px_rgba(255,200,80,0.6)]
            "
                    >
                        <span className="flex items-center gap-2 justify-center transform skew-x-[15deg]">
                            VIEW MEMBER LIST
                            <span className="group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </span>
                    </Link>
                </div>

                {/* PARTNERS */}
                {/* <div className="mt-16 text-gray-400 text-xs tracking-widest">
                    — OFFICIAL PARTNERS —
                    <div className="mt-4 flex justify-center gap-6 opacity-60">
                        <div className="w-10 h-10 border border-yellow-500/30 rounded-full" />
                        <div className="w-10 h-10 border border-yellow-500/30 rounded-full" />
                    </div>
                </div> */}

            </div>
        </main >
    );
}
