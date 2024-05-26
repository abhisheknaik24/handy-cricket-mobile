import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useVibrate = () => {
  const vibrate = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  return { vibrate };
};
