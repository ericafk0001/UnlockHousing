"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatusMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    // Placeholder submission: wire this to email/API later.
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSubmitting(false);
    setStatusMessage("Thanks for reaching out. We will get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <main className="flex min-h-[calc(100svh-7rem)] flex-1 items-center justify-center px-4 pb-12 pt-8 sm:px-6 lg:px-10">
      <section className="w-full max-w-2xl rounded-3xl border border-border bg-card/85 p-6 shadow-xl backdrop-blur sm:p-8 lg:p-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Send us a message and our team will follow up.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-foreground">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-32 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring"
              placeholder="How can we help?"
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {statusMessage ? (
          <p className="mt-4 text-sm text-muted-foreground">{statusMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
