"use client";

import { useTranslations } from "next-intl";
import { TrustQA } from "./TrustQA";
import { LiveTrustSignals } from "./LiveTrustSignals";

export function TrustSafety() {
  const t = useTranslations("home.trustSafety");

  return (
    <section className="section-spacing">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-lg leading-relaxed text-foreground-secondary">
            {t("description")}
          </p>
        </div>
        
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Live Trust Signals */}
          <LiveTrustSignals />
          
          {/* Trust Q&A */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-center">
              {t("qaTitle")}
            </h3>
            <TrustQA />
          </div>
        </div>
      </div>
    </section>
  );
}
