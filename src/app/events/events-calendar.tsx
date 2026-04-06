'use client';

import { useState, useMemo } from 'react';
import {
  VGC_EVENTS_2025_2026,
  TIER_LABEL,
  REGION_LABEL,
  type EventTier,
  type EventRegion,
  type VGCEvent,
} from '@/lib/vgc-events';

// ── Tier colours ──────────────────────────────────────────────────────────────

const TIER_COLOR: Record<EventTier, string> = {
  regional:      '#6890f0', // water
  international: '#f85888', // psychic
  worlds:        '#f8d030', // electric
  special:       '#f08030', // fire
  national:      '#78c850', // grass
  online:        '#b8b8d0', // steel
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + 'T12:00:00Z');
  const e = new Date(end   + 'T12:00:00Z');
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (s.toDateString() === e.toDateString()) {
    return s.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
  }
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString('en-US', opts)}\u2013${e.getDate()}, ${e.getFullYear()}`;
  }
  return `${s.toLocaleDateString('en-US', opts)} \u2013 ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

function monthKey(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z');
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
}

function isPast(event: VGCEvent, todayISO: string): boolean {
  return event.endDate < todayISO;
}

function isOngoing(event: VGCEvent, todayISO: string): boolean {
  return event.startDate <= todayISO && todayISO <= event.endDate;
}

function safeUrl(url: string): string {
  return url.startsWith('https://') || url.startsWith('http://') ? url : '#';
}

// ── Event card ────────────────────────────────────────────────────────────────

