"use client";

import {useEffect, useId, useMemo, useRef, useState} from "react";
import {useLocale} from "next-intl";
import {ALL_FILTER_VALUE} from "@/lib/dashboard";

interface FilterOption {
  label: string;
  value: string;
}

export function SearchableFilter({
  controlId,
  label,
  value,
  options,
  multiple = false,
  allLabel,
  searchLabel,
  noResultsLabel,
  selectedCountLabel,
  onChange,
}: {
  controlId: string;
  label: string;
  value: string | string[];
  options: FilterOption[];
  multiple?: boolean;
  allLabel: string;
  searchLabel: string;
  noResultsLabel: string;
  selectedCountLabel: string;
  onChange: (value: string | string[]) => void;
}) {
  const locale = useLocale();
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [popupPosition, setPopupPosition] = useState({left: 0, top: 0, width: 0});
  const selectedValues = Array.isArray(value) ? value : value === ALL_FILTER_VALUE ? [] : [value];
  const selectedLabel = selectedValues.length === 0
    ? allLabel
    : selectedValues.length === 1
      ? options.find((option) => option.value === selectedValues[0])?.label ?? selectedValues[0]
      : selectedCountLabel;
  const normalizedQuery = normalizeSearchValue(query, locale);
  const filteredOptions = useMemo(() => options.filter((option) => (
    normalizeSearchValue(option.label, locale).includes(normalizedQuery)
  )), [locale, normalizedQuery, options]);
  const visibleOptions = useMemo(() => [
    {label: allLabel, value: ALL_FILTER_VALUE},
    ...filteredOptions,
  ], [allLabel, filteredOptions]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
        setActiveIndex(0);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({block: "nearest"});
  }, [activeIndex, open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };
  const select = (option: FilterOption) => {
    if (multiple) {
      if (option.value === ALL_FILTER_VALUE) onChange([]);
      else onChange(selectedValues.includes(option.value)
        ? selectedValues.filter((item) => item !== option.value)
        : [...selectedValues, option.value]);
      return;
    }
    onChange(option.value);
    close();
    triggerRef.current?.focus();
  };
  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const viewportPadding = 16;
      const popupHeight = 304;
      const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
      const left = Math.min(
        Math.max(rect.left, viewportPadding),
        window.innerWidth - viewportPadding - width,
      );
      const top = window.innerHeight - rect.bottom >= popupHeight
        ? rect.bottom + 6
        : Math.max(viewportPadding, rect.top - popupHeight - 6);
      setPopupPosition({left, top, width});
    }
    setOpen(true);
    setActiveIndex(Math.max(0, visibleOptions.findIndex((option) => selectedValues.includes(option.value))));
  };

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        ref={triggerRef}
        id={controlId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        onClick={() => open ? close() : openMenu()}
        onKeyDown={(event) => {
          if (["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            openMenu();
          }
          if (event.key === "Escape") close();
        }}
        className="flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-control border border-control-border bg-surface px-3 text-left text-sm font-medium text-foreground outline-none transition-colors focus:border-primary"
      >
        <span className="min-w-0 truncate" title={selectedLabel}>{selectedLabel}</span>
        <span aria-hidden="true" className="shrink-0 text-muted">⌄</span>
      </button>

      {open ? (
        <div
          style={popupPosition}
          className="fixed z-40 min-w-0 overflow-hidden rounded-control border border-border bg-surface shadow-card"
        >
          <div className="border-b border-border p-2">
            <input
              ref={inputRef}
              role="combobox"
              aria-label={`${searchLabel}: ${label}`}
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={`${id}-listbox`}
              aria-activedescendant={`${id}-option-${activeIndex}`}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.min(current + 1, visibleOptions.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((current) => Math.max(current - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const option = visibleOptions[activeIndex];
                  if (option) select(option);
                } else if (event.key === "Escape") {
                  event.preventDefault();
                  close();
                  triggerRef.current?.focus();
                } else if (event.key === "Tab") {
                  close();
                }
              }}
              placeholder={searchLabel}
              className="h-10 w-full rounded-md border border-control-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div id={`${id}-listbox`} role="listbox" aria-multiselectable={multiple || undefined} aria-label={label} className="max-h-60 overflow-y-auto overscroll-contain p-1">
            {visibleOptions.map((option, index) => (
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                key={option.value}
                id={`${id}-option-${index}`}
                type="button"
                role="option"
                tabIndex={-1}
                aria-selected={option.value === ALL_FILTER_VALUE ? selectedValues.length === 0 : selectedValues.includes(option.value)}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(option)}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm outline-none ${index === activeIndex ? "bg-primary/10 text-primary-strong" : "text-foreground hover:bg-surface-raised"}`}
                title={option.label}
              >
                <span className="truncate">{option.label}</span>
                {multiple && (option.value === ALL_FILTER_VALUE ? selectedValues.length === 0 : selectedValues.includes(option.value)) ? <span aria-hidden="true">✓</span> : null}
              </button>
            ))}
          </div>
          {filteredOptions.length === 0 ? <p role="status" className="border-t border-border px-4 py-3 text-sm text-muted">{noResultsLabel}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function normalizeSearchValue(value: string, locale: string) {
  return value.normalize("NFKC").toLocaleLowerCase(locale);
}
