import { getNowDate } from '~/common';
import { useDialog } from '~/hooks/useDialog';
import useSaveLoadPatch from '~/hooks/useSaveLoadPatch';

export default function SaveParamsDialog() {
  const defaultName = `WaveMaker Patch ${getNowDate()}`;

  const dialog = useDialog();
  const { save } = useSaveLoadPatch();

  const onSubmit = (e: any) => {
    e.preventDefault();

    const data = new FormData(e.target);
    save(data.get('filename') as string)
      .then(() => {
        dialog.close();
      });

    return false;
  }

  return (
    <form onSubmit={onSubmit} className="block w-full p-4 text-zinc-200">
      <label className="block w-full">
        <input type="text" name="filename" className="mb-4 p-2 block w-full bg-zinc-900 border border-zinc-700" placeholder="Save file name..." defaultValue={defaultName} autoFocus required/>
      </label>
      <div className="flex justify-end gap-x-4">
        <button type="button" className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600" onClick={dialog.close}>CANCEL</button>
        <button type="submit" className="px-4 py-1 bg-zinc-700 hover:bg-zinc-600">SAVE</button>
      </div>
    </form>
  );
}
