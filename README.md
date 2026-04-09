# Frontend Engineering Challenge: Interactive Calendar Component

This project is a React + Vite implementation of the interactive wall calendar component described in the Frontend Engineering Challenge. The goal was to translate a static wall-calendar inspired concept into a polished, responsive, and usable frontend-only experience.
## UI Preview

<p align="center">
<img src="./wall-calendar/src/assets/desktop.png" />
<img src="./wall-calendar/src/assets/mobile.png" />
</p>

<p align="center"><i>Desktop vs Mobile responsiveness</i></p>



## Challenge Alignment

### Wall Calendar Aesthetic

The UI is designed to resemble a physical wall calendar with:

- a hanging calendar presentation
- a dedicated hero artwork panel for the current month
- a separate notes area integrated into the layout
- a clear visual split between the decorative and functional parts of the component

### Day Range Selector

The calendar supports:

- single-day selection
- start and end date selection
- highlighted in-between range states
- distinct styling for range start, range end, and days inside the range

### Integrated Notes Section

The notes experience includes:

- note creation for a selected day or selected date range
- note editing through a popup interface
- note deletion
- note previews on calendar days
- a notes list in the left panel for the current month

### Fully Responsive Design

The layout adapts across screen sizes:

- desktop uses a two-panel wall calendar layout
- mobile stacks the layout vertically while keeping date selection and notes usable
- interactions remain accessible for both mouse and keyboard users

## Creative Extras

In addition to the core requirements, this version includes:

- month-to-month page slide animation
- custom seasonal SVG month artwork
- holiday markers and holiday badges
- local persistence using `localStorage`

## Tech Decisions

- `React` for component-driven UI and state handling
- `Vite` for fast local development and build tooling
- `Tailwind CSS v4` for global setup and utility support
- custom CSS in the wall calendar component for the detailed physical-calendar styling
- `localStorage` for frontend-only persistence, per the challenge scope

## Project Structure

```text
src/
|-- App.jsx
|-- index.css
|-- main.jsx
|-- assets/
`-- components/
    |-- CalendarGrid.jsx
    |-- NotePopup.jsx
    |-- NotesPanel.jsx
    |-- WallCalender.css
    `-- WallCalender.jsx
```

## How to Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Verification

This project has been verified with:

```bash
npm run lint
npm run build
```

## Submission Items

### Source Code

Public repository link: `https://github.com/kanankotwani28/WallCalender.git`

### Video Demonstration

Required demo link: `https://youtu.be/Im9Wvn0sbys`

Suggested walkthrough points:

- wall calendar layout on desktop
- day range selection flow
- note creation, editing, and deletion
- holiday markers
- mobile responsiveness

### Live Demo

Optional deployed link: `https://wall-calendert.vercel.app/`

## Scope Note

This project is intentionally frontend-only. It does not use a backend, database, or API. Notes and selection state are stored on the client with `localStorage`, which keeps the implementation aligned with the challenge requirements.
