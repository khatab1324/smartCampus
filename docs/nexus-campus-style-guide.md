# Nexus Campus Style Guide

This document now follows the actual Stitch-generated screen for the Smart Campus Attendance System project.

## Stitch Source

- Project: `138199090489878614`
- Project name: `Smart Campus Attendance System`
- Screen: `e9e8b376f483405db2822bec4df43c24`
- Screen title: `Mobile Style Guide`

Use the Stitch screen above as the visual source of truth. This file mirrors the structure and styling that Stitch exported.

## Screen Structure

The current Stitch style guide is organized in this order:

1. Fixed top app bar
2. Hero section
3. Typography
4. Color palette
5. Buttons
6. Status badges
7. Session card
8. Input fields
9. Fixed bottom navigation

## Core Tokens

### Color

- `primary`: `#0058BC`
- `primary_container`: `#0070EB`
- `secondary`: `#405E96`
- `tertiary`: `#9E3D00`
- `error`: `#BA1A1A`
- `surface`: `#F9F9FF`
- `surface_container_low`: `#F1F3FE`
- `surface_container_lowest`: `#FFFFFF`
- `surface_container_high`: `#E6E8F3`
- `surface_container_highest`: `#E0E2ED`
- `on_surface`: `#181C23`
- `on_surface_variant`: `#414755`
- `outline_variant`: `#C1C6D7`

### Radius

- Standard small radius: `4px`
- Card radius: `16px`
- Large shell radius: `24px`
- Pill radius: `9999px`

### Typography

- Display / H1: `2.75rem`, extra bold, tighter tracking
- Headline / H2: `1.5rem`, bold
- Title / H3: `1.125rem`, semibold
- Body: `0.875rem`
- Label / Caption: `0.75rem`
- Font family: `Inter`

### Elevation

- Main raised card shadow: `0 12px 32px rgba(24, 28, 35, 0.06)`
- Top bar: soft shadow with heavy backdrop blur
- Bottom nav: soft upward shadow with heavy backdrop blur

## Component Rules

### Top App Bar

- Fixed at the top of the screen.
- Use a translucent light surface with strong blur.
- Height is `64px`.
- Horizontal padding is `24px`.
- Left side contains the menu icon and the `Smart Campus` wordmark in blue.
- Right side contains a circular profile avatar inside a soft tonal shell.

### Hero Section

- Eyebrow label uses `tertiary`, uppercase, and wide tracking.
- Hero title is `Fluid Academic`.
- Supporting text is body-sized and muted with `on_surface_variant`.
- This section introduces the design system rather than app functionality.

### Typography Section

- Wrap the typography examples inside a `surface_container_low` card.
- Show type role labels in small mono-like metadata text.
- Demonstrate exactly these scales:
  - `DISPLAY-MD (2.75rem)`
  - `HEADLINE-SM (1.5rem)`
  - `TITLE-LG (1.125rem)`
  - `BODY-MD (0.875rem)`
  - `LABEL-MD (0.75rem)`

### Color Palette

- Present colors in a two-column grid.
- Each swatch uses a rounded tile with the hex value aligned at the bottom.
- The current Stitch screen shows:
  - Primary Blue
  - Warning Orange
  - Success Slate
  - Error Red

### Buttons

- Buttons sit inside a `surface_container_low` card.
- Primary button:
  - Full width
  - Gradient from `primary` to `primary_container`
  - White text
  - Full pill radius
  - Includes trailing icon
- Secondary button:
  - Full width
  - `primary_fixed` background
  - Dark text
  - Full pill radius
- Tertiary button:
  - Transparent background
  - `primary` text
  - Full pill radius

### Status Badges

- Use pill badges with uppercase text and wide tracking.
- Each badge includes a small leading dot.
- Current badge states shown by Stitch:
  - `Present`: primary-toned
  - `Late`: tertiary-toned with pulsing dot
  - `Absent`: error-toned

### Session Card

- Use `surface_container_lowest` as the card background.
- Use `16px` radius and a soft ambient shadow.
- Apply only a very light ghost border.
- Structure:
  - Small tertiary eyebrow: `Active Now`
  - Bold session title
  - Muted metadata row for room and time
  - Tonal icon tile on the right
  - Progress bar
  - Footer row for metric label and completion value
- The current Stitch example uses:
  - `Data Structures 101`
  - `Room 402 • 09:30 AM`
  - `Attendance Rate`
  - `78% Complete`

### Input Fields

- Inputs sit inside a `surface_container_low` card.
- Use the plinth style rather than boxed outlines.
- Field shell uses `surface_container_high`.
- Use a bottom border highlight instead of a full outline.
- Left icon is embedded inside the field.
- Top label is small, uppercase, and muted.

### Bottom Navigation

- Fixed to the bottom of the screen.
- Use a translucent white surface with strong blur.
- Top corners use a `24px` radius.
- Items are vertically stacked icon + label.
- Labels are uppercase and very small.
- The active item is blue and uses a small orange indicator dot.
- Current Stitch nav labels:
  - `Dashboard`
  - `Sessions`
  - `Styleguide`
  - `Profile`

## Shared Reuse Guidance

Use the Stitch style guide patterns across the existing mobile screens:

- `Doctor Dashboard`, `Student Home Screen`, and `Account Screen` should reuse the same top app bar and bottom navigation treatment.
- `Live Attendance (Real-time)`, `Lecture Details`, and `Attendance History` should reuse the same session-card shell, badge language, and muted metadata formatting.
- `Create Lecture` and `Login Screen` should reuse the same input-field treatment and the same button family.
- Any new status state should extend the existing badge system before introducing a new chip style.

## What Changed From The Earlier Draft

- The earlier local guide described a broader component library than the Stitch screen actually generated.
- This file now follows the exported Stitch screen closely instead of documenting unrendered patterns.
- Components not currently shown in the Stitch screen, such as filter chips, empty states, or attendance rows, should not be treated as first-class shared patterns until they are generated or approved.

## Practical Rule

When editing or generating new screens, match the existing Stitch style guide first:

- same color tokens
- same radii
- same type scales
- same blurred chrome for top and bottom navigation
- same button family
- same badge language
- same session-card shell
- same plinth-style inputs
