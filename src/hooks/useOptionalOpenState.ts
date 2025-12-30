import { useOpenState } from "@/contexts/OpenStateContext";

/**
 * Safe wrapper around useOpenState.
 *
 * In read-only menu routes we may not mount <OpenStateProvider />.
 * This hook returns null instead of throwing.
 */
export function useOptionalOpenState() {
  try {
    return useOpenState();
  } catch {
    return null;
  }
}
