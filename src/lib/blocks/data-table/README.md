# Data Table Column Builder

This new column builder system makes it much easier to create data tables with sensible defaults and reusable components.

## Basic Usage

```typescript
import { createColumns } from '$lib/blocks/data-table/index.js';
import DataTable from '$lib/blocks/data-table/data-table.svelte';

const columns = createColumns<MyDataType>([
  col => col.text('name', { label: 'Name' }),
  col => col.currency('amount', { label: 'Amount', currency: 'USD' }),
  col => col.badge('status', { 
    label: 'Status',
    variants: { active: 'success', inactive: 'destructive' }
  }),
  col => col.editable('quantity', { 
    label: 'Qty', 
    type: 'number',
    onSave: async (value, row) => {
      // Save to API
      await updateQuantity(row.id, value);
    }
  }),
  col => col.actions({
    actions: ['edit', 'delete'],
    onEdit: (row) => editItem(row),
    onDelete: (row) => deleteItem(row)
  })
]);

// Clean, prop-driven API
<DataTable 
  {columns} 
  {data}
  selectable={true}   // Automatically adds select column
  draggable={true}    // Automatically adds drag column
  searchable={true}   // Shows search input (default: true)
  pagination={true}   // Shows pagination controls (default: true)
/>
```

## Available Column Types

### `text(key, config?)`
Basic text display with optional alignment.

```typescript
col => col.text('name', { 
  label: 'Full Name', 
  align: 'center',
  sortable: true 
})
```

### `currency(key, config?)`
Formats numbers as currency.

```typescript
col => col.currency('price', { 
  label: 'Price', 
  currency: 'EUR',
  locale: 'de-DE' 
})
```

### `badge(key, config?)`
Displays values as badges with optional variants and icons.

```typescript
col => col.badge('status', { 
  label: 'Status',
  variants: { 
    'active': 'success', 
    'pending': 'warning',
    'inactive': 'destructive' 
  },
  icons: { 
    'active': CheckIcon,
    'pending': ClockIcon 
  }
})
```

### `editable(key, config?)`
Creates inline editable fields.

```typescript
col => col.editable('quantity', { 
  label: 'Quantity', 
  type: 'number',
  align: 'right',
  onSave: async (value, row) => {
    await api.update(row.id, { quantity: value });
  }
})
```



### `actions(config?)`
Adds action dropdown menus.

```typescript
col => col.actions({
  actions: ['edit', 'copy', 'delete', 'view'],
  onEdit: (row) => editRow(row),
  onCopy: (row) => copyRow(row),
  onDelete: (row) => deleteRow(row),
  onView: (row) => viewRow(row)
})
```

### `custom(columnDef)`
For full customization, pass a complete TanStack Table column definition.

```typescript
col => col.custom({
  accessorKey: 'custom',
  header: 'Custom Column',
  cell: ({ row }) => renderComponent(MyCustomComponent, { row })
})
```

## Configuration Options

All column types support these base options:
- `label?: string` - Column header label
- `sortable?: boolean` - Enable/disable sorting (default: true)
- `hideable?: boolean` - Allow hiding in column selector (default: true)
- `className?: string` - Additional CSS classes

## DataTable Component

The DataTable component uses a clean, prop-driven API for feature control:

```typescript
<DataTable 
  {columns} 
  {data}
  selectable={true}   // Adds select column automatically (default: false)
  draggable={true}    // Adds drag column automatically (default: false)  
  searchable={true}   // Shows search input (default: true)
  pagination={true}   // Shows pagination controls (default: true)
/>
```

### Feature Control Props

- **`selectable`**: Automatically adds selection checkboxes and enables row selection
- **`draggable`**: Automatically adds drag handles and enables row reordering  
- **`searchable`**: Shows/hides the search input
- **`pagination`**: Shows/hides pagination controls and enables pagination

### Column Positioning (Optional)

```typescript
<DataTable 
  {columns} 
  {data}
  selectable={true}
  draggable={true}
  selectPosition="end"    // 'start' | 'end' (default: 'start')
  dragPosition="start"    // 'start' | 'end' (default: 'start')
/>
```