export const FPS = 30, WIDTH = 1080, HEIGHT = 1920, OVERLAP = 20;
export const SHOW_SAFE_ZONES = false;
export const BGM_START_SEC = 0;
export const SCENES = [
  { id: 'gate',       length: 210, in: 'none'   },
  { id: 'ganesha',    length: 270, in: 'none'   }, // starts with its own flood overlay
  { id: 'hero',       length: 190, in: 'fade'   },
  { id: 'invitation', length: 190, in: 'rise'   },
  { id: 'satya',      length: 200, in: 'fade'   },
  { id: 'family',     length: 170, in: 'fade'   },
  { id: 'date',       length: 200, in: 'rise'   },
  { id: 'venue',      length: 160, in: 'circle' },
  { id: 'rsvp',       length: 305, in: 'fade'   },
] as const;
export const sceneStart = (i: number) => SCENES.slice(0, i).reduce((s, x) => s + x.length - OVERLAP, 0);
export const totalFrames = () => sceneStart(SCENES.length - 1) + SCENES[SCENES.length - 1].length;
