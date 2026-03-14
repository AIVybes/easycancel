"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Tracking = {
  number: string;
  status: string;
  eta: string;
};

type FormState = {
  name: string;
  email: string;
  address: string;
  gymName: string;
  gymAddress: string;
  membership: string;
  notes: string;
};

export default function GymCancelStartupSite() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<Tracking | null>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    address: "",
    gymName: "",
    gymAddress: "",
    membership: "",
    notes: "",
  });

  function updateField(field: keyof FormState, value: string) {
    setForm({ ...form, [field]: value });
  }

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Error starting checkout");
    }

    setLoading(false);
  }

  async function simulateTracking() {
    setLoading(true);

    setTimeout(() => {
      setTracking({
        number: "701234567890",
        status: "Certified Mail Sent",
        eta: "3–5 business days",
      });
      setStep(3);
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* HERO */}

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Cancel Your Gym Membership Online</h1>

          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Skip the post office. We generate your cancellation letter and send it
            via certified mail with tracking.
          </p>

          <div className="mt-6">
            <Button
              className="text-lg px-8 py-4"
              onClick={() => setStep(2)}
            >
              Start Cancellation
            </Button>
          </div>
        </header>

        {/* HOW IT WORKS */}

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">1. Enter Your Info</h3>
              <p className="text-gray-600">
                Provide your membership and gym cancellation address.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">2. Pay Securely</h3>
              <p className="text-gray-600">
                A one-time payment covers printing, postage, and certified mail.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">3. Letter Sent</h3>
              <p className="text-gray-600">
                We print and mail your cancellation with tracking proof.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* FORM STEP */}

        {step === 2 && (
          <section className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleCheckout} className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">
                    Cancel My Membership
                  </h2>

                  <Input
                    placeholder="Full Name"
                    required
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                  />

                  <Input
                    placeholder="Email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />

                  <Input
                    placeholder="Home Address"
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />

                  <Input
                    placeholder="Gym Name"
                    required
                    value={form.gymName}
                    onChange={(e) => updateField("gymName", e.target.value)}
                  />

                  <Input
                    placeholder="Gym Cancellation Address"
                    required
                    value={form.gymAddress}
                    onChange={(e) => updateField("gymAddress", e.target.value)}
                  />

                  <Input
                    placeholder="Membership Number (optional)"
                    value={form.membership}
                    onChange={(e) => updateField("membership", e.target.value)}
                  />

                  <Textarea
                    placeholder="Additional Notes (optional)"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                  />

                  <div className="bg-gray-100 p-4 rounded-lg text-sm">
                    By continuing you authorize this service to send a certified
                    cancellation letter on your behalf.
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-lg"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Continue to $24.99 Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        )}

        {/* POST PAYMENT SIMULATION */}

        {step === 1 && (
          <div className="text-center mt-10">
            <Button onClick={simulateTracking}>Demo: Simulate Letter Sent</Button>
          </div>
        )}

        {/* TRACKING */}

        {step === 3 && tracking && (
          <section className="max-w-xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                  Cancellation Letter Sent
                </h2>

                <p className="text-gray-600 mb-6">
                  Your cancellation letter has been sent via certified mail.
                </p>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>
                    <strong>Tracking Number:</strong> {tracking.number}
                  </p>

                  <p>
                    <strong>Status:</strong> {tracking.status}
                  </p>

                  <p>
                    <strong>Estimated Delivery:</strong> {tracking.eta}
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* PRICING FOOTER */}

        <footer className="text-center text-sm text-gray-500 mt-16">
          <p>$24.99 flat fee • Certified mail included • Tracking provided</p>
        </footer>

      </div>
    </div>
  );
}



// Backend Stripe routes should be placed in separate files:
// app/api/create-checkout-session/route.ts
// app/api/stripe-webhook/route.ts

// This page file should only contain the React component for the landing page.
