import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { getTokenServer } from '@/lib/getTokenServer';
import { getUserSession } from "@/lib/core/session";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;
  const userSession = await getUserSession();
  const role = userSession?.role || 'user';
  const transactionsLink = `/dashboard/${role}/transactions`;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            <XCircle className="size-12 text-red-600 drop-shadow-md" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Invalid Session</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">No payment session ID was provided.</p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-1 mt-4">
            <Link href="/classes">Return to Classes</Link>
          </Button>
        </div>
      </main>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.status === 'open') {
      return redirect('/');
    }

    if (session.status === 'complete') {
      // Save to backend
      const { classId, userId, title, trainerId } = session.metadata || {};
      const amount = session.amount_total / 100;
      
      try {
        const token = await getTokenServer();
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookings`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            sessionId: session.id,
            classId,
            userId,
            title,
            trainerId,
            price: amount,
            transactionId: session.payment_intent,
          }),
          cache: "no-store"
        });
      } catch (error) {
        console.error("Failed to log booking in backend:", error);
      }

      return (
        <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative flex size-32 items-center justify-center rounded-full bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
              <CheckCircle2 className="size-16 text-red-600 drop-shadow-md" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                Payment <span className="text-red-600">Successful!</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
                You have successfully booked <strong>{title || 'your class'}</strong>. A confirmation email has been sent to <span className="text-foreground font-semibold">{session.customer_details?.email}</span>.
              </p>
            </div>

            <div className="pt-6 w-full max-w-sm flex flex-col gap-4">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-1 w-full">
                <Link href={transactionsLink}>
                  View Transactions <ArrowRight className="ml-2 size-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border bg-muted/30 hover:bg-muted text-foreground rounded-xl h-14 px-8 text-lg font-bold transition-all w-full">
                <Link href="/classes">Browse More Classes</Link>
              </Button>
            </div>
          </div>
        </main>
      );
    }
  } catch (err) {
    console.error("Stripe session error:", err);
    return (
      <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-red-600/10 shadow-[0_0_40px_rgba(220,38,38,0.2)]">
            <XCircle className="size-12 text-red-600 drop-shadow-md" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Error Verifying Payment</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">We could not verify your payment session.</p>
          </div>
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-8 text-lg font-bold shadow-lg shadow-red-600/20 transition-all hover:-translate-y-1 mt-4">
            <Link href="/classes">Return to Classes</Link>
          </Button>
        </div>
      </main>
    );
  }

  return redirect('/');
}
