# GrowMeOrganic Internship Assignment

A React + TypeScript application built using **Vite** that displays paginated data using the **PrimeReact DataTable** component.

> ⚠️ This project was built in response to a specific assignment and fully adheres to all submission requirements, including server-side pagination, custom persistent row selection, and strict tech stack usage.

---

## 🔧 Tech Stack

- **React 18** with **TypeScript**
- **Vite** for fast development and build
- **PrimeReact** for UI components (DataTable, OverlayPanel, Tooltip, Spinner)
- **CSS Modules / Inline Styling** for layout and responsiveness

---

## 📸 Features

### ✅ Server-Side Pagination
- Fetches data page-wise directly from the API on every page change
- No caching or storing of entire datasets to avoid memory bloat
- API Endpoint: [`https://api.artic.edu/api/v1/artworks`](https://api.artic.edu/api/v1/artworks)

### ✅ PrimeReact DataTable
- Fully implemented with sorting, lazy loading, and multi-row selection
- Custom column renderers with tooltips for truncated text

### ✅ Persistent Row Selection
- Users can select/deselect rows across pages
- Selections persist even when users navigate to other pages and back
- No local storage or global array for all rows—only selected IDs are maintained efficiently

### ✅ Quick Row Selector (Custom UI)
- A custom UI panel allows quick selection of a defined number of top rows
- Fully integrated into the DataTable header using `OverlayPanel`

### ✅ Type Safety
- Strongly typed data models (`Artwork`, `ArtworksApiResponse`)
- Safer and more predictable code with full TypeScript support

---

## 🚀 How to Run

```bash
# Clone the repository
git clone [https://github.com/your-username/prime-pagination.git](https://github.com/Rakshit-Rawat/prime-pagination)
cd prime-pagination

# Install dependencies
npm install

# Start development server
npm run dev


