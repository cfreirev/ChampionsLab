import type { Metadata } from 'next';
import { EventsCalendar } from './events-calendar';

// Revalidate once per day so the past/upcoming split stays accurate
// without needing a full redeploy.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'VGC Calendar - Champions Lab',
  description: 'Full Season 2025-2026 VGC event calendar. Browse upcoming Regionals, Internationals, Nationals, and Special Championships with registration links and CP points.',
  alternates: { canonical: 'https://championslab.xyz/events' },
};

export default function EventsPage() {
  // Compute today on the server so SSR and client share the same reference date.
  // ISR (revalidate=86400) ensures this refreshes daily.
  const todayISO = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <EventsCalendar todayISO={todayISO} />
    </div>
  );
}
