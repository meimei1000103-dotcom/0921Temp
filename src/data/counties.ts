export interface CountyGeoInfo {
  name: string;
  lat: number;
  lng: number;
  region: "northern" | "central" | "southern" | "eastern" | "islands";
}

export const TAIWAN_COUNTIES: Record<string, CountyGeoInfo> = {
  "基隆市": { name: "基隆市", lat: 25.1276, lng: 121.7392, region: "northern" },
  "臺北市": { name: "臺北市", lat: 25.0330, lng: 121.5654, region: "northern" },
  "新北市": { name: "新北市", lat: 24.9157, lng: 121.6739, region: "northern" },
  "桃園市": { name: "桃園市", lat: 24.9936, lng: 121.3010, region: "northern" },
  "新竹市": { name: "新竹市", lat: 24.8138, lng: 120.9675, region: "northern" },
  "新竹縣": { name: "新竹縣", lat: 24.7033, lng: 121.1252, region: "northern" },
  "苗栗縣": { name: "苗栗縣", lat: 24.5602, lng: 120.8214, region: "central" },
  "臺中市": { name: "臺中市", lat: 24.1477, lng: 120.6736, region: "central" },
  "彰化縣": { name: "彰化縣", lat: 24.0518, lng: 120.5161, region: "central" },
  "南投縣": { name: "南投縣", lat: 23.9609, lng: 120.9719, region: "central" },
  "雲林縣": { name: "雲林縣", lat: 23.7092, lng: 120.4313, region: "central" },
  "嘉義市": { name: "嘉義市", lat: 23.4800, lng: 120.4491, region: "southern" },
  "嘉義縣": { name: "嘉義縣", lat: 23.4518, lng: 120.2555, region: "southern" },
  "臺南市": { name: "臺南市", lat: 22.9997, lng: 120.2270, region: "southern" },
  "高雄市": { name: "高雄市", lat: 22.6273, lng: 120.3014, region: "southern" },
  "屏東縣": { name: "屏東縣", lat: 22.5519, lng: 120.5487, region: "southern" },
  "宜蘭縣": { name: "宜蘭縣", lat: 24.7021, lng: 121.7377, region: "eastern" },
  "花蓮縣": { name: "花蓮縣", lat: 23.9872, lng: 121.6016, region: "eastern" },
  "臺東縣": { name: "臺東縣", lat: 22.7583, lng: 121.1444, region: "eastern" },
  "澎湖縣": { name: "澎湖縣", lat: 23.5712, lng: 119.5793, region: "islands" },
  "金門縣": { name: "金門縣", lat: 24.4493, lng: 118.3766, region: "islands" },
  "連江縣": { name: "連江縣", lat: 26.1505, lng: 119.9499, region: "islands" },
};
