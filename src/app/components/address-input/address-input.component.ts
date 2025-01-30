import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MAPS_API_KEY } from '../../../environments/environment';
import { Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { UserModel } from '../../../assets/models/user.model';
import { AddressModel, DefaultAddress } from '../../../assets/models/address.model';

declare global {
  interface Window {
    initMap: () => void;
  }
}

export interface AddressesData {
  billAddress: AddressModel
  postAddress: AddressModel
}

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  styles: [],
  imports:[ CommonModule ]
})
export class AddressInputComponent implements OnInit, OnDestroy {
  @ViewChild('billAddress') billAddress!: ElementRef<HTMLInputElement>;
  @ViewChild('postAddress') postAddress!: ElementRef<HTMLInputElement>;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('sameAddress') sameAddress!: ElementRef<HTMLInputElement>;
  selectedPlaceBillAddress: google.maps.places.PlaceResult | null = null;
  selectedPlacePostAddress: google.maps.places.PlaceResult | null = null;
  private autocompleteBillAddress: google.maps.places.Autocomplete | undefined;
  private autocompletePostAddress: google.maps.places.Autocomplete | undefined;
  private map: google.maps.Map | undefined; // Map instance
  private marker1: google.maps.Marker | undefined; // Marker instance
  private marker2: google.maps.Marker | undefined; // Marker instance
  private readonly placeSubjectBillAddress = new Subject<google.maps.places.PlaceResult>();
  private readonly placeSubjectPostAddress = new Subject<google.maps.places.PlaceResult>();
  placeBillAddress$ = this.placeSubjectBillAddress.asObservable();
  placePostAddress$ = this.placeSubjectPostAddress.asObservable();
  private placeSubscription: Subscription | undefined;
  oldAddress: google.maps.places.PlaceResult | undefined = {...DefaultAddress, name: DefaultAddress.formatted_address};
  isChecked = false;
  postAddressDirty = false;

  constructor( private readonly userService: UserService){}

  @Output() addressesSelected = new EventEmitter<AddressesData>();

  ngOnInit() {
    this.loadGoogleMapsScript().then(() => {
      this.initAutocomplete();
      this.initMap();
      this.placeSubscription = this.placeBillAddress$.subscribe((placeBillAddress) => {
        this.selectedPlaceBillAddress = placeBillAddress;
        this.updateMap(); // Update the map when the place changes
      });
      this.placeSubscription = this.placePostAddress$.subscribe((placePostAddress) => {
        this.selectedPlacePostAddress = placePostAddress;
        this.updateMap(); // Update the map when the place changes
      });
    })
    .catch( err => console.error(err))
    .finally(() => this.onMapReady());
  }

  onMapReady() {
    const user: UserModel = this.userService.userData();
    this.billAddress.nativeElement.value = user.billAddress.formatted_address;
    this.postAddress.nativeElement.value = user.postAddress.formatted_address;
    this.oldAddress = {...user.billAddress, name: user.billAddress.formatted_address};
    this.isChecked = user.billAddress == user.postAddress;
    this.selectedPlacePostAddress = {formatted_address: user.postAddress.formatted_address, geometry: {location: new google.maps.LatLng(user.postAddress.lat, user.postAddress.lng)}} as google.maps.places.PlaceResult;
    this.selectedPlaceBillAddress = {formatted_address: user.billAddress.formatted_address, geometry: {location: new google.maps.LatLng(user.billAddress.lat, user.billAddress.lng)}} as google.maps.places.PlaceResult;
    this.sameAddressCheck({target:{checked:this.isChecked}});
  }

  private initMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        center: { lat: 47.6449138, lng: -2.7490848}, // Default center (Vannes)
        zoom: 17
    });
  }

  private updateMap() {
    if (this.selectedPlaceBillAddress && this.map && this.selectedPlaceBillAddress.geometry?.location) {
        const location = this.selectedPlaceBillAddress.geometry.location;
        this.map.setCenter(location);
        this.map.setZoom(15); // Adjust zoom as needed

        if (this.marker1) {
            this.marker1.setPosition(location);
        } else {
            this.marker1 = new google.maps.Marker({
                position: location,
                map: this.map
            });
        }
    }
    if (this.selectedPlacePostAddress && this.map && this.selectedPlacePostAddress.geometry?.location) {
        const location = this.selectedPlacePostAddress.geometry.location;
        this.map.setCenter(location);
        this.map.setZoom(15); // Adjust zoom as needed

        if (this.marker2) {
            this.marker2.setPosition(location);
        } else {
            this.marker2 = new google.maps.Marker({
                position: location,
                map: this.map
            });
        }
    }
    this.emit();
  }

  ngOnDestroy(): void {
    this.placeSubscription?.unsubscribe();
  }

  private updateBillAddress() {
    const placeBillAddress = this.autocompleteBillAddress?.getPlace();
    if (placeBillAddress?.geometry) {
        this.placeSubjectBillAddress.next(placeBillAddress);
    }
    this.emit();
  }

  private updatePostAddress() {
    const placePostAddress = this.autocompletePostAddress?.getPlace();
    if (placePostAddress?.geometry) {
      this.placeSubjectPostAddress.next(placePostAddress);
      if (this.sameAddress.nativeElement.checked){
        this.placeSubjectBillAddress.next(placePostAddress); // set the marker
        this.billAddress.nativeElement.value = this.postAddress.nativeElement.value;
      }
    }
    this.emit();
  }

  private initAutocomplete() {
    const autocompleteOptions = {
      // componentRestrictions: { country: 'fr' }, //Optional: Restrict to country
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
      types: ['address'],
    };
    this.autocompleteBillAddress = new google.maps.places.Autocomplete(this.billAddress.nativeElement, autocompleteOptions);
    this.autocompletePostAddress = new google.maps.places.Autocomplete(this.postAddress.nativeElement, autocompleteOptions);

    this.autocompleteBillAddress.addListener('place_changed', () => this.updateBillAddress());
    this.autocompletePostAddress.addListener('place_changed', () => this.updatePostAddress());
  }

  private emit() {
    if (
      this.selectedPlaceBillAddress?.formatted_address && 
      this.selectedPlaceBillAddress.geometry &&
      this.selectedPlacePostAddress?.formatted_address && 
      this.selectedPlacePostAddress.geometry
    )
      this.addressesSelected.emit({
        billAddress: {
          formatted_address: this.selectedPlaceBillAddress?.formatted_address,
          lat: this.selectedPlaceBillAddress?.geometry?.location?.lat(),
          lng: this.selectedPlaceBillAddress?.geometry?.location?.lng()
        },
        postAddress: {
          formatted_address: this.selectedPlacePostAddress?.formatted_address,
          lat: this.selectedPlacePostAddress?.geometry?.location?.lat(),
          lng: this.selectedPlacePostAddress?.geometry?.location?.lng()
          }
      });
  }

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'object' && typeof google.maps === 'object') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=places&callback=initMap&loading=async`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        resolve();
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  sameAddressCheck(event: any) {
    if (event.target.checked) {
      this.oldAddress = this.autocompleteBillAddress?.getPlace();
      this.billAddress.nativeElement.value = this.postAddress.nativeElement.value.toString();
    } else {
        this.billAddress.nativeElement.value = this.oldAddress?.formatted_address?.toString() ?? '';
    }
    this.updateBillAddress();
    this.isChecked = !this.isChecked;
    this.updateMap();
  }
}
