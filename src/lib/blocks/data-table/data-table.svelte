<script lang="ts" generics="TData, TValue">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FlexRender,
		renderComponent,
		renderSnippet
	} from '$lib/components/ui/data-table/index.js';
	import LayoutColumnsIcon from '@lucide/svelte/icons/columns';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronsLeftIcon from '@lucide/svelte/icons/chevrons-left';
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import ChevronsRightIcon from '@lucide/svelte/icons/chevrons-right';
	import { createRawSnippet } from 'svelte';
	import { DragDropProvider } from '@dnd-kit-svelte/svelte';
	import { move } from '@dnd-kit/helpers';
	import { useSortable } from '@dnd-kit-svelte/svelte/sortable';
	import SelectCell from './cells/SelectCell.svelte';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		// Feature controls - automatically add required columns
		selectable?: boolean;
		draggable?: boolean;
		searchable?: boolean;
		pagination?: boolean;
		// Column positioning
		selectPosition?: 'start' | 'end';
		dragPosition?: 'start' | 'end';
	};

	let {
		data,
		columns: userColumns,
		selectable = false,
		draggable = false,
		searchable = true,
		pagination = true,
		selectPosition = 'start',
		dragPosition = 'start'
	}: DataTableProps<TData, TValue> = $props();

	// Helper functions to create system columns
	function createSelectColumn(): ColumnDef<TData, any> {
		return {
			id: 'select',
			header: ({ table }) =>
				renderComponent(SelectCell, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(SelectCell, {
					checked: row.getIsSelected(),
					onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		};
	}

	function createDragColumn(): ColumnDef<TData, any> {
		return {
			id: 'drag',
			header: () => null,
			cell: () =>
				renderSnippet(
					createRawSnippet<[any]>((attach) => ({
						render:
							() => `<button class="flex size-7 items-center justify-center text-muted-foreground hover:bg-transparent variant-ghost">
					<svg class="size-3 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="9" cy="12" r="1"/>
						<circle cx="9" cy="5" r="1"/>
						<circle cx="9" cy="19" r="1"/>
						<circle cx="15" cy="12" r="1"/>
						<circle cx="15" cy="5" r="1"/>
						<circle cx="15" cy="19" r="1"/>
					</svg>
					<span class="sr-only">Drag to reorder</span>
				</button>`
					}))
				),
			enableSorting: false,
			enableHiding: false
		};
	}

	// Build final columns array with system columns
	function buildFinalColumns(): ColumnDef<TData, any>[] {
		const startColumns: ColumnDef<TData, any>[] = [];
		const endColumns: ColumnDef<TData, any>[] = [];

		// Add drag column
		if (draggable) {
			if (dragPosition === 'start') {
				startColumns.push(createDragColumn());
			} else {
				endColumns.push(createDragColumn());
			}
		}

		// Add select column
		if (selectable) {
			if (selectPosition === 'start') {
				startColumns.push(createSelectColumn());
			} else {
				endColumns.push(createSelectColumn());
			}
		}

		return [...startColumns, ...userColumns, ...endColumns];
	}

	// Get final columns
	const columns = buildFinalColumns();

	let paginationState = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});
	let globalFilter = $state('');

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return paginationState;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			},
			get globalFilter() {
				return globalFilter;
			}
		},
		getRowId: (row) => (row as any).id?.toString() || Math.random().toString(),
		enableRowSelection: selectable,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: searchable ? getFilteredRowModel() : undefined,
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				paginationState = updater(paginationState);
			} else {
				paginationState = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			if (typeof updater === 'function') {
				globalFilter = updater(globalFilter);
			} else {
				globalFilter = updater;
			}
		}
	});
</script>

