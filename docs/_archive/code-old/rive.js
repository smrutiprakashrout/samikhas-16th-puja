export function createRiveLoader() {
  return function rive(name, canvas, opts = {}) {
    let instance;
    let machine;
    let settled = false;
    let resolveReady;
    const ready = new Promise((resolve) => { resolveReady = resolve; });
    const finish = (value) => { if (!settled) { settled = true; resolveReady(value); } };
    const timeout = setTimeout(() => finish(false), 4000);
    const fallback = () => {
      if (!canvas) return;
      const image = document.createElement('img');
      image.src = opts.fallback || `/svg/${name}.svg`;
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      canvas.replaceWith(image);
    };
    import('@rive-app/canvas').then(({ Rive, Layout, Fit, Alignment }) => {
      instance = new Rive({
        src: `/rive/${name}.riv`, canvas, artboard: 'Main', stateMachines: 'SM',
        autoplay: true,
        layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
        onLoad: () => { clearTimeout(timeout); machine = instance.stateMachineInputs('SM'); finish(true); },
        onLoadError: () => { clearTimeout(timeout); fallback(); finish(false); },
      });
    }).catch(() => { clearTimeout(timeout); console.warn(`Rive unavailable: ${name}`); fallback(); finish(false); });
    return {
      ready,
      setInput(inputName, value) {
        const input = machine?.find((item) => item.name === inputName);
        if (input) input.value = value;
      },
      fire(inputName) { const input = machine?.find((item) => item.name === inputName); input?.fire(); },
    };
  };
}
