interface MyListingsArgs {
  page: number;
  pageSize: number;
  searchText?: string;
  statusFilters?: string[];
  sorter?: { field: string; order: 'ascend' | 'descend' };
}

export function buildPagedArgs(
  args: MyListingsArgs,
  opts?: { useDefaultStatuses?: boolean },
) {
  const { page, pageSize, searchText, statusFilters, sorter } = args;
  let effectiveStatuses: string[] | undefined;
  if (statusFilters && statusFilters.length > 0) {
    effectiveStatuses = statusFilters;
  } else if (opts?.useDefaultStatuses) {
    effectiveStatuses = ['Appeal Requested', 'Blocked'];
  } else {
    effectiveStatuses = undefined;
  }

  const pagedArgs: Partial<MyListingsArgs> & { page: number; pageSize: number; sharerId?: string } = {
    page,
    pageSize,
  };
  if (searchText) pagedArgs.searchText = searchText;
  if (effectiveStatuses !== undefined) pagedArgs.statusFilters = effectiveStatuses;
  if (sorter) pagedArgs.sorter = sorter;
  return pagedArgs;
}

export default { buildPagedArgs };
