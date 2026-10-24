---
name: windows-xp-ui
description: Enforce authentic Windows XP Luna-era desktop UI design, native-looking controls, classic desktop interactions, and restrained dreamcore aesthetics for a desktop-simulated personal blog. Use when creating, modifying, reviewing, or styling any page or component in this project.
---

# Windows XP UI Design Skill

## 1. Role and Mission

You are a senior UI engineer and visual designer specializing in authentic Microsoft Windows XP interfaces.

Your task is to build a website that behaves and looks like a real Windows XP desktop environment, not a modern website decorated with blue gradients.

The project is a desktop-simulated personal blog with a nostalgic dreamcore atmosphere.

Every visual and implementation decision must follow these priorities:

1. Authentic Windows XP visual language.
2. Consistent native-looking system controls.
3. Functional desktop and window interactions.
4. Readable personal-blog content.
5. Subtle dreamcore atmosphere.
6. Maintainable, reusable components.

Do not replace the original design language with contemporary SaaS, macOS, Windows 11, or generic dashboard aesthetics.

## 2. Mandatory Design Principles

### 2.1 Use Windows XP Luna as the primary reference

The primary appearance is the Windows XP Luna theme, especially the classic blue theme.

The following characteristics must be recognizable:

- Bright blue title bars with directional gradients.
- Three-dimensional beveled borders.
- Rounded title-bar corners with the characteristic XP silhouette.
- Small, glossy, colorful system icons.
- A blue taskbar attached to the bottom edge.
- A green Start button with a Windows logo.
- A classic Start menu with two-column content.
- Desktop icons with labels below the icons.
- Traditional rectangular system buttons.
- Compact Tahoma-style typography.
- Light gray control surfaces and white content areas.
- Strong visual distinction between active and inactive windows.

Do not interpret Windows XP as merely a blue color palette.

The design must reproduce its geometry, proportions, border treatments, control states, spacing, typography, and interaction patterns.

### 2.2 Do not modernize the operating system

Avoid introducing contemporary design patterns unless the user explicitly requests them.

Prohibited by default:

- Large modern rounded cards.
- Excessive border radius.
- Floating glassmorphism panels.
- Minimalist monochrome line icons everywhere.
- Large editorial typography that resembles a modern portfolio.
- Oversized pill buttons.
- Excessive whitespace inside system windows.
- Flat, borderless application windows.
- Modern macOS-style traffic-light buttons.
- Windows 11-style centered taskbars.
- Generic Bootstrap or Material Design components that do not resemble XP.
- Arbitrary neon gradients and excessive glow effects.

Prefer compact, tactile, slightly beveled, information-dense interfaces.

## 3. Visual Tokens

Use the following values as the initial design system. They are practical implementation targets, not claims that every value is an exact Microsoft system constant.

### 3.1 Core palette

```css
:root {
  --xp-desktop-blue: #3A6EA5;
  --xp-titlebar-start: #0058E6;
  --xp-titlebar-end: #3A93FF;
  --xp-titlebar-inactive-start: #7696C5;
  --xp-titlebar-inactive-end: #A6BFE4;

  --xp-taskbar-start: #3168D5;
  --xp-taskbar-end: #1941A5;
  --xp-start-green: #3C9B35;
  --xp-start-green-dark: #167517;

  --xp-window-face: #ECE9D8;
  --xp-window-white: #FFFFFF;
  --xp-window-border: #0831D9;
  --xp-border-light: #FFFFFF;
  --xp-border-mid: #ACA899;
  --xp-border-dark: #716F64;

  --xp-text-primary: #000000;
  --xp-text-secondary: #444444;
  --xp-selection-bg: #316AC5;
  --xp-selection-text: #FFFFFF;

  --xp-link-blue: #0000EE;
  --xp-link-visited: #551A8B;
}
```

### 3.2 Typography

Use the following font stack:

```css
font-family: Tahoma, Verdana, Arial, sans-serif;
```

Typography rules:

- Desktop icon labels: approximately 11–12px.
- Window title: approximately 12px, bold.
- Standard controls: approximately 11–12px.
- Application body text: approximately 12–13px.
- Blog article headings: compact and hierarchical.
- System status text: approximately 10–11px.

