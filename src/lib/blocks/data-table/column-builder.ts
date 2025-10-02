import type { ColumnDef } from '@tanstack/table-core';
import type { Component } from 'svelte';
import { createRawSnippet } from 'svelte';
//import { renderComponent, renderSnippet } from './index.js';

// Import our cell components
import TextCell from './cells/TextCell.svelte';
import BadgeCell from './cells/BadgeCell.svelte';
import CurrencyCell from './cells/CurrencyCell.svelte';
import EditableCell from './cells/EditableCell.svelte';
import ActionsCell from './cells/ActionsCell.svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';

// Base configuration types
type BaseColumnConfig = {
    label?: string;
    sortable?: boolean;
    hideable?: boolean;
    className?: string;
};

type TextColumnConfig = BaseColumnConfig & {
    align?: 'left' | 'center' | 'right';
};

type CurrencyColumnConfig = BaseColumnConfig & {
    currency?: string;
    locale?: string;
    align?: 'left' | 'center' | 'right';
};

type BadgeColumnConfig = BaseColumnConfig & {
    variants?: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'>;
    icons?: Record<string, Component>;
};

type EditableColumnConfig = BaseColumnConfig & {
    type?: 'text' | 'number';
    align?: 'left' | 'center' | 'right';
    onSave?: (value: string | number, row: any) => Promise<void>;
};

type ActionsColumnConfig = BaseColumnConfig & {
    actions?: Array<'edit' | 'copy' | 'delete' | 'view'>;
    onEdit?: (row: any) => void;
    onCopy?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
};

// Column builder class
class ColumnBuilder<TData> {
    text(key: keyof TData, config: TextColumnConfig = {}): ColumnDef<TData> {
        const { label, align = 'left', sortable = true, hideable = true, className = '' } = config;

        return {
            accessorKey: key as string,
            header: label || (key as string),
            cell: ({ row }) => {
                const value = row.getValue(key as string) as string;
                return renderComponent(TextCell, { value, align, className });
            },
            enableSorting: sortable,
            enableHiding: hideable
        };
    }

    currency(key: keyof TData, config: CurrencyColumnConfig = {}): ColumnDef<TData> {
        const {
            label,
            currency = 'USD',
            locale = 'en-US',
            align = 'right',
            sortable = true,
            hideable = true,
            className = ''
        } = config;

        return {
            accessorKey: key as string,
            header: () => {
                if (align !== 'left') {
                    const headerSnippet = createRawSnippet(() => ({
                        render: () => `<div class="text-${align}">${label || (key as string)}</div>`
                    }));
                    return renderSnippet(headerSnippet, '');
                }
                return label || (key as string);
            },
            cell: ({ row }) => {
                const value = row.getValue(key as string) as number | string;
                return renderComponent(CurrencyCell, { value, currency, locale, align, className });
            },
            enableSorting: sortable,
            enableHiding: hideable
        };
    }

    badge(key: keyof TData, config: BadgeColumnConfig = {}): ColumnDef<TData> {
        const { label, variants = {}, icons = {}, sortable = true, hideable = true, className = '' } = config;

        return {
            accessorKey: key as string,
            header: label || (key as string),
            cell: ({ row }) => {
                const value = row.getValue(key as string) as string;
                return renderComponent(BadgeCell, { value, variants, icons, className });
            },
            enableSorting: sortable,
            enableHiding: hideable
        };
    }

    editable(key: keyof TData, config: EditableColumnConfig = {}): ColumnDef<TData> {
        const {
            label,
            type = 'text',
            align = 'left',
            onSave,
            sortable = true,
            hideable = true,
            className = ''
        } = config;

        return {
            accessorKey: key as string,
            header: () => {
                if (align !== 'left') {
                    const headerSnippet = createRawSnippet(() => ({
                        render: () => `<div class="text-${align}">${label || (key as string)}</div>`
                    }));
                    return renderSnippet(headerSnippet, '');
                }
                return label || (key as string);
            },
            cell: ({ row }) => {
                const value = row.getValue(key as string) as string | number;
                const rowId = (row.original as any).id || row.id;
                const fieldKey = key as string;

                const saveHandler = onSave ? (newValue: string | number) => onSave(newValue, row.original) : undefined;

                return renderComponent(EditableCell, {
                    value,
                    type,
                    align,
                    className,
                    rowId,
                    fieldKey,
                    onSave: saveHandler
                });
            },
            enableSorting: sortable,
            enableHiding: hideable
        };
    }

    actions(config: ActionsColumnConfig = {}): ColumnDef<TData> {
        const {
            actions = ['edit', 'copy', 'delete'],
            onEdit,
            onCopy,
            onDelete,
            onView,
            className = '',
            hideable = false
        } = config;

        return {
            id: 'actions',
            header: () => null,
            cell: ({ row }) => {
                const handlers = {
                    onEdit: onEdit ? () => onEdit(row.original) : undefined,
                    onCopy: onCopy ? () => onCopy(row.original) : undefined,
                    onDelete: onDelete ? () => onDelete(row.original) : undefined,
                    onView: onView ? () => onView(row.original) : undefined
                };

                return renderComponent(ActionsCell, { actions, ...handlers, className });
            },
            enableSorting: false,
            enableHiding: hideable
        };
    }

    custom(columnDef: ColumnDef<TData>): ColumnDef<TData> {
        return columnDef;
    }
}

// Main function to create columns
export function createColumns<TData>(
    columnBuilders: Array<(builder: ColumnBuilder<TData>) => ColumnDef<TData>>
): ColumnDef<TData>[] {
    const builder = new ColumnBuilder<TData>();
    return columnBuilders.map(builderFn => builderFn(builder));
}

// Export types for consumers
export type {
    BaseColumnConfig,
    TextColumnConfig,
    CurrencyColumnConfig,
    BadgeColumnConfig,
    EditableColumnConfig,
    ActionsColumnConfig
};