import { atomControls, atomEffects, atomLFOs, atomOscillators } from '~/stores/context';
import { useNanoState } from './useNanoState';
import { useCallback } from 'react';

export default function useSaveLoadPatch() {
  const [oscillators, setOscillators] = useNanoState(atomOscillators);
  const [controls, setControls] = useNanoState(atomControls);
  const [effects, setEffects] = useNanoState(atomEffects);
  const [lfos, setLFOs] = useNanoState(atomLFOs);

  const onLoadParams = useCallback(async (file: File) => {
    const buffer = await file.arrayBuffer()
    const decoder = new TextDecoder().decode(buffer);
    const data = JSON.parse(decoder);
    
    const state: SaveDataPatch = {
      oscillators: {},
      controls: {},
      effects: {},
      lfos: {}
    };

    if (data.hasOwnProperty('controls')) {
      state.controls = { ...data.controls };
    }
    
    if (data.hasOwnProperty('oscillators')) {
      state.oscillators = { ...data.oscillators };
    }
    
    if (data.hasOwnProperty('effects')) {
      state.effects = { ...data.effects };
    }
    
    if (data.hasOwnProperty('lfos')) {
      state.lfos = { ...data.lfos };
    }

    setControls({ ...state.controls});
    setOscillators({ ...state.oscillators });
    setEffects({ ...state.effects });
    setLFOs({ ...state.lfos });
  }, []);

  const onSaveParams = useCallback(async (filename: string) => {
    const data: SaveDataPatch = {
      oscillators: { ...oscillators },
      controls: { ...controls },
      effects: { ...effects },
      lfos: { ...lfos },
    };

    const buffer = new TextEncoder().encode(JSON.stringify(data));
    const blob = new Blob([buffer], { type: 'text/json' });
    const url = URL.createObjectURL(blob);

    const anch = document.createElement('a');
    if (typeof anch.download === 'string') {
      anch.href = url;
      anch.download = `${filename}.json`;
      document.body.appendChild(anch);
      anch.click();
      document.body.removeChild(anch);
    } else {
      window.open(url);
    }

    URL.revokeObjectURL(url);
  }, []);

  return {
    save: onSaveParams,
    load: onLoadParams,
  };
}
