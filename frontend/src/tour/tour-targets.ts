import { menuItems, type MenuTourId } from "@/config/menu-items";

/**
 * Targets that are NOT sidebar links
 */
export type ExtraTourId =
  | "orders-table"
  | "orders-status-filter";

export type TourTargetId = MenuTourId | ExtraTourId;

/** The exact selector strings a step is allowed to use. */
export type TourSelector = `[data-tour="${TourTargetId}"]`;

/** Typed selector builder for TourStep.target. */
export const tourSelector = <T extends TourTargetId>(
  id: T,
): `[data-tour="${T}"]` => `[data-tour="${id}"]`;

/** Spread onto the element that should be highlighted: <div {...tourAttr("orders-table")} /> */
export const tourAttr = <T extends TourTargetId>(id: T) =>
  ({ "data-tour": id }) as const;

const MENU_TOUR_IDS: ReadonlySet<TourTargetId> = new Set(
  menuItems.map((item) => item.tourId),
);

export const isMenuTourId = (id: TourTargetId): id is MenuTourId =>
  MENU_TOUR_IDS.has(id);
