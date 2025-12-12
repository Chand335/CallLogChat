# Design Guidelines: Mobile Call Log & WhatsApp Messenger Web App

## Design Approach
**Design System**: Material Design 3 (Material You)
**Rationale**: Mobile-first utility application requiring clear touch targets, efficient list patterns, and intuitive navigation. Material Design provides proven patterns for mobile app interfaces with emphasis on usability and accessibility.

## Core Design Principles
1. **Mobile-First**: All layouts optimized for phone screens (320px-428px), then scale up
2. **Touch-Friendly**: Minimum 44px tap targets, generous spacing between interactive elements
3. **Information Clarity**: Clear hierarchy for contact names, numbers, timestamps, and call types
4. **Quick Actions**: Easy access to WhatsApp messaging without friction

## Typography System
- **Primary Font**: Inter or Roboto via Google Fonts
- **Hierarchy**:
  - Contact Names: text-lg font-semibold (18px)
  - Phone Numbers: text-base font-normal (16px)
  - Timestamps/Meta: text-sm (14px)
  - Call Type Labels: text-xs font-medium uppercase (12px)
  - Screen Titles: text-2xl font-bold (24px)

## Layout & Spacing System
**Tailwind Units**: Use 2, 4, 6, 8, 12, 16 for consistency
- Component padding: p-4
- List item spacing: py-3 px-4
- Section gaps: space-y-4
- Screen padding: px-4 py-6
- Card spacing: gap-6

## Component Library

### App Shell
- **Header Bar**: Fixed top, h-14, flex items-center justify-between px-4
  - App title/logo on left
  - Search icon on right
- **Bottom Navigation** (if multi-screen): Fixed bottom, h-16, safe-area padding

### Call Log List
- **List Container**: Full-width, space-y-2
- **List Item Card**: 
  - Rounded corners (rounded-lg)
  - Shadow (shadow-sm)
  - Padding: px-4 py-3
  - Flex layout with space-between
  - Tap highlight on press
  
- **Item Structure**:
  - Left: Contact initial avatar circle (w-10 h-10)
  - Center: Contact name (font-semibold), phone number below, timestamp (text-xs)
  - Right: Call type icon + WhatsApp action button

### Action Buttons
- **Primary (WhatsApp)**: Rounded-full, px-6 py-2.5, font-medium, min-w-[44px] min-h-[44px]
- **Floating Action Button (FAB)**: Fixed bottom-right (bottom-20 right-4), w-14 h-14, rounded-full, shadow-lg
  - Use for "Add Call Log" action
- **Icon Buttons**: w-10 h-10, rounded-full, centered icon

### Forms (Add/Edit Call Log)
- **Modal/Sheet**: Slide up from bottom, rounded-t-2xl, p-6
- **Input Fields**: 
  - Full-width, h-12, rounded-lg, px-4
  - Label above (text-sm font-medium, mb-2)
  - Focus ring on interaction
- **Spacing**: space-y-4 between fields
- **Submit Button**: Full-width, h-12, rounded-lg, font-semibold

### WhatsApp Message Customizer
- **Textarea**: min-h-[120px], rounded-lg, p-4, resize-none
- **Character Counter**: text-xs, text-right, mt-1
- **Template Variables**: Chips/tags showing {name}, {number} insertions
- **Send Button**: Prominent, full-width or fixed bottom

### Search & Filter
- **Search Bar**: h-10, rounded-full, px-4, with search icon left
- **Filter Pills**: Inline-flex, rounded-full, px-3 py-1, text-sm, gap-2

### Empty States
- **Container**: Centered, py-16, flex-col items-center
- **Icon**: w-16 h-16, opacity-50
- **Message**: text-base, mt-4, text-center
- **CTA**: mt-6, primary button

## Icons
**Library**: Material Icons via CDN
- Call types: phone_outgoing, phone_incoming, phone_missed
- WhatsApp: WhatsApp logo (use Font Awesome brand icons)
- Actions: add, search, filter_list, more_vert
- Forms: person, phone, message

## Layout Patterns

### Main Screen
```
[Fixed Header with title + search]
[Search bar - collapsible]
[Call log list - scrollable]
  - Each item: Avatar | Name, Number, Time | WhatsApp button
  - Swipe actions optional
[FAB: Add Call Log]
```

### Add Call Entry
```
[Modal Header: "Add Call Log" + Close]
[Form Fields - scrollable]
  - Contact Name input
  - Phone Number input
  - Call Type selector (incoming/outgoing/missed)
  - Date/Time picker
[Save Button - fixed bottom]
```

### WhatsApp Message Screen
```
[Header: Contact Name + Number]
[Message Template Textarea]
[Template Variables chips]
[Character count]
[Preview section]
[Send to WhatsApp button - prominent]
```

## Responsive Behavior
- **Mobile (320px-768px)**: Single column, full-width components
- **Tablet (768px+)**: Max-width container (max-w-md mx-auto), centered layout
- **Desktop (1024px+)**: Same max-width, centered, boxed appearance

## Animations
**Minimal and Purposeful**:
- List item tap: Scale 0.98 on press
- Modal entry: Slide up with ease-out
- FAB: Subtle elevation change on hover
- Loading states: Simple spinner or skeleton screens
- NO scroll animations, parallax, or decorative motion

## Touch Interactions
- **Tap targets**: Minimum 44x44px
- **List items**: Full-width tappable area
- **Swipe gestures**: Optional swipe-to-delete on list items
- **Pull-to-refresh**: Standard mobile pattern
- **Safe areas**: Respect mobile notches and navigation bars

## Images
**No hero images** - This is a utility app, not marketing.
**Avatar Placeholders**: Use initials in circular backgrounds for contacts without photos.

This design prioritizes speed, clarity, and ease of use on mobile devices with a clean, functional interface optimized for daily utility tasks.