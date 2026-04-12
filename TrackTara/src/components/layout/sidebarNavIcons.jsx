import {
  ClipboardList,
  Package,
  Container,
  LayoutGrid,
  LayoutDashboard,
  Home,
  Truck,
  FilePlus,
  Users,
  Tags,
  Layers,
  ScrollText,
  PackageX,
} from "lucide-react";

const MAP = {
  "/": Home,
  "/warehouse/pick": ClipboardList,
  "/packing": Package,
  "/tare": Container,
  "/products": LayoutGrid,
  "/sales": LayoutDashboard,
  "/sales/clients": Truck,
  "/orders/create": FilePlus,
  "/users": Users,
  "/productType": Tags,
  "/container/containerTypes": Layers,
  "/carts/registry": ScrollText,
  "/brakimag": PackageX,
};

export function SidebarNavIcon({ to, className = "" }) {
  const Cmp = MAP[to];
  if (!Cmp) return null;
  return <Cmp className={className} size={18} strokeWidth={1.85} aria-hidden />;
}
