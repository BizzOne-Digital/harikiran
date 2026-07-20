"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { newsletterSchema } from "@/lib/validation/forms";
import { cn } from "@/lib/utilities/cn";
import { z } from "zod";

type NewsletterInput = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  compact?: boolean;
  className?: string;
}

export function NewsletterForm({ compact = false, className }: NewsletterFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      name: "",
      consent: undefined,
      honeypot: "",
    },
  });

  async function onSubmit(data: NewsletterInput) {
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Subscription failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={cn("text-sm text-cyan", className)}>
        Thank you for subscribing.
      </p>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("space-y-3", className)}
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <input tabIndex={-1} autoComplete="off" {...form.register("honeypot")} />
      </div>

      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="newsletter-name">Name</Label>
          <Input id="newsletter-name" {...form.register("name")} />
        </div>
      )}

      <div className={cn(compact && "flex flex-col gap-2 sm:flex-row")}>
        <Input
          type="email"
          placeholder="Your email"
          aria-label="Email address"
          {...form.register("email")}
        />
        <Button
          type="submit"
          variant={compact ? "secondary" : "default"}
          disabled={status === "loading"}
        >
          {status === "loading" ? "..." : "Subscribe"}
        </Button>
      </div>
      {form.formState.errors.email && (
        <p className="text-xs text-accent">{form.formState.errors.email.message}</p>
      )}

      <div className="flex items-start gap-2">
        <Checkbox
          id="newsletter-consent"
          checked={form.watch("consent") === true}
          onCheckedChange={(checked) =>
            form.setValue("consent", checked === true ? true : (undefined as never))
          }
        />
        <Label
          htmlFor="newsletter-consent"
          className="text-xs leading-relaxed text-text-secondary"
        >
          I agree to receive educational updates and understand I can unsubscribe
          at any time.
        </Label>
      </div>
      {status === "error" && (
        <p className="text-xs text-accent">Unable to subscribe. Please try again.</p>
      )}
    </form>
  );
}
