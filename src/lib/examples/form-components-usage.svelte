<!--
  Form Components Usage Examples
  
  This file demonstrates all the different ways to use the form components
  in the sv-blocks-base-stub project.
-->

<script lang="ts">
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import {
		BaseForm,
		TextField,
		TextareaField,
		CheckableField,
		ComboboxField,
		DynamicField
	} from '$lib/blocks/forms';
	import DialogResponsive from '$lib/blocks/components/DialogResponsive.svelte';
	import FloatingActionButton from '$lib/blocks/components/FloatingActionButton.svelte';
	import CalendarField from '$lib/blocks/forms/components/CalendarField.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Settings, Plus, Edit } from '@lucide/svelte';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	// Example schemas
	const basicSchema = z.object({
		name: z.string().min(2, 'Name must be at least 2 characters'),
		email: z.string().email('Invalid email address'),
		bio: z.string().optional(),
		newsletter: z.boolean().default(false)
	});

	const advancedSchema = z.object({
		title: z.string().min(1, 'Title is required'),
		content: z.string().min(10, 'Content must be at least 10 characters'),
		tags: z.array(z.string()).min(1, 'At least one tag is required').default(['']),
		category: z.enum(['tech', 'design', 'business']),
		publishDate: z.string().refine((v) => v, 'Publish date is required'),
		isDraft: z.boolean().default(true),
		featuredImage: z.string().url().optional()
	});

	// Mock data - in real app this would come from load function
	const mockBasicData = { form: {} as SuperValidated<Infer<typeof basicSchema>> };
	const mockAdvancedData = { form: {} as SuperValidated<Infer<typeof advancedSchema>> };

	// Options for dropdowns
	const categories = [
		{ label: 'Technology', value: 'tech' },
		{ label: 'Design', value: 'design' },
		{ label: 'Business', value: 'business' }
	];

	const languages = [
		{ label: 'English', value: 'en' },
		{ label: 'Spanish', value: 'es' },
		{ label: 'French', value: 'fr' },
		{ label: 'German', value: 'de' }
	];
</script>

