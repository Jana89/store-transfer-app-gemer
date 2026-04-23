"use client";

import { useMemo, useState } from "react";
import type { PickTask, PickTaskStatus } from "@/lib/data";
import { initialTasks } from "@/lib/data";

const statusOrder: PickTaskStatus[] = [
  "New",
  "Acknowledged",
  "Picking",
  "Packed",
  "Courier collected",
  "In ootel stock",
  "Awaiting verification",
  "Unblocked",
];

const queueTabs = [
  "All",
  "New",
  "Acknowledged",
  "Picking",
  "Packed",
  "Courier collected",
  "Awaiting verification",
  "Unblocked",
] as const;

type QueueFilter = (typeof queueTabs)[number];

function Badge({ children }: { children: string }) {
  const classes: Record<string, string> = {
    High: "badge badge-red",
    Medium: "badge badge-amber",
    Low: "badge badge-green",
    New: "badge badge-blue",
    Acknowledged: "badge badge-slate",
    Picking: "badge badge-indigo",
    Packed: "badge badge-violet",
    "Courier collected": "badge badge-amber",
    "In ootel stock": "badge badge-slate",
    "Awaiting verification": "badge badge-orange",
    Unblocked: "badge badge-green",
  };

  return <span className={classes[children] || "badge"}>{children}</span>;
}

