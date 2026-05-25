# Service Pages - Deployment & Launch Guide

## System Overview

You now have a complete commercial service system for ewastekochi.com with:
- 6 high-conversion service pages
- 5 reusable components
- Wiki-to-service CTA framework
- Lead capture infrastructure
- Professional B2B design

## Quick Launch Checklist

### Phase 1: Pre-Launch Configuration (Day 1)

**Update Contact Information**
```bash
# Find and replace placeholders in all service pages:
# +91-XXXX-XXXX → Your actual phone number
# Phone numbers appear in contact-form components
```

**Service Pages to Update:**
- `/app/services/schedule-pickup/page.tsx`
- `/app/services/recycling-kochi/page.tsx`
- `/app/services/data-destruction/page.tsx`
- `/app/services/enterprise-itad/page.tsx`
- `/app/services/battery-recycling/page.tsx`
- `/app/services/document-shredding/page.tsx`

**Update Key Information:**
- [ ] Phone numbers (all pages)
- [ ] WhatsApp numbers (contact-form.tsx)
- [ ] Pricing details (if not free)
- [ ] Service area coverage (Kochi specifics)
- [ ] Company statistics (real numbers)

### Phase 2: Backend Integration (Day 2)

**Form Submission Handler**
```typescript
// components/services/contact-form.tsx - Line ~30
// Replace form submission with actual handler:

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Send to your CRM/email service
  const formData = new FormData(e.currentTarget as HTMLFormElement)
  
  // Example: Send to Vercel KV or external API
  const response = await fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(Object.fromEntries(formData)),
  })
  
  setSubmitted(true)
}
```

**Create Form Handler API Route:**
```bash
# Create /app/api/leads/route.ts with your submission logic
# Include: CRM integration, email notification, lead scoring
```

**Phone/WhatsApp Integration:**
- [ ] Phone links (tel: protocol - already working)
- [ ] WhatsApp links (wa.me/ protocol - already working)
- [ ] SMS integration (optional, via Twilio/AWS)

### Phase 3: Analytics Setup (Day 3)

**Google Analytics Events**
Add GA4 tracking to contact forms:
```typescript
// In contact-form.tsx, on form submit:
gtag.event('form_submission', {
  service_type: 'pickup', // or appropriate type
  source: 'contact_form',
  page_location: window.location.href,
})
```

**Track Key Metrics:**
- [ ] Form submissions per page
- [ ] CTA clicks (primary buttons)
- [ ] Phone/WhatsApp clicks
- [ ] Page scroll depth
- [ ] Visitor source attribution

### Phase 4: Wiki Integration (Day 4)

**Add Service CTAs to Elite Wiki Articles**

Example integration:
```tsx
// In article component, after main content:
import { WikiServiceCTA } from '@/components/services/wiki-service-cta'

<WikiServiceCTA
  title="Ready to Recycle?"
  description="Schedule a free e-waste pickup from your home or office in Kochi."
  serviceUrl="/services/schedule-pickup"
  serviceLabel="Schedule Free Pickup"
/>
```

**Recommended CTA Placements:**
1. **What is E-Waste?** (2 CTAs)
   - Schedule Pickup (primary)
   - Enterprise ITAD (secondary)

2. **NIST 800-88 Data Destruction** (1 CTA)
   - Data Destruction Services

3. **Lithium-Ion Battery Recycling** (1 CTA)
   - Battery Recycling Pickup

4. **E-Waste Management Rules** (1 CTA)
   - Recycling Kochi Hub

5. **Complete ITAD Guide** (1 CTA)
   - Enterprise ITAD Solutions

6. **Hard Drive Shredding Methods** (1 CTA)
   - Data Destruction Services

7. **Environmental Impact** (1 CTA)
   - Schedule Pickup

### Phase 5: Deployment (Day 5)

**Build & Test Locally**
```bash
pnpm build
pnpm dev

# Test all routes:
# http://localhost:3000/services/schedule-pickup
# http://localhost:3000/services/recycling-kochi
# http://localhost:3000/services/data-destruction
# http://localhost:3000/services/enterprise-itad
# http://localhost:3000/services/battery-recycling
# http://localhost:3000/services/document-shredding
```

**Verify All Forms:**
- [ ] Input validation works
- [ ] Form submission feedback displays
- [ ] Phone/WhatsApp links open correctly
- [ ] Mobile responsive (test on actual device)
- [ ] All CTAs point to correct URLs

**Deploy to Vercel**
```bash
git add .
git commit -m "Launch ewastekochi.com service pages"
git push origin main

# Vercel auto-deploys on main branch
# Verify at your production URL
```

## Testing Checklist

### Desktop Testing
- [ ] All pages load without errors
- [ ] Forms submit successfully
- [ ] Contact form responsive
- [ ] Process section displays correctly
- [ ] Pricing tables aligned properly
- [ ] All links working

