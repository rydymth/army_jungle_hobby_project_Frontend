import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, Observable, pipe, startWith, switchMap } from 'rxjs';
import { coords, polygon, rayCaster } from './ray-caster.ts';
import { res_data, Device, res } from '../../models.js';

export function transform_data(ds: string, d: res_data[], polygonCoords: polygon): Device
{

  let id = ds;

  let path_inside = d
              .filter(ff =>
                (ff.deviceCode === ds) &&
                (rayCaster(
                  {lat: Number(ff.latitude), lng: Number(ff.longitude)},
                  polygonCoords.coords
                ))
              )
  
  let path_outside = d.filter(ff => ff.deviceCode === ds && !path_inside.includes(ff))
  
  let ret_path_inside = path_inside
                .map(ff => ({
                  lat: Number(ff.latitude),
                  lng: Number(ff.longitude)
                }))

  let ret_path_outside = path_outside
                .map(ff => ({
                  lat: Number(ff.latitude),
                  lng: Number(ff.longitude)
                }))
  
  return {
    id: id,
    paths: [
      { isInside: true, path: ret_path_inside.slice(0, 30)},
      { isInside: false, path: ret_path_outside.slice(0, 30)}
    ]
  }
}

@Injectable({
  providedIn: 'root'
})
export class FetchDeviceLocationTs {
  private apiUrl: string = "https://midastestbe.garimasystem.com/api/BLEScanning/GetGPSdeviceById" 
  private httpClient = inject(HttpClient);
  
  // Will only track one device
  pollDevices(polygonCoords: polygon): Observable<Device[]>
  {
    return interval(15000)
    .pipe(
      startWith(0), // Run at startup
      switchMap(() => this.httpClient.get<res>(`${this.apiUrl}`)),
      // for piping, just keep on mapping      
      map(obj => obj.data),
      map(d => {
        let devices: string[] = [...new Set(d.map(item => item.deviceCode))];
        let dp = devices.map(
          ds => {
            return transform_data(ds, d, polygonCoords)
          }
        )
        return dp;
      })
    )
  }
}