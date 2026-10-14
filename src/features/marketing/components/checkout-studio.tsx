"use client";

import { Check, CreditCard, Landmark, LockKeyhole, Package, Pause, Play, Pointer } from "lucide-react";
import Image from "next/image";
import { useEffect, useReducer, useRef, useState, type CSSProperties } from "react";
import { siAfterpay, siCoinbase, siKlarna } from "simple-icons";

import {
  initialStudioState,
  studioColors,
  studioRails,
  studioReducer,
  studioShapes,
  studioSizes,
  type StudioRail
} from "@/features/marketing/data/checkout-studio";

function RailIcon({ rail, iconOnly = false }: { rail: StudioRail; iconOnly?: boolean }) {
  const label = studioRails.find((option) => option.id === rail)!.label;
  if (rail === "apple-pay")
    return (
      <Image className="studio-apple-pay" src="/payment-rails/apple-pay.svg" width={42} height={18} alt="Apple Pay" />
    );
  const brand =
    rail === "coinbase" ? siCoinbase : rail === "klarna" ? siKlarna : rail === "afterpay" ? siAfterpay : null;
  return (
    <>
      {brand ? (
        <svg className={`studio-brand-icon studio-brand-${rail}`} viewBox="0 0 24 24">
          <path d={brand.path} />
        </svg>
      ) : rail === "ach" ? (
        <Landmark />
      ) : (
        <Image src={`/marketing/studio/${rail}.svg`} width={17} height={17} alt="" />
      )}
      {!iconOnly && label}
    </>
  );
}