### Mobile Testing
- [ ] Hero section readable
- [ ] CTAs easily clickable (44px+ minimum)
- [ ] Form inputs full width
- [ ] Process steps stacked properly
- [ ] No horizontal scrolling

### Form Testing
- [ ] Empty fields show validation
- [ ] Valid email required
- [ ] Phone number optional
- [ ] Submission feedback displays
- [ ] Success message shows for 5 seconds

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Post-Launch Monitoring

### Week 1: Stabilization
- [ ] Monitor error logs
- [ ] Check form submission success rate
- [ ] Verify GA4 events firing
- [ ] Test phone/WhatsApp routing
- [ ] Monitor page load times

### Week 2-4: Optimization
- [ ] Analyze form field drop-off rates
- [ ] Identify underperforming pages
- [ ] Test CTA button text variations
- [ ] Monitor source attribution
- [ ] Optimize mobile experience

### Ongoing: KPI Tracking
- **Conversion Rate:** Target 15-20% form completion
- **Lead Quality:** 70%+ qualified leads
- **Page Load:** <3 seconds
- **Mobile Traffic:** 40%+ of total
- **Cost Per Lead:** Set baseline for optimization

## Troubleshooting

### Forms Not Submitting
1. Check form handler API route created
2. Verify form field names match handler
3. Check browser console for errors
4. Verify CORS configuration if external API

### Mobile Issues
1. Test in actual mobile devices (not just DevTools)
2. Check button sizes (44px minimum)
3. Verify form single column on mobile
4. Test scroll experience

### Phone/WhatsApp Not Working
1. Check URL format: `tel:+91XXXXXXXXXX` and `https://wa.me/91XXXXXXXXXX`
2. Remove all spaces and special characters
3. Verify country code is included
4. Test on mobile device

### GA4 Events Not Firing
1. Verify GA4 ID is correct
2. Check gtag script loaded in head
3. Verify event names match configuration
4. Check browser console for errors

## Service Page Directory

```
/app/services/
├── schedule-pickup/          (Free pickup primary converter)
│   └── page.tsx
├── recycling-kochi/          (B2B authority hub)
│   └── page.tsx
├── data-destruction/         (Enterprise security)
│   └── page.tsx
├── enterprise-itad/          (B2B bulk solutions)
│   └── page.tsx
├── battery-recycling/        (Vertical service)
│   └── page.tsx
└── document-shredding/       (Complementary service)
    └── page.tsx

/components/services/
├── service-hero.tsx          (Configurable hero section)
├── process-section.tsx       (4-step process flows)
├── pricing-table.tsx         (3-tier pricing display)
├── contact-form.tsx          (Lead capture form)
└── wiki-service-cta.tsx      (Wiki article embeds)
```

## Analytics Events to Track

```typescript
// Form submission
gtag.event('form_submission', {
  service_type: 'pickup|itad|data-destruction|etc',
  source: 'contact_form'
})

// CTA click
gtag.event('cta_click', {
  button_text: 'Schedule Now',
  service_page: '/services/schedule-pickup'
})

// Phone click
gtag.event('phone_click', {
  phone_number: '+91XXXXXXXXXX',
  service_page: '/services/schedule-pickup'
})

// WhatsApp click
gtag.event('whatsapp_click', {
  phone_number: '+91XXXXXXXXXX',
  service_page: '/services/schedule-pickup'
})

// Page view (automatic)
// Form completion time (optional)
// Form field drop-off (optional)
```

## Performance Optimization

### Image Optimization
- Compress all hero images (<100KB each)
- Use WebP format where possible
- Add responsive images (srcset)

### Code Splitting
- Service components lazy-load if needed
- Contact form is lightweight (~3KB)
- No heavy dependencies

### Caching
- Set static pages to ISR (60s revalidation)
- Cache service component data
- Reduce database queries

## Next Steps After Launch

1. **Week 1:** Monitor form submissions, fix bugs, optimize mobile
2. **Week 2-3:** A/B test CTA text and button colors
3. **Week 4:** Integrate with wiki CTA embeds
4. **Month 2:** Expand to service-specific landing pages
5. **Month 3:** Add testimonials and case studies
6. **Month 4:** Implement lead scoring and routing

## Support & Maintenance

### Common Tasks
- Update phone numbers: Search and replace across all pages
- Change CTA text: Update button text in components
- Modify pricing: Update pricing-table.tsx
- Add new service page: Copy schedule-pickup structure

### Performance Monitoring
- Lighthouse: Run monthly
- Page Speed Insights: Weekly
- GA4 Dashboard: Daily
- Form submissions: Real-time alerts

## Final Notes

- All 6 service pages are production-ready
- Component library is fully functional
- Wiki integration framework in place
- Lead capture infrastructure ready
- Just needs configuration and backend setup

Ready for immediate launch!