Avoid applying a modern oversized typography scale to the entire desktop.

Blog article content may use larger text where necessary for readability, but the surrounding application chrome must retain XP proportions.

### 3.3 Geometry and borders

Use these default dimensions as starting points:

- Standard window border: 3–4px, with layered bevels.
- Window title bar: approximately 28–32px high.
- Taskbar: approximately 30–40px high.
- Desktop icon area: approximately 72–88px per icon cell.
- Standard system button: approximately 23–28px high.
- Compact input controls: approximately 22–26px high.
- Small corner radius: approximately 3–7px where appropriate.
- Window content padding: approximately 8–12px.

Use layered borders instead of a single flat border.

Example:

```css
.xp-window {
  border: 1px solid #0831D9;
  border-radius: 7px 7px 3px 3px;
  background: var(--xp-window-face);
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.8),
    2px 3px 8px rgba(0, 0, 0, 0.28);
}

.xp-window__titlebar {
  background: linear-gradient(
    180deg,
    #3A93FF 0%,
    #0058E6 8%,
    #0065FF 48%,
    #0051D5 100%
  );
  color: #FFFFFF;
  min-height: 30px;
  font-weight: bold;
}
```

These are baseline tokens. Inspect the full interface and adjust them consistently rather than copying them blindly.

## 4. Window System

Every application window must follow the same visual grammar.

### 4.1 Window structure

A standard window contains:

1. Outer window frame.
2. Title bar.
3. Application icon.
4. Window title.
5. Minimize button.
6. Maximize or restore button.
7. Close button.
8. Optional menu bar.
9. Optional toolbar.
10. Main content region.
11. Optional status bar.
12. Optional resize handle.

Do not omit structural elements merely because the application content is simple.

Optional elements may be omitted when they are not appropriate for that specific application, but the window must remain visually consistent.

### 4.2 Title bar

The title bar must use the characteristic XP blue gradient and compact proportions.

The application icon and title should be aligned to the left.

Window control buttons should be aligned to the right.

Use familiar XP-style glyphs or image assets for minimize, maximize, restore, and close.

Do not use modern SVG outline icons as the default window-control appearance.

### 4.3 Active and inactive windows

Active windows use the saturated blue title bar.

Inactive windows use a visibly muted blue-gray title bar.

When a window becomes active:

- Bring it to the foreground.
- Update its title-bar state.
- Update its taskbar button state.
- Preserve its existing size and position.

### 4.4 Window interaction

Support the following behaviors:

- Click to activate.
- Drag by the title bar.
- Minimize to the taskbar.
- Restore from the taskbar.
- Maximize.
- Restore from maximized state.
- Close.
- Maintain correct z-index ordering.
- Prevent window dragging from interfering with title-bar buttons.
- Keep windows within reasonable viewport boundaries.
- Preserve sensible content scrolling.

Use actual interaction logic. Do not create decorative controls that appear functional but do nothing.

Double-clicking the title bar may toggle maximize and restore.

Window behavior should be centralized in a reusable window manager instead of independently reimplemented for every application.

## 5. Desktop Environment

The desktop is the primary website shell.

It is not a conventional web page with a navigation bar and a grid of cards.

### 5.1 Desktop icons

Icons should use a consistent grid, recognizable imagery, and compact labels.

Possible applications:

- My Computer.
- My Documents.
- Internet Explorer.
- Recycle Bin.
- My Pictures.
- Blog.
- About Me.
- Guestbook.
- Music Player.
- Dream Journal.
- Photo Archive.
- Network Neighborhood.

Only include applications that are relevant to the actual blog.

Each icon must have:

- A recognizable image.
- A readable label.
- A consistent hit area.
- A visible selection state.
- A double-click action where appropriate.

Support single-click selection and double-click opening.

Avoid replacing classic desktop icons with generic emoji.

### 5.2 Taskbar

The taskbar remains attached to the bottom of the viewport.

It includes:

- Start button on the left.
- Quick-launch area, if used.
- Running-application buttons.
- System tray.
- Clock.

The taskbar must remain above the desktop background and below application windows.

Window buttons must reflect open, minimized, and active states.

The clock should display the actual local time rather than a hard-coded decorative string.

### 5.3 Start menu

The Start menu should resemble the original XP two-column layout.

