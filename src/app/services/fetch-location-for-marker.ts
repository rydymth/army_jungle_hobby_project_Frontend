import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, Observable, of, pipe, startWith, switchMap } from 'rxjs';
import { polygon, rayCaster } from './ray-caster.ts';
import { device_markers, POLYGON_STORAGE_KEY, res } from '../../models.js';

@Injectable({
  providedIn: 'root'
})
export class FetchLocationForMarker {
  private apiUrl: string = "https://midastestbe.garimasystem.com/api/BLEScanning/GetGPSdeviceById" 
  private httpClient = inject(HttpClient);
  
  // Will only track one device
  pollDevices(): Observable<device_markers[]>
  {
    return interval(15000)
    .pipe(
      startWith(0), // Run at startup
      switchMap(() => this.httpClient.get<res>(`${this.apiUrl}`)),
      // for piping, just keep on mapping      
      map(obj => obj.data),
      map(obj => {
        let polyStr = localStorage.getItem(POLYGON_STORAGE_KEY);
        if (!polyStr)
        {
          let devices: string[] = [...new Set(obj.map(item => item.deviceCode))];
          let markerPaths = devices.map(
            dids => {
              let id = dids;

              let paths = obj
                          .filter(ff => ff.deviceCode === dids)
                          .map(fmapper => ({
                            lat: Number(fmapper.latitude),
                            lng: Number(fmapper.longitude),
                            timestamp: fmapper.timestamp,
                            isInside: false
                          }))
              return {id: id, path: paths}
            }
          )
          return markerPaths
          
        }
        const polygonCoords: polygon = new polygon();
        polygonCoords.coords = JSON.parse(polyStr);
        console.log("Polygon Coords:", polygonCoords);
        let devices: string[] = [...new Set(obj.map(item => item.deviceCode))];
        let markerPaths = devices.map(
          dids => {
            let id = dids;

            let paths = obj
                        .filter(ff => ff.deviceCode === dids)
                        .map(fmapper => ({
                          lat: Number(fmapper.latitude),
                          lng: Number(fmapper.longitude),
                          timestamp: fmapper.timestamp,
                          isInside: rayCaster({lat: Number(fmapper.latitude), lng: Number(fmapper.longitude)}, polygonCoords.coords)
                        }))
            return {id: id, path: paths}
          }
        )
        return markerPaths
      })
    )
  }
}
