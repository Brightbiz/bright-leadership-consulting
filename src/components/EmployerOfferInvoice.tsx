import { Button } from "@/components/ui/button";
import {
  BRIGHT_CONTACT_EMAIL,
  EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS,
  EMPLOYER_OFFER_VAT_WORDING,
  LEGAL_CONTRACTING_IDENTITY,
  LEGAL_SUPPLIER_ADDRESS,
} from "@/data/legal";

export type EmployerOfferInvoiceDetails = {
  employer_organisation: string;
  participant_name: string;
  invoice_contact: string | null;
  po_number: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  payment_due_date: string | null;
  invoice_description: string | null;
  invoice_net_amount_gbp: number | null;
  invoice_vat_amount_gbp: number | null;
  invoice_total_gbp: number | null;
  invoice_payment_instructions: string | null;
  invoice_contact_email: string | null;
  supplier_contracting_identity: string | null;
  supplier_address: string | null;
  offer_reference?: string | null;
};

const fmtWholeGbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);

const fmtPenceGbp = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const lines = (value: string | null | undefined) =>
  (value ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

export const buildEmployerOfferInvoiceText = (invoice: EmployerOfferInvoiceDetails) => {
  const net = Number(invoice.invoice_net_amount_gbp ?? 1297);
  const vat = Number(invoice.invoice_vat_amount_gbp ?? 0);
  const total = Number(invoice.invoice_total_gbp ?? 1297);
  const description =
    invoice.invoice_description ||
    `One named individual place on the Executive Leadership Mastery Programme for ${invoice.participant_name}.`;
  return [
    "Invoice",
    `Supplier: ${invoice.supplier_contracting_identity ?? LEGAL_CONTRACTING_IDENTITY}`,
    ...(invoice.supplier_address ?? LEGAL_SUPPLIER_ADDRESS).split(/\r?\n/),
    `Contact: ${invoice.invoice_contact_email ?? BRIGHT_CONTACT_EMAIL}`,
    "",
    `Invoice number: ${invoice.invoice_number ?? "—"}`,
    `Invoice date: ${fmtDate(invoice.invoice_date)}`,
    `Payment due date: ${fmtDate(invoice.payment_due_date)}`,
    `Offer reference: ${invoice.offer_reference ?? "—"}`,
    `Purchase order number: ${invoice.po_number || "—"}`,
    "",
    `Bill to: ${invoice.employer_organisation}`,
    ...(invoice.invoice_contact ? lines(invoice.invoice_contact) : []),
    "",
    description,
    `Net amount: ${fmtWholeGbp(net)}`,
    `VAT: ${fmtPenceGbp(vat)}`,
    `Total payable: ${fmtWholeGbp(total)}`,
    EMPLOYER_OFFER_VAT_WORDING,
    "",
    invoice.invoice_payment_instructions ?? EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS,
  ].join("\n");
};

type EmployerOfferInvoiceProps = {
  invoice: EmployerOfferInvoiceDetails;
  showCopy?: boolean;
  onCopied?: () => void;
};

const EmployerOfferInvoice = ({ invoice, showCopy = false, onCopied }: EmployerOfferInvoiceProps) => {
  const net = Number(invoice.invoice_net_amount_gbp ?? 1297);
  const vat = Number(invoice.invoice_vat_amount_gbp ?? 0);
  const total = Number(invoice.invoice_total_gbp ?? 1297);
  const supplierAddress = lines(invoice.supplier_address ?? LEGAL_SUPPLIER_ADDRESS);
  const invoiceAddress = lines(invoice.invoice_contact);
  const description =
    invoice.invoice_description ||
    `One named individual place on the Executive Leadership Mastery Programme for ${invoice.participant_name}.`;

  const copyInvoice = async () => {
    await navigator.clipboard?.writeText(buildEmployerOfferInvoiceText(invoice));
    onCopied?.();
  };

  return (
    <section aria-label="Invoice" className="border border-border bg-background p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="kicker mb-2">Invoice</p>
          <h2 className="font-serif text-2xl font-medium text-foreground">
            {invoice.invoice_number ?? "Invoice pending"}
          </h2>
        </div>
        {showCopy && (
          <Button type="button" variant="outline" size="sm" onClick={copyInvoice}>
            Copy invoice text
          </Button>
        )}
      </div>

      <div className="mt-6 grid gap-8 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Supplier
          </h3>
          <p className="text-sm font-medium text-foreground">
            {invoice.supplier_contracting_identity ?? LEGAL_CONTRACTING_IDENTITY}
          </p>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {supplierAddress.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {invoice.invoice_contact_email ?? BRIGHT_CONTACT_EMAIL}
          </p>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Bill to
          </h3>
          <p className="text-sm font-medium text-foreground">{invoice.employer_organisation}</p>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {invoiceAddress.length > 0 ? invoiceAddress.map((line) => <p key={line}>{line}</p>) : <p>—</p>}
          </div>
        </div>
      </div>

      <dl className="mt-8 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Invoice number</dt>
          <dd className="text-right text-foreground">{invoice.invoice_number ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Invoice date</dt>
          <dd className="text-right text-foreground">{fmtDate(invoice.invoice_date)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Payment due date</dt>
          <dd className="text-right text-foreground">{fmtDate(invoice.payment_due_date)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Offer reference</dt>
          <dd className="text-right text-foreground">{invoice.offer_reference ?? "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Purchase order number</dt>
          <dd className="text-right text-foreground">{invoice.po_number || "—"}</dd>
        </div>
      </dl>

      <div className="mt-8 overflow-x-auto border-t border-border pt-6">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="pb-3 font-medium">Description</th>
              <th className="pb-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-4 pr-6 text-foreground">{description}</td>
              <td className="py-4 text-right text-foreground">{fmtWholeGbp(net)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <dl className="ml-auto mt-6 max-w-[320px] space-y-2 text-sm">
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">Net amount</dt>
          <dd className="text-foreground">{fmtWholeGbp(net)}</dd>
        </div>
        <div className="flex justify-between gap-6">
          <dt className="text-muted-foreground">VAT</dt>
          <dd className="text-foreground">{fmtPenceGbp(vat)}</dd>
        </div>
        <div className="flex justify-between gap-6 border-t border-border pt-3 font-medium">
          <dt className="text-foreground">Total payable</dt>
          <dd className="text-foreground">{fmtWholeGbp(total)}</dd>
        </div>
      </dl>

      <p className="mt-6 border-t border-border pt-5 text-sm text-muted-foreground">
        {EMPLOYER_OFFER_VAT_WORDING}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {invoice.invoice_payment_instructions ?? EMPLOYER_OFFER_INVOICE_PAYMENT_INSTRUCTIONS}
      </p>
    </section>
  );
};

export default EmployerOfferInvoice;