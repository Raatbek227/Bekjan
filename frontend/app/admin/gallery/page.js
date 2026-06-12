"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/layouts/dashboard-shell";
import { adminLinks } from "@/constants/admin-links";
import { adminService } from "@/services/admin-service";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingFile, setEditingFile] = useState(null);

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    adminService.listGallery().then((res) => setItems(res.data || []));
  }

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return alert("Выберите файл");
    setLoading(true);

    const fd = new FormData();
    fd.append("media", file);
    fd.append("title", title);

    try {
      await adminService.createGallery(fd);
      refresh();
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Ошибка при загрузке");
    } finally {
      setLoading(false);
    }
  }

  const pendingDeletes = {};

  function scheduleDelete(item) {
    if (!confirm("Удалить этот элемент галереи?")) return;

    // remove locally immediately
    setItems((s) => s.filter((i) => i.id !== item.id));

    const timer = setTimeout(async () => {
      try {
        await adminService.deleteGallery(item.id);
      } catch (err) {
        console.error("Failed to delete on server", err);
      }
      delete pendingDeletes[item.id];
    }, 5000);

    pendingDeletes[item.id] = { timer, item };

    pushToast({
      title: "Item removed",
      description: item.title || "Untitled",
      action: {
        label: "Undo",
        onClick: () => {
          // cancel pending delete and restore
          const entry = pendingDeletes[item.id];
          if (entry) {
            clearTimeout(entry.timer);
            setItems((s) => [entry.item, ...s]);
            delete pendingDeletes[item.id];
          }
        }
      }
    });
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditingTitle(item.title || "");
    setEditingFile(null);
  }

  async function submitEdit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", editingTitle);
      if (editingFile) fd.append("media", editingFile);
      await adminService.updateGallery(editingId, fd);
      setEditingId(null);
      refresh();
    } catch (err) {
      console.error(err);
      alert("Ошибка при обновлении");
    } finally {
      setLoading(false);
    }
  }

  const { pushToast } = useToast();

  return (
    <DashboardShell title="Gallery Admin" navLinks={adminLinks}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel rounded-lg p-6">
          <PageHeader eyebrow="Admin" title="Gallery" description="Upload and manage gallery media." />

          <form onSubmit={handleUpload} className="mt-6 flex flex-col gap-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="input w-full"
            />

            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              {preview ? <img src={preview} className="h-20 w-28 rounded-md object-cover" alt="preview" /> : null}
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading} variant="primary">
                {loading ? "Uploading..." : "Upload media"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => { setFile(null); setTitle(""); }}>
                Clear
              </Button>
            </div>
          </form>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <h3 className="text-lg font-semibold">Existing items</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <div key={it.id} className="relative rounded-lg bg-white/5 p-2">
                <img src={it.mediaUrl} alt={it.title} className="h-48 w-full rounded-md object-cover" />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-sm line-clamp-1">{it.title || "Untitled"}</p>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs text-muted hover:text-white"
                      onClick={() => startEdit(it)}>
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(it.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === it.id ? (
                  <form onSubmit={submitEdit} className="mt-3 flex flex-col gap-2">
                    <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} className="input" />
                    <input type="file" accept="image/*" onChange={(e) => setEditingFile(e.target.files?.[0] ?? null)} />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} variant="primary">
                        Save
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
