import { describe, it, expect } from "vitest";
import {
  normalizeOrderRoute,
  isActiveWorkloadOrder,
  buildRouteWorkloadTable,
} from "./routeWorkload";

describe("routeWorkload", () => {
  it("normalizeOrderRoute: порожнє → —", () => {
    expect(normalizeOrderRoute({})).toBe("—");
    expect(normalizeOrderRoute({ routeCode: "  ac  " })).toBe("AC");
  });

  it("isActiveWorkloadOrder", () => {
    expect(isActiveWorkloadOrder({ status: "active" })).toBe(true);
    expect(isActiveWorkloadOrder({ status: "completed" })).toBe(false);
  });

  it("buildRouteWorkloadTable: агрегує позиції та візки по трасі", () => {
    const orders = [
      {
        id: 1,
        status: "active",
        routeCode: "AC",
        items: [
          {
            status: "pending",
            containerCode: "A01-CNT-001",
            quantity: 10,
            pickedQuantity: 0,
            weightKg: 1,
          },
          {
            status: "completed",
            containerCode: "A01-CNT-002",
            quantity: 5,
            pickedQuantity: 5,
            weightKg: 1,
          },
        ],
        carts: [{ leftOnLine: false }, { leftOnLine: true }],
      },
    ];
    const boxes = [{ orderId: 1, createdAt: new Date().toISOString() }];
    const rows = buildRouteWorkloadTable(orders, boxes);
    const ac = rows.find((r) => r.routeCode === "AC");
    expect(ac).toBeDefined();
    expect(ac.orders).toBe(1);
    expect(ac.itemsTotal).toBe(2);
    expect(ac.itemsDone).toBe(1);
    expect(ac.pendingLines).toBe(1);
    expect(ac.cartsActive).toBe(1);
    expect(ac.uniqueContainers).toBe(2);
    expect(ac.packingBoxes).toBe(1);
    expect(ac.remainingWeightKg).toBeCloseTo(10);
    expect(ac.progressPct).toBe(50);
  });

  it("buildRouteWorkloadTable: неактивні замовлення не враховуються", () => {
    const orders = [
      { id: 1, status: "completed", routeCode: "HR", items: [{ status: "pending" }] },
    ];
    const rows = buildRouteWorkloadTable(orders, []);
    expect(rows.length).toBe(0);
  });

  it("buildRouteWorkloadTable: needHelp при високому залишку ваги", () => {
    const orders = [
      {
        id: 1,
        status: "active",
        routeCode: "X",
        items: Array.from({ length: 1 }, () => ({
          status: "pending",
          quantity: 100,
          pickedQuantity: 0,
          weightKg: 1,
        })),
        carts: [],
      },
    ];
    const rows = buildRouteWorkloadTable(orders, []);
    expect(rows[0].needHelp).toBe(true);
  });
});
