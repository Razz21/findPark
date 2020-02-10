export const MapMixin = {
  data() {
    return {
      min_zoom: 9,
      zoom: 10,
      center: [0, 0],
      mapLoading: false,
      contextMenuItems: [
        {
          title: "Center map here",
          icon: "mdi-image-filter-center-focus",
          callback: () => {
            const map = this.$refs.map.mapObject;
            const center = this.$refs.contextmenu.mapObject._latlng;
            if (center) {
              this.$refs.map.mapObject.setView(center, map.getZoom(), {
                animation: true
              });
            }
          }
        },
        {
          title: "Zoom in",
          icon: "mdi-magnify-plus-outline",
          callback: () => this.$refs.map.mapObject.zoomIn()
        },
        {
          title: "Zoom out",
          icon: "mdi-magnify-minus-outline",
          callback: () => this.$refs.map.mapObject.zoomOut()
        }
      ]
    };
  },
  computed: {
    maxBounds() {
      return L.latLngBounds([53.655871, 15.776287], [51.1037825, 19.105015]);
    },
    animations() {
      return this.$store.getters["global/getSettings"].animations;
    },
    ipLocationLookUp() {
      return this.$store.getters["global/getIpLongLat"];
    },
    geolocPosition: {
      set(val) {
        this.$store.commit("map/setGeolocation", val);
      },
      get() {
        return this.$store.getters["map/getGeolocation"];
      }
    }
  },

  methods: {
    /* IP Look Up */
    getLookupLocation() {
      return new Promise(resolve => {
        if (this.ipLocationLookUp && this.ipLocationLookUp.length == 2) {
          resolve([this.ipLocationLookUp, 10]);
        } else {
          this.$store
            .dispatch("global/getIpLookUp")
            .then(result => {
              /* allow coordinates only inside Greater Poland Area */
              if (!this.maxBounds.contains(result)) {
                resolve([[52, 17], 10]);
              } else {
                resolve([result, 10]);
              }
            })
            .catch(() => {
              resolve([[52, 17], 4]);
            });
        }
      });
    },

    changeMapExtent(extent, maxZoom) {
      const map = this.$refs.map.mapObject;
      /* fit view to given bounds */
      if (map) {
        if (maxZoom === undefined) maxZoom = map.getZoom();
        map.fitBounds(extent, {
          maxZoom,
          paddingTopLeft: [this.offsetX, 0],
          paddingBottomRight: [0, this.offsetY]
        });
      }
    },
    onMapContextMenu(e) {
      /* toggle popup on map click */
      if (this.$refs.contextmenu.mapObject.isOpen()) {
        this.$refs.contextmenu.mapObject._close();
      } else {
        this.$refs.contextmenu.mapObject
          .setLatLng(e.latlng)
          .openOn(e.sourceTarget);
      }
    }
  },
  mounted() {}
};
