import { cn } from "@/lib/utils";

interface OptionListProps<T extends string> {
  /** Accessible group name, rendered as the legend. */
  legend: string;
  options: readonly (readonly [T, string])[];
  /** Selected value (single-select) or selected values (multi-select). */
  value: T | null | T[];
  onChange: (value: T) => void;
  multiple?: boolean;
  /** Values that must be rendered non-selectable (mutually exclusive rules). */
  disabledValues?: T[];
  name: string;
}

/**
 * Radio / checkbox group built on real inputs so keyboard and screen-reader
 * behaviour comes from the platform rather than being re-implemented.
 */
function OptionList<T extends string>({
  legend,
  options,
  value,
  onChange,
  multiple = false,
  disabledValues = [],
  name,
}: OptionListProps<T>) {
  const isSelected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);

  return (
    <fieldset className="mt-2 border-0 p-0">
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-col gap-3">
        {options.map(([v, label]) => {
          const selected = isSelected(v);
          const disabled = disabledValues.includes(v);
          return (
            <label
              key={v}
              className={cn(
                "group flex min-h-[44px] cursor-pointer items-start gap-3 rounded-sm border px-4 py-3 text-[15px] leading-relaxed transition-colors",
                "focus-within:outline-none focus-within:ring-2 focus-within:ring-gold focus-within:ring-offset-2 focus-within:ring-offset-navy",
                selected
                  ? "border-gold bg-navy-foreground/[0.07] text-navy-foreground"
                  : "border-navy-foreground/15 text-navy-foreground/85 hover:border-navy-foreground/35",
                disabled && "cursor-not-allowed opacity-40",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={v}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(v)}
                className="mt-[3px] h-4 w-4 shrink-0 accent-gold"
              />
              <span>{label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default OptionList;
