"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PublicService } from "@/lib/data/fallbacks";
import { leadFormSchema, type LeadFormInput } from "@/lib/validation/forms";
import { cn } from "@/lib/utilities/cn";

interface ConsultationFormProps {
  services?: PublicService[];
  className?: string;
  defaultService?: string;
}

export function ConsultationForm({
  services = [],
  className,
  defaultService,
}: ConsultationFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(leadFormSchema) as import("react-hook-form").Resolver<LeadFormInput>,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      clientType: "individual",
      company: "",
      serviceInterest: defaultService ?? "",
      message: "",
      timeline: "",
      preferredContact: "either",
      consent: undefined,
      honeypot: "",
      formType: "consultation",
      landingPage:
        typeof window !== "undefined" ? window.location.pathname : "",
    },
  });

  async function onSubmit(data: LeadFormInput) {
    setStatus("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to submit form.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className={cn("glass-panel rounded-xl p-8 text-center", className)}>
        <h3 className="font-display text-xl text-text-primary">
          Thank you for reaching out
        </h3>
        <p className="mt-2 text-sm text-text-secondary">
          Your consultation request has been received. We will be in touch
          shortly with clear next steps.
        </p>
        <Button
          className="mt-6"
          variant="secondary"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("glass-panel space-y-5 rounded-xl p-6 sm:p-8", className)}
      noValidate
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...form.register("honeypot")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-accent">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-accent">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...form.register("phone")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientType">I am enquiring as *</Label>
          <Select
            value={form.watch("clientType")}
            onValueChange={(value) =>
              form.setValue("clientType", value as "individual" | "business")
            }
          >
            <SelectTrigger id="clientType">
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual / Family</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {form.watch("clientType") === "business" && (
        <div className="space-y-2">
          <Label htmlFor="company">Company name</Label>
          <Input id="company" {...form.register("company")} />
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="serviceInterest">Service of interest</Label>
          <Select
            value={form.watch("serviceInterest") || undefined}
            onValueChange={(value) => form.setValue("serviceInterest", value)}
          >
            <SelectTrigger id="serviceInterest">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.slug} value={service.name}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContact">Preferred contact</Label>
          <Select
            value={form.watch("preferredContact")}
            onValueChange={(value) =>
              form.setValue(
                "preferredContact",
                value as "email" | "phone" | "either",
              )
            }
          >
            <SelectTrigger id="preferredContact">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="either">Email or phone</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" rows={4} {...form.register("message")} />
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id="consent"
          checked={form.watch("consent") === true}
          onCheckedChange={(checked) =>
            form.setValue("consent", checked === true ? true : (undefined as never))
          }
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed text-text-secondary">
          I consent to being contacted about my enquiry. I understand this is not
          a quotation, approval or guarantee of any product or rate. *
        </Label>
      </div>
      {form.formState.errors.consent && (
        <p className="text-xs text-accent">{form.formState.errors.consent.message}</p>
      )}

      {status === "error" && (
        <p className="text-sm text-accent" role="alert">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" variant="gold" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Book a Free Consultation"}
      </Button>
    </form>
  );
}
