let viewerModulePromise;

export function getViewerModule() {
  viewerModulePromise ??= import("./viewer.js");
  return viewerModulePromise;
}
