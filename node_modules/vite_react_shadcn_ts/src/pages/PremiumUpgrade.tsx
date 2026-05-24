import React from "react";
import { useNavigate } from "react-router-dom";

const PremiumUpgrade = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[kinetic-surface] text-[kinetic-on-surface] font-body selection:bg-[kinetic-primary] selection:text-[kinetic-on-primary] min-h-screen">
      <style>{`
        .glass-card {
          background: rgba(23, 31, 51, 0.6);
          backdrop-filter: blur(20px);
        }
        .kinetic-gradient {
          background: linear-gradient(135deg, kinetic-primary 0%, kinetic-primary-container 100%);
        }
      `}</style>

      {/* TopAppBar */}
      <header className="w-full top-0 flex items-center justify-between px-6 py-4 bg-[kinetic-surface] z-50">
        <div className="flex items-center gap-4">
          <span
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-[kinetic-primary] cursor-pointer active:scale-95 duration-200"
          >
            close
          </span>
          <span className="font-['Inter'] font-bold text-[kinetic-on-surface] uppercase tracking-wider">
            Upgrade Plan
          </span>
        </div>
        <div className="text-lg font-black text-[kinetic-on-surface] tracking-tight">
          KINETIC
        </div>
      </header>

      <main className="pb-32 pt-6 px-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="mb-10 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[kinetic-on-surface] leading-tight mb-4 tracking-tighter">
            UPGRADE YOUR <br />{" "}
            <span className="text-[kinetic-primary] italic">
              DISCIPLINE SYSTEM
            </span>
          </h1>
          <p className="text-[kinetic-on-surface-variant] text-base sm:text-lg max-w-md">
            Unlock AI Analysis, Craving Prediction, and more.
          </p>
        </section>

        {/* Prominent 3-Day Trial CTA */}
        <div className="mb-12 relative overflow-hidden rounded-xl kinetic-gradient p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10">
            <div className="inline-block bg-[kinetic-on-primary] text-[kinetic-primary] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              Limited Time
            </div>
            <h2 className="text-2xl font-black text-[kinetic-on-primary] leading-none">
              START 3-DAY FREE TRIAL
            </h2>
            <p className="text-[kinetic-on-primary]/80 mt-1 font-medium">
              Experience full power with zero commitment.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="relative z-10 bg-[kinetic-on-primary] text-[kinetic-primary-container] px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            Activate Now
          </button>
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <span
              className="material-symbols-outlined text-[160px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              workspace_premium
            </span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Weekly */}
          <div className="bg-[kinetic-surface-container] rounded-xl p-6 flex flex-col justify-between border-t-4 border-transparent hover:border-[kinetic-primary-container] transition-all cursor-pointer group">
            <div>
              <h3 className="text-[kinetic-on-surface-variant] text-xs font-bold uppercase tracking-widest mb-4">
                Weekly
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">PKR 149</span>
              </div>
              <p className="text-[kinetic-on-surface-variant] text-sm mt-2">
                Impulse trial
              </p>
            </div>
            <div className="mt-8">
              <button className="w-full py-3 rounded-xl border-2 border-[kinetic-outline-variant] text-[kinetic-on-surface] font-bold group-hover:bg-[kinetic-surface-container-high] transition-colors">
                Select
              </button>
            </div>
          </div>

          {/* Monthly */}
          <div className="bg-[kinetic-surface-container-high] rounded-xl p-6 flex flex-col justify-between border-2 border-[kinetic-primary] relative transform scale-105 shadow-2xl z-20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[kinetic-primary] text-[kinetic-on-primary] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter w-max">
              Limited Offer
            </div>
            <div>
              <h3 className="text-[kinetic-primary] text-xs font-bold uppercase tracking-widest mb-4">
                Monthly
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">PKR 249</span>
                <span className="text-[kinetic-on-surface-variant] line-through text-sm">
                  PKR 499
                </span>
              </div>
              <p className="text-[kinetic-on-surface-variant] text-sm mt-2">
                Standard momentum
              </p>
            </div>
            <div className="mt-8">
              <button className="w-full py-3 rounded-xl kinetic-gradient text-[kinetic-on-primary] font-bold shadow-md active:scale-95 transition-transform">
                Get Started
              </button>
            </div>
          </div>

          {/* Yearly */}
          <div className="bg-[kinetic-surface-container] rounded-xl p-6 flex flex-col justify-between border-t-4 border-transparent hover:border-[kinetic-primary-container] transition-all cursor-pointer group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[kinetic-on-surface-variant] text-xs font-bold uppercase tracking-widest">
                  Yearly
                </h3>
                <span className="text-[kinetic-primary-container] text-[10px] font-bold">
                  SAVE 50%
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black">PKR 2,999</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-[kinetic-surface-container-high] text-[kinetic-on-surface] px-2 py-0.5 rounded text-[10px] font-bold italic">
                  ~PKR 8 / DAY
                </span>
              </div>
            </div>
            <div className="mt-8">
              <button className="w-full py-3 rounded-xl border-2 border-[kinetic-outline-variant] text-[kinetic-on-surface] font-bold group-hover:bg-[kinetic-surface-container-high] transition-colors">
                Select
              </button>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <section className="bg-[kinetic-surface-container-low] rounded-xl p-8 mb-16">
          <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-center text-[kinetic-on-surface-variant]">
            Unrivaled Intelligence
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[kinetic-surface-container] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[kinetic-primary]">
                  restaurant
                </span>
              </div>
              <div>
                <p className="font-bold text-[kinetic-on-surface]">
                  AI Food Analysis
                </p>
                <p className="text-sm text-[kinetic-on-surface-variant] leading-relaxed">
                  Snap a photo to get instant macronutrient breakdown and toxic
                  ingredient alerts.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[kinetic-surface-container] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[kinetic-primary]">
                  psychology
                </span>
              </div>
              <div>
                <p className="font-bold text-[kinetic-on-surface]">
                  Craving Prediction
                </p>
                <p className="text-sm text-[kinetic-on-surface-variant] leading-relaxed">
                  Biological clock tracking to notify you before emotional
                  hunger strikes.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[kinetic-surface-container] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[kinetic-primary]">
                  monitoring
                </span>
              </div>
              <div>
                <p className="font-bold text-[kinetic-on-surface]">
                  Smart Insights
                </p>
                <p className="text-sm text-[kinetic-on-surface-variant] leading-relaxed">
                  Weekly summaries that correlate your sleep and steps with
                  habit success rates.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-[kinetic-surface-container] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[kinetic-primary]">
                  analytics
                </span>
              </div>
              <div>
                <p className="font-bold text-[kinetic-on-surface]">
                  Advanced Analytics
                </p>
                <p className="text-sm text-[kinetic-on-surface-variant] leading-relaxed">
                  Deep-dive into metabolic trends with exportable health
                  reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[kinetic-on-surface-variant] mb-4">
            Secure Payment Options
          </p>
          <div className="flex justify-center items-center gap-8 grayscale opacity-60">
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-3xl">
                account_balance_wallet
              </span>
              <span className="text-[8px] mt-1 font-bold">JAZZCASH</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-3xl">
                payments
              </span>
              <span className="text-[8px] mt-1 font-bold">EASYPAISA</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="material-symbols-outlined text-3xl">
                credit_card
              </span>
              <span className="text-[8px] mt-1 font-bold">VISA/MC</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-[kinetic-on-surface-variant] text-xs space-y-2 pb-10">
          <p>3-Day Free Trial. Auto-converts to Monthly unless cancelled.</p>
          <div className="flex justify-center gap-4 text-[10px] uppercase font-bold tracking-tighter">
            <a className="hover:text-[kinetic-primary]" href="#">
              Terms of Use
            </a>
            <span>•</span>
            <a className="hover:text-[kinetic-primary]" href="#">
              Privacy Policy
            </a>
            <span>•</span>
            <a className="hover:text-[kinetic-primary]" href="#">
              Restore Purchase
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default PremiumUpgrade;
