"use client";

import {
  AdjustIcon,
  ArchiveIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DuplicateIcon,
  DeleteIcon,
  EditIcon,
  ExportIcon,
  ImageAddIcon,
  ImageIcon,
  PackageIcon,
  PlusIcon,
  ProductIcon,
  ReceiptDollarIcon,
  SearchIcon,
  XIcon
} from "@shopify/polaris-icons";
import NextImage from "next/image";
import { useMemo, useRef, useState } from "react";

import type { ListAdapter } from "@/components/data/adapter";
import { createMoney, decimalAmount, formatMoney, minorUnitsFromDecimal } from "@/components/data/money";
import { useListCollection } from "@/components/data/use-list-collection";
import { CollectionPageState } from "@/components/ui/collection-state";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDismissOnEscape } from "@/components/ui/use-dismiss-on-escape";
import { productAdapter, type BillingType, type Product, type ProductStatus } from "@/features/products/data/products";

const statuses: Array<"All" | ProductStatus> = ["All", "Active", "Draft", "Archived"];

function money(value: number) {
  return formatMoney(createMoney(value));
}

function copy(value: string) {
  return navigator.clipboard?.writeText(value);
}

async function prepareProductImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Choose a PNG, JPG, WebP, or GIF image.");
  if (file.size > 12 * 1024 * 1024) throw new Error("Each image must be smaller than 12 MB.");

  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("This image could not be read."));
    reader.readAsDataURL(file);
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("This image could not be processed."));
    element.src = source;
  });
  const limit = 1400;
  const scale = Math.min(1, limit / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.84);
}

function ProductStatusPill({ status }: { status: ProductStatus }) {
  const Icon = status === "Active" ? CheckCircleIcon : status === "Draft" ? EditIcon : ArchiveIcon;
  return (
    <span className="product-status" data-status={status.toLowerCase()}>
      <Icon />
      {status}
    </span>
  );
}

function ProductMark({ product }: { product: Product }) {
  return (
    <span className="product-mark" data-color={product.color}>
      {product.images?.[0] ? (
        <NextImage src={product.images[0]} alt="" width={36} height={36} unoptimized />
      ) : (
        <ProductIcon />
      )}
    </span>
  );
}

function ProductMediaEditor({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function addFiles(files: FileList | File[]) {
    const available = Math.max(0, 8 - images.length);
    if (!available) {
      setError("A product can have up to 8 images.");
      return;
    }
    try {
      setError("");
      const prepared = await Promise.all(Array.from(files).slice(0, available).map(prepareProductImage));
      onChange([...images, ...prepared]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The image could not be added.");
    }
  }

  return (
    <div className="product-media-editor">
      {images.length ? (
        <div className="product-media-grid">
          {images.map((source, index) => (
            <figure className={index === 0 ? "primary" : ""} key={`${source.slice(-18)}-${index}`}>
              <NextImage src={source} alt={`Product media ${index + 1}`} width={640} height={640} unoptimized />
              {index === 0 ? <span>Primary</span> : null}
              <div>
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => onChange([source, ...images.filter((_, imageIndex) => imageIndex !== index)])}
                  >
                    Set primary
                  </button>
                ) : null}
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                >
                  <DeleteIcon />
                </button>
              </div>
            </figure>
          ))}
          {images.length < 8 ? (
            <button className="product-media-add-tile" type="button" onClick={() => inputRef.current?.click()}>
              <ImageAddIcon />
              Add
            </button>
          ) : null}
        </div>
      ) : (
        <button
          className="product-media-dropzone"
          data-dragging={dragging}
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void addFiles(event.dataTransfer.files);
          }}
        >
          <span>
            <ImageAddIcon />
          </span>
          <strong>Add product media</strong>
          <small>Drop images here or click to upload</small>
          <em>PNG, JPG, WebP or GIF · up to 12 MB</em>
        </button>
      )}
      <input
        ref={inputRef}
        className="product-media-input"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        onChange={(event) => {
          if (event.target.files) void addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {error ? <p className="product-media-error">{error}</p> : null}
      {images.length ? (
        <small className="product-media-help">The first image is used across checkout and your catalog.</small>
      ) : null}
    </div>
  );
}

