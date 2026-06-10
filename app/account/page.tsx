"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { categories } from "@/lib/mock-data";
import { getStoredUser, setStoredUser, type StoredUser } from "@/lib/auth-client";
import styles from "./account.module.css";

type Coordinates = { lat: number; lon: number };
type AddressSuggestion = Coordinates & { label: string };

type ToggleState = Record<string, boolean>;

type AccountSettings = {
  notifications: ToggleState;
  safety: ToggleState;
  favoriteCategories: string[];
};

const SETTINGS_KEY = "ez_account_settings";
const defaultFavoriteCategories = ["food", "music"];

const notificationSettings = [
  { id: "revealReminders", title: "Reveal reminders", description: "Get a reminder before an RSVP unlocks." },
  { id: "friendActivity", title: "Friend activity", description: "See when friends or group members join events." },
  { id: "groupInvites", title: "New group invites", description: "Notify me when someone shares a group code or invite." },
];

const safetySettings = [
  { id: "noTwentyOnePlus", title: "No 21+ events", description: "Avoid events with age restrictions or nightlife-only entry.", defaultChecked: false },
  { id: "stepFree", title: "Step-free access preferred", description: "Prioritize venues with accessible entrances and routes.", defaultChecked: true },
  { id: "emergencyReveal", title: "Share reveal with emergency contact", description: "Prepare a placeholder for sharing the final event details.", defaultChecked: true },
];

const defaultSettings: AccountSettings = {
  notifications: Object.fromEntries(notificationSettings.map((item) => [item.id, true])),
  safety: Object.fromEntries(safetySettings.map((item) => [item.id, item.defaultChecked ?? true])),
  favoriteCategories: defaultFavoriteCategories,
};

