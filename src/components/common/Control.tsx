import type { ReactNode } from 'react';
import { clamp } from '~/common';
import { useNanoState } from '~/hooks/useNanoState';
import { atomControls } from '~/stores/context';

export default function Control({
  children,
  id,
  className,
}: {
  children: (
    control: ControlState,
    changeValue: (value: number) => void,
  ) => ReactNode
  id: string,
  className?: string,
}) {
  const [controls, setControls] = useNanoState(atomControls);
  const control = controls[id];

  const changeValue = (value: number) => {
    const controlCopy = { ...control };
    controlCopy.value = clamp(value, controlCopy.rangeMin, controlCopy.rangeMax);
    setControls({ ...controls, [controlCopy.id]: controlCopy });
  }

  return (
    <div className={className}>
      {children(control, changeValue)}
    </div>
  );
}
