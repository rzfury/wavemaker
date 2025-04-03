import { randstr } from '~/common';
import LFO from './LFO';
import { createLFOState } from '~/generator';
import { atomLFOs } from '~/stores/context';
import { useNanoState } from '~/hooks/useNanoState';

export default function LFOShelf() {
  const [lfos, setLFOs] = useNanoState(atomLFOs);

  const onAddLFO = () => {
    const id = randstr();
    const lfo = createLFOState(`${id}-lfo`);
    setLFOs({ ...lfos, [lfo.id]: lfo });
  };

  return (
    <div id="lforack">
      {Object.keys(lfos).map((k) => (
        <LFO key={k} id={k} />
      ))}
      <button title="Add Effect" className="w-8 max-w-8 min-w-8 h-full flex items-center justify-center hover:bg-zinc-700 cursor-pointer" onClick={onAddLFO}>
        <span className="text-zinc-200">(+)<span className="text-upright">&nbsp;LFO</span></span>
      </button>
    </div>
  );
}
