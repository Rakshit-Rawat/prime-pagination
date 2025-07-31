import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tooltip } from "primereact/tooltip";
import { OverlayPanel } from "primereact/overlaypanel";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

interface ArtworksApiResponse {
  data: Artwork[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    total_pages: number;
    current_page: number;
  };
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quickSelectCount, setQuickSelectCount] = useState("");

  const tooltipRef = useRef<Tooltip>(null);
  const overlayRef = useRef<OverlayPanel>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPage = (page: number) => {
    setLoading(true);

    const api = `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}&fields=id,title,place_of_origin,artist_display,inscriptions,date_start,date_end`;

    fetch(api)
      .then((res) => res.json())
      .then((json: ArtworksApiResponse) => {
        setArtworks(json.data);
        setTotalRecords(json.pagination.total);

        // Restore selection for visible items
        const selectedOnPage = json.data.filter((art) => selectedIds.has(art.id));
        setSelectedRows(selectedOnPage);
      })
      .catch((err) => console.error("Failed to load data:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  useEffect(() => {
    tooltipRef.current?.updateTargetEvents();
  }, [artworks]);

  const handlePageChange = (e: any) => {
    const nextPage = (e.page ?? 0) + 1;
    setFirst(e.first);
    setRows(e.rows);
    fetchPage(nextPage);
  };

  const handleSelectionChange = (e: { value: Artwork[] }) => {
    const updatedSelected = e.value;
    setSelectedRows(updatedSelected);

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      updatedSelected.forEach((item) => newSet.add(item.id));
      artworks.forEach((item) => {
        if (!updatedSelected.find((s) => s.id === item.id)) {
          newSet.delete(item.id);
        }
      });
      return newSet;
    });
  };

  const applyQuickSelect = (count: number) => {
    const sliced = artworks.slice(0, count);
    setSelectedRows(sliced);
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      sliced.forEach((item) => newSet.add(item.id));
      return newSet;
    });
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      <Tooltip ref={tooltipRef} target=".tooltip-target" />

      <DataTable
        value={artworks}
        paginator
        rows={rows}
        first={first}
        totalRecords={totalRecords}
        lazy
        // loading={loading}
        onPage={handlePageChange}
        selection={selectedRows}
        onSelectionChange={handleSelectionChange}
        selectionMode="multiple"
        dataKey="id"
        tableStyle={{ minWidth: "70rem" }}
        stripedRows
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        <Column
          header={
            <>
              <i
                className="pi pi-angle-down"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  overlayRef.current?.toggle(e);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
              />
              <OverlayPanel ref={overlayRef}>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    minWidth: "200px",
                  }}
                >
                  <input
                    type="number"
                    ref={inputRef}
                    value={quickSelectCount}
                    onChange={(e) => setQuickSelectCount(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const count = Math.min(Number(quickSelectCount), artworks.length);
                        applyQuickSelect(count);
                        overlayRef.current?.hide();
                      }
                    }}
                    placeholder="Select rows..."
                    style={{
                      flex: 1,
                      padding: "0.4rem",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Button
                    label="Go"
                    text
                    onClick={() => {
                      const count = Math.min(Number(quickSelectCount), artworks.length);
                      applyQuickSelect(count);
                      overlayRef.current?.hide();
                    }}
                  />
                </div>
              </OverlayPanel>
            </>
          }
          body={() => null}
          style={{ width: "2rem", textAlign: "center" }}
        />

        <Column
          header="Title"
          style={{ width: "200px" }}
          body={(row: Artwork) => (
            <div
              className="truncate tooltip-target"
              style={{ maxWidth: "200px" }}
              data-pr-tooltip={row.title}
            >
              {row.title || "-"}
            </div>
          )}
        />

        <Column
          header="Place of Origin"
          style={{ width: "180px" }}
          body={(row: Artwork) => (
            <div
              className="truncate tooltip-target"
              style={{ maxWidth: "180px" }}
              data-pr-tooltip={row.place_of_origin}
            >
              {row.place_of_origin || "-"}
            </div>
          )}
        />

        <Column
          header="Artist Display"
          style={{ width: "250px" }}
          body={(row: Artwork) => (
            <div
              className="truncate tooltip-target"
              style={{ maxWidth: "250px" }}
              data-pr-tooltip={row.artist_display}
            >
              {row.artist_display || "-"}
            </div>
          )}
        />

        <Column
          header="Inscriptions"
          style={{ width: "200px", textAlign: "center" }}
          body={(row: Artwork) => (
            <div
              className="truncate tooltip-target"
              style={{ maxWidth: "200px", textAlign: "center" }}
              data-pr-tooltip={row.inscriptions}
              data-pr-position="left"
            >
              {row.inscriptions || "-"}
            </div>
          )}
        />
      </DataTable>

      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
        </div>
      )}
    </div>
  );
};

export default App;
