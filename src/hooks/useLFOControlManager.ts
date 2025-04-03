import { useStore } from '@nanostores/react';
import { mapRange, TOTAL_FRAME_COUNT } from '~/common';
import { atomControls, atomLFOs, atomTimeFrame } from '~/stores/context';

export default function useLFOControlManager() {
  const timeFrame = useStore(atomTimeFrame);
  const controls = useStore(atomControls);
  const lfos = useStore(atomLFOs);

  const updateControlLFO = () => {
    const timeNormalized = timeFrame / (TOTAL_FRAME_COUNT - 1);
    const lfoCopies = Object.fromEntries(Object.entries({ ...lfos }).map(
      ([id, lfo]) => {
        const intersection = findIntersection(lfo, timeNormalized);
        if (intersection) lfo.current = { ...intersection };
        return [id, lfo];
      }
    ));

    const controlCopies: [string, ControlState][] = [];
    Object.entries(lfoCopies).forEach(([_, lfo]) => {
      lfo.controls.forEach(lfoControl => {
        if (lfoControl.bypass) return;

        controlCopies.push([lfoControl.id, { ...controls[lfoControl.id] }]);
        controlCopies[controlCopies.length - 1][1].value = controlCopies[controlCopies.length - 1][1].valueMap(
          mapRange(
            lfo.current.amount,
            0.0,
            1.0,
            controlCopies[controlCopies.length - 1][1].rangeMin,
            controlCopies[controlCopies.length - 1][1].rangeMax
          )
        );
      });
    });

    atomLFOs.set(lfoCopies);
    atomControls.set({ ...controls, ...Object.fromEntries(controlCopies) });
  };

  const findIntersection = (lfo: LFOState, time: number) => {
    const nodes = [
      { time: 0, amount: lfo.edgeNode.amount },
      ...lfo.nodes,
      { time: 1, amount: lfo.edgeNode.amount },
    ];

    for (let i = 0; i < nodes.length - 1; i++) {
      let node = nodes[i];
      let nextNode = nodes[i + 1];

      if (time >= node.time && time <= nextNode.time) {
        let amt = node.amount + ((nextNode.amount - node.amount) / (nextNode.time - node.time)) * (time - node.time);
        return { time, amount: amt };
      }
    }

    return null;
  }

  return {
    updateControlLFO
  }
}