export default function StorePickApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState(initialTasks[0]?.id ?? "");
  const [filter, setFilter] = useState<QueueFilter>("All");
  const [storeView] = useState("Tartu Store");

  const selectedTask = tasks.find((task) => task.id === selectedId) ?? tasks[0];

  const visibleTasks = useMemo(() => {
    if (filter === "All") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const metrics = {
    open: tasks.filter((task) => task.status !== "Unblocked").length,
    urgent: tasks.filter((task) => task.priority === "High" && task.status !== "Unblocked").length,
    packed: tasks.filter((task) => task.status === "Packed").length,
    verification: tasks.filter((task) => task.status === "Awaiting verification").length,
    released: tasks.filter((task) => task.status === "Unblocked").length,
  };

  function updateStatus(taskId: string, nextStatus: PickTaskStatus) {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status: nextStatus } : task))
    );
  }

  function advanceTask(task: PickTask) {
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[Math.min(currentIndex + 1, statusOrder.length - 1)];
    updateStatus(task.id, nextStatus);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-title">Macta Flow</div>
            <div className="brand-subtitle">Store transfer workspace</div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Location</div>
          <button className="sidebar-store-button">{storeView}</button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Queue</div>
          <div className="sidebar-nav">
            {queueTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`sidebar-nav-item ${filter === tab ? "sidebar-nav-item-active" : ""}`}
              >
                <span>{tab === "All" ? "All requests" : tab}</span>
                <span className="sidebar-count">
                  {tab === "All" ? tasks.length : tasks.filter((task) => task.status === tab).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-focus-card">
          <div className="sidebar-focus-title">Today’s priority</div>
          <p>
            Acknowledge new requests quickly, clear high-priority transfers before courier pickup, and avoid stock getting stuck before warehouse release.
          </p>
          <button className="sidebar-focus-button" onClick={() => setFilter("New")}>
            Open new requests
          </button>
        </div>
      </aside>

      <section className="workspace">
        <header className="workspace-header">
          <div>
            <div className="eyebrow">Retail fulfillment demo</div>
            <h1>Store Transfer Desk</h1>
            <p className="subcopy">
              A store-side workflow for acknowledging requests, picking items, handing them to the internal courier, and tracking release into warehouse stock.
            </p>
          </div>

          <div className="header-actions">
            <button className="ghost-button">Transfer log</button>
            <button className="primary-button">Create exception</button>
          </div>
        </header>

        <section className="metric-grid metric-grid-five">
          <article className="metric-card">
            <span className="metric-label">Open requests</span>
            <strong className="metric-value">{metrics.open}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Urgent</span>
            <strong className="metric-value">{metrics.urgent}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Packed</span>
            <strong className="metric-value">{metrics.packed}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Awaiting verification</span>
            <strong className="metric-value">{metrics.verification}</strong>
          </article>
          <article className="metric-card">
            <span className="metric-label">Released</span>
            <strong className="metric-value">{metrics.released}</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>Transfer requests</h2>
                <p>{visibleTasks.length} requests in this view</p>
              </div>
              <div className="inline-tabs wide-inline-tabs">
                {queueTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`inline-tab ${filter === tab ? "inline-tab-active" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-list">
              {visibleTasks.map((task) => (
                <button
                  key={task.id}
                  className={`task-card ${selectedTask?.id === task.id ? "task-card-active" : ""}`}
                  onClick={() => setSelectedId(task.id)}
                >
                  <div className="task-card-top">
                    <div>
                      <div className="task-id">{task.id}</div>
                      <div className="task-order">{task.orderId} · {task.customer}</div>
                    </div>
                    <Badge>{task.priority}</Badge>
                  </div>

                  <div className="task-card-mid">
                    <span className="task-line">{task.reason}</span>
                    <span className="task-line">Courier ETA {task.internalCourierEta}</span>
                  </div>

                  <div className="task-card-bottom">
                    <Badge>{task.status}</Badge>
                    <span>{task.items.length} item{task.items.length > 1 ? "s" : ""}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel detail-panel">
            {selectedTask ? (
              <>
                <div className="panel-header detail-header">
                  <div>
                    <h2>{selectedTask.id}</h2>
                    <p>{selectedTask.orderId} · Requested by warehouse operations</p>
                  </div>
                  <Badge>{selectedTask.status}</Badge>
                </div>

                <div className="detail-summary-grid detail-summary-grid-extended">
                  <div className="summary-card">
                    <span className="summary-label">Customer</span>
                    <strong>{selectedTask.customer}</strong>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Destination</span>
                    <strong>{selectedTask.shipTo}</strong>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Requested</span>
                    <strong>{selectedTask.requestedAt}</strong>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Priority</span>
                    <strong>{selectedTask.priority}</strong>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Courier ETA</span>
                    <strong>{selectedTask.internalCourierEta}</strong>
                  </div>
                  <div className="summary-card">
                    <span className="summary-label">Current issue</span>
                    <strong>{selectedTask.reason}</strong>
                  </div>
                </div>

                <div className="detail-block">
                  <h3>What to send</h3>
                  <div className="table-wrap">
                    <div className="table-row table-head">
                      <span>SKU</span>
                      <span>Product</span>
                      <span>Qty</span>
                      <span>Store location</span>
                    </div>
                    {selectedTask.items.map((item) => (
                      <div key={item.sku} className="table-row">
                        <span>{item.sku}</span>
                        <span>{item.name}</span>
                        <span>{item.qty}</span>
                        <span>{item.location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-block">
                  <h3>Operational note</h3>
                  <div className="note-box">{selectedTask.notes}</div>
                </div>

                {selectedTask.exception ? (
                  <div className="detail-block exception-panel">
                    <h3>Open exception</h3>
                    <div className="note-box exception-note">{selectedTask.exception}</div>
                  </div>
                ) : null}

                <div className="detail-block soft-panel">
                  <h3>Transfer workflow</h3>
                  <div className="workflow-list">
                    <div className="workflow-item">1. Acknowledge request so warehouse knows the store has seen it</div>
                    <div className="workflow-item">2. Pick items from shelf and confirm quantity</div>
                    <div className="workflow-item">3. Pack transfer for internal courier pickup</div>
                    <div className="workflow-item">4. Mark courier collected to show transfer is in movement</div>
                    <div className="workflow-item">5. Warehouse receives into ootel stock and verifies quantities</div>
                    <div className="workflow-item">6. After verification, stock is unblocked to main warehouse</div>
                  </div>
                </div>

                <div className="action-row">
                  <button className="primary-button" onClick={() => advanceTask(selectedTask)}>
                    Mark next step
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Acknowledged")}>
                    Acknowledge
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Picking")}>
                    Set Picking
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Packed")}>
                    Set Packed
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Courier collected")}>
                    Courier Collected
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "In ootel stock")}>
                    In Ootel Stock
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Awaiting verification")}>
                    Awaiting Verification
                  </button>
                  <button className="ghost-button" onClick={() => updateStatus(selectedTask.id, "Unblocked")}>
                    Unblock to Main
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state">No request selected.</div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
