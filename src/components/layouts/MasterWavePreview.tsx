import { useStore } from '@nanostores/react';
import { useContext, useEffect, useRef } from 'react';
import { TOTAL_FRAME_COUNT } from '~/common';
import { AudioPlayerContext } from '~/contexts/audio-player/context';
import { useDialog } from '~/hooks/useDialog';
import useLFOControlManager from '~/hooks/useLFOControlManager';
import { useNanoState } from '~/hooks/useNanoState';
import { atomTimeFrame, getMasterMix } from '~/stores/context';
import WaveRender from '../common/WaveRender';
import SaveParamsDialog from '../dialogs/SavePatchDialog';
import useSaveLoadPatch from '~/hooks/useSaveLoadPatch';

export default function MasterWavePreview() {
  const dialog = useDialog();
  const controlManager = useLFOControlManager();
  const { load } = useSaveLoadPatch();

  const player = useContext(AudioPlayerContext);
  const samples = useStore(getMasterMix);

  const [timeFrame, setTimeFrame] = useNanoState(atomTimeFrame);

  const inputRef = useRef<HTMLInputElement>(null);

  const onChangeTimeFrame = (e: any) => {
    setTimeFrame(e.target.valueAsNumber);
  }

  const onLoadPatch = async (e: any) => {
    const files = e.target.files;
    if (!files[0]) return;

    const file = files[0];

    if (!(file instanceof File)) return;

    load(file);
  }

  const openSavePatchDialog = () => {
    dialog.open({
      title: 'Save Patch',
      template: <SaveParamsDialog />,
      width: 576
    })
  }

  useEffect(() => {
    controlManager.updateControlLFO();
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-y-4 p-4 bg-zinc-800 shadow-md shadow-black/50">
      <input ref={inputRef} type="file" aria-hidden className="hidden" tabIndex={-1} accept=".json" onInput={onLoadPatch} />
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
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.play?.()}>PLAY FRAME</button>
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.playAll?.()}>PLAY ALL</button>
            <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => player.stop?.()}>STOP</button>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-y-4 border border-zinc-600 text-zinc-200">
        <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => {}}>EXPORT AS WAV</button>
        <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => {}} title="Export as FamiTracker Instrument for N163">EXPORT AS FTI (FT N163)</button>
      </div>
      <div className="p-4 flex flex-col gap-y-4 border border-zinc-600 text-zinc-200">
        <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={() => inputRef.current?.click()}>LOAD PATCH</button>
        <button className="px-2 py-1 text-xs bg-zinc-700 hover:bg-zinc-600" onClick={openSavePatchDialog}>SAVE PATCH</button>
      </div>
    </div>
  )
}
