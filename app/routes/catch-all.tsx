import type { Route } from "../../.react-router/types/app/+types/root";

export function Component() {
  // This component doesn't render anything
  // It just catches routes that don't match any other route
  return null;
}

// Prevent this route from being server-rendered
export const handle: Route.Handle = {
  hydrate: true,
};