import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "../../../lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const formData = await request.formData();
    const classId = formData.get("classId");
    const classSlug = formData.get("classSlug");
    const price = formData.get("price");
    const title = formData.get("title");
    const trainerId = formData.get("trainerId");
    const trainerName = formData.get("trainerName");
    const scheduleDays = formData.get("scheduleDays");
    const time = formData.get("time");

    const redirectParam = classSlug || classId;

    const user = await getUserSession();
    
    if (!user) {
      return NextResponse.redirect(`${origin}/login`, 303);
    }

    const { getTokenServer } = await import("@/lib/getTokenServer");
    const token = await getTokenServer();
    if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/me`, {
           headers: { authorization: `Bearer ${token}` }
        });
        if (res.ok) {
           const dbUser = await res.json();
           if (dbUser.isBlocked) {
              return NextResponse.redirect(`${origin}/classes/${redirectParam}?error=Action+restricted+by+Admin`, 303);
           }
        }
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Number(price) * 100, // Amount in cents
            product_data: {
              name: title || "Class Booking",
              description: `Trainer: ${trainerName} | Schedule: ${scheduleDays} at ${time}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { classId, title, trainerId, userId: user.id },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/classes/${redirectParam}`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
