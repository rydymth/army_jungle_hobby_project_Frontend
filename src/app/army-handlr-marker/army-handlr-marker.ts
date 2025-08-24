import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapInfoWindow, MapAdvancedMarker, GoogleMap, MapPolygon, MapMarker, MapPolyline } from '@angular/google-maps';
import { CommonModule, NgFor, NgForOf, NgTemplateOutlet } from '@angular/common';
import { coords, polygon, rayCaster } from '../services/ray-caster.ts';
import { Device, device_markers, POLYGON_STORAGE_KEY } from '../../models.js';
import { FetchLocationForMarker } from '../services/fetch-location-for-marker.js';

@Component({
  selector: 'app-army-handlr-marker',
  imports: [RouterOutlet, GoogleMap, MapPolygon, CommonModule, MapAdvancedMarker],
  templateUrl: './army-handlr-marker.html',
  styleUrl: './army-handlr-marker.scss'
})
export class ArmyHandlrMarker implements OnInit{

  @ViewChild(GoogleMap) map!: GoogleMap;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 22.2905, lng: 73.1676 },
    zoom: 15,
    mapId: 'Jungle_Tracker'
  };
  protected readonly title = signal('army-tracker');
  // Injecting service for fetchingLocation
  private service = inject(FetchLocationForMarker)
  
  // Handler for polygon drawn or not
  drawn: boolean = false
  getPolygon()
  {
    this.drawn = !this.drawn
  }

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
  
  deviceMarkers: { [id: string]: google.maps.marker.AdvancedMarkerElement[] } = {};

  constructor()
  {}
  
  getCoords(event: google.maps.MapMouseEvent)
  {
    let point = event.latLng?.toJSON();
    if (point && !this.drawn) {
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
      this.drawn = true
      this.polygonCoords.coords = JSON.parse(saved);
      this.updatePolygon();
      this.fitPolygonToMap()
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
    this.drawn = false
  }
  
  devices: device_markers[] = []
  
  createMarkerContent(device: any, path: any): HTMLElement {
    const el = document.createElement("div");
    el.classList.add("marker-dot");

    // 🔹 Per-device color theme
    const colorMap: Record<string, string> = {
      "device1": "blue",
      "device2": "green",
      "device3": "orange",
      "default": "red"
    };

    el.style.backgroundColor = colorMap[device.id] || colorMap["default"];

    // 🔹 Show inside/outside polygon
    if (!path.isInside) {
      el.style.border = "2px solid black";
      el.style.opacity = "0.6";
    }

    // 🔹 Different size if latest point
    if (device.path[device.path.length - 1].timestamp === path.timestamp) {
      el.style.width = "16px";
      el.style.height = "16px";
    } else {
      el.style.width = "12px";
      el.style.height = "12px";
    }

    el.style.borderRadius = "50%";
    el.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
    return el;
  }

  ngOnInit(): void {
    this.loadPolygonFromStorage();
    this.fitPolygonToMap()

    this.service.pollDevices()
    .subscribe((data: any) => {
      this.fitPolygonToMap()
      this.devices = data
      console.log(this.devices)
    })
  }
}
