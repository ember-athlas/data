# Data Components

**Table of Contents**

1. Components
	1. Table
	2. List
	3. Data Manager
	4. ActionPart
2. References
	1. {{data-table}}
	2. {{data-list}}
	3. {{data-manager}}

## Components

Sample data for the examples below:

```js
let people = [
	{
		givenName: 'Anakin',
		familyName: 'Skywalker',
		email: 'kingdarth@deathstar.space',
		avatarUrl: 'https://blubb.com/foo.jpg'
	},
	{
		givenName: 'Luke',
		familyName: 'Skywalker',
		email: 'luke@maytheforcebewith.you',
		avatarUrl: 'https://blubb.com/bar.jpg'
	},
	{
		givenName: 'Padme',
		familyName: 'Amidala',
		email: 'senator@naboo.space',
		avatarUrl: 'https://blubb.com/baz.jpg'
	}
];
```

### Table

The table component for rendering tabular data. Example:

```javascript
{{#data-table items=people as |table person|}}
	{{#table.column as |col|}}
		{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
		<img src={{person.avatarUrl}}>
	{{/table.column}}

	{{#table.column label='Name'}}
		{{person.givenName}} {{person.familyName}}
	{{/table.column}}

	{{table.column lable='Email' property='email'}}
{{/data-table}}
```

The same example could be written in a more verbose syntax.

```javascript
{{#data-table items=people as |table|}}
  {{#table.head as |head|}}
    {{#head.column}}
      <i class="fa fa-user"></i>
    {{/head.column}}

    {{head.column label='Name'}}

    {{head.column label='Email' property='email'}}
  {{/table.head}}

  {{#table.body as |person row|}}
    {{#row.cell}}
      <img src={{person.avatarUrl}}>
    {{/row.cell}}

    {{#row.cell}}
      {{person.givenName}} {{person.familyName}}
    {{/row.cell}}

    {{row.cell}} {{!gets 'property' from cell to column mapping}}
  {{/table.body}}

{{/data-table}}
```

Although the syntax is a bit more redundant, it offers more freedom for interaction, which can be necessary sometimes.

#### Expanded Rows

Rows can be expanded:

```javascript
{{#data-table items=people as |table person row|}}
	{{#table.column width="30px"}}
		<i class="fa fa-fw cursor-pointer fa-chevron-{{if row.open 'down' 'right'}}" {{action row.toggle}}></i>
	{{/table.column}}

	{{#table.column as |col|}}
		{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
		<img src={{person.avatarUrl}}>
	{{/table.column}}

	{{#table.column label='Name'}}
		{{person.givenName}} {{person.familyName}}
	{{/table.column}}

	{{table.column lable='Email' property='email'}}

	{{#row.expanded}}
	<td colspan="4">Some more content which can be displayed about a person here</td>
	{{/row.expanded}}
{{/data-table}}
```

### List

The list component renders a regular list of items. Simple and straight forward.

```javascript
{{#data-list items=people as |person|}}
	<img src={{person.avatarUrl}}>
	{{person.givenName}} {{person.familyName}}
	&lt;{{person.email}}&gt;
{{/data-list}}
```

### Data Manager
The data manager is an invisible components providing the following capabilities:

- Filtering
- Sorting
- Selection
- Active Item

#### Data Flow
Data manager receives a list of items and itself provides sorted and filtered items of that (they are a computed property). The data flows as follows:

1. items
2. filteredItems
3. sortedItems

Whenever a superior item set changes, the depending steps follow subsequently.

**Example**

```javascript
{{#data-manager items=people as |data|}}
	{{#data-table
		items=data.sortedItems
		sortDescriptor=data.sortDescriptor
		sortChanged=(action data.sortItems)
		as |table person|}}

		{{#table.column as |col|}}
			{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
			<img src={{person.avatarUrl}}>
		{{/table.column}}

		{{#table.column label='Name'}}
			{{person.givenName}} {{person.familyName}}
		{{/table.column}}

		{{table.column lable='Email' property='email' sortable=true}}
	{{/data-table}}
{{/data-manager}}
```

In this example, people are sorted on their email (which, for sure, makes absolutely sense!). Whenever the email column is clicked, the `sortDescriptor` is changed accordingly and the passed `sortChanged` on the table is triggered, which itself is rooted forward to the `{{data-manager}}` and the computed property `data.sortedItems` is updated.

The `{{data-manager}}` is capable of manipulating the data itself, hence following DDAU, the changes can be triggered up.

**Example**

```javascript
// template.hbs
{{#data-manager
	items=people
	sortDescriptor=sortDescriptor
	sortChanged=(action 'sortChanged')
	as |data|}}

	...
{{/data-manager}}

// controller.js
export default Ember.Controller.extend({
	sortDescriptor: {
		'email': 'asc'
	},

	actions: {
		sortChanged(desc) {
			this.set('sortDescriptor', desc);
		}
	}
});
```
#### Selecting items