<div class="w-full flex-col justify-start gap-6">
	<div class="flex items-center justify-between px-4 lg:px-6">
		<div class="flex items-center gap-2">
			{#if searchable}
				<Input
					placeholder="Search..."
					bind:value={globalFilter}
					oninput={(e) => table.setGlobalFilter((e.target as HTMLInputElement).value)}
					class="max-w-sm"
				/>
			{/if}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="sm" {...props}>
							<LayoutColumnsIcon />
							<span class="hidden lg:inline">Customize Columns</span>
							<span class="lg:hidden">Columns</span>
							<ChevronDownIcon />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					{#each table
						.getAllColumns()
						.filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(!!value)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
		<div class="overflow-hidden rounded-lg border">
			{#if draggable}
				<DragDropProvider
					modifiers={[
						// @ts-expect-error @dnd-kit/abstract types are botched atm
						RestrictToVerticalAxis
					]}
					onDragEnd={(e) => {
						const moved = move(data as any, e);
						data = Array.isArray(moved) ? (moved as TData[]) : data;
					}}
				>
					<Table.Root>
						<Table.Header class="sticky top-0 z-10 bg-muted">
							{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
								<Table.Row>
									{#each headerGroup.headers as header (header.id)}
										<Table.Head colspan={header.colSpan}>
											{#if !header.isPlaceholder}
												<FlexRender
													content={header.column.columnDef.header}
													context={header.getContext()}
												/>
											{/if}
										</Table.Head>
									{/each}
								</Table.Row>
							{/each}
						</Table.Header>
						<Table.Body class="**:data-[slot=table-cell]:first:w-8">
							{#if table.getRowModel().rows?.length}
								{#each table.getRowModel().rows as row, index (row.id)}
									{@render DraggableRow({ row, index })}
								{/each}
							{:else}
								<Table.Row>
									<Table.Cell colspan={columns.length} class="h-24 text-center">
										No results.
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</DragDropProvider>
			{:else}
				<Table.Root>
					<Table.Header class="sticky top-0 z-10 bg-muted">
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head colspan={header.colSpan}>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body class="**:data-[slot=table-cell]:first:w-8">
						{#if table.getRowModel().rows?.length}
							{#each table.getRowModel().rows as row, index (row.id)}
								{@render StaticRow({ row })}
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center">
									No results.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
			{/if}
		</div>
		{#if pagination || selectable}
			<div class="flex items-center justify-between px-4">
				{#if selectable}
					<div class="hidden flex-1 text-sm text-muted-foreground lg:flex">
						{table.getFilteredSelectedRowModel().rows.length} of
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
				{/if}
				{#if pagination}
					<div class="flex w-full items-center gap-8 lg:w-fit">
						<div class="hidden items-center gap-2 lg:flex">
							<Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
							<Select.Root
								type="single"
								bind:value={
									() => `${table.getState().pagination.pageSize}`,
									(v) => table.setPageSize(Number(v))
								}
							>
								<Select.Trigger size="sm" class="w-20" id="rows-per-page">
									{table.getState().pagination.pageSize}
								</Select.Trigger>
								<Select.Content side="top">
									{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
										<Select.Item value={pageSize.toString()}>
											{pageSize}
										</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div class="flex w-fit items-center justify-center text-sm font-medium">
							Page {table.getState().pagination.pageIndex + 1} of
							{table.getPageCount()}
						</div>
						<div class="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								class="hidden h-8 w-8 p-0 lg:flex"
								onclick={() => table.setPageIndex(0)}
								disabled={!table.getCanPreviousPage()}
							>
								<span class="sr-only">Go to first page</span>
								<ChevronsLeftIcon />
							</Button>
							<Button
								variant="outline"
								class="size-8"
								size="icon"
								onclick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								<span class="sr-only">Go to previous page</span>
								<ChevronLeftIcon />
							</Button>
							<Button
								variant="outline"
								class="size-8"
								size="icon"
								onclick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
							>
								<span class="sr-only">Go to next page</span>
								<ChevronRightIcon />
							</Button>
							<Button
								variant="outline"
								class="hidden size-8 lg:flex"
								size="icon"
								onclick={() => table.setPageIndex(table.getPageCount() - 1)}
								disabled={!table.getCanNextPage()}
							>
								<span class="sr-only">Go to last page</span>
								<ChevronsRightIcon />
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#snippet DraggableRow({ row, index }: { row: Row<TData>; index: number })}
	{@const { ref, isDragging, handleRef } = useSortable({
		id: (row.original as any).id,
		index: () => index
	})}

	<Table.Row
		data-state={row.getIsSelected() && 'selected'}
		data-dragging={isDragging.current}
		class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
		{@attach ref}
	>
		{#each row.getVisibleCells() as cell (cell.id)}
			<Table.Cell>
				<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
			</Table.Cell>
		{/each}
	</Table.Row>
{/snippet}

{#snippet StaticRow({ row }: { row: Row<TData> })}
	<Table.Row data-state={row.getIsSelected() && 'selected'}>
		{#each row.getVisibleCells() as cell (cell.id)}
			<Table.Cell>
				<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
			</Table.Cell>
		{/each}
	</Table.Row>
{/snippet}
