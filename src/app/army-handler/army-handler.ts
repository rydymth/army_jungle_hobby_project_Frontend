import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapInfoWindow, MapAdvancedMarker, GoogleMap, MapPolygon, MapMarker, MapPolyline } from '@angular/google-maps';
import { CommonModule, NgFor, NgForOf, NgTemplateOutlet } from '@angular/common';
import { coords, polygon, rayCaster } from '../services/ray-caster.ts';
import { FetchDeviceLocationTs } from '../services/fetch-device-location.ts.js';
import { BrowserModule } from '@angular/platform-browser';
import { Device, POLYGON_STORAGE_KEY } from '../../models.js';

const demo_polygon_coords: coords[] = [
  { lat: 22.296093, lng: 73.166728},
  { lat: 22.292662, lng: 73.164233},
  { lat: 22.289017, lng: 73.164543},
  { lat: 22.288674, lng: 73.169551},
  { lat: 22.292888, lng: 73.170944},
  { lat: 22.296889, lng: 73.169196}  
]

/*
 * TODO: (Things to handle)
 * TO HANDLE ALLOF THIS IS ONE COMPONENT
 * - [ ] Draw polygon,
 *      - [ ] also view/render it if it is correct,
 *      - [ ] detele/clear the points
 *      - [ ] Change the original coordinates
 * - [ ] Track devices
 *      - [ ] Check if the device is inside the polygon or not
 *      - [ ] Track path along with the device ids
 *      - [ ] Zoom in to where each device is/was (Get all the history???)
*/

/*
 * Polygon dynamic
 * Check if localstorage has any polygon coordinates.
 * If no, prompt the client to draw the coordinates.
 * If yes, go brbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbrbr
*/

/*
  Every device will have 2 paths:
    1. One path will be inside the polygon
    2. The other will be outside the polygon
*/
@Component({
  selector: 'app-army-handler',
  imports: [RouterOutlet, GoogleMap, MapPolygon, MapPolyline, CommonModule],
  templateUrl: './army-handler.html',
  styleUrl: './army-handler.scss'
})
export class ArmyHandler implements OnInit
{
  @ViewChild(GoogleMap) map!: GoogleMap;
  protected readonly title = signal('army-tracker');
  // Injecting service for fetchingLocation
  private service = inject(FetchDeviceLocationTs)

  zoom = 16;
  // Center to be dynamic? cuz when focusing to other devices?
  center: google.maps.LatLngLiteral = { lat: 22.293133067205993, lng: 73.16774098650659 };
  
  polygonCoords: polygon = new polygon()
  
  areaCoords: google.maps.LatLngLiteral[] = this.polygonCoords.coords

  areaPolygon: google.maps.PolygonOptions = {
    paths: this.areaCoords,
    fillColor: 'lightblue',
    fillOpacity: 0.3,
    strokeColor: 'blue',
    strokeWeight: 2,
  };
  
  // Handling multiple devices:
  /*
   * We will order the incoming first request w.r.t the device ids.
     We will also be storing just the device names here locally(local variable)
     Once API called we just check if the API has any more device ids.
     If not we just continue the same flow and only add the new GPS coordinates to the respective devices.
     If there exists a new device, we just remake? Or we just find the new one and add the same onto 
  */
  devices: Device[] = []

  constructor()
  {}
  
  getCoords(event: google.maps.MapMouseEvent)
  {
    let point = event.latLng?.toJSON();
    if (point) {
      this.polygonCoords.coords.push(point);
      this.updatePolygon();
      this.savePolygonToStorage();
    }
  }
  
  // Zoom into the polygon instead of hardcoding it
  private fitPolygonToMap(): void {
    if (!this.map || this.polygonCoords.coords.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    this.polygonCoords.coords.forEach((coord) => {
      bounds.extend(coord);
    });

    // Center and fit bounds
    this.map.googleMap?.fitBounds(bounds);
  }
  
  /* Save polygon to localStorage */
  private savePolygonToStorage() {
    localStorage.setItem(POLYGON_STORAGE_KEY, JSON.stringify(this.polygonCoords.coords));
  }

  /* Load polygon from localStorage */
  private loadPolygonFromStorage() {
    const saved = localStorage.getItem(POLYGON_STORAGE_KEY);
    if (saved) {
      this.polygonCoords.coords = JSON.parse(saved);
      this.updatePolygon();
    }
  }

  /* Update polygon paths */
  private updatePolygon() {
    this.areaCoords = [...this.polygonCoords.coords];
    this.areaPolygon = {
      ...this.areaPolygon,
      paths: this.areaCoords
    };
  }

  /* Clear polygon */
  clearPolygon() {
    this.polygonCoords.coords = [];
    this.updatePolygon();
    localStorage.removeItem(POLYGON_STORAGE_KEY);
  }
   
  ngOnInit(): void {

    // Polygon dynamic handling
    this.loadPolygonFromStorage();

    // this.polygonCoords.coords.push(
    //   ...demo_polygon_coords
    // )
    
    this.service.pollDevices(this.polygonCoords)
    .subscribe((data: any) => {
      this.devices = data
      this.fitPolygonToMap()
    })
    
  }
}