'use client';

import { Handshake } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { vendorSecurityReviews } from '@/lib/enterprise-trust';
import { TrustPanel } from './enterprise-trust-panel';

export function VendorSecurityManagement() {
  return (
    <TrustPanel title="Vendor Security Management" description="Vendor Risk Reviews, Security Assessments and Vendor Compliance Tracking are prepared for enterprise procurement reviews." badge="Vendor Risk Reviews">
      <div className="grid gap-3 lg:grid-cols-4">
        {vendorSecurityReviews.map((vendor) => (
          <article key={vendor.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold text-white"><Handshake className="size-4 text-gold-200" />{vendor.vendor}</div>
              <Badge variant={vendor.risk === 'high' ? 'warning' : 'info'}>{vendor.risk}</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-graphite-300">{vendor.compliance}</p>
            <p className="mt-3 text-xs text-gold-100">Next review: {vendor.nextReview}</p>
          </article>
        ))}
      </div>
    </TrustPanel>
  );
}
