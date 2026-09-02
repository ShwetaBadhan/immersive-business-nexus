import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { SectionBackdrop } from "@/components/site/SectionBackdrop";
import { Action, Overlay, SectionMarker, SplitHeading, Telemetry } from "@/components/site/ui";
import { ConnectionVisual } from "@/components/site/Visual3D";
import { cursorProps } from "@/components/experience/Cursor";
import { setWorld } from "@/lib/world-store";
import { playCue } from "@/lib/audio";

const TITLE = "Contact 239 — Let's Make Something Move";
const DESC = "Have an idea, challenge or opportunity? Talk to 239 The Business Developer LLP.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Contact,
});

const PROJECT_TYPES = [
  "Business Development",
  "Brand Strategy",
  "Digital Experience",
  "Creative Solutions",
  "Growth Strategy",
  "Digital Transformation",
];

function Contact() {
  useReveal();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: PROJECT_TYPES[0]!,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.message.trim()) {
      setError("Name, a valid email and a message are required.");
      return;
    }
    setError(null);
    setSent(true);
    playCue("open");
    // pulse the 3D environment outward on success
    setWorld({ veil: 1 });
    window.setTimeout(() => setWorld({ veil: 0 }), 2600);
  };

  return (
    <>
      <Telemetry tag="239 / Contact" />
      <Overlay>
        <section className="relative flex min-h-[64svh] flex-col justify-end overflow-hidden px-5 pb-10 pt-24 md:min-h-svh md:px-10 md:pb-20 md:pt-32">
          <SectionBackdrop label="Talk" />
          <SectionMarker index="—" title="Contact" />
          <SplitHeading text="Let's make something move." className="display-xl max-w-[14ch] text-foreground" />
          <p className="mt-5 max-w-[40ch] text-sm leading-relaxed text-muted-foreground md:mt-8 md:text-base" data-reveal data-reveal-delay={400}>
            Have an idea, challenge or opportunity? Let's talk.
          </p>
        </section>

        <section className="px-5 py-14 md:px-10 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-9 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <ConnectionVisual className="mb-8 !h-[200px] md:mb-14 md:!h-[320px]" />

              <div className="space-y-6 md:space-y-10">
                {[
                  { k: "Email", v: "hello@239business.com", href: "mailto:hello@239business.com" },
                  { k: "Phone", v: "+91 XXXXX XXXXX", href: "tel:+91" },
                  { k: "Studio", v: "India" },
                ].map((c, i) => (
                  <div key={c.k} data-reveal data-reveal-delay={i * 110}>
                    <span className="label">{c.k}</span>
                    {c.href ? (
                      <a
                        href={c.href}
                        {...cursorProps("Copy")}
                        className="link-underline pointer-events-auto mt-3 block text-lg uppercase tracking-tight text-foreground transition-colors duration-500 hover:text-glow md:text-2xl"
                      >
                        {c.v}
                      </a>
                    ) : (
                      <p className="mt-3 text-lg uppercase tracking-tight text-foreground md:text-2xl">{c.v}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6" data-no-drag>
              {sent ? (
                <div className="border-t border-neon/40 pt-10">
                  <h2 className="display-lg text-glow" style={{ textShadow: "var(--glow-soft)" }}>
                    Message received.
                  </h2>
                  <p className="mt-6 max-w-[44ch] text-sm text-muted-foreground">
                    Thank you, {form.name.split(" ")[0]}. We read every brief ourselves and reply within two
                    working days.
                  </p>
                  <button
                    {...cursorProps("Reset")}
                    onClick={() => setSent(false)}
                    className="link-underline pointer-events-auto label mt-10 !text-glow"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="pointer-events-auto space-y-8 border-t border-border pt-10">
                  <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                  <Field
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                  />
                  <Field label="Company" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />

                  <div>
                    <span className="label">Project type</span>
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
                      {PROJECT_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          {...cursorProps()}
                          onClick={() => {
                            setForm({ ...form, projectType: t });
                            playCue("click");
                          }}
                          className="label border border-border px-4 py-2 transition-colors duration-500 hover:border-neon"
                          style={{
                            color: form.projectType === t ? "var(--color-glow)" : undefined,
                            borderColor: form.projectType === t ? "var(--color-neon)" : undefined,
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      {...cursorProps()}
                      className="mt-3 w-full resize-none border-b border-input bg-transparent pb-3 text-lg text-foreground outline-none transition-colors duration-500 placeholder:text-muted-foreground/50 focus:border-neon"
                      placeholder="Tell us what you're building…"
                    />
                  </div>

                  {error && <p className="label !text-destructive">{error}</p>}

                  <Action type="submit" label="Send">
                    Send message
                  </Action>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="flex items-end px-5 pb-10 pt-6 md:min-h-[60svh] md:px-10 md:pb-14">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-border pt-6 md:pt-8">
            <span className="label">239 The Business Developer LLP</span>
            <span className="label">© {new Date().getFullYear()}</span>
          </div>
        </section>

      </Overlay>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  const id = label.toLowerCase();
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...cursorProps()}
        className="mt-3 w-full border-b border-input bg-transparent pb-3 text-lg text-foreground outline-none transition-colors duration-500 focus:border-neon"
      />
    </div>
  );
}
