import { useDialog } from '~/hooks/useDialog';

export default function OscOutRouteDialog() {
  const dialog = useDialog();

  return (
    <div className="">
      <label>
        <div>Route:</div>
        <select className="px-2 py-1 w-full text-xs text-white cursor-pointer">
          <option className="text-black" value="master">Master</option>
          <option className="text-black" value="input">Input</option>
          <option className="text-black" value="none">None</option>
        </select>
      </label>
    </div>
  )
}
