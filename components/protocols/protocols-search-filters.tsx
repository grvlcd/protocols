"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SORT_LABELS: Record<string, string> = {
  recent: "Most Recent",
  most_reviewed: "Most Reviews",
  highest_rated: "Top Rated",
};

interface Props {
  initialSearch: string;
  initialSort: string;
}

export function ProtocolsSearchFilters({ initialSearch, initialSort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const search = (formData.get("search") as string) ?? "";
    const sort = (formData.get("sort") as string) ?? "recent";
    const params = new URLSearchParams(searchParams.toString());

    if (search) params.set("search", search);
    else params.delete("search");

    if (sort) params.set("sort", sort);
    else params.delete("sort");

    params.delete("page");

    const query = params.toString();
    startTransition(() => {
      router.push(`/protocols${query ? `?${query}` : ""}`);
    });
  }

  return (
    <form
      action={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card/80 p-3 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
    >
      <div className="flex-1">
        <label className="block text-xs font-medium text-muted-foreground">
          Title
        </label>
        <Input
          type="search"
          name="search"
          defaultValue={initialSearch}
          placeholder="Search protocols..."
          className="mt-1"
        />
      </div>

      <div className="flex flex-wrap items-end gap-2 sm:justify-end">
        <div>
          <label className="block text-xs font-medium text-muted-foreground">
            Sort By
          </label>
          <Select name="sort" defaultValue={initialSort} className="mt-1 w-full">
            <option value="recent">{SORT_LABELS.recent}</option>
            <option value="most_reviewed">{SORT_LABELS.most_reviewed}</option>
            <option value="highest_rated">{SORT_LABELS.highest_rated}</option>
          </Select>
        </div>

        <Button
          type="submit"
          size="sm"
          className="mt-1"
          disabled={isPending}
        >
          {isPending ? "Applying..." : "Apply"}
        </Button>
      </div>
    </form>
  );
}

