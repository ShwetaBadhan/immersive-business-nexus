import { cursorProps } from "@/components/experience/Cursor";
import { playCue } from "@/lib/audio";
import { toggleTheme, useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** Minimal editorial light/dark switch matching the nav's label typography. */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme();
  const dark = theme === "dark";

  return (
    <button
      {...cursorProps(dark ? "Light" : "Dark")}
      onClick={() => {
        toggleTheme();
        playCue("click");
      }}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className={cn(
        "label pointer-events-auto flex items-center gap-2 !text-[0.7rem] !tracking-[0.12em] transition-colors duration-500",
        className,
      )}
    >
      <span className="relative flex h-4 w-8 items-center rounded-full border border-border px-[3px]">
        <span
          className="block h-2.5 w-2.5 rounded-full bg-neon transition-transform duration-500 ease-out"
          style={{
            transform: dark ? "translateX(14px)" : "translateX(0)",
            boxShadow: "var(--glow-hard)",
          }}
        />
      </span>
      {dark ? "Dark" : "Light"}
    </button>
  );
}
