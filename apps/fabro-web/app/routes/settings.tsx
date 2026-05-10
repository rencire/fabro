import { BoltIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation } from "react-router";

export function meta({}: any) {
  return [{ title: "Settings — Fabro" }];
}

export const handle = { hideHeader: true };

type NavItem = {
  name: string;
  href: string;
  icon: typeof Cog6ToothIcon;
  match: (pathname: string) => boolean;
};

const navItems: NavItem[] = [
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    match: (p) => p === "/settings",
  },
  {
    name: "Live Events",
    href: "/settings/live-events",
    icon: BoltIcon,
    match: (p) => p.startsWith("/settings/live-events"),
  },
];

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsLayout() {
  const { pathname } = useLocation();
  const currentName = navItems.find((item) => item.match(pathname))?.name ?? "Settings";

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="lg:w-56 lg:shrink-0">
        <nav className="sticky top-6">
          <ul role="list" className="flex gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
            {navItems.map((item) => {
              const current = item.match(pathname);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    aria-current={current ? "page" : undefined}
                    className={classNames(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm whitespace-nowrap transition-colors",
                      current
                        ? "bg-overlay text-fg"
                        : "text-fg-3 hover:bg-overlay hover:text-fg",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <h1 className="mb-2 text-xl font-semibold tracking-tight text-fg">
          {currentName}
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
