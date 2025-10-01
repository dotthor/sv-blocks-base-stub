# RadioGroupField Component

A composable radio group field component with consistent styling and grid support.

## Basic Usage

```svelte
<script>
  import { RadioGroupField } from '$lib/blocks/forms';
  
  const notificationOptions = [
    { label: 'All messages', value: 'all' },
    { label: 'Mentions only', value: 'mentions' },
    { label: 'None', value: 'none' }
  ];
</script>

<RadioGroupField
  {form}
  {formData}
  name="notifications"
  legend="Notify me about..."
  options={notificationOptions}
/>
```

## With Descriptions

```svelte
const detailedOptions = [
  {
    label: 'All new messages',
    value: 'all',
    description: 'Get notified for every new message'
  },
  {
    label: 'Direct messages and mentions',
    value: 'mentions',
    description: 'Only important notifications'
  },
  {
    label: 'Nothing',
    value: 'none',
    description: 'No notifications at all'
  }
];
```

## With Background Style

```svelte
<RadioGroupField
  {form}
  {formData}
  name="preferences"
  legend="Choose your preference"
  options={options}
  withBackground={true}
/>
```

## Horizontal Layout

```svelte
<RadioGroupField
  {form}
  {formData}
  name="size"
  legend="Size"
  options={sizeOptions}
  orientation="horizontal"
/>
```

## Grid Layout Options

```svelte
<!-- Half width on desktop -->
<RadioGroupField gridClass="sm:col-span-3" ... />

<!-- Two-thirds width -->
<RadioGroupField gridClass="sm:col-span-4" ... />

<!-- Full width (default) -->
<RadioGroupField gridClass="col-span-full" ... />
```

## Props

- `form`: SuperForm instance
- `formData`: Form data store
- `name`: Field name
- `legend`: Radio group title/legend (required)
- `options`: Array of radio options with `label`, `value`, optional `description` and `disabled`
- `withBackground?`: Enable background styling (default: false)
- `orientation?`: 'vertical' | 'horizontal' (default: 'vertical')
- `description?`: Additional description below the legend
- `disabled?`: Disable entire radio group
- `gridClass?`: CSS classes for grid positioning (default: 'col-span-full')