"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function BlogDetailActions() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!showTopButton) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110"
      aria-label="Back to top"
    >
      <ChevronUp className="size-5" />
    </button>
  );
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setMessage("Thank you for subscribing! Check your inbox for confirmation.");
    setEmail("");
  };

  return (
    <div>
      <form className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 flex-1 rounded-full border border-border bg-background px-5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="h-12 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Subscribe
        </button>
      </form>
      {error && (
        <p className="mt-3 text-sm font-medium text-destructive">{error}</p>
      )}
      {message && (
        <p className="mt-3 text-sm font-medium text-success">{message}</p>
      )}
    </div>
  );
}
