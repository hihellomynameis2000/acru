import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PaymentFeaturePreview } from "./payment-feature-preview";
import { paymentFeatureAssetFor, paymentFlowItems } from "../data/cinematic";

describe("feature preview delivery", () => {
  it.each(paymentFlowItems)("renders only the requested $id poster and defers film loading", ({ id }) => {
    const html = renderToStaticMarkup(<PaymentFeaturePreview feature={id} mode="sequence" />);
    expect(html).toContain(paymentFeatureAssetFor(id)!.poster);
    expect(html.match(/<video/g)).toHaveLength(1);
    expect(html).toContain('preload="none"');
    expect(html).not.toContain(`src="${paymentFeatureAssetFor(id)!.src}"`);
    expect(html).toContain('data-shown="true"');
    expect(html).toContain('aria-busy="false"');
  });
});
