export const POLYGON_STORAGE_KEY = "polygonCoords";

export interface Device {
  id: string;
  paths: {
    path: google.maps.LatLngLiteral[],
    isInside: boolean
  }[]
}

export interface res_data {
  latitude: number,
  longitude: number,
  deviceCode: string,
  timestamp: string,
}

export interface gps_data {
  id: number,
  lat: number,
  long: number
}

export interface res {
  isSuccess: boolean,
  status: number,
  message: string,
  data: res_data[]
}

export interface deviceIds{
  deviceIds: string[] 
}

export interface device_markers {
    id: string,
    path: {
        lat: number,
        lng: number,
        timestamp: string,
        isInside: boolean
    }[]
}