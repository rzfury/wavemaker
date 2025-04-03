import { useStore } from '@nanostores/react';
import { useContext, useEffect } from 'react';
import { AudioPlayerContext } from '~/contexts/audio-player/context';
import { useNanoState } from '~/hooks/useNanoState';
import { atomTimeFrame, getMasterMix } from '~/stores/context';
import WaveRender from '../common/WaveRender';
import useLFOControlManager from '~/hooks/useLFOControlManager';
import { TOTAL_FRAME_COUNT } from '~/common';

export default function MasterWavePreview() {
  const controlManager = useLFOControlManager();

  const player = useContext(AudioPlayerContext);
  const samples = useStore(getMasterMix);

  const [timeFrame, setTimeFrame] = useNanoState(atomTimeFrame);

  const onChangeTimeFrame = (e: any) => {
    setTimeFrame(e.target.valueAsNumber);
  }

  useEffect(() => {
    controlManager.updateControlLFO();
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-y-4 p-4 bg-zinc-800 shadow-md shadow-black/50">
      <div className="h-64">
        <WaveRender samples={samples} />
      </div>
      <div className="p-4 border border-zinc-600">
        <div className="text-zinc-200">
          <div className="flex items-center gap-x-4 mb-4">
            <div className="w-32">FRAME</div>
            <div className="w-4">{timeFrame + 1}</div>
            <input type="range" className="grow block" min={0} max={TOTAL_FRAME_COUNT - 1} step={1} value={timeFrame} onInput={onChangeTimeFrame} />
          </div>
          <div className="grid grid-cols-3 gap-x-4">
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.play?.()}>PLAY WAVE</button>
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.play?.()}>PLAY ALL</button>
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.stop?.()}>STOP</button>
          </div>
        </div>
      </div>
    </div>
  )
}
