
import { useEffect, useRef, useState } from 'react';

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

const regionCoordinates = {
  dobong: { lat: 37.6688, lng: 127.0471 },
  nowon: { lat: 37.6542, lng: 127.0568 },
  gwanak: { lat: 37.4784, lng: 126.9516 },
  eunpyeong: { lat: 37.6027, lng: 126.9291 },
  seongbuk: { lat: 37.5894, lng: 127.0167 },
  gangseo: { lat: 37.5509, lng: 126.8495 },
  guro: { lat: 37.4954, lng: 126.8874 },
  gangbuk: { lat: 37.6397, lng: 127.0255 }
};

function loadKakaoMap() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      window.kakao.maps.load(() => resolve(window.kakao));
      return;
    }

    if (!KAKAO_MAP_KEY) {
      reject(new Error('Kakao Maps API 키가 설정되지 않았습니다.'));
      return;
    }

    const existingScript = document.getElementById('kakao-map-sdk');

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        window.kakao.maps.load(() => resolve(window.kakao));
      }, { once: true });

      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');

    script.id = 'kakao-map-sdk';
    script.src =
      `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao));
    };

    script.onerror = () => {
      reject(new Error('Kakao Maps SDK를 불러오지 못했습니다.'));
    };

    document.head.appendChild(script);
  });
}

function RegionMap({ regions, selectedIds, onSelect }) {
  const mapElement = useRef(null);
  const mapInstance = useRef(null);
  const [mapStatus, setMapStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    if (!KAKAO_MAP_KEY) {
      setMapStatus('fallback');
      return;
    }

    const initializeMap = async () => {
      try {
        const kakao = await loadKakaoMap();

        if (cancelled || !mapElement.current) return;

        const center = new kakao.maps.LatLng(37.5665, 126.9780);

        const map = new kakao.maps.Map(mapElement.current, {
          center,
          level: 8
        });

        mapInstance.current = map;

        regions.forEach((region) => {
          const coordinate = regionCoordinates[region.id];

          if (!coordinate) return;

          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(
              coordinate.lat,
              coordinate.lng
            ),
            map,
            title: region.name
          });

          kakao.maps.event.addListener(marker, 'click', () => {
            onSelect(region.id);
          });
        });

        if (!cancelled) {
          setMapStatus('ready');
        }
      } catch (error) {
        console.error('지도 초기화 실패:', error);

        if (!cancelled) {
          setMapStatus('fallback');
        }
      }
    };

    initializeMap();

    return () => {
      cancelled = true;
    };
  }, [regions, selectedIds, onSelect]);

  if (mapStatus === 'fallback') {
    return (
      <div className="map-fallback">
        <div className="map-fallback-heading">
          <span>SEOUL DISTRICTS</span>
          <strong>지역을 선택해 보세요.</strong>
          <p>
            Kakao Maps API가 연결되면 실제 서울 지도가 표시됩니다.
            지금은 지역 선택용 미리보기를 제공합니다.
          </p>
        </div>

        <div className="district-preview">
          {regions.map((region) => (
            <button
              key={region.id}
              type="button"
              className={
                selectedIds.includes(region.id) ? 'active' : ''
              }
              onClick={() => onSelect(region.id)}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (mapStatus === 'loading') {
    return (
      <div className="map-loading">
        서울 지도를 불러오는 중입니다.
      </div>
    );
  }

  return <div ref={mapElement} className="kakao-map" />;
}

export default RegionMap;
