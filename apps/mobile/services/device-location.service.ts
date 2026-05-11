import * as Location from 'expo-location';

export type DeviceLocation = {
  accuracy?: number | null;
  capturedAt: string;
  latitude: number;
  longitude: number;
};

export async function getCurrentDeviceLocation(timeout = 8000) {
  const permission = await Location.requestForegroundPermissionsAsync();

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    return null;
  }

  const freshLocation = await getFreshDeviceLocation(timeout);

  if (freshLocation) {
    return mapLocationObject(freshLocation);
  }

  const lastKnownLocation = await Location.getLastKnownPositionAsync({
    maxAge: 30000,
    requiredAccuracy: 100,
  });

  return lastKnownLocation ? mapLocationObject(lastKnownLocation) : null;
}

async function getFreshDeviceLocation(timeout: number) {
  const locationRequest = Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
    mayShowUserSettingsDialog: true,
  }).catch(() => null);

  const timeoutRequest = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), timeout);
  });

  return Promise.race([locationRequest, timeoutRequest]);
}

function mapLocationObject(location: Location.LocationObject): DeviceLocation {
  return {
    accuracy: location.coords.accuracy,
    capturedAt: new Date(location.timestamp).toISOString(),
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}
