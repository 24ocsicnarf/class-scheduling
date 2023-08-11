// eslint-disable-next-line @typescript-eslint/no-explicit-any
function on(eventType: any, listener: any) {
  document.addEventListener(eventType, listener);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function off(eventType: any, listener: any) {
  document.removeEventListener(eventType, listener);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function once(eventType: any, listener: any) {
  on(eventType, handleEventOnce);

  function handleEventOnce(event: any) {
    listener(event);
    off(eventType, handleEventOnce);
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function trigger(eventType: any, data: CustomEventInit<any> | undefined) {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
}

export { on, off, once, trigger };
