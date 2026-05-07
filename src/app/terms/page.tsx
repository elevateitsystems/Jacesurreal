import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <Navbar />
      <div className="container mx-auto px-6 pt-40 pb-20 max-w-4xl">
        <div className="border-l-2 border-primary pl-8 py-4 mb-12">
          <h1 className="text-5xl md:text-7xl font-bebas tracking-[0.15em] text-white">
            SMS TERMS & <span className="text-primary">CONDITIONS</span>
          </h1>
          <p className="text-white/30 text-xs font-bold uppercase tracking-[0.4em] mt-2">
            Legal requirement for communication
          </p>
        </div>

        <div className="space-y-12 text-white/60 font-roboto tracking-wide leading-relaxed">
          <section>
            <h2 className="text-white font-bebas text-2xl tracking-widest mb-4 uppercase">
              Campaign: Ladies fight club
            </h2>
            <p className="text-lg">
              A campaign that covers multiple use cases such as Customer Care
              and Marketing to engage with our customers.
            </p>
          </section>

          <section className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h3 className="text-white font-bebas text-xl tracking-widest mb-4 uppercase">
              Message Guidelines
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▪</span>
                <span>Message frequency varies.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▪</span>
                <span>Message and data rates may apply.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">▪</span>
                <span>
                  Carriers are not liable for any delays or undelivered
                  messages.
                </span>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
