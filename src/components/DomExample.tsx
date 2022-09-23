import Boundary from './Boundary';

/*

Please learn MouseEvent before practicing Drag Event
https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent

### x vs clientX vs pageX vs screenX
x, clientX -> in local (DOM content) coordinates.
pageX      -> relative to the whole document.
screenX    -> in global (screen) coordinates.

*/

export default function DomExample() {
  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-lg font-bold">DOM EVENT</h1>
        <span>watch the console log</span>
      </div>
      <Boundary
        onMouseDown={() => {
          const mouseMoveHandler = (e: MouseEvent) => {
            console.log(`mouse move x:${e.screenX} y:${e.screenY}`);
          };
          const mouseUpHandler = (e: MouseEvent) => {
            console.warn(`>>>> mouse up x:${e.screenX} y:${e.screenY}`);
            document.removeEventListener('mousemove', mouseMoveHandler);
          };

          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler, { once: true });
        }}
      />
    </div>
  );
}
