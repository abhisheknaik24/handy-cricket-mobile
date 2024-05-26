import { Preferences } from '@capacitor/preferences';

export const useStorage = () => {
  const getStorage = async (key: string) => {
    const ret = await Preferences.get({
      key: key,
    });

    const data = await JSON.parse(ret?.value!);

    return data?.data;
  };

  const postStorage = async (key: string, data: any) => {
    await Preferences.set({
      key: key,
      value: JSON.stringify({
        data: data,
      }),
    });
  };

  return { getStorage, postStorage };
};