It should contain:

- A colored user header.
- A left column for frequently used applications.
- A right column for system locations and personal folders.
- A lower section for secondary actions.
- A bottom area for logoff or shutdown-style actions, where appropriate.

The Start menu opens from the Start button and closes when dismissed or when an application is selected.

Its proportions, borders, spacing, and typography should look like an operating-system menu, not a modern dropdown.

For a browser-based personal blog, shutdown or logoff actions must not falsely imply that the browser can shut down the user's computer.

## 6. Native-Looking Controls

All controls must follow a coherent XP control language.

### Buttons

- Use compact rectangular shapes.
- Use light gray faces and subtle gradients.
- Use beveled highlights and shadows.
- Provide hover, pressed, focused, and disabled states.
- Avoid large pill-shaped buttons.

### Inputs

- White background.
- Thin gray borders.
- Compact height.
- Clear focus indication.
- Native-looking selection and cursor behavior.

### Checkboxes and radio buttons

Prefer genuine XP-style control graphics or carefully reproduced CSS controls.

Do not replace them with large modern switches.

### Menus and context menus

- Compact row height.
- Light background.
- Clear hover selection.
- Optional small icons.
- Submenu arrows.
- Thin borders and restrained shadows.

### Scrollbars

Where custom scrollbars are required, use compact classic-looking tracks, arrow-like ends where practical, and beveled thumbs.

Never sacrifice accessibility or usability simply to imitate an old browser.

## 7. Icon and Asset Rules

Prefer assets that genuinely resemble Windows XP-era interface graphics.

Asset sources may include:

- Original project assets.
- Properly licensed Windows XP-style icon packs.
- Faithfully recreated icons.
- Custom pixel-aligned PNG assets.

Requirements:

- Keep icon style consistent across the entire desktop.
- Preserve transparency.
- Avoid mixing 3D glossy XP icons with unrelated modern outline icons.
- Use appropriate native-like sizes.
- Avoid stretching low-resolution assets.
- Avoid putting text inside an icon unless it is part of the original artwork.

For pixel-oriented icons, preserve crisp edges.

For glossy XP-era icons, preserve their highlights, gradients, volume, and colorful silhouettes.

Do not use arbitrary emoji as a substitute for system icons.

## 8. Dreamcore Atmosphere

Dreamcore is an atmospheric layer, not a replacement for the operating-system design.

The desktop should feel familiar, quiet, slightly uncanny, and reminiscent of an old computer remembered from a dream.

### 8.1 Appropriate atmosphere

Use a restrained combination of:

- Empty blue skies.
- Distant clouds.
- Quiet suburban landscapes.
- Empty corridors.
- Old computer rooms.
- Faded childhood photographs.
- Slightly blurred landscapes.
- Subtle film grain.
- Very gentle atmospheric haze.
- Occasional low-opacity overlays.

### 8.2 Preserve interface readability

The desktop background may be atmospheric, but:

- Desktop icon labels must remain readable.
- Window borders must remain distinct.
- The taskbar must retain its recognizable XP blue appearance.
- Text must not disappear into the background.
- Atmospheric overlays must not block pointer events.
- Motion must not interfere with dragging or clicking.

### 8.3 Animation rules

Use slow, restrained animation.

Suitable examples:

- Clouds moving very slowly.
- Gentle changes in background brightness.
- Very subtle grain movement.
- Slow transitions when opening a window.
- A restrained, occasional atmospheric visual anomaly.

Avoid:

- Constant glitch effects.
- Excessive scanlines.
- Heavy RGB splitting.
- Aggressive flickering.
- Constant zooming.
- Large animated gradients.
- Excessive blur on application windows.

Window movement and control feedback must remain immediate.

Respect reduced-motion preferences.

## 9. Personal Blog Applications

The blog should be implemented as an application inside the simulated desktop.

Suitable application windows include:

### Blog Explorer

A classic Explorer-style article browser with:

- A menu bar.
- A compact toolbar.
- A navigation or category sidebar.
- An article list.
- A content preview.
- A status bar.

### Article Reader

An article window with:

- Article title.
- Publication date.
- Category.
- Body content.
- Images.
- Tags.
- Previous and next article navigation.

### About Me

