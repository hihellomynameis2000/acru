import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProductLanding } from "@/features/marketing/components/product-landing";
import { productPages } from "@/features/marketing/data/product-pages";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Card processing · Design preview | Acru",
  robots: { index: false, follow: false }
};

const hybridAssets = [
  ["hero", 1512, 1365, "Checkout with card, bank, Apple Pay and Google Pay options"],
  ["methods", 1638, 954, "Card transactions and supported payment method logos"],
  ["authorization", 1458, 1356, "Connected identity, device, authentication and authorization checks"],
  ["intelligence", 1542, 1278, "Payment status and Acru Intelligence transaction summary"]
] as const;

function HybridArt({ index }: { index: number }) {
  const [name, width, height, alt] = hybridAssets[index];
  return (
    <div className={`${index === 0 ? "pl-hero-frame" : "pl-feature-frame"} po-art-frame ${styles.hybridFrame}`}>
      <div className={`${styles.hybridCards} ${index === 1 ? styles.methodCards : ""}`}>
        {index === 2 && (
          <svg className={styles.flowLines} viewBox="0 0 1458 1356" aria-hidden="true" fill="none">
            <g stroke="#71bce4" strokeWidth="2.5" opacity=".85">
              <path d="M474 220 V260 Q474 300 514 300 H689 Q729 300 729 340 V380 M983 220 V260 Q983 300 943 300 H769 Q729 300 729 340" />
              <path d="M729 590 V632 Q729 674 687 674 H516 Q474 674 474 716 V754 M729 632 Q729 674 771 674 H941 Q983 674 983 716 V754" />
              <path d="M474 950 V1000 Q474 1038 512 1038 H691 Q729 1038 729 1076 V1120 M983 950 V1000 Q983 1038 945 1038 H767 Q729 1038 729 1076" />
            </g>
          </svg>
        )}
        <Image
          src={`/marketing/card-processing-directions/hybrid-${name}.webp`}
          alt={alt}
          width={width}
          height={height}
          priority={index === 0}
          sizes="(max-width: 760px) 80vw, 36vw"
        />
      </div>
    </div>
  );
}

export default async function CardProcessingPreview({ params }: { params: Promise<{ direction: string }> }) {
  const { direction } = await params;
  if (process.env.NODE_ENV !== "development" || !["gradient", "dark", "hybrid"].includes(direction)) notFound();
  const root = `/marketing/card-processing-directions/${direction}`;
  return (
    <div className={`${styles.preview} ${direction === "dark" ? styles.dark : ""}`}>
      <ProductLanding
        page={productPages["/features/card-processing"]}
        artworkOverride={[
          `${root}-hero.webp`,
          `${root}-methods.webp`,
          `${root}-authorization.webp`,
          `${root}-intelligence.webp`
        ]}
        artworkElements={
          direction === "hybrid"
            ? [
                <HybridArt key="hero" index={0} />,
                <HybridArt key="methods" index={1} />,
                <HybridArt key="flow" index={2} />,
                <HybridArt key="intelligence" index={3} />
              ]
            : undefined
        }
      />
      <nav className={styles.switcher} aria-label="Compare card processing designs">
        <span>Local preview</span>
        <Link href="/features/card-processing">Selected</Link>
        <Link href="/preview/card-processing/gradient" aria-current={direction === "gradient" ? "page" : undefined}>
          Gradient
        </Link>
        <Link href="/preview/card-processing/dark" aria-current={direction === "dark" ? "page" : undefined}>
          Dark
        </Link>
        <Link href="/preview/card-processing/hybrid" aria-current={direction === "hybrid" ? "page" : undefined}>
          Hybrid
        </Link>
      </nav>
    </div>
  );
}
