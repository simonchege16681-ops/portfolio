import { useEffect, useRef, useState } from "react";
import { useSite } from "../context/SiteContext";

export function AdminGate() {
  const { gateOpen, closeGate, unlockAdmin } = useSite();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gateOpen) {
      setCode("");
      setError(false);
      const t = window.setTimeout(() => inputRef.current?.focus(), 350);
      return () => window.clearTimeout(t);
    }
  }, [gateOpen]);

  const submit = () => {
    const ok = unlockAdmin(code.trim());
    if (!ok) {
      setError(true);
      window.setTimeout(() => setError(false), 600);
      setCode("");
    }
  };

  return (
    <div className={`gate-overlay${gateOpen ? " open" : ""}`} role="dialog" aria-modal="true">
      <div className={`gate-card${error ? " shake" : ""}`}>
        <div className="gate-scan" aria-hidden="true" />
        <span className="gate-eyebrow">Restricted Access</span>
        <h3>Enter passcode</h3>
        <p>This area is reserved for the site owner. Enter the passcode to open the control console.</p>
        <input
          ref={inputRef}
          className="gate-input"
          type="password"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="••••"
        />
        <div className="gate-actions">
          <button className="adm-btn tap" onClick={closeGate}>
            Cancel
          </button>
          <button className="adm-btn adm-btn-primary tap" onClick={submit}>
            Unlock
          </button>
        </div>
        <span className="gate-hint">Hint: default code is 2580 — change it inside Security once unlocked.</span>
      </div>
    </div>
  );
}