function readSettings(): AccountSettings {
  if (typeof window === "undefined") return defaultSettings;

  const stored = window.localStorage.getItem(SETTINGS_KEY);

  if (!stored) return defaultSettings;

  try {
    const parsed = JSON.parse(stored) as Partial<AccountSettings>;

    return {
      notifications: { ...defaultSettings.notifications, ...(parsed.notifications ?? {}) },
      safety: { ...defaultSettings.safety, ...(parsed.safety ?? {}) },
      favoriteCategories: (() => {
        const savedCategories = parsed.favoriteCategories?.filter((category) => categories.includes(category as (typeof categories)[number])) ?? [];
        return savedCategories.length ? savedCategories : defaultFavoriteCategories;
      })(),
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: AccountSettings) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function initialsFromName(name?: string) {
  const parts = (name || "e-z user").trim().split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "EZ";
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className={styles.toggleRow}>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button
        type="button"
        className={`${styles.toggleSwitch} ${checked ? styles.toggleSwitchOn : ""}`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        aria-pressed={checked}
      >
        <span />
      </button>
    </div>
  );
}

export default function AccountPage() {
  const [profile, setProfile] = useState<StoredUser>({ name: "", email: "", phone: "" });
  const [settings, setSettings] = useState<AccountSettings>(defaultSettings);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [addressFocused, setAddressFocused] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");
  const debounceRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const user = getStoredUser();

    if (user) {
      setProfile({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        avatarUrl: user.avatarUrl ?? "",
        bio: user.bio ?? "",
        defaultAddress: user.defaultAddress ?? "",
        emergencyContact: user.emergencyContact ?? { name: "", relationship: "", phone: "" },
      });
    }

    setSettings(readSettings());
  }, []);

  useEffect(() => {
    const query = profile.defaultAddress?.trim() ?? "";

    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (query.length < 3) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      setAddressError("");
      return;
    }

    setAddressLoading(true);
    setAddressError("");

    debounceRef.current = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
        const data = (await response.json().catch(() => ({}))) as { suggestions?: AddressSuggestion[]; error?: string };

        if (!response.ok) throw new Error(data.error || "Address search failed.");

        setAddressSuggestions(data.suggestions ?? []);
        setAddressError("");
      } catch {
        setAddressSuggestions([]);
        setAddressError("Address search is temporarily unavailable.");
      } finally {
        setAddressLoading(false);
      }
    }, 260);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [profile.defaultAddress]);

  const visibleCategories = useMemo(() => categories, []);

  function persistProfile(nextProfile: StoredUser) {
    setProfile(nextProfile);
    setStoredUser(nextProfile);
  }

  function updateProfileField<K extends keyof StoredUser>(key: K, value: StoredUser[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function saveProfile() {
    setStoredUser(profile);
  }

  function updateSettings(nextSettings: AccountSettings) {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  }

  function toggleNotification(id: string) {
    updateSettings({
      ...settings,
      notifications: { ...settings.notifications, [id]: !settings.notifications[id] },
    });
  }

  function toggleSafety(id: string) {
    updateSettings({
      ...settings,
      safety: { ...settings.safety, [id]: !settings.safety[id] },
    });
  }

  function toggleCategory(category: string) {
    const selected = settings.favoriteCategories.includes(category);
    const nextCategories = selected
      ? settings.favoriteCategories.filter((item) => item !== category)
      : [...settings.favoriteCategories, category];

    updateSettings({ ...settings, favoriteCategories: nextCategories });
  }

  function chooseAddress(suggestion: AddressSuggestion) {
    const nextProfile = { ...profile, defaultAddress: suggestion.label };

    setAddressSuggestions([]);
    setAddressFocused(false);
    setAddressError("");
    persistProfile(nextProfile);
  }

  function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") return;

      persistProfile({ ...profile, avatarUrl: reader.result });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function removePhoto() {
    persistProfile({ ...profile, avatarUrl: "" });
  }

  return (
    <main className="main-shell">
      <p className="page-kicker">Keep your profile, safety preferences, and notifications polished.</p>
      <h1 className="page-title">Your account.</h1>

      <section className={styles.accountPanel}>
        <h2>Account settings</h2>

        <div className={styles.profileGrid}>
          <div className={styles.avatarColumn}>
            <button type="button" className={styles.photoButton} onClick={() => fileInputRef.current?.click()}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Your profile" />
              ) : (
                <span>{initialsFromName(profile.name)}</span>
              )}
              <span className={styles.photoOverlay}>Change photo</span>
            </button>
            <button type="button" className={styles.removePhotoButton} onClick={removePhoto} disabled={!profile.avatarUrl}>
              Remove photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={uploadPhoto} className={styles.hiddenInput} />
          </div>

          <div className={styles.profileFields}>
            <label className={styles.fieldLabel}>
              Username
              <input
                className="input"
                value={profile.name}
                onChange={(event) => updateProfileField("name", event.target.value)}
                onBlur={saveProfile}
                placeholder="Your username"
              />
            </label>

            <label className={styles.fieldLabel}>
              Email
              <input
                className="input"
                value={profile.email}
                onChange={(event) => updateProfileField("email", event.target.value)}
                onBlur={saveProfile}
                placeholder="you@example.com"
              />
            </label>

            <label className={styles.fieldLabel}>
              Phone number
              <input
                className="input"
                value={profile.phone ?? ""}
                onChange={(event) => updateProfileField("phone", event.target.value)}
                onBlur={saveProfile}
                placeholder="(555) 555-5555"
              />
            </label>

            <div className={styles.addressField}>
              <label className={styles.fieldLabel}>
                Default address
                <input
                  className="input"
                  value={profile.defaultAddress ?? ""}
                  onBlur={() => {
                    window.setTimeout(() => setAddressFocused(false), 150);
                    saveProfile();
                  }}
                  onChange={(event) => {
                    updateProfileField("defaultAddress", event.target.value);
                    setAddressFocused(true);
                  }}
                  onFocus={() => setAddressFocused(true)}
                  placeholder="Type any U.S. address"
                />
              </label>

              {addressFocused && (addressSuggestions.length > 0 || addressLoading || addressError) && (
                <div className={styles.suggestionMenu}>
                  {addressLoading && <div className={styles.suggestionStatus}>Searching addresses...</div>}

                  {!addressLoading &&
                    addressSuggestions.map((suggestion) => (
                      <button
                        key={`${suggestion.label}-${suggestion.lat}-${suggestion.lon}`}
                        type="button"
                        className={styles.suggestionButton}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => chooseAddress(suggestion)}
                      >
                        {suggestion.label}
                      </button>
                    ))}

                  {!addressLoading && addressError && <div className={styles.suggestionStatus}>{addressError}</div>}

                  {!addressLoading && !addressError && (profile.defaultAddress?.trim().length ?? 0) >= 3 && addressSuggestions.length === 0 && (
                    <div className={styles.suggestionStatus}>No matching U.S. addresses found.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <label className={styles.fieldLabel}>
          Bio
          <textarea
            className={styles.textarea}
            value={profile.bio ?? ""}
            onChange={(event) => updateProfileField("bio", event.target.value)}
            onBlur={saveProfile}
            placeholder="Tell friends a little about your event style."
          />
        </label>

        <div className={styles.emergencyGrid}>
          <label className={styles.fieldLabel}>
            Emergency contact name
            <input
              className="input"
              value={profile.emergencyContact?.name ?? ""}
              onChange={(event) => updateProfileField("emergencyContact", { ...(profile.emergencyContact ?? {}), name: event.target.value })}
              onBlur={saveProfile}
              placeholder="Contact name"
            />
          </label>

          <label className={styles.fieldLabel}>
            Relationship
            <input
              className="input"
              value={profile.emergencyContact?.relationship ?? ""}
              onChange={(event) => updateProfileField("emergencyContact", { ...(profile.emergencyContact ?? {}), relationship: event.target.value })}
              onBlur={saveProfile}
              placeholder="Friend, sibling, parent"
            />
          </label>

          <label className={styles.fieldLabel}>
            Emergency phone
            <input
              className="input"
              value={profile.emergencyContact?.phone ?? ""}
              onChange={(event) => updateProfileField("emergencyContact", { ...(profile.emergencyContact ?? {}), phone: event.target.value })}
              onBlur={saveProfile}
              placeholder="(555) 555-5555"
            />
          </label>
        </div>

        <div className={styles.categorySection}>
          <p className={styles.fieldLabelText}>Favorite categories</p>
          <div className="chip-row">
            {visibleCategories.map((category) => {
              const selected = settings.favoriteCategories.includes(category);

              return (
                <button
                  key={category}
                  className={`${styles.categoryChip} ${selected ? styles.categoryChipActive : ""}`}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-pressed={selected}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.accountPanel}>
        <h2>Notifications</h2>
        <div className={styles.settingsStack}>
          {notificationSettings.map((item) => (
            <ToggleRow
              key={item.id}
              title={item.title}
              description={item.description}
              checked={Boolean(settings.notifications[item.id])}
              onChange={() => toggleNotification(item.id)}
            />
          ))}
        </div>

        <div className={styles.sectionDivider} />

        <h2>Safety preferences</h2>
        <div className={styles.settingsStack}>
          {safetySettings.map((item) => (
            <ToggleRow
              key={item.id}
              title={item.title}
              description={item.description}
              checked={Boolean(settings.safety[item.id])}
              onChange={() => toggleSafety(item.id)}
            />
          ))}
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.deleteSection}>
          <h2>Delete account</h2>
          <p>Permanently delete your profile, RSVP history, groups, and saved preferences.</p>
          <button type="button" className={styles.deleteButton}>
            Delete account
          </button>
        </div>
      </section>
    </main>
  );
}