function NativeProductMenu({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <label className="product-form-label">
      {label}
      <div className="product-native-select">
        <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
          <span>{value}</span>
          <ChevronDownIcon />
        </button>
        {open ? (
          <>
            <button
              className="product-native-scrim"
              type="button"
              aria-label={`Close ${label}`}
              onClick={() => setOpen(false)}
            />
            <div className="product-native-menu">
              {options.map((option) => (
                <button
                  key={option}
                  className={value === option ? "active" : ""}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  {option}
                  {value === option ? <CheckCircleIcon /> : null}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </label>
  );
}

function ProductDrawer({
  product,
  onClose,
  onSave
}: {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}) {
  const [tab, setTab] = useState("Overview");
  const [editing, setEditing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState(product);
  const [notice, setNotice] = useState("");
  const closeDrawer = () => {
    if (closing) return;
    setClosing(true);
    window.setTimeout(onClose, 260);
  };
  useDismissOnEscape(true, closeDrawer);
  function save() {
    onSave({ ...draft, updated: "Aug 11, 2026" });
    setEditing(false);
    setNotice("Product changes saved");
  }
  return (
    <aside className="product-drawer" data-closing={closing} aria-label={`${product.name} details`}>
      <header className="product-drawer-header">
        <button className="product-drawer-close" type="button" onClick={closeDrawer}>
          <XIcon />
        </button>
        <ProductMark product={draft} />
        <div className="product-drawer-title">
          <h2>{draft.name}</h2>
          <span>
            {draft.sku} · {draft.id}
          </span>
        </div>
        <ProductStatusPill status={draft.status} />
      </header>
      <nav className="product-drawer-tabs">
        {["Overview", "Media", "Pricing", "Inventory", "Activity", "Metadata"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} type="button" onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </nav>
      <div className="product-drawer-body">
        {tab === "Overview" ? (
          <>
            <section className="product-summary-grid">
              <div>
                <span>Price</span>
                <strong>{money(draft.priceMinor)}</strong>
                <small>{draft.billing}</small>
              </div>
              <div>
                <span>Units sold</span>
                <strong>{draft.sold}</strong>
                <small>All time</small>
              </div>
              <div>
                <span>Revenue</span>
                <strong>{money(draft.revenueMinor)}</strong>
                <small>All time</small>
              </div>
            </section>
            <section className="product-detail-card product-media-card">
              <header>
                <div>
                  <h3>Media</h3>
                  <small>Add images customers will see at checkout.</small>
                </div>
                <ImageIcon />
              </header>
              <ProductMediaEditor
                images={draft.images ?? []}
                onChange={(images) => setDraft((value) => ({ ...value, images }))}
              />
              {JSON.stringify(draft.images ?? []) !== JSON.stringify(product.images ?? []) ? (
                <button className="product-media-save" type="button" onClick={save}>
                  <CheckCircleIcon /> Save media
                </button>
              ) : null}
            </section>
            <section className="product-detail-card">
              <header>
                <h3>Product details</h3>
                <button type="button" onClick={() => (editing ? save() : setEditing(true))}>
                  {editing ? <CheckCircleIcon /> : <EditIcon />}
                  {editing ? "Save" : "Edit"}
                </button>
              </header>
              {editing ? (
                <div className="product-edit-grid">
                  <label>
                    Name
                    <input
                      value={draft.name}
                      onChange={(event) => setDraft((value) => ({ ...value, name: event.target.value }))}
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      value={draft.description}
                      onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))}
                    />
                  </label>
                  <label>
                    SKU
                    <input
                      value={draft.sku}
                      onChange={(event) => setDraft((value) => ({ ...value, sku: event.target.value }))}
                    />
                  </label>
                  <label>
                    Category
                    <input
                      value={draft.category}
                      onChange={(event) => setDraft((value) => ({ ...value, category: event.target.value }))}
                    />
                  </label>
                </div>
              ) : (
                <>
                  <p className="product-description">{draft.description}</p>
                  <dl>
                    <div>
                      <dt>Status</dt>
                      <dd>
                        <ProductStatusPill status={draft.status} />
                      </dd>
                    </div>
                    <div>
                      <dt>Category</dt>
                      <dd>{draft.category}</dd>
                    </div>
                    <div>
                      <dt>SKU</dt>
                      <dd>
                        <code>{draft.sku}</code>
                        <button type="button" onClick={() => void copy(draft.sku)}>
                          <DuplicateIcon />
                        </button>
                      </dd>
                    </div>
                    <div>
                      <dt>Tax code</dt>
                      <dd>{draft.taxCode}</dd>
                    </div>
                    <div>
                      <dt>Last updated</dt>
                      <dd>{draft.updated}</dd>
                    </div>
                  </dl>
                </>
              )}
            </section>
            <section className="product-detail-two-column">
              <article className="product-detail-card">
                <h3>Default price</h3>
                <strong className="product-price-value">{money(draft.priceMinor)}</strong>
                <small>
                  {draft.billing === "One time" ? "One-time charge" : `Billed ${draft.billing.toLowerCase()}`}
                </small>
                <dl>
                  <div>
                    <dt>Currency</dt>
                    <dd>USD</dd>
                  </div>
                  <div>
                    <dt>Tax behavior</dt>
                    <dd>Exclusive</dd>
                  </div>
                </dl>
                <button className="product-inline-button" type="button" onClick={() => setTab("Pricing")}>
                  Manage prices <ArrowRightIcon />
                </button>
              </article>
              <article className="product-detail-card">
                <h3>Inventory</h3>
                <strong className="product-price-value">
                  {draft.inventory === null ? "Unlimited" : `${draft.inventory} available`}
                </strong>
                <small>
                  {draft.inventory !== null && draft.inventory <= 5 ? "Low inventory" : "Inventory healthy"}
                </small>
                <dl>
                  <div>
                    <dt>Sold</dt>
                    <dd>{draft.sold}</dd>
                  </div>
                  <div>
                    <dt>Policy</dt>
                    <dd>{draft.inventory === null ? "Not tracked" : "Stop when sold out"}</dd>
                  </div>
                </dl>
                <button className="product-inline-button" type="button" onClick={() => setTab("Inventory")}>
                  Manage inventory <ArrowRightIcon />
                </button>
              </article>
            </section>
            <div className="product-danger-actions">
              <button
                type="button"
                onClick={() => {
                  const status: ProductStatus = draft.status === "Archived" ? "Active" : "Archived";
                  const next = { ...draft, status };
                  setDraft(next);
                  onSave(next);
                  setNotice(status === "Archived" ? "Product archived" : "Product restored");
                }}
              >
                {draft.status === "Archived" ? <CheckCircleIcon /> : <ArchiveIcon />}
                {draft.status === "Archived" ? "Restore product" : "Archive product"}
              </button>
            </div>
          </>
        ) : null}
        {tab === "Media" ? (
          <section className="product-detail-card product-media-card product-media-card-large">
            <header>
              <div>
                <h3>Product media</h3>
                <small>Use high-quality square images for the best storefront presentation.</small>
              </div>
              <ImageIcon />
            </header>
            <ProductMediaEditor
              images={draft.images ?? []}
              onChange={(images) => setDraft((value) => ({ ...value, images }))}
            />
            <footer className="product-media-footer">
              <span>{draft.images?.length ?? 0} of 8 images</span>
              <button type="button" onClick={save}>
                <CheckCircleIcon /> Save media
              </button>
            </footer>
          </section>
        ) : null}
        {tab === "Pricing" ? (
          <>
            <section className="product-detail-card">
              <header>
                <h3>Prices</h3>
                <button type="button" onClick={() => setNotice("Price editor opened")}>
                  <PlusIcon />
                  Add price
                </button>
              </header>
              <div className="product-price-row">
                <span>
                  <ReceiptDollarIcon />
                </span>
                <div>
                  <strong>{money(draft.priceMinor)}</strong>
                  <small>USD · {draft.billing}</small>
                </div>
                <ProductStatusPill status="Active" />
              </div>
            </section>
            <section className="product-detail-card">
              <h3>Pricing controls</h3>
              <dl>
                <div>
                  <dt>Lookup key</dt>
                  <dd>price_{draft.id.slice(-7)}</dd>
                </div>
                <div>
                  <dt>Tax behavior</dt>
                  <dd>Exclusive</dd>
                </div>
                <div>
                  <dt>Currency options</dt>
                  <dd>USD</dd>
                </div>
              </dl>
            </section>
          </>
        ) : null}
        {tab === "Inventory" ? (
          <section className="product-detail-card">
            <header>
              <h3>Inventory management</h3>
              <PackageIcon />
            </header>
            <div className="product-inventory-control">
              <span>
                <small>Available inventory</small>
                <strong>{draft.inventory === null ? "Unlimited" : draft.inventory}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  const inventory = (draft.inventory ?? 0) + 10;
                  const next = { ...draft, inventory };
                  setDraft(next);
                  onSave(next);
                  setNotice("Inventory increased by 10");
                }}
              >
                <PlusIcon />
                Add 10 units
              </button>
            </div>
            <div className="product-stock-bar">
              <i style={{ width: draft.inventory === null ? "100%" : `${Math.min(100, draft.inventory * 5)}%` }} />
            </div>
            <dl>
              <div>
                <dt>Inventory tracking</dt>
                <dd>{draft.inventory === null ? "Off" : "On"}</dd>
              </div>
              <div>
                <dt>Out-of-stock policy</dt>
                <dd>Prevent purchases</dd>
              </div>
              <div>
                <dt>Low-stock threshold</dt>
                <dd>5 units</dd>
              </div>
            </dl>
          </section>
        ) : null}
        {tab === "Activity" ? (
          <section className="product-detail-card">
            <h3>Product activity</h3>
            <ol className="product-timeline">
              <li>
                <span />
                <div>
                  <strong>Product updated</strong>
                  <small>{draft.updated} · Price and metadata reviewed</small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Latest purchase</strong>
                  <small>Aug 10, 2026 · {money(draft.priceMinor)}</small>
                </div>
              </li>
              <li>
                <span />
                <div>
                  <strong>Product created</strong>
                  <small>January 14, 2026</small>
                </div>
              </li>
            </ol>
          </section>
        ) : null}
        {tab === "Metadata" ? (
          <section className="product-detail-card">
            <h3>Metadata</h3>
            <dl>
              <div>
                <dt>product_id</dt>
                <dd>{draft.id}</dd>
              </div>
              <div>
                <dt>sku</dt>
                <dd>{draft.sku}</dd>
              </div>
              <div>
                <dt>catalog_source</dt>
                <dd>acru_dashboard</dd>
              </div>
            </dl>
            <button className="product-inline-button" type="button" onClick={() => setNotice("Metadata editor opened")}>
              <PlusIcon />
              Add metadata
            </button>
          </section>
        ) : null}
      </div>
      {notice ? (
        <button className="product-toast" type="button" onClick={() => setNotice("")}>
          <CheckCircleIcon />
          {notice}
        </button>
      ) : null}
    </aside>
  );
}

function ProductDialog({ onClose, onCreate }: { onClose: () => void; onCreate: (product: Product) => void }) {
  useDismissOnEscape(true, onClose);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0.00");
  const [billing, setBilling] = useState<BillingType>("One time");
  const [status, setStatus] = useState<ProductStatus>("Active");
  const [category, setCategory] = useState("Software");
  const [trackInventory, setTrackInventory] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  function create() {
    let parsedPrice: number;
    try {
      parsedPrice = minorUnitsFromDecimal(price.replaceAll(",", ""));
      if (!name.trim()) throw new RangeError("Enter a product name.");
      if (parsedPrice <= 0) throw new RangeError("Enter a price greater than zero.");
      setError("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Check the product details.");
      return;
    }
    const product: Product = {
      id: `prod_${Date.now().toString(36)}`,
      name: name.trim() || "Untitled product",
      description: description.trim() || "No description provided.",
      priceMinor: parsedPrice,
      status,
      billing,
      inventory: trackInventory ? 0 : null,
      sold: 0,
      revenueMinor: 0,
      updated: "Aug 11, 2026",
      sku: `SKU-${Date.now().toString(36).slice(-6).toUpperCase()}`,
      category,
      taxCode: category === "Software" ? "SaaS — General" : "Professional services",
      color: "blue",
      images
    };
    onCreate(product);
  }
  return (
    <div
      className="product-create-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="product-create-dialog" role="dialog" aria-modal="true" aria-label="Add product">
        <header>
          <span>
            <ProductIcon />
          </span>
          <div>
            <h2>Add product</h2>
            <p>Create a product and its default price.</p>
          </div>
          <button type="button" onClick={onClose}>
            <XIcon />
          </button>
        </header>
        <div className="product-create-form">
          <label className="product-form-label">
            Name
            <input
              autoFocus
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Product name"
            />
          </label>
          <section className="product-create-media">
            <div>
              <strong>Media</strong>
              <small>Add up to 8 product images.</small>
            </div>
            <ProductMediaEditor images={images} onChange={setImages} />
          </section>
          <label className="product-form-label">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what customers receive"
            />
          </label>
          <div className="product-form-columns">
            <label className="product-form-label">
              Price
              <div className="product-amount-field">
                <span>$</span>
                <input
                  inputMode="decimal"
                  pattern="[0-9]+(?:\.[0-9]{1,2})?"
                  required
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </label>
            <NativeProductMenu
              label="Billing"
              value={billing}
              options={["One time", "Monthly", "Annual"]}
              onChange={(value) => setBilling(value as BillingType)}
            />
          </div>
          <div className="product-form-columns">
            <NativeProductMenu
              label="Status"
              value={status}
              options={["Active", "Draft"]}
              onChange={(value) => setStatus(value as ProductStatus)}
            />
            <NativeProductMenu
              label="Category"
              value={category}
              options={["Software", "Services", "Physical goods", "Other"]}
              onChange={setCategory}
            />
          </div>
          <label className="product-form-check">
            <input
              type="checkbox"
              checked={trackInventory}
              onChange={(event) => setTrackInventory(event.target.checked)}
            />
            <span>
              <strong>Track inventory</strong>
              <small>Prevent purchases when this product sells out.</small>
            </span>
          </label>
          {error ? <p role="alert">{error}</p> : null}
        </div>
        <footer>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" onClick={create}>
            Save product
          </button>
        </footer>
      </section>
    </div>
  );
}

export function ProductsPage({ adapter = productAdapter }: { adapter?: ListAdapter<Product> }) {
  const { error, items: products, retry, setItems: setProducts, status: resourceStatus } = useListCollection(adapter);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [category, setCategory] = useState("All categories");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        (!normalized ||
          [product.name, product.description, product.id, product.sku, product.category]
            .join(" ")
            .toLowerCase()
            .includes(normalized)) &&
        (status === "All" || product.status === status) &&
        (category === "All categories" || product.category === category)
    );
  }, [category, products, query, status]);
  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const active = products.filter((product) => product.status === "Active");
  const recurringRevenue = active
    .filter((product) => product.billing === "Monthly")
    .reduce((sum, product) => sum + product.priceMinor * product.sold, 0);
  const lowStock = active.filter((product) => product.inventory !== null && product.inventory <= 5).length;
  function saveProduct(product: Product) {
    setProducts((items) => items.map((item) => (item.id === product.id ? product : item)));
    setSelected(product);
  }
  function exportCsv() {
    const rows = [
      ["Product ID", "Name", "Price", "Status", "Billing", "Inventory", "Sold", "Revenue", "SKU", "Category"],
      ...filteredProducts.map((product) => [
        product.id,
        product.name,
        decimalAmount(product.priceMinor),
        product.status,
        product.billing,
        product.inventory ?? "Unlimited",
        product.sold,
        decimalAmount(product.revenueMinor),
        product.sku,
        product.category
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "acru-products.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (resourceStatus !== "ready") {
    return (
      <CollectionPageState
        description="Manage products, prices, inventory, and recurring billing options."
        error={error}
        onRetry={retry}
        status={resourceStatus}
        title="Products"
      />
    );
  }

  return (
    <div className="products-workspace">
      <section className="products-list-pane">
        <header className="products-page-heading">
          <div>
            <h1>Products</h1>
            <p>Manage your catalog, pricing, inventory, and product availability.</p>
          </div>
          <div className="products-page-actions">
            <button className="products-secondary-button" type="button" onClick={exportCsv}>
              <ExportIcon />
              Export
            </button>
            <button className="products-create-button" type="button" onClick={() => setCreateOpen(true)}>
              Add product <PlusIcon />
            </button>
          </div>
        </header>
        <section className="products-metrics">
          <div>
            <span>Active products</span>
            <strong>{active.length}</strong>
            <small>{products.filter((item) => item.status === "Draft").length} drafts</small>
          </div>
          <div>
            <span>Catalog revenue</span>
            <strong>{money(products.reduce((sum, product) => sum + product.revenueMinor, 0))}</strong>
            <small>All-time product sales</small>
          </div>
          <div>
            <span>Recurring revenue</span>
            <strong>{money(recurringRevenue)}</strong>
            <small>Monthly products</small>
          </div>
          <div>
            <span>Low inventory</span>
            <strong>{lowStock}</strong>
            <small>{lowStock ? "Products need attention" : "Inventory healthy"}</small>
          </div>
        </section>
        <div className="products-toolbar">
          <div className="products-status-tabs">
            {statuses.map((option) => (
              <button
                key={option}
                className={status === option ? "active" : ""}
                type="button"
                onClick={() => setStatus(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="products-tools">
            <label className="products-search">
              <SearchIcon />
              <input
                type="search"
                placeholder="Search products"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="products-filter-wrap">
              <button className="products-filter-button" type="button" onClick={() => setFilterOpen((open) => !open)}>
                <AdjustIcon />
              </button>
              {filterOpen ? (
                <>
                  <button className="products-popup-scrim" type="button" onClick={() => setFilterOpen(false)} />
                  <div className="products-filter-menu">
                    <span>Category</span>
                    {["All categories", "Software", "Services", "Physical goods", "Other"].map((option) => (
                      <button
                        key={option}
                        className={category === option ? "active" : ""}
                        type="button"
                        onClick={() => {
                          setCategory(option);
                          setFilterOpen(false);
                        }}
                      >
                        {option}
                        {category === option ? <CheckCircleIcon /> : null}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="products-table-wrap">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Billing</th>
                <th>Inventory</th>
                <th>Units sold</th>
                <th>Revenue</th>
                <th>Updated</th>
                <th>Product ID</th>
              </tr>
            </thead>
            <tbody>
              {!visible.length ? (
                <tr className="products-empty-row">
                  <td colSpan={9}>No products match these filters.</td>
                </tr>
              ) : null}
              {visible.map((product) => (
                <tr
                  key={product.id}
                  tabIndex={0}
                  data-selected={selected?.id === product.id}
                  onClick={() => setSelected(product)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") setSelected(product);
                  }}
                >
                  <td>
                    <ProductMark product={product} />
                    <span>
                      <strong>{product.name}</strong>
                      <small>
                        {product.sku} · {product.category}
                      </small>
                    </span>
                  </td>
                  <td>
                    <strong>{money(product.priceMinor)}</strong>
                    <small>USD</small>
                  </td>
                  <td>
                    <ProductStatusPill status={product.status} />
                  </td>
                  <td>
                    <span className="product-billing-pill">{product.billing}</span>
                  </td>
                  <td>
                    <strong data-low={product.inventory !== null && product.inventory <= 5}>
                      {product.inventory === null ? "Unlimited" : product.inventory}
                    </strong>
                    <small>
                      {product.inventory === null ? "Not tracked" : product.inventory <= 5 ? "Low stock" : "Available"}
                    </small>
                  </td>
                  <td>{product.sold}</td>
                  <td>
                    <strong>{money(product.revenueMinor)}</strong>
                  </td>
                  <td>{product.updated}</td>
                  <td>
                    <code>{product.id}</code>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        void copy(product.id);
                      }}
                    >
                      <DuplicateIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          className="products-pagination"
          page={currentPage}
          pageSize={pageSize}
          totalItems={filteredProducts.length}
          onPageChange={setPage}
        />
      </section>
      {selected ? <ProductDrawer product={selected} onClose={() => setSelected(null)} onSave={saveProduct} /> : null}
      {createOpen ? (
        <ProductDialog
          onClose={() => setCreateOpen(false)}
          onCreate={(product) => {
            setProducts((items) => [product, ...items]);
            setCreateOpen(false);
            setSelected(product);
          }}
        />
      ) : null}
    </div>
  );
}
