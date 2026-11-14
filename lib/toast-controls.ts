'use client';

/**
 * Bus event ringan untuk kontrol kamera 3D dari UI di luar <Canvas>.
 * Sengaja bukan state React: zoom tidak butuh re-render, dan hero + modal
 * bisa punya canvas sendiri tanpa saling mengganggu (dipisah per channel).
 */

type ZoomHandler = (direction: 1 | -1) => void;
type ResetHandler = () => void;

const zoomHandlers = new Map<string, Set<ZoomHandler>>();
const resetHandlers = new Map<string, Set<ResetHandler>>();

export const toastControls = {
  zoom(channel: string, direction: 1 | -1) {
    zoomHandlers.get(channel)?.forEach((handler) => handler(direction));
  },
  reset(channel: string) {
    resetHandlers.get(channel)?.forEach((handler) => handler());
  },
  onZoom(channel: string, handler: ZoomHandler) {
    if (!zoomHandlers.has(channel)) zoomHandlers.set(channel, new Set());
    zoomHandlers.get(channel)!.add(handler);
    return () => {
      zoomHandlers.get(channel)?.delete(handler);
    };
  },
  onReset(channel: string, handler: ResetHandler) {
    if (!resetHandlers.has(channel)) resetHandlers.set(channel, new Set());
    resetHandlers.get(channel)!.add(handler);
    return () => {
      resetHandlers.get(channel)?.delete(handler);
    };
  },
};
