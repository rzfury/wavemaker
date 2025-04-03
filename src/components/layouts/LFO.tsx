import { useStore } from '@nanostores/react';
import { useDialog } from '~/hooks/useDialog';
import { atomLFOs } from '~/stores/context';
import LFORender from '../common/LFORender';
import LFOConnectionsDialog from '../dialogs/LFOConnectionsDialog';

export default function LFO({ id }: { id: string }) {
  const dialog = useDialog();

  const lfos = useStore(atomLFOs);
  const lfo = lfos[id];

  const onRemoveLFO = () => {
    atomLFOs.set(Object.fromEntries(Object.entries(lfos).filter(([k]) => k !== id)));
  };

  const onAddNode = (i: number, amt: number, t: number) => {
    const lfoCopy = { ...lfo };
    if (i === -1) {
      lfoCopy.nodes.push({ amount: amt, time: t });
    }
    else {
      lfoCopy.nodes = [
        ...lfoCopy.nodes.slice(0, i),
        { amount: amt, time: t },
        ...lfoCopy.nodes.slice(i),
      ];
    }
    atomLFOs.set({ ...lfos, [id]: lfoCopy });
  };

  const onRemoveNode = (i: number) => {
    const lfoCopy = { ...lfo };
    lfoCopy.nodes.splice(i, 1);
    atomLFOs.set({ ...lfos, [id]: lfoCopy });
  };

  const onChangeNode = (i: number, amt: number, t: number) => {
    const lfoCopy = { ...lfo };
    lfoCopy.nodes[i].amount = amt;
    lfoCopy.nodes[i].time = t;
    atomLFOs.set({ ...lfos, [id]: lfoCopy });
  };

  const onChangeEdgeNode = (amt: number) => {
    const lfoCopy = { ...lfo };
    lfoCopy.edgeNode.amount = amt;
    atomLFOs.set({ ...lfos, [id]: lfoCopy });
  };

  const openModalLFOConnections = () => {
    dialog.open({
      title: 'Connections',
      template: <LFOConnectionsDialog lfo={lfo}/>,
      width: 720
    })
  };

  return (
    <div className="min-w-[420px] h-full flex flex-col border border-zinc-600 overflow-hidden">
      <div className="pl-1 flex justify-between bg-zinc-600">
        <div className="mb-0.5 text-xs text-zinc-200">LFO [{lfo.id}]</div>
        <div className="flex gap-x-1">
          <button className="mb-0.5 w-4 text-xs text-zinc-200 hover:bg-zinc-500 cursor-pointer" onClick={onRemoveLFO}>&times;</button>
        </div>
      </div>
      <div className="grow flex bg-zinc-800">
        <div className="w-64 h-full">
          <LFORender
            lfo={lfo}
            onAddNode={onAddNode}
            onRemoveNode={onRemoveNode}
            onChangeNode={onChangeNode}
            onChangeEdgeNode={onChangeEdgeNode}
          />
        </div>
        <div className="p-2">
          <div className="grid grid-flow-row gap-y-1">
            <button className="mb-2 px-4 w-full bg-zinc-700 hover:bg-zinc-600 cursor-pointer" onClick={openModalLFOConnections}>
              <span className="text-xs text-zinc-200">CONNECTIONS</span>
            </button>
            <div className="flex items-center justify-between gap-x-2">
              <span className="text-xs text-zinc-200">RATE</span>
              <select className="px-2 py-1 w-16 text-xs text-white cursor-pointer">
                <option className="text-black" value="1/1">1/1</option>
                <option className="text-black" value="1/2">1/2</option>
                <option className="text-black" value="1/4">1/4</option>
                <option className="text-black" value="1/8">1/8</option>
                <option className="text-black" value="1/16">1/16</option>
                <option className="text-black" value="1/32">1/32</option>
              </select>
            </div>
            <div className="flex items-center justify-between gap-x-2">
              <span className="text-xs text-zinc-200">MODE</span>
              <select className="px-2 py-1 w-16 text-xs text-white cursor-pointer">
                <option className="text-black" value="loop">LOOP</option>
                <option className="text-black" value="env">ENV</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