function EventCard({ event, todayISO }: { event: VGCEvent; todayISO: string }) {
  const color   = TIER_COLOR[event.tier];
  const past    = isPast(event, todayISO);
  const ongoing = isOngoing(event, todayISO);
  const note    = event.registrationNote;
  const soldOut = note?.toLowerCase().includes('sold out');

  const btnLabel = past ? 'Results' : soldOut ? 'Sold Out' : 'Register';
  const btnColor = past || soldOut ? 'var(--muted-foreground)' : color;
  const btnBg    = past || soldOut ? 'var(--card)' : `${color}22`;
  const btnBorder = past || soldOut ? 'var(--border)' : `${color}44`;

  return (
    <div
      className="glass flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
      style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${color}`, opacity: past ? 0.45 : 1 }}
    >
      {/* Date block */}
      <div className="shrink-0 text-center w-12">
        {(() => {
          const d = new Date(event.startDate + 'T12:00:00Z');
          return (
            <>
              <div className="text-xs font-semibold uppercase" style={{ color: 'var(--muted-foreground)' }}>
                {d.toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xl font-bold leading-none">{d.getDate()}</div>
            </>
          );
        })()}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${color}22`, color }}
          >
            {TIER_LABEL[event.tier]}
          </span>
          {ongoing && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
              LIVE
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {REGION_LABEL[event.region]}
          </span>
        </div>

        <p className="font-semibold text-sm leading-snug">{event.name}</p>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {event.city !== 'Online' && (
            <span className="text-xs text-muted-foreground">
              {event.city}, {event.country}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDateRange(event.startDate, event.endDate)}
          </span>
          <span className="text-xs text-muted-foreground">
            {event.cpPoints.toLocaleString()} CP
          </span>
          {note && !soldOut && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: `${color}22`, color }}
            >
              {note}
            </span>
          )}
        </div>
      </div>

      {/* Action button */}
      <a
        href={safeUrl(event.registrationUrl)}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-xs px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
        style={{ background: btnBg, color: btnColor, border: `1px solid ${btnBorder}` }}
      >
        {btnLabel}
      </a>
    </div>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({
  active, color, onClick, children,
}: {
  active: boolean;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all"
      style={{
        background: active ? (color ? `${color}22` : 'rgba(255,255,255,0.1)') : 'var(--card)',
        color:      active ? (color ?? 'var(--foreground)') : 'var(--muted-foreground)',
        border:     `1px solid ${active ? (color ? `${color}55` : 'rgba(255,255,255,0.3)') : 'var(--border)'}`,
        boxShadow:  active && color ? `0 0 10px ${color}22` : 'none',
      }}
    >
      {children}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type TimeFilter   = 'upcoming' | 'past' | 'all';
type TierFilter   = EventTier | 'all';
type RegionFilter = EventRegion | 'all';

const TIER_FILTERS: EventTier[]     = ['regional', 'international', 'worlds', 'special', 'national', 'online'];
const REGION_FILTERS: EventRegion[] = ['NA', 'EU', 'LA', 'OC', 'APAC', 'ONLINE'];

export function EventsCalendar({ todayISO }: { todayISO: string }) {
  const [time,   setTime]   = useState<TimeFilter>('upcoming');
  const [tier,   setTier]   = useState<TierFilter>('all');
  const [region, setRegion] = useState<RegionFilter>('all');

  const filtered = useMemo(() => {
    return VGC_EVENTS_2025_2026.filter(ev => {
      if (time === 'upcoming' && isPast(ev, todayISO))  return false;
      if (time === 'past'     && !isPast(ev, todayISO)) return false;
      if (tier   !== 'all' && ev.tier   !== tier)       return false;
      if (region !== 'all' && ev.region !== region)     return false;
      return true;
    });
  }, [time, tier, region, todayISO]);

  const grouped = useMemo(() => {
    const map = new Map<string, VGCEvent[]>();
    for (const ev of filtered) {
      const key = monthKey(ev.startDate);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  const upcomingCount = useMemo(
    () => VGC_EVENTS_2025_2026.filter(ev => !isPast(ev, todayISO)).length,
    [todayISO],
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-yellow-500">
            Season 2025-2026
          </p>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-yellow-500 bg-clip-text text-transparent">
            VGC Calendar
          </h1>
          <p className="text-sm mt-1 text-muted-foreground">
            {upcomingCount} upcoming event{upcomingCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['upcoming', 'all', 'past'] as TimeFilter[]).map(t => (
            <FilterPill key={t} active={time === t} onClick={() => setTime(t)}>
              {t === 'upcoming' ? 'Upcoming' : t === 'past' ? 'Past' : 'All'}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Tier filters */}
      <div className="space-y-2">
        <div className="flex gap-2 flex-wrap">
          <FilterPill active={tier === 'all'} onClick={() => setTier('all')}>All tiers</FilterPill>
          {TIER_FILTERS.map(t => (
            <FilterPill key={t} active={tier === t} color={TIER_COLOR[t]} onClick={() => setTier(t)}>
              {TIER_LABEL[t]}
            </FilterPill>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <FilterPill active={region === 'all'} onClick={() => setRegion('all')}>All regions</FilterPill>
          {REGION_FILTERS.map(r => (
            <FilterPill key={r} active={region === r} onClick={() => setRegion(r)}>
              {r}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-x-5 gap-y-1 flex-wrap">
        {TIER_FILTERS.map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: TIER_COLOR[t] }} />
            <span className="text-xs text-muted-foreground">{TIER_LABEL[t]}</span>
          </div>
        ))}
      </div>

      {/* Events grouped by month */}
      {grouped.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground border border-border">
          No events match the current filters.
        </div>
      ) : (
        grouped.map(([key, events]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                {monthLabel(key)}
              </h2>
              <span className="flex-1 h-px bg-border" />
            </div>
            {events.map(ev => (
              <EventCard key={ev.id} event={ev} todayISO={todayISO} />
            ))}
          </div>
        ))
      )}

      <p className="text-xs text-center pb-4 text-muted-foreground">
        Source:{' '}
        <a
          href="https://victoryroad.pro/2026-season-calendar/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80"
        >
          victoryroad.pro/2026-season-calendar
        </a>
      </p>

    </div>
  );
}
