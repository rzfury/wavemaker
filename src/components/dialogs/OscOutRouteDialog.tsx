import { useNanoState } from '~/hooks/useNanoState';
import { atomOscillators } from '~/stores/context';

export default function OscOutRouteDialog({ oscId }: { oscId: string }) {
  const [oscillators, setOscillators] = useNanoState(atomOscillators);
  const osc = oscillators[oscId];

  const onChangeRoute = (e: any) => {
    const oscCopy = { ...osc };
    oscCopy.route = e.target.value;
    setOscillators({ ...oscillators, [oscCopy.id]: oscCopy });
  };

  return (
    <div className="w-full flex flex-col gap-y-4 p-4">
      <label className="w-full flex gap-x-4 items-center justify-between text-zinc-200">
        <div className="w-16">ROUTE:</div>
        <select className="grow px-2 py-1 cursor-pointer" value={osc.route} onInput={onChangeRoute}>
          <option className="text-black" value="master">MASTER</option>
          <option className="text-black" value="input">INPUT</option>
          <option className="text-black" value="none">NONE</option>
        </select>
      </label>
      {osc.route === 'input' && (
        <div className="w-full flex gap-x-4 items-center justify-between text-zinc-200">
          <div className="w-16">CONTROL:</div>
          <div className="grow text-right">{osc.routeInput || 'Not Routed'}</div>
        </div>
      )}
    </div>
  )
}
