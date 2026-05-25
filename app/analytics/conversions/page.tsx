import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conversion Analytics Dashboard | E-Waste Kochi',
  description: 'Real-time conversion tracking dashboard for wiki-to-service attribution',
  robots: 'noindex, nofollow',
}

export default function ConversionAnalyticsDashboard() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Conversion Analytics Dashboard</h1>
          <p className="text-foreground/70">Real-time tracking of wiki-to-service conversions and user journeys</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* KPI Cards */}
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-sm text-foreground/60 mb-2">Total Wiki Visits</div>
            <div className="text-3xl font-bold">--</div>
            <div className="text-xs text-foreground/50 mt-2">Tracked via GA4</div>
          </div>
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-sm text-foreground/60 mb-2">Service CTA Clicks</div>
            <div className="text-3xl font-bold text-primary">--</div>
            <div className="text-xs text-foreground/50 mt-2">Wiki → Service</div>
          </div>
          <div className="rounded-lg border border-border bg-background p-6">
            <div className="text-sm text-foreground/60 mb-2">Form Submissions</div>
            <div className="text-3xl font-bold text-primary">--</div>
            <div className="text-xs text-foreground/50 mt-2">Service Page Conversions</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Top Performing Articles */}
          <div className="rounded-lg border border-border bg-background p-6">
            <h2 className="text-xl font-bold mb-4">Top Performing Articles</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/2">
                <div>
                  <p className="font-medium text-sm">What is E-Waste?</p>
                  <p className="text-xs text-foreground/60">/wiki/recycling/what-is-e-waste</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">--</div>
                  <div className="text-xs text-foreground/60">CTA clicks</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/2">
                <div>
                  <p className="font-medium text-sm">NIST 800-88 Data Destruction</p>
                  <p className="text-xs text-foreground/60">/wiki/data-destruction/nist-guide</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">--</div>
                  <div className="text-xs text-foreground/60">CTA clicks</div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing Service Pages */}
          <div className="rounded-lg border border-border bg-background p-6">
            <h2 className="text-xl font-bold mb-4">Top Service Pages by Submissions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/2">
                <div>
                  <p className="font-medium text-sm">Schedule Pickup</p>
                  <p className="text-xs text-foreground/60">/services/schedule-pickup</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">--</div>
                  <div className="text-xs text-foreground/60">submissions</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/2">
                <div>
                  <p className="font-medium text-sm">Data Destruction</p>
                  <p className="text-xs text-foreground/60">/services/data-destruction</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">--</div>
                  <div className="text-xs text-foreground/60">submissions</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background p-6">
          <h2 className="text-xl font-bold mb-4">Conversion Funnel</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-right w-32">
                <div className="text-xl font-bold">--</div>
                <div className="text-xs text-foreground/60">Wiki visits</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-primary/20 to-primary/5 rounded"></div>
              <div className="text-sm text-foreground/60">100%</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right w-32">
                <div className="text-xl font-bold">--</div>
                <div className="text-xs text-foreground/60">CTA clicks</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-primary/40 to-primary/20 rounded"></div>
              <div className="text-sm text-foreground/60">--%</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right w-32">
                <div className="text-xl font-bold">--</div>
                <div className="text-xs text-foreground/60">Form submissions</div>
              </div>
              <div className="flex-1 h-2 bg-gradient-to-r from-primary/60 to-primary/40 rounded"></div>
              <div className="text-sm text-foreground/60">--%</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 rounded-lg border border-yellow-500/20 bg-yellow-50/5">
          <p className="text-sm text-foreground/70">
            This dashboard displays data from GA4. Connect your GA4 account in analytics configuration to populate real metrics. Metrics auto-refresh every 60 seconds.
          </p>
        </div>
      </div>
    </main>
  )
}