Selecting items is also managed within the `{{data-manager}}`. It is necessary to understand the difference between an active item and the selection. As long as the collection has items, there is an active item present, which is also moved when using keyboard navigation. Similarly to sorting and filtering, the data-manager keeps track of the itself or can trigger changes up.

**Example 1: {{data-manager}} managing selection**

```javascript
{{#data-manager
	items=people
	as |data|}}
	{{#data-table
		items=data.sortedItems
		selection=data.selection
		activeItem=data.activeItem
		selectionChanged=(action data.changeSelection)
		activeItemChanged=(action data.changeActiveItem)
		sortChanged=(action data.sortItems)
		as |table person|}}

		{{#table.column as |col|}}
			{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
			<img src={{person.avatarUrl}}>
		{{/table.column}}

		{{#table.column label='Name'}}
			{{person.givenName}} {{person.familyName}}
		{{/table.column}}

		{{table.column lable='Email' property='email' sortable=true}}
	{{/data-table}}
{{/data-manager}}
```

**Example 2: {{data-manager}} passes on selection management**

```javascript
// template.hbs
{{#data-manager
	items=people
	selection=selection
	selectionChanged=(action 'selectionChanged')
	as |data|}}
	{{#data-table
		items=data.sortedItems
		selection=data.selection
		activeItem=data.activeItem
		selectionChanged=(action data.changeSelection)
		activeItemChanged=(action data.changeActiveItem)
		sortChanged=(action data.sortItems)
		as |table person|}}

		{{#table.column as |col|}}
			{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
			<img src={{person.avatarUrl}}>
		{{/table.column}}

		{{#table.column label='Name'}}
			{{person.givenName}} {{person.familyName}}
		{{/table.column}}

		{{table.column lable='Email' property='email' sortable=true}}
	{{/data-table}}
{{/data-manager}}

// controller.js
export default Ember.Controller.extend({
	selection: [],

	selectedItem: Ember.computed('selection.[]', function() {
		if (this.get('selection.length') > 0) {
			return this.get('selection.lastObject');
		}
		return null;
	}),

	actions: {
		selectionChanged(selection) {
			this.set('selection', selection);
		}
	}
});
```

### ActionPart

The ActionPart is a component which has a control on one side and buttons on the other. Typically the buttons trigger actions, which manipulate the items in the control. Thus, the `{{action-part}}` extends `{{data-manager}}` to manage items.

**Example**

```javascript
// template.hbs
{{#action-part items=people as |ap|}}
	{{#ap.control class="table-sm" as |table person|}}
		{{#table.column as |col|}}
			{{#col.header}}<i class="fa fa-user"></i>{{/col.header}}
			<img src={{person.avatarUrl}}>
		{{/table.column}}

		{{#table.column label='Name'}}
			{{person.givenName}} {{person.familyName}}
		{{/table.column}}

		{{table.column lable='Email' property='email'}}
	{{/ap.control}}

	{{#ap.actions}}
		{{#ap.button action=(action 'addPerson')}}<i class="fa fa-plus"></i>{{/ap.button}}
		{{#ap.button bound=true action=(action 'removePerson')}}<i class="fa fa-minus"></i>{{/ap.button}}
	{{/ap.actions}}
{{/action-part}}

// controller.js
export default Ember.Controller.extend({
	people: [...],

	actions: {
		addPerson()
			const person = {...};

			this.get('people').pushObject(person);
		},

		removePerson(person) {
			this.get('people').removeObject(person);
		}
	}
});
```

Buttons can be bound to a selectedItem in the control and will be enabled/disabled whenever the selection changes.

## References

### {{data-table}}

#### Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `activeItem` | `<T>` | `null` | Active item |
| `activeItemChanged` | `function` | `null` | Active item changed listener |
| `fixed` | `boolean` | `false` | Sticky header or not |
| `highlightActive` | `boolean` | `false` | Highlight active row |
| `highlightSelected` | `boolean` | `true` | Highlight selected rows |
| `itemClicked` | `function` | `null` | Item clicked listener |
| `itemDoubleClicked` | `function` | `null` | Item double clicked listener |
| `items` | `array<T>` | `[]` | Items for the table |
| `selection` | `array<T>` | `[]` | Selected items |
| `selectionChanged` | `function` | `null` | Selection changed listener |
| `selectEnabled` | `boolean` | `true` | Enable selection |
| `selectMultiple` | `boolean` | `false` | Enable multi select |
| `sortChanged` | `function` | `null` | Sort changed listener |
| `sortDescriptor` | `object` | `{}` | Sort descriptor |
| `sortMultiple` | `boolean` | `false` | Whether multiple columns can be sorted |

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `table` | `hash` | Hash to access sub components |
| 2* | `item` | `<T>` | Iterated item |
| 3* | `row` | `hash` | `{{data-table/row}}` component yield |

\* Optional (When iterated over items and not in extended mode)