export function CheckoutStudio() {
  const root = useRef<HTMLDivElement>(null);
  const controls = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);
  const [visible, setVisible] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [scale, setScale] = useState(1);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const { config } = state;
  const playing = state.automatic && visible && documentVisible && motionAllowed;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const compact = matchMedia("(max-width: 700px)");
    const preferences = () => setMotionAllowed(!motion.matches);
    const visibility = () => setDocumentVisible(!document.hidden);
    const resize = () => setScale(element.clientWidth / (compact.matches ? 560 : 1120));
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2), {
            threshold: [0, 0.2]
          })
        : null;
    const sizing = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    observer?.observe(element);
    sizing?.observe(element);
    const initialFrame = requestAnimationFrame(() => {
      if (!observer) setVisible(true);
      preferences();
      visibility();
      resize();
    });
    motion.addEventListener("change", preferences);
    compact.addEventListener("change", resize);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(initialFrame);
      observer?.disconnect();
      sizing?.disconnect();
      motion.removeEventListener("change", preferences);
      compact.removeEventListener("change", resize);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!playing) return;
    // Let the animated cursor arrive before the checkout adopts the next setting.
    const cue = setTimeout(() => dispatch({ type: "cue" }), 700);
    const advance = setTimeout(() => dispatch({ type: "advance" }), 1350);
    return () => {
      clearTimeout(cue);
      clearTimeout(advance);
    };
  }, [playing, state.scene]);

  useEffect(() => {
    if (!state.activeTarget) return;
    const frame = requestAnimationFrame(() => {
      const panel = controls.current;
      const target = panel?.querySelector<HTMLElement>(`[data-studio-option="${state.activeTarget}"]`);
      if (!panel || !target || !scale) return;
      const panelBounds = panel.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      // Align the fingertip, not the icon box, with the actual rendered control.
      setPointer({
        x: (targetBounds.left + targetBounds.width / 2 - panelBounds.left) / scale - panel.clientLeft - 7,
        y: (targetBounds.top + targetBounds.height / 2 - panelBounds.top) / scale - panel.clientTop - 2
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [scale, state.activeTarget]);

  const color = studioColors.find((option) => option.id === config.color)!;
  const shape = studioShapes.find((option) => option.id === config.shape)!;
  const size = studioSizes.find((option) => option.id === config.size)!;
  const variables = {
    "--studio-scale": scale,
    "--studio-cursor-x": `${pointer.x}px`,
    "--studio-cursor-y": `${pointer.y}px`,
    "--studio-accent": color.value,
    "--studio-accent-ink": color.ink,
    "--studio-radius": `${shape.radius}px`,
    "--studio-input-radius": `${Math.max(4, Math.round(shape.radius * 0.45))}px`,
    "--studio-modal-width": `${size.width}px`,
    "--studio-mobile-modal-width": `${size.width === 440 ? 364 : 306}px`
  } as CSSProperties;

  return (
    <div className="checkout-studio" id="checkout-studio" ref={root} style={variables} data-playing={playing}>
      <p className="landing-sr-only">
        Checkout studio animation showing custom colors, corners, and layouts. Express options include Apple Pay and
        ACH; crypto options include MetaMask, Coinbase Pay, and Phantom; pay later options include Klarna and Afterpay.
        This is a product preview, not a live checkout.
      </p>
      <div className="studio-stage" aria-hidden="true">
        <div className="studio-workspace">
          <div className="studio-controls" ref={controls}>
            <div className="studio-control-group studio-color-control" data-active={state.activeField === "color"}>
              <div className="studio-control-label">
                Brand color <span>{color.value}</span>
              </div>
              <div className="studio-swatches">
                {studioColors.map((option) => (
                  <span
                    key={option.id}
                    className="studio-swatch"
                    data-studio-option={`color-${option.id}`}
                    data-selected={config.color === option.id}
                    style={{ "--swatch": option.value } as CSSProperties}
                  >
                    {config.color === option.id && <Check />}
                  </span>
                ))}
              </div>
            </div>
            <div className="studio-control-group studio-shape-control" data-active={state.activeField === "shape"}>
              <div className="studio-control-label">Corners</div>
              <div className="studio-segments">
                {studioShapes.map((option) => (
                  <span
                    key={option.id}
                    data-studio-option={`shape-${option.id}`}
                    data-selected={config.shape === option.id}
                  >
                    <i style={{ borderRadius: option.radius / 3 }} />
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="studio-control-group studio-size-control" data-active={state.activeField === "size"}>
              <div className="studio-control-label">Layout</div>
              <div className="studio-segments">
                {studioSizes.map((option) => (
                  <span
                    key={option.id}
                    data-studio-option={`size-${option.id}`}
                    data-selected={config.size === option.id}
                  >
                    {option.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="studio-control-group studio-rail-control" data-active={state.activeField === "rails"}>
              {(["Express", "Crypto", "Pay later"] as const).map((group) => (
                <div className="studio-rail-group" key={group}>
                  <span className="studio-control-label">{group}</span>
                  <div className="studio-rail-options">
                    {studioRails
                      .filter((rail) => rail.group === group)
                      .map((rail) => (
                        <span
                          key={rail.id}
                          data-studio-option={`rail-${rail.id}`}
                          data-enabled={config.rails.includes(rail.id)}
                          title={rail.label}
                        >
                          <RailIcon rail={rail.id} iconOnly />
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <span className="studio-cursor" data-field={state.activeField ?? "none"}>
              <span key={state.scene} className="studio-pointer-click">
                <Pointer />
              </span>
            </span>
          </div>
          <div className="studio-canvas">
            <div className="studio-modal-wrap">
              <div className="studio-selection">
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="studio-modal">
                <div className="studio-order">
                  <span className="studio-product-icon">
                    <Package />
                  </span>
                  <span>
                    <strong>Pro plan</strong>
                    <small>Billed monthly</small>
                  </span>
                  <strong>$342.99</strong>
                </div>
                <div className="studio-express">
                  {studioRails.map((rail) => (
                    <div className="studio-express-slot" key={rail.id} data-enabled={config.rails.includes(rail.id)}>
                      <span>
                        <RailIcon rail={rail.id} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="studio-or">
                  <span>or pay with card</span>
                </div>
                <div className="studio-card-fields">
                  <div className="studio-field">
                    <span>Card number</span>
                    <div>
                      <span>4242 4242 4242 4242</span>
                      <CreditCard />
                    </div>
                  </div>
                  <div className="studio-field-row">
                    <div className="studio-field">
                      <span>Expiration</span>
                      <div>06 / 28</div>
                    </div>
                    <div className="studio-field">
                      <span>Security code</span>
                      <div>
                        •••
                        <LockKeyhole />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="studio-pay">
                  <LockKeyhole />
                  Pay $342.99
                </div>
                <div className="studio-secure">
                  <LockKeyhole />
                  Secured by Acru
                </div>
              </div>
              <div className="studio-dimensions">
                <span />
                {size.label} layout
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
      {motionAllowed && (
        <button
          type="button"
          className="studio-playback"
          onClick={() => dispatch({ type: "toggle-playback" })}
          aria-label={`${state.automatic ? "Pause" : "Play"} checkout studio animation`}
        >
          {state.automatic ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
