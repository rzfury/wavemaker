import { clamp, randstr } from '~/common';
import { useDialog } from '~/hooks/useDialog';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls, atomEffects } from '~/stores/context';

export default function AddEffectDialog({
  oscId
}: {
  oscId: string,
}) {
  const dialog = useDialog();

  const [fxs, setFXs] = useNanoState(atomEffects);
  const [controls, setControls] = useNanoState(atomControls);

  const onAddEffect = (effect: string) => () => {
    const id = `${oscId}-fx-${randstr()}`

    if (effect === 'gain') {
      const gainControlId = id + '-gain';

      setFXs({
        ...fxs,
        [id]: {
          id,
          type: 'gain',
          bypass: false,
          controls: {
            gain: gainControlId,
          },
          oscillator: oscId,
        }
      });

      setControls({
        ...controls,
        [gainControlId]: {
          id: gainControlId,
          rangeMin: 0.0,
          rangeMax: 3.0,
          value: 1.0,
          valueMap: (val) => clamp(val, 0.0, 3.0)
        }
      });

      return dialog.close();
    }
    
    if (effect === 'rp') {
      setFXs({
        ...fxs,
        [id]: {
          id,
          type: 'reverse',
          bypass: false,
          controls: {},
          oscillator: oscId,
        }
      });

      return dialog.close();
    }

    if (effect === 'delay') {
      const delayTimeControlId = id + '-dt';
      const feedbackControlId = id + '-fb';
      const mixControlId = id + '-mix';

      setFXs({
        ...fxs,
        [id]: {
          id,
          type: 'delay',
          bypass: false,
          controls: {
            delaytime: delayTimeControlId,
            feedback: feedbackControlId,
            mix: mixControlId,
          },
          oscillator: oscId,
        }
      });

      setControls({
        ...controls,
        [delayTimeControlId]: {
          id: delayTimeControlId,
          rangeMin: 0.0,
          rangeMax: 1.0,
          value: 0.0,
          valueMap: (val) => clamp(val, 0.0, 1.0),
        },
        [feedbackControlId]: {
          id: feedbackControlId,
          rangeMin: 0.0,
          rangeMax: 1.0,
          value: 0.5,
          valueMap: (val) => clamp(val, 0.0, 1.0),
        },
        [mixControlId]: {
          id: mixControlId,
          rangeMin: 0.0,
          rangeMax: 1.0,
          value: 0.5,
          valueMap: (val) => clamp(val, 0.0, 1.0),
        },
      });

      return dialog.close();
    }

    if (effect === 'filter-1') {
      const cutoffControlId = id + '-cutoff';

      setFXs({
        ...fxs,
        [id]: {
          id,
          type: 'filter-1',
          bypass: false,
          controls: {
            cutoff: cutoffControlId,
          },
          oscillator: oscId,
        }
      });

      setControls({
        ...controls,
        [cutoffControlId]: {
          id: cutoffControlId,
          rangeMin: 0.1,
          rangeMax: 1.0,
          value: 1.0,
          valueMap: (val) => clamp(val, 0.0, 1.0),
        },
      });

      return dialog.close();
    }
  }

  return (
    <div className="w-full grid grid-cols-3 gap-4 p-4 text-zinc-200">
      <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600" onClick={onAddEffect('rp')}>
        REVERSE POL
      </button>
      <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600" onClick={onAddEffect('gain')}>
        GAIN
      </button>
      <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600" onClick={onAddEffect('delay')}>
        DELAY
      </button>
      {/* <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600" onClick={onAddEffect('filter-1')}>
        FILTER 1
      </button> */}
      {/* <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600">
        EQ
      </button> */}
      {/* <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600">
        DISTORTION
      </button> */}
      {/* <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600">
        FM
      </button> */}
      {/* <button className="px-4 py-3 bg-zinc-700 hover:bg-zinc-600">
        RM
      </button> */}
    </div>
  )
}