**`table`**

| Property | Type | Description |
|----------|------|-------------|
| `column` | Component | The `{{data-table/column}}` component |
| `head` | Component | The `{{data-table/head}}` component |
| `body` | Component | The `{{data-table/body}}` component |


### {{data-table/column}}

#### Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cellClass` | `string` | `null` | CSS classes for the cell |
| `columnClass` | `string` | `null` | CSS classes for the column |
| `label` | `string` | `null` | Label for the column |
| `property` | `string` | `null` | The property of the item of the column |
| `sortable` | `boolean` | `false` | Sortable column or not |
| `width` | `string` | `null` | CSS value for the width of the column |

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `column` | `hash` | Hash to access sub components |

**`column`**

| Property | Type | Description |
|----------|------|-------------|
| `header` | Block | A block for the column header |

### {{data-table/head}}

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `head` | `hash` | Hash to access sub components |

**`head`**

| Property | Type | Description |
|----------|------|-------------|
| `column` | Component | The `{{data-table/head/column}}` component |

### {{data-table/head/column}}

#### Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `label` | `string` | `null` | Label for the column |
| `property` | `string` | `null` | The property of the item of the column |
| `sortable` | `boolean` | `false` | Sortable column or not |
| `width` | `string` | `null` | CSS value for the width of the column |

### {{data-table/body}}

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `item` | `<T>` | Iterated item |
| 2 | `row` | `hash` | `{{data-table/row}}` component `row` yield |

### {{data-table/row}}

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `row` | `hash` | Hash |

**`row`**

| Property | Type | Description |
|----------|------|-------------|
| `cell` | Component | The `{{data-table/cell}}` component |
| `expanded` | Block | A block for the expanded content |
| `open` | `boolean` | Whether the row is expanded or not |
| `toggle` | `function` | Function to toggle the open state |


### {{data-table/cell}}

#### Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `property` | `string` | `null` | The property of the item of the column |
| `width` | `string` | `null` | CSS value for the width of the column |

### {{data-list}}

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `activeItem` | `<T>` | `null` | Active item |
| `activeItemChanged` | `function` | `null` | Active item changed listener |
| `highlightActive` | `boolean` | `false` | Highlight active row |
| `highlightSelected` | `boolean` | `true` | Highlight selected rows |
| `itemClicked` | `function` | `null` | Item clicked listener |
| `itemDoubleClicked` | `function` | `null` | Item double clicked listener |
| `items` | `array<T>` | `[]` | Items for the table |
| `selection` | `array<T>` | `[]` | Selected items |
| `selectionChanged` | `function` | `null` | Selection changed listener |
| `selectEnabled` | `boolean` | `true` | Enable selection |
| `selectMultiple` | `boolean` | `false` | Enable multi select |

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `item` | `<T>` | Iterated item |

### {{data-manager}}

#### Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `activeItem` | `<T>` | `null` | Active item |
| `activeItemChanged` | `function` | `null` | Active item changed listener |
| `filterChanged` | `function` | `null` | Filter changed listener |
| `filterDescriptor` | `object` | `{}` | Filter descriptor |
| `items` | `array<T>` | `[]` | Items for the table |
| `selection` | `array<T>` | `[]` | Selected items |
| `selectionChanged` | `function` | `null` | Selection changed listener |
| `selectEnabled` | `boolean` | `true` | Enable selection |
| `selectMultiple` | `boolean` | `false` | Enable multi select |
| `sortChanged` | `function` | `null` | Sort changed listener |
| `sortDescriptor` | `object` | `{}` | Sort descriptor |
| `sortMultiple` | `boolean` | `false` | Whether multiple columns can be sorted |

#### Yield

| Position | Name | Type | Description |
|----------|------|------|-------------|
| 1 | `data` | `hash` | Hash with access to properties |

**`data`**

| Property | Type | Description |
|----------|------|-------------|
| `activeItem` | `<T>` | The active item |
| `changeActiveItem` | `function` | Changes active item |
| `changeSelection` | `function` | Changes selection |
| `filteredItems` | `array<T>` | The filtered items |
| `filterDescriptor` | `object` | The filter descriptor |
| `filterItems` | `function` | Filters items |
| `selection` | `array<T>` | Selected items |
| `selectEnabled` | `boolean` | Whether selection is enabled |
| `selectMultiple` | `boolean` | Whether multi selection is enabled |
| `sortedItems` | `array<T>` | The sorted items |
| `sortDescriptor` | `object` | The sort descriptor |
| `sortItems` | `function` | Sorts items |
| `sortMultiple` | `boolean` | Whether multiple columns can be sorted |

### {{action-part}}

.... oah, ich glaub... das teil hier muss nochn bissi umgebaut werden. Besser ist hier vlt. auch ne invisible component.

## Literature

- Desai, D. (2017). <i><a href="https://www.youtube.com/watch?v=M6MHWgHjoJs">Design Considerations for a Modern Data Table</a></i>
