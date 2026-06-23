import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from 'next/link';
import { getTokenServer } from '@/lib/getTokenServer';

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-red-500/20 shadow-red-500/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <XCircle className="size-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-foreground">Invalid Session</CardTitle>
            <CardDescription>No payment session ID was provided.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6">
            <Button asChild className="w-full">
              <Link href="/classes">Return to Classes</Link>
            </Button>
          </CardFooter>
        </Card>
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
          })
        });
      } catch (error) {
        console.error("Failed to log booking in backend:", error);
      }

      return (
        <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
          <Card className="max-w-md w-full border-emerald-500/20 shadow-emerald-500/10 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold text-foreground">Payment Successful!</CardTitle>
              <CardDescription className="text-base mt-2">
                You have successfully booked <strong>{title || 'your class'}</strong>. 
                A confirmation email has been sent to {session.customer_details?.email}.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center pt-8">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </main>
      );
    }
  } catch (err) {
    console.error("Stripe session error:", err);
    return (
      <main className="min-h-screen bg-background pt-32 pb-16 flex items-center justify-center px-4">
        <Card className="max-w-md w-full border-red-500/20 shadow-red-500/10 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <XCircle className="size-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-foreground">Error Verifying Payment</CardTitle>
            <CardDescription>We could not verify your payment session.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pt-6">
            <Button asChild className="w-full">
              <Link href="/classes">Return to Classes</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  return redirect('/');
}
