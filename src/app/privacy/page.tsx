import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 pb-20 max-w-4xl">
        <div className="border-l-2 border-primary pl-8 py-4 mb-12">
          <h1 className="text-5xl md:text-7xl font-bebas tracking-[0.15em] text-white">
            PRIVACY <span className="text-primary">POLICY</span>
          </h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em] mt-2">
            Data protection & mobile privacy
          </p>
        </div>

        <div className="space-y-12 text-white/60 font-roboto tracking-wide leading-relaxed">
          <section className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h2 className="text-white font-bebas text-2xl tracking-widest mb-6 uppercase">
              Information Sharing
            </h2>
            <p className="text-lg mb-6">
              No mobile information will be shared with third parties/affiliates
              for marketing/promotional purposes.
            </p>
            <div className="h-px bg-white/10 w-full mb-6" />
            <p className="text-white font-medium">
              All the above categories exclude text messaging originator opt-in
              data and consent; this information will not be shared with any
              third parties.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