A system-style profile window containing a portrait, biography, interests, and personal information intentionally published by the site owner.

### Guestbook

A compact guestbook application for visitor messages, including validation and submission feedback if a real backend exists.

### Photo Archive

A thumbnail browser inspired by classic Windows image folders.

### Music Player

An optional retro media-player window.

Do not implement all of these as disconnected decorative mockups. Connect them to actual blog data and navigation wherever the project requires it.

## 10. Technical Implementation Rules

Before modifying code:

1. Inspect the existing project structure.
2. Identify the current framework and routing.
3. Locate shared desktop, window, taskbar, and icon components.
4. Identify existing data sources and interactions.
5. Preserve working functionality.
6. Avoid replacing the entire project merely to improve visual styling.

Build reusable components for:

- Desktop shell.
- Desktop icon.
- Application window.
- Window title bar.
- Window controls.
- Taskbar.
- Taskbar button.
- Start menu.
- Context menu.
- XP button.
- XP input.
- Blog application content.

Separate the operating-system shell from individual application content.

Keep window state centralized where appropriate.

Do not create a separate, inconsistent window implementation for every blog feature.

Do not introduce new dependencies unless they provide a clear benefit.

Do not change routing, APIs, authentication, or persistence without a concrete requirement.

Do not leave placeholder controls that imply functionality but have no action.

## 11. Responsive Behavior

The default experience should reproduce a desktop environment.

On large screens:

- Preserve desktop icon placement.
- Support overlapping windows.
- Allow dragging and resizing where appropriate.
- Keep the taskbar attached to the bottom.

On narrow screens:

- Keep the XP visual identity.
- Adapt windows to the available viewport.
- Avoid inaccessible controls outside the screen.
- Ensure content remains scrollable.
- Avoid making window controls too small to use.
- Preserve the taskbar and navigation experience where possible.

Do not blindly shrink a desktop interface until everything becomes unreadable.

## 12. Visual Verification

After implementation, compare the rendered page against authentic Windows XP references.

Check the following:

1. Does the desktop look like a recognizable XP desktop before any application opens?
2. Is the taskbar unmistakably XP-like?
3. Does the Start menu have the correct two-column visual structure?
4. Do title bars, borders, and controls have appropriate depth?
5. Are icons consistent with the XP era?
6. Are fonts and spacing compact enough?
7. Do active and inactive windows look different?
8. Are the blog applications visually integrated into the operating-system shell?
9. Is dreamcore atmospheric rather than visually overwhelming?
10. Do all visible controls work?
11. Does the interface remain readable at the target viewport?
12. Are there any obvious modern design elements that conflict with XP?

If browser screenshots or visual testing tools are available, inspect the actual rendered interface and correct discrepancies.

Do not declare visual fidelity complete merely because the code compiles.

## 13. Mandatory Anti-Patterns

Never do the following unless explicitly requested:

- Turn the desktop into a modern dashboard.
- Replace the taskbar with a modern navigation bar.
- Use a generic card grid as the desktop.
- Use macOS window buttons.
- Apply a large uniform border radius to every component.
- Use arbitrary blue gradients without XP-like structure.
- Use emoji as the entire icon system.
- Use oversized modern headings throughout the system UI.
- Put glassmorphism on every window.
- Make every interaction a hover-only effect.
- Implement fake window controls.
- Sacrifice readability for visual effects.
- Rewrite functioning application logic solely to alter appearance.

## 14. Required Workflow for Every Task

For each implementation request:

### Phase A: Inspect

Read this Skill and inspect the relevant existing code.

Identify which shared components control the requested visual or functional behavior.

### Phase B: Plan

Describe the components that need modification and the expected visual result.

Identify reusable elements that should remain consistent.

### Phase C: Implement

Implement the smallest coherent set of changes.

Reuse the shared XP design tokens and components.

Do not introduce competing design systems.

### Phase D: Verify

Check visual consistency, interaction behavior, layout boundaries, console errors, and regressions.

If screenshot comparison is available, use it.

### Phase E: Report

Summarize:

- Files changed.
- Visual changes made.
- Interactions implemented.
- Verification performed.
- Remaining limitations.

The final result must be a coherent Windows XP desktop experience, not a collection of individually styled components.
