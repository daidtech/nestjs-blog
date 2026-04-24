'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type MatchableOption = {
  id: number;
  name: string;
};

type ReactSelect2Props = {
  options: MatchableOption[];
  value: number[];
  onChange: (selectedIds: number[]) => void;
  onCreate?: (label: string) => Promise<MatchableOption>;
  placeholder?: string;
  allowCreate?: boolean;
  noOptionsLabel?: string;
};

export default function ReactSelect2({
  options,
  value,
  onChange,
  onCreate,
  placeholder = 'Search or create...',
  allowCreate = false,
  noOptionsLabel = 'No results found',
}: ReactSelect2Props) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const selectedSet = useMemo(() => new Set(value.map((item) => String(item))), [value]);
  const selectedOptions = useMemo(
    () => options.filter((option) => selectedSet.has(String(option.id))),
    [options, selectedSet],
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }
    return options.filter((option) => option.name.toLowerCase().includes(normalized));
  }, [options, query]);

  const createCandidate = useMemo(() => {
    const trimmed = query.trim();
    if (!allowCreate || !onCreate || !trimmed) return null;
    const exists = options.some((option) => option.name.toLowerCase() === trimmed.toLowerCase());
    return exists ? null : trimmed;
  }, [allowCreate, onCreate, options, query]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (containerRef.current.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleSelection = (id: number) => {
    if (selectedSet.has(String(id))) {
      onChange(value.filter((item) => String(item) !== String(id)));
    } else {
      onChange([...value, id]);
    }
    setOpen(true);
  };

  const handleCreate = async () => {
    if (!createCandidate || !onCreate) return;
    const created = await onCreate(createCandidate);
    setQuery('');
    setOpen(false);
    onChange([...value, created.id]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="min-h-[3rem] flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
        {selectedOptions.map((option) => (
          <span
            key={option.id}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700"
          >
            {option.name}
            <button
              type="button"
              onClick={() => toggleSelection(option.id)}
              className="rounded-full p-0.5 text-xs text-indigo-700 hover:bg-indigo-100"
              aria-label={`Remove ${option.name}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="min-w-[10rem] flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {filteredOptions.length > 0 ? (
            <ul className="max-h-56 overflow-auto">
              {filteredOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => toggleSelection(option.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition ${
                      selectedSet.has(String(option.id))
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">{noOptionsLabel}</div>
          )}
          {createCandidate && (
            <button
              type="button"
              onClick={handleCreate}
              className="w-full border-t border-gray-200 px-4 py-3 text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Create "{createCandidate}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