<div class="mx-auto max-w-4xl space-y-12 p-6">
	<header>
		<h1 class="mb-4 text-3xl font-bold">Form Components Usage Examples</h1>
		<p class="text-muted-foreground">
			This page demonstrates all the different ways to use the form components in
			sv-blocks-base-stub.
		</p>
	</header>

	<!-- Example 1: Basic Form with BaseForm Component -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">1. Basic Form (Using BaseForm)</h2>
		<p class="text-sm text-muted-foreground">
			Simple form using the BaseForm component with default configuration.
		</p>

		<div
			class="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-muted-foreground"
		>
			<p><strong>📱 Mobile FAB:</strong></p>
			<ul class="mt-1 list-inside list-disc space-y-1">
				<li><strong>Desktop:</strong> Normal submit button at the bottom of the form</li>
				<li>
					<strong>Mobile:</strong> Floating Action Button (FAB) centered at the bottom of the screen
				</li>
				<li>Resize your browser to see the responsive behavior!</li>
			</ul>
		</div>

		<div class="rounded-lg border p-6">
			<BaseForm data={mockBasicData} schema={basicSchema} submitText="Create Account" debug={true}>
				{#snippet children({ form, formData })}
					<div class="space-y-4">
						<TextField
							{form}
							{formData}
							name="name"
							label="Full Name"
							placeholder="Enter your full name"
							required
						/>

						<TextField
							{form}
							{formData}
							name="email"
							label="Email Address"
							type="email"
							placeholder="you@example.com"
							required
						/>

						<TextareaField
							{form}
							{formData}
							name="bio"
							label="Bio"
							placeholder="Tell us about yourself..."
							description="This will be shown on your public profile."
						/>

						<CheckableField
							{form}
							{formData}
							name="newsletter"
							label="Subscribe to newsletter"
							description="Get weekly updates about new features and content."
						/>
					</div>
				{/snippet}
			</BaseForm>
		</div>
	</section>

	<!-- Example 2: Advanced Form with Custom Actions -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">2. Advanced Form with Custom Actions</h2>
		<p class="text-sm text-muted-foreground">
			Form with custom SuperForms configuration and custom action buttons.
		</p>

		<div class="rounded-lg border p-6">
			<BaseForm
				data={mockAdvancedData}
				schema={advancedSchema}
				showSubmitButton={false}
				superFormConfig={{
					resetForm: false,
					onSubmit: ({ formData, cancel }) => {
						console.log('Submitting form:', formData);
						// Add custom validation or processing here
					},
					onResult: ({ result }) => {
						if (result.type === 'success') {
							console.log('Form submitted successfully!');
						}
					}
				}}
			>
				{#snippet children({ form, formData })}
					<div class="space-y-4">
						<TextField
							{form}
							{formData}
							name="title"
							label="Article Title"
							placeholder="Enter article title"
							required
						/>

						<TextareaField
							{form}
							{formData}
							name="content"
							label="Content"
							placeholder="Write your article content..."
							rows={6}
							required
						/>

						<DynamicField
							{form}
							{formData}
							name="tags"
							legend="Tags"
							fieldType="text"
							placeholder="Enter a tag"
							addButtonText="Add Tag"
							minItems={1}
							maxItems={5}
						/>

						<ComboboxField
							{form}
							{formData}
							name="category"
							label="Category"
							options={categories}
							placeholder="Select category..."
							required
						/>

						<CalendarField {form} {formData} name="publishDate" label="Publish Date" required />

						<CheckableField
							{form}
							{formData}
							name="isDraft"
							label="Save as draft"
							style="switch"
							description="Draft articles won't be published immediately."
						/>

						<TextField
							{form}
							{formData}
							name="featuredImage"
							label="Featured Image URL"
							type="url"
							placeholder="https://example.com/image.jpg"
						/>
					</div>
				{/snippet}

				{#snippet actions({ form, formData })}
					<div class="flex gap-2 pt-4">
						<Button type="submit" variant="default">
							<Edit class="mr-2 h-4 w-4" />
							Publish Article
						</Button>
						<Button type="submit" variant="outline" formaction="?/draft">Save as Draft</Button>
						<Button type="button" variant="ghost" onclick={() => window.history.back()}>
							Cancel
						</Button>
					</div>
				{/snippet}
			</BaseForm>
		</div>
	</section>

	<!-- Example 3: Mobile FAB Options -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">3. Mobile FAB Options</h2>
		<p class="text-sm text-muted-foreground">
			Examples showing different mobile FAB configurations.
		</p>

		<div class="grid gap-6">
			<!-- FAB Disabled -->
			<div class="rounded-lg border p-6">
				<h3 class="mb-2 font-medium">Traditional Submit Button (FAB Disabled)</h3>
				<BaseForm data={mockBasicData} schema={basicSchema} submitText="Save" mobileFAB={false}>
					{#snippet children({ form, formData })}
						<div class="space-y-4">
							<TextField {form} {formData} name="name" label="Name" placeholder="Enter name" />
							<TextField
								{form}
								{formData}
								name="email"
								label="Email"
								type="email"
								placeholder="Enter email"
							/>
						</div>
					{/snippet}
				</BaseForm>
			</div>

			<!-- Custom Breakpoint -->
			<div class="rounded-lg border p-6">
				<h3 class="mb-2 font-medium">Custom Breakpoint (FAB at 1024px)</h3>
				<BaseForm
					data={mockBasicData}
					schema={basicSchema}
					submitText="Create"
					breakpoint="(min-width: 1024px)"
				>
					{#snippet children({ form, formData })}
						<div class="space-y-4">
							<TextField
								{form}
								{formData}
								name="name"
								label="Project Name"
								placeholder="Enter project name"
							/>
							<TextareaField
								{form}
								{formData}
								name="bio"
								label="Description"
								placeholder="Describe your project..."
							/>
						</div>
					{/snippet}
				</BaseForm>
			</div>
		</div>
	</section>

	<!-- Example 4: Manual Form (Complex Logic) -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">4. Manual Form (For Complex Cases)</h2>
		<p class="text-sm text-muted-foreground">
			When you need full control over the form logic, use the manual approach.
		</p>

		<div class="rounded-lg border p-6">
			<!-- Manual form setup for complex cases -->
			<form method="POST" class="space-y-4">
				<TextField
					form={{}}
					formData={{}}
					name="complexField"
					label="Complex Field"
					placeholder="This form has complex logic"
				/>

				<div class="rounded bg-gray-50 p-4 text-sm text-muted-foreground">
					<p><strong>Use manual setup when you need:</strong></p>
					<ul class="mt-2 list-inside list-disc space-y-1">
						<li>Complex form validation with external APIs</li>
						<li>Multi-step form logic</li>
						<li>Real-time data synchronization</li>
						<li>Custom form state management</li>
					</ul>
				</div>

				<Button type="submit">Submit Complex Form</Button>
			</form>
		</div>
	</section>

	<!-- Example 5: DialogResponsive Component -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">5. DialogResponsive Component</h2>
		<p class="text-sm text-muted-foreground">
			Responsive dialog that becomes a drawer on mobile devices.
		</p>

		<div class="space-y-4 rounded-lg border p-6">
			<!-- Basic Dialog -->
			<DialogResponsive
				title="User Settings"
				description="Configure your account settings."
				triggerText="Open Settings"
				triggerVariant="outline"
			>
				{#snippet children()}
					<div class="space-y-4 py-4">
						<div class="grid grid-cols-4 items-center gap-4">
							<label class="text-right font-medium">Theme</label>
							<select class="col-span-3 rounded border px-3 py-2">
								<option>Light</option>
								<option>Dark</option>
								<option>System</option>
							</select>
						</div>
						<div class="grid grid-cols-4 items-center gap-4">
							<label class="text-right font-medium">Language</label>
							<select class="col-span-3 rounded border px-3 py-2">
								<option>English</option>
								<option>Spanish</option>
								<option>French</option>
							</select>
						</div>
					</div>
				{/snippet}
			</DialogResponsive>

			<!-- Dialog with Custom Trigger -->
			<DialogResponsive
				title="Create New Item"
				description="Add a new item to your collection."
				triggerText="Fallback Text"
			>
				{#snippet trigger(props)}
					<Button {...props} variant="default" size="lg" class="w-full">
						<Plus class="mr-2 h-4 w-4" />
						Create New Item
					</Button>
				{/snippet}

				{#snippet children()}
					<div class="space-y-4 py-4">
						<input type="text" placeholder="Item name" class="w-full rounded border px-3 py-2" />
						<textarea placeholder="Item description" class="h-24 w-full rounded border px-3 py-2"
						></textarea>
					</div>
				{/snippet}

				{#snippet footer()}
					<Button type="submit">Create</Button>
					<Button variant="outline" type="button">Cancel</Button>
				{/snippet}
			</DialogResponsive>

			<!-- Dialog with Icon Trigger -->
			<DialogResponsive
				title="Quick Settings"
				description="Quickly adjust your preferences."
				triggerText="Settings"
			>
				{#snippet trigger(props)}
					<Button {...props} variant="ghost" size="icon">
						<Settings class="h-4 w-4" />
					</Button>
				{/snippet}

				{#snippet children()}
					<div class="py-4">
						<p>Quick settings content goes here...</p>
					</div>
				{/snippet}
			</DialogResponsive>
		</div>
	</section>

	<!-- Example 6: FloatingActionButton Component -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">6. FloatingActionButton Component</h2>
		<p class="text-sm text-muted-foreground">
			Standalone floating action button for quick actions throughout your app.
		</p>

		<div class="relative min-h-[200px] space-y-4 rounded-lg border p-6">
			<div
				class="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-3 text-sm text-muted-foreground"
			>
				<p><strong>🎯 FloatingActionButton Features:</strong></p>
				<ul class="mt-1 list-inside list-disc space-y-1">
					<li><strong>Flexible Positioning:</strong> bottom-center, bottom-right, bottom-left</li>
					<li><strong>Hide on Scroll:</strong> Automatically hide when scrolling down</li>
					<li><strong>Custom Content:</strong> Text, icons, or custom snippets</li>
					<li><strong>Form Association:</strong> Can submit forms using form attribute</li>
				</ul>
			</div>

			<!-- Example FABs (positioned relative for demo) -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="relative flex h-32 items-center justify-center rounded-lg bg-gray-50">
					<span class="text-sm text-muted-foreground">Bottom Center</span>
					<div class="absolute bottom-4 left-1/2 -translate-x-1/2">
						<FloatingActionButton text="+" onclick={() => alert('Center FAB clicked!')} />
					</div>
				</div>

				<div class="relative flex h-32 items-center justify-center rounded-lg bg-gray-50">
					<span class="text-sm text-muted-foreground">Bottom Right</span>
					<div class="absolute right-4 bottom-4">
						<FloatingActionButton
							position="bottom-right"
							variant="secondary"
							onclick={() => alert('Right FAB clicked!')}
						>
							{#snippet children()}
								<Settings class="h-5 w-5" />
							{/snippet}
						</FloatingActionButton>
					</div>
				</div>

				<div class="relative flex h-32 items-center justify-center rounded-lg bg-gray-50">
					<span class="text-sm text-muted-foreground">Bottom Left</span>
					<div class="absolute bottom-4 left-4">
						<FloatingActionButton
							position="bottom-left"
							variant="destructive"
							text="DEL"
							onclick={() => alert('Delete FAB clicked!')}
						/>
					</div>
				</div>
			</div>

			<div class="text-xs text-muted-foreground">
				<strong>Note:</strong> In real usage, FABs are positioned fixed to the viewport, not relative
				to their container.
			</div>
		</div>
	</section>

	<!-- Example 7: Individual Form Field Examples -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">7. Individual Form Field Examples</h2>
		<p class="text-sm text-muted-foreground">
			Examples of all individual form field components with different configurations.
		</p>

		<div class="space-y-6 rounded-lg border p-6">
			<!-- TextField Variations -->
			<div class="space-y-4">
				<h3 class="font-medium">TextField Variations</h3>
				<div class="grid gap-4">
					<TextField form={{}} formData={{}} name="basic" label="Basic Text Field" />
					<TextField
						form={{}}
						formData={{}}
						name="email"
						label="Email Field"
						type="email"
						placeholder="user@example.com"
						required
					/>
					<TextField
						form={{}}
						formData={{}}
						name="password"
						label="Password Field"
						type="password"
						required
					/>
					<TextField
						form={{}}
						formData={{}}
						name="url"
						label="URL Field"
						type="url"
						placeholder="https://example.com"
					/>
				</div>
			</div>

			<!-- CheckableField Variations -->
			<div class="space-y-4">
				<h3 class="font-medium">CheckableField Variations</h3>
				<div class="space-y-4">
					<CheckableField
						form={{}}
						formData={{}}
						name="checkbox1"
						label="Standard Checkbox"
						style="checkbox"
					/>
					<CheckableField
						form={{}}
						formData={{}}
						name="switch1"
						label="Switch Style"
						style="switch"
						description="This uses a switch instead of checkbox"
					/>
					<CheckableField
						form={{}}
						formData={{}}
						name="background1"
						label="With Background"
						style="checkbox"
						withBackground={true}
						description="This checkbox has a background highlight"
					/>
				</div>
			</div>

			<!-- ComboboxField Variations -->
			<div class="space-y-4">
				<h3 class="font-medium">ComboboxField Variations (Responsive)</h3>
				<div
					class="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-muted-foreground"
				>
					<p><strong>📱 Responsive Behavior:</strong></p>
					<ul class="mt-1 list-inside list-disc space-y-1">
						<li><strong>Desktop:</strong> Shows as popover dropdown (current view)</li>
						<li>
							<strong>Mobile:</strong> Shows as drawer from bottom (resize your browser to see!)
						</li>
					</ul>
				</div>
				<div class="grid gap-4">
					<ComboboxField
						form={{}}
						formData={{}}
						name="language1"
						label="Language (Searchable)"
						options={languages}
						placeholder="Select language..."
						searchable={true}
					/>
					<ComboboxField
						form={{}}
						formData={{}}
						name="language2"
						label="Language (No Search)"
						options={languages}
						placeholder="Choose language..."
						searchable={false}
						width="w-[250px]"
					/>
					<ComboboxField
						form={{}}
						formData={{}}
						name="language3"
						label="Custom Breakpoint"
						options={categories}
						placeholder="Select category..."
						searchable={true}
						breakpoint="(min-width: 1024px)"
						description="This combobox switches to drawer mode at 1024px instead of 768px"
					/>
				</div>
			</div>

			<!-- DynamicField Variations -->
			<div class="space-y-4">
				<h3 class="font-medium">DynamicField Variations</h3>
				<div class="space-y-4">
					<DynamicField
						form={{}}
						formData={{}}
						name="urls"
						legend="Website URLs"
						fieldType="url"
						placeholder="https://example.com"
						minItems={1}
						maxItems={5}
					/>
					<DynamicField
						form={{}}
						formData={{}}
						name="skills"
						legend="Skills"
						fieldType="text"
						placeholder="Enter a skill"
						addButtonText="Add Skill"
						minItems={2}
						maxItems={10}
					/>
					<DynamicField
						form={{}}
						formData={{}}
						name="notes"
						legend="Notes"
						fieldType="textarea"
						placeholder="Enter a note..."
						rows={3}
						minItems={0}
						maxItems={3}
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- Example 8: Best Practices -->
	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">8. Best Practices & Tips</h2>

		<div class="rounded-lg border p-6">
			<div class="prose prose-sm max-w-none">
				<h3>When to use BaseForm vs Manual Setup:</h3>
				<ul>
					<li>
						<strong>Use BaseForm for:</strong> Simple CRUD forms, user registration/login, settings forms
					</li>
					<li>
						<strong>Use Manual Setup for:</strong> Multi-step wizards, forms with complex real-time validation,
						forms with external API integration
					</li>
				</ul>

				<h3>Form Field Guidelines:</h3>
				<ul>
					<li>Always provide clear labels and helpful descriptions</li>
					<li>Use appropriate input types (email, url, tel, etc.)</li>
					<li>Provide placeholders for better UX</li>
					<li>Mark required fields clearly</li>
					<li>Use CheckableField with switch style for settings/preferences</li>
					<li>Use ComboboxField for searchable dropdowns with many options</li>
					<li>Use DynamicField for arrays of similar data (tags, URLs, etc.)</li>
				</ul>

				<h3>Mobile FAB (Floating Action Button):</h3>
				<ul>
					<li>Enabled by default for better mobile UX - submit button floats at bottom center</li>
					<li>Automatically disabled on desktop (≥768px) - shows normal submit button</li>
					<li>Disable with <code>mobileFAB={false}</code> if you prefer traditional buttons</li>
					<li>Customize breakpoint with <code>breakpoint</code> prop</li>
					<li>FAB shows checkmark (✓) for long submit text, or the actual text if ≤3 characters</li>
				</ul>

				<h3>ComboboxField Responsive Behavior:</h3>
				<ul>
					<li>
						Automatically switches between popover (desktop) and Command.Dialog (mobile) at 768px
					</li>
					<li>Customize breakpoint with the <code>breakpoint</code> prop</li>
					<li>Mobile Command.Dialog provides smooth, native-like interaction</li>
					<li>Built-in search functionality works seamlessly in both modes</li>
				</ul>

				<h3>DialogResponsive Usage:</h3>
				<ul>
					<li>Use for forms that don't need a full page (quick actions, settings)</li>
					<li>Provide custom triggers for better integration with your UI</li>
					<li>Remember it automatically becomes a drawer on mobile</li>
					<li>Use the footer snippet for custom action buttons</li>
				</ul>

				<h3>FloatingActionButton Best Practices:</h3>
				<ul>
					<li>Use for primary actions that should always be accessible (create, save, etc.)</li>
					<li>Limit to one FAB per screen to avoid overwhelming the user</li>
					<li>Consider <code>hideOnScroll={true}</code> for content-heavy pages</li>
					<li>Use <code>position="bottom-right"</code> for right-handed users (most common)</li>
					<li>Keep content simple - single icon or short text (≤3 characters)</li>
					<li>
						Use <code>form</code> attribute to associate with forms instead of complex click handlers
					</li>
				</ul>

				<h3>TypeScript Tips:</h3>
				<ul>
					<li>Always define your Zod schemas with proper validation</li>
					<li>Use the generated types from your schema</li>
					<li>The BaseForm component provides full type safety for SuperForms config</li>
				</ul>
			</div>
		</div>
	</section>
</div>

<style>
	/* Add any custom styles here if needed */
	.prose ul {
		@apply list-inside list-disc space-y-1;
	}

	.prose h3 {
		@apply mt-4 mb-2 font-semibold;
	}
</style>
