//
// Add parcel functionality to a leaflet map
//

var L = require('leaflet');

require('leaflet-geojson-gridlayer');


var map,
    parcelsLayer,
    selectedParcel,

    parcelDefaultStyle = {
        color: '#2593c6',
        fillOpacity: 0,
        weight: 2.5
    };


var ParcelsMixin = {
    parcelLayerOptions: {
        minZoom: 17,

        onEachFeature: function (feature, layer) {
            layer.on({
                click: function (event) {
                    var map = this._map;
                    if (selectedParcel && selectedParcel.id === feature.id) {
                        selectedParcel = null;
                        layer.setStyle(parcelDefaultStyle);
                        $('#id_parcels').val('');
                        map.fire('parcels.unselect', { layer: layer, feature: feature });
                    }
                    else {
                        if (selectedParcel) {
                            selectedParcel.layer.setStyle(map.parcelSelectStyle);
                        }
                        selectedParcel = {
                            id: feature.id,
                            address: feature.properties.address,
                            layer: layer
                        };
                        $('#id_parcels').val(feature.id);
                        layer.setStyle(map.parcelSelectStyle);
                        layer.bindPopup(map.getParcelPopupContent(layer, feature)).openPopup();
                        map.fire('parcels.select', { layer: layer, feature: feature });
                    }
                },

                mouseover: function (event) {
                    $('.map-add-lot-current-parcel').text(feature.properties.address);
                    this._map.fire('parcels.mouseover', { layer: layer, feature: feature });
                }
            });
        },

        style: function (feature) {
            return parcelDefaultStyle;
        }
    },

    parcelSelectStyle: {
        fillColor: '#EEC619',
        fillOpacity: 0.5
    },

    getParcelPopupContent: function (layer, feature) {
        return feature.properties.address || 'unknown address';
    },

    removeParcelsLayer: function () {
        if (parcelsLayer) {
            this.removeLayer(parcelsLayer);
        }
    },

    addParcelsLayer: function () {
        if (parcelsLayer) {
            this.removeLayer(parcelsLayer);
        }
        var url = this.options.parcelsUrl;
        parcelsLayer = L.geoJsonGridLayer(url, {
            layers: {
                default: this.parcelLayerOptions
            },
            minZoom: 17
        });
        this.addLayer(parcelsLayer);
    }

};

L.Map.include(ParcelsMixin);

function setView(map, latlng) {
    if (map) {
        map.setView(latlng, 18);
    }
}

module.exports = {
    init: function (map, latlng) {
        if (latlng) {
            setView(map, latlng);
        }
        map.addParcelsLayer();
    },

    exit: function (map) {
        map.removeParcelsLayer();
    },

    setView: setView
};
