// Atoms
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from "./atoms/Button";
export { IconButton, type IconButtonVariant } from "./atoms/IconButton";
export { TransactionTag, type TransactionTagVariant } from "./atoms/TransactionTag";
export { CurrencyInput } from "./atoms/CurrencyInput";
export { DateInput } from "./atoms/DateInput";
export { Logo, type LogoProps, type LogoSize } from "./atoms/Logo";
export {
  SparkleIcon,
  WalletIcon,
  FileTextIcon,
  ChartIcon,
  UsersIcon,
  SettingsIcon,
  ChevronLeftIcon,
  AlertIcon,
  PlusIcon,
  DocumentIcon,
  ShieldIcon,
  InboxIcon,
  CoinsIcon,
  LogOutIcon,
} from "./atoms/Icons";

// Molecules
export { Breadcrumb, type BreadcrumbItem } from "./molecules/Breadcrumb";
export { StatCard, type StatTone } from "./molecules/StatCard";
export { BannerAlert, type BannerTone } from "./molecules/BannerAlert";
export { ModuleCard, type ModuleCardData } from "./molecules/ModuleCard";
export { PagePlaceholder } from "./molecules/PagePlaceholder";
export { CurrencyDisplay } from "./molecules/CurrencyDisplay";
export { FormField } from "./molecules/FormField";
export { TransactionItem } from "./molecules/TransactionItem";

// Organisms
export { BalanceSummary } from "./organisms/BalanceSummary";
export { TransactionList } from "./organisms/TransactionList";
export { TransactionForm } from "./organisms/TransactionForm";
export { ModuleGrid } from "./organisms/ModuleGrid";
export {
  AppHeader,
  type AppHeaderLink,
  type AppHeaderUser,
} from "./organisms/AppHeader";
export {
  Sidebar,
  type SidebarItem,
  type SidebarSection,
  type SidebarUser,
} from "./organisms/Sidebar";

// Templates y páginas
export {
  CajaMenorDashboardLayout,
  type CajaMenorDashboardLayoutSidebar,
} from "./templates/CajaMenorDashboardLayout";
export {
  DashboardPage,
  type DashboardMovement,
  type MovementStatus,
} from "./pages/DashboardPage";
export { ModulesHomePage } from "./pages/ModulesHomePage";

export const version = "0.0.0";